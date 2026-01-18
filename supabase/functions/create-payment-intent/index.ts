import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import Stripe from 'https://esm.sh/stripe@12.0.0';
import { z } from 'https://esm.sh/zod@3.22.4';

console.log('💳 Stripe Payment Intent Function Loaded (Secure Order Flow)');

// Allowed Origins from env var or defaults
const ALLOWED_ORIGINS = (
  Deno.env.get('ALLOWED_ORIGINS') ??
  'http://localhost:5173,http://localhost:3000,https://marjahans-jewelry.com'
).split(',');

const getCorsHeaders = (origin: string | null) => {
  const allowOrigin = origin && ALLOWED_ORIGINS.includes(origin) ? origin : 'null';
  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };
};

// Zod schema for request validation
const CartItemSchema = z.object({
  id: z.string().uuid().or(z.string()), // Support both UUID and custom IDs
  quantity: z.number().int().positive(),
});

const CreatePaymentIntentSchema = z.object({
  items: z.array(CartItemSchema).min(1),
  currency: z.string().optional().default('usd'),
  metadata: z.record(z.string()).optional().default({}),
});

serve(async (req) => {
  const origin = req.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin);

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client with user auth
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      },
    );

    // Get the user from the JWT
    const {
      data: { user },
    } = await supabaseClient.auth.getUser();

    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
      apiVersion: '2023-10-16',
    });

    // Parse and validate request body using Zod
    const body = await req.json();
    const result = CreatePaymentIntentSchema.safeParse(body);

    if (!result.success) {
      return new Response(
        JSON.stringify({ error: 'Invalid request data', details: result.error.format() }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      );
    }

    const { items, currency, metadata } = result.data;

    // === CRITICAL FIX: CREATE ORDER FIRST ===
    // This prevents data loss if payment succeeds but order creation fails

    // 1. Fetch products from DB to validate price and stock
    const itemIds = items.map((i) => i.id);
    const { data: products, error: productsError } = await supabaseClient
      .from('products')
      .select('*')
      .in('id', itemIds);

    if (productsError || !products) {
      throw new Error('Failed to fetch product details');
    }

    let calculatedAmount = 0;

    // 2. Validate stock and calculate server-side total
    for (const item of items) {
      const product = products.find((p) => p.id === item.id);

      if (!product) {
        throw new Error(`Product not found: ${item.id}`);
      }

      if (product.stock < item.quantity) {
        throw new Error(`Insufficient stock for ${product.name}. Available: ${product.stock}`);
      }

      calculatedAmount += product.price * item.quantity;
    }

    if (calculatedAmount <= 0) {
      throw new Error('Total amount must be greater than 0');
    }

    console.log(`💳 Calculated Total: ${calculatedAmount} for ${items.length} items`);

    // 3. Create order with status='pending_payment'
    const { data: order, error: orderError } = await supabaseClient
      .from('orders')
      .insert({
        user_id: user.id,
        total: calculatedAmount,
        status: 'pending_payment', // New intermediate status
      })
      .select()
      .single();

    if (orderError || !order) {
      throw new Error(`Failed to create order: ${orderError?.message}`);
    }

    console.log(`📦 Created Order: ${order.id}`);

    // 4. Create order items (triggers will decrement stock atomically)
    const orderItems = items.map((item) => ({
      order_id: order.id,
      product_id: item.id,
      quantity: item.quantity,
      price_snapshot: (products as Product[]).find((p) => p.id === item.id)!.price,
    }));

    const { error: itemsError } = await supabaseClient.from('order_items').insert(orderItems);

    if (itemsError) {
      // Rollback: Delete the order if items fail
      await supabaseClient.from('orders').delete().eq('id', order.id);
      throw new Error(`Failed to create order items: ${itemsError.message}`);
    }

    console.log(`📦 Created ${orderItems.length} order items for order ${order.id}`);

    // 5. Create payment intent with order_id in metadata
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(calculatedAmount * 100), // Convert to cents
      currency: currency.toLowerCase(),
      metadata: {
        user_id: user.id,
        order_id: order.id, // CRITICAL: Link payment to order
        items_count: items.length.toString(),
        ...metadata,
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    console.log(`💳 Created PaymentIntent: ${paymentIntent.id} for order ${order.id}`);

    // 6. Update order with payment_intent_id for tracking
    await supabaseClient
      .from('orders')
      .update({ stripe_payment_id: paymentIntent.id })
      .eq('id', order.id);

    return new Response(
      JSON.stringify({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        orderId: order.id, // Return order ID to frontend
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  } catch (error) {
    console.error('💳 Payment Intent Error:', error);

    return new Response(
      JSON.stringify({
        error: error.message || 'Internal server error',
      }),
      {
        status: 400, // Bad Request for validation errors
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  }
});
