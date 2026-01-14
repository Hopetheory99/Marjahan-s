import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import Stripe from 'https://esm.sh/stripe@12.0.0';

console.log('💳 Stripe Webhook Function Loaded');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client with service role key for admin operations
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
      apiVersion: '2023-10-16',
    });

    // Get the raw body for webhook signature verification
    const body = await req.text();
    const signature = req.headers.get('stripe-signature');

    if (!signature) {
      return new Response(JSON.stringify({ error: 'No Stripe signature found' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Verify webhook signature
    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        Deno.env.get('STRIPE_WEBHOOK_SECRET') ?? '',
      );
    } catch (err) {
      console.error('💳 Webhook signature verification failed:', err);
      return new Response(JSON.stringify({ error: 'Webhook signature verification failed' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`💳 Received webhook event: ${event.type}`);

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await handlePaymentIntentSucceeded(supabaseClient, paymentIntent);
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await handlePaymentIntentFailed(supabaseClient, paymentIntent);
        break;
      }

      default:
        console.log(`💳 Unhandled event type: ${event.type}`);
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('💳 Webhook Error:', error);

    return new Response(
      JSON.stringify({
        error: error.message || 'Internal server error',
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  }
});

async function handlePaymentIntentSucceeded(
  supabaseClient: any,
  paymentIntent: Stripe.PaymentIntent,
) {
  console.log(`💳 Processing successful payment: ${paymentIntent.id}`);

  try {
    const orderId = paymentIntent.metadata?.order_id;
    const userId = paymentIntent.metadata?.user_id;

    if (!orderId) {
      console.error('💳 No order_id in payment intent metadata');
      return;
    }

    // Update order status to 'paid' using order_id from metadata
    const { error: updateError } = await supabaseClient
      .from('orders')
      .update({
        status: 'paid',
        payment_intent_id: paymentIntent.id,
        updated_at: new Date().toISOString(),
      })
      .eq('id', orderId);

    if (updateError) {
      console.error('💳 Error updating order status:', updateError);
      return;
    }

    console.log(`✅ Order ${orderId} marked as paid`);

    // Get the updated order for email notification
    const { data: order, error: fetchError } = await supabaseClient
      .from('orders')
      .select(
        `
        *,
        order_items (
          *,
          products (*)
        )
      `,
      )
      .eq('id', orderId)
      .single();

    if (fetchError || !order) {
      console.error('💳 Error fetching updated order:', fetchError);
      return;
    }

    // Fetch user profile to get email
    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('email')
      .eq('id', userId)
      .single();

    if (profileError || !profile || !profile.email) {
      console.error('💳 Error fetching user profile or email missing:', profileError);
      return;
    }

    console.log(`📧 Sending order confirmation email to ${profile.email}...`);

    try {
      const functionsUrl = `${Deno.env.get('SUPABASE_URL')}/functions/v1/send-order-email`;
      const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

      const emailRes = await fetch(functionsUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${serviceKey}`,
        },
        body: JSON.stringify({
          type: 'order_confirmation',
          email: profile.email,
          data: {
            orderId: order.id,
            customerName: 'Valued Customer',
            total: order.total,
            status: 'paid',
          },
        }),
      });

      if (!emailRes.ok) {
        const errorText = await emailRes.text();
        console.error('📧 Failed to call email function:', errorText);
      } else {
        console.log('📧 Email function called successfully');
      }
    } catch (emailErr) {
      console.error('📧 Error calling email function:', emailErr);
    }
  } catch (error) {
    console.error('💳 Error handling payment success:', error);
  }
}

async function handlePaymentIntentFailed(supabaseClient: any, paymentIntent: Stripe.PaymentIntent) {
  console.log(`❌ Processing failed payment: ${paymentIntent.id}`);

  try {
    const userId = paymentIntent.metadata?.user_id;
    if (!userId) {
      console.error('💳 No user_id in payment intent metadata');
      return;
    }

    // Update order status to 'failed'
    const { error: updateError } = await supabaseClient
      .from('orders')
      .update({
        status: 'failed',
        payment_intent_id: paymentIntent.id,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId)
      .eq('status', 'pending')
      .order('created_at', { ascending: false })
      .limit(1);

    if (updateError) {
      console.error('💳 Error updating order status:', updateError);
    }
  } catch (error) {
    console.error('💳 Error handling payment failure:', error);
  }
}
