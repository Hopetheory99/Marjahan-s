# HANDOFF to Agent Guardian

**From:** Agent Architect (Senior Orchestrator)  
**Task ID:** task-guardian-001  
**Priority:** High  
**Due:** 2026-01-18 EOD  
**Created:** 2026-01-18T05:28:33+06:00

---

## Context

The Marjahan's e-commerce platform currently performs critical business logic (price calculations, stock validation, coupon verification) on the client side. This creates security vulnerabilities where malicious users could manipulate prices or bypass stock checks.

**Your Mission:** Move all security-critical operations to **server-side Supabase Edge Functions** and implement robust webhook security for payment processing.

**Why This Matters:**

- **Revenue Protection:** Prevent price manipulation attacks
- **Inventory Integrity:** Server-side stock validation prevents overselling
- **Payment Security:** Secure Stripe webhook handling prevents fraud
- **Compliance:** Meet PCI-DSS requirements for payment processing

---

## Inputs / Artifacts

### Files to Review

- [implementation_plan.md](file:///C:/Users/fhdib/.gemini/antigravity/brain/cf154202-0595-4959-9822-401e49e33e0c/implementation_plan.md) - Track 4: Agent Ops
- [Agents.md](file:///c:/Users/fhdib/.gemini/antigravity/scratch/Marjahan-s/.agent/rules/Agents.md) - Agent coordination spec

### Current Implementation (Client-Side)

- `services/productService.ts` - Stock checks
- `services/couponService.ts` - Coupon verification
- `context/CartContext.tsx` - Price calculations
- Stripe integration in `CheckoutPage.tsx`

### Supabase Resources

- Database schema: `supabase_schema.sql`
- Existing RPC: `verify_coupon` (needs audit)
- Edge Functions directory: `supabase/functions/`

### Environment Variables Required

```env
# Already configured
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...

# You'll need to add
STRIPE_SECRET_KEY=...
STRIPE_WEBHOOK_SECRET=...
SUPABASE_SERVICE_ROLE_KEY=...
```

---

## Next Actions (Ordered)

### 1. Audit Existing RLS Policies 🔒 IMMEDIATE

**File:** Review `supabase_schema.sql`

**Tasks:**

- [ ] Verify RLS enabled on all tables
- [ ] Check `products` table: Users can SELECT, only admins can INSERT/UPDATE/DELETE
- [ ] Check `orders` table: Users can only see their own orders
- [ ] Check `coupons` table: Read-only for users, admin-only writes
- [ ] Document any missing or weak policies

**Deliverable:**

- `docs/RLS_AUDIT.md` with findings and recommendations

---

### 2. Create Edge Function: `validate-cart` 🛡️ HIGH PRIORITY

**Purpose:** Server-side validation of cart items before payment

**File:** `supabase/functions/validate-cart/index.ts`

**Functionality:**

```typescript
// Input: { items: CartItem[], couponCode?: string }
// Output: { valid: boolean, finalTotal: number, errors?: string[] }

// Validations:
✓ All products exist and are active
✓ Sufficient stock available
✓ Prices match current database values
✓ Coupon is valid and applicable
✓ Calculate final total server-side
```

**Implementation Steps:**

1. Create function scaffold:

   ```bash
   npx supabase functions new validate-cart
   ```

2. Implement validation logic:
   - Query products with stock check
   - Verify coupon via `verify_coupon` RPC
   - Calculate totals server-side
   - Return validation result

3. Add error handling:
   - Out of stock errors
   - Invalid coupon errors
   - Price mismatch errors

4. Write tests:
   - Create `validate-cart.test.ts`
   - Test all validation scenarios
   - Mock Supabase client

**Acceptance:**

- [ ] Edge function deployed and accessible
- [ ] All validation scenarios tested
- [ ] Proper error messages returned
- [ ] Response time < 500ms

---

### 3. Create Edge Function: `create-payment-intent` 💳 HIGH PRIORITY

**Purpose:** Secure Stripe PaymentIntent creation with server-side validation

**File:** `supabase/functions/create-payment-intent/index.ts`

**Functionality:**

```typescript
// Input: { items: CartItem[], shippingInfo, couponCode? }
// Output: { clientSecret: string, orderId: string }

// Flow:
1. Validate cart via validate-cart logic
2. Create order record in database
3. Create Stripe PaymentIntent with metadata
4. Return clientSecret to client
```

**Security Requirements:**

- ✅ Use `STRIPE_SECRET_KEY` (never expose to client)
- ✅ Validate all inputs with Zod schemas
- ✅ Store order with `pending` status
- ✅ Include order ID in PaymentIntent metadata
- ✅ Implement idempotency keys

**Acceptance:**

- [ ] Edge function deployed
- [ ] Stripe integration working
- [ ] Order created in database
- [ ] Idempotency implemented
- [ ] Error handling robust

---

### 4. Secure Stripe Webhook Endpoint 🔐 CRITICAL

**Purpose:** Handle payment confirmations securely

**File:** `supabase/functions/stripe-webhook/index.ts`

**Functionality:**

```typescript
// Handles Stripe events:
✓ payment_intent.succeeded - Update order status to 'paid'
✓ payment_intent.payment_failed - Update order status to 'failed'
✓ charge.refunded - Update order status to 'refunded'
```

**Security Implementation:**

```typescript
import Stripe from 'stripe';

// CRITICAL: Verify webhook signature
const signature = req.headers.get('stripe-signature');
const event = stripe.webhooks.constructEvent(body, signature, STRIPE_WEBHOOK_SECRET);

// Only process verified events
```

**Steps:**

1. Create webhook function
2. Implement signature verification
3. Add event handlers for each event type
4. Update order status in database
5. Send confirmation emails (optional)
6. Log all webhook events for audit

**Acceptance:**

- [ ] Signature verification implemented
- [ ] All event types handled
- [ ] Order status updates working
- [ ] Idempotency for duplicate webhooks
- [ ] Comprehensive logging

---

### 5. Update Client to Use Edge Functions 🔄 MEDIUM PRIORITY

**Files to Modify:**

- `pages/CheckoutPage.tsx`
- `context/CartContext.tsx`
- `services/orderService.ts`

**Changes:**

1. Replace client-side price calculation with `validate-cart` call
2. Use `create-payment-intent` instead of direct Stripe calls
3. Remove sensitive Stripe keys from client
4. Add loading states for server calls
5. Handle server-side validation errors

**Example:**

```typescript
// Before (client-side)
const paymentIntent = await stripe.createPaymentIntent({...});

// After (server-side)
const { clientSecret, orderId } = await supabase.functions.invoke(
  'create-payment-intent',
  { body: { items, shippingInfo, couponCode } }
);
```

**Acceptance:**

- [ ] All checkout flow using Edge Functions
- [ ] No sensitive keys in client code
- [ ] Proper error handling and UX
- [ ] Loading states implemented

---

### 6. Environment & Deployment Setup 🚀 FINAL STEP

**Tasks:**

1. **Set Supabase Secrets:**

   ```bash
   npx supabase secrets set STRIPE_SECRET_KEY=sk_...
   npx supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_...
   ```

2. **Deploy Edge Functions:**

   ```bash
   npx supabase functions deploy validate-cart
   npx supabase functions deploy create-payment-intent
   npx supabase functions deploy stripe-webhook
   ```

3. **Configure Stripe Webhook:**
   - Get webhook URL from Supabase
   - Add to Stripe Dashboard
   - Test with Stripe CLI

4. **Update Environment Variables:**
   - Document all required secrets
   - Create `.env.example` template
   - Update deployment docs

**Acceptance:**

- [ ] All functions deployed successfully
- [ ] Secrets configured in Supabase
- [ ] Stripe webhook registered and tested
- [ ] Documentation updated

---

## Acceptance Criteria

### Must Have (Blocking)

- [ ] `validate-cart` Edge Function deployed and tested
- [ ] `create-payment-intent` Edge Function deployed and tested
- [ ] `stripe-webhook` Edge Function with signature verification
- [ ] RLS policies audited and documented
- [ ] Client updated to use Edge Functions
- [ ] All sensitive keys removed from client code

### Should Have (High Priority)

- [ ] Comprehensive error handling in all functions
- [ ] Idempotency implemented for payment operations
- [ ] Logging and monitoring configured
- [ ] Rate limiting on Edge Functions

### Nice to Have (Optional)

- [ ] Email notifications on order events
- [ ] Admin dashboard for webhook logs
- [ ] Automated testing for Edge Functions

---

## Blockers / Dependencies

### Known Blockers

1. **Stripe Account Access:** Need API keys
   - **Mitigation:** Use test mode keys for development
   - **Production:** Coordinate with user for live keys

2. **Supabase Service Role Key:** Required for admin operations
   - **Location:** Supabase Dashboard → Settings → API
   - **Security:** Never commit to version control

### Dependencies

- ✅ Supabase project configured
- ✅ Stripe account exists
- ⚠️ Need to verify Edge Functions quota/limits

---

## Definition of Done

### Code Quality

- [ ] TypeScript strict mode compliance
- [ ] Zod validation for all inputs
- [ ] Comprehensive error handling
- [ ] Security best practices followed

### Testing

- [ ] Unit tests for validation logic
- [ ] Integration tests with Stripe test mode
- [ ] Webhook signature verification tested
- [ ] End-to-end checkout flow tested

### Documentation

- [ ] Edge Function README with usage examples
- [ ] RLS audit report
- [ ] Deployment guide
- [ ] Security considerations documented

### Handoff

- [ ] `STATUS-guardian-001.md` updated throughout work
- [ ] `DONE-guardian-001.md` created with proof of work
- [ ] `HANDOFF-TO-ARCHITECT-guardian-complete.md` created
- [ ] All code committed and pushed

---

## Security Checklist

Before marking complete, verify:

- [ ] No API keys in client-side code
- [ ] All Edge Functions use environment variables
- [ ] Stripe webhook signature verified
- [ ] RLS policies prevent unauthorized access
- [ ] Input validation on all Edge Functions
- [ ] SQL injection prevention (parameterized queries)
- [ ] Rate limiting configured
- [ ] Error messages don't leak sensitive info

---

## Resources

### Documentation

- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)
- [Stripe Webhooks](https://stripe.com/docs/webhooks)
- [Stripe Payment Intents](https://stripe.com/docs/payments/payment-intents)
- [Supabase RLS](https://supabase.com/docs/guides/auth/row-level-security)

### Example Code

- Supabase Edge Function examples: `supabase/functions/` directory
- Stripe webhook verification: Stripe docs

---

**Agent Architect Signature:** ✅ Approved for deployment  
**Handoff Time:** 2026-01-18T05:28:33+06:00  
**Expected Completion:** 2026-01-18 EOD

---

**Good luck, Agent Guardian! The security of our platform and our customers' trust depends on your diligence. 🔒✨**
