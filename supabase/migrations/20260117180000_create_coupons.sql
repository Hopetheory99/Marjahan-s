-- Create coupons table
CREATE TABLE IF NOT EXISTS public.coupons (
  code TEXT PRIMARY KEY,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percent', 'fixed')),
  discount_value NUMERIC NOT NULL CHECK (discount_value > 0),
  min_order_value NUMERIC NOT NULL DEFAULT 0 CHECK (min_order_value >= 0),
  max_uses INTEGER,
  current_uses INTEGER NOT NULL DEFAULT 0,
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;

-- Policies
-- Admins can do everything
CREATE POLICY "Admins can do everything on coupons"
ON public.coupons
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- Public can read active coupons (needed for client-side validation, though RPC involves this too)
-- Actually, strict security suggests ONLY RPC should verify, but for UI feedback "Coupon exists but expired" vs "Invalid code", read access might be useful.
-- Let's NOT give public read access to the table directly to prevent scraping.
-- Verification will be done purely via RPC.

-- Create RPC function to securely verify and apply coupon
CREATE OR REPLACE FUNCTION verify_coupon(
  code_input TEXT,
  cart_total NUMERIC
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER -- Runs as owner (admin) to access the table
AS $$
DECLARE
  coupon_record RECORD;
BEGIN
  -- Fetch coupon
  SELECT * INTO coupon_record
  FROM public.coupons
  WHERE code = code_input;

  -- 1. Check existence
  IF coupon_record IS NULL THEN
    RETURN jsonb_build_object('valid', false, 'error', 'Invalid coupon code');
  END IF;

  -- 2. Check active
  IF NOT coupon_record.is_active THEN
    RETURN jsonb_build_object('valid', false, 'error', 'Coupon is inactive');
  END IF;

  -- 3. Check expiry
  IF coupon_record.expires_at IS NOT NULL AND coupon_record.expires_at < NOW() THEN
    RETURN jsonb_build_object('valid', false, 'error', 'Coupon has expired');
  END IF;

  -- 4. Check usage limits
  IF coupon_record.max_uses IS NOT NULL AND coupon_record.current_uses >= coupon_record.max_uses THEN
    RETURN jsonb_build_object('valid', false, 'error', 'Coupon usage limit reached');
  END IF;

  -- 5. Check min order value
  IF cart_total < coupon_record.min_order_value THEN
    RETURN jsonb_build_object(
      'valid', false, 
      'error', 'Minimum order value of ' || coupon_record.min_order_value || ' required'
    );
  END IF;

  -- Return success details
  RETURN jsonb_build_object(
    'valid', true,
    'code', coupon_record.code,
    'discount_type', coupon_record.discount_type,
    'discount_value', coupon_record.discount_value
  );
END;
$$;
