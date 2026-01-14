import { loadStripe, Stripe } from '@stripe/stripe-js';
import { supabase } from './supabaseClient';

// Get Stripe publishable key from environment
const STRIPE_PUBLIC_KEY =
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ||
  'pk_test_51P00000000000000000000000000000000000000000000000000000000000000000000000000000000';

let stripePromise: Promise<Stripe | null>;

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(STRIPE_PUBLIC_KEY);
  }
  return stripePromise;
};

export interface PaymentIntentResponse {
  clientSecret: string;
  paymentIntentId?: string;
  error?: string;
}

export const stripeService = {
  /**
   * Creates a payment intent by calling the Supabase Edge Function
   */
  async createPaymentIntent(
    amount: number,
    currency: string = 'usd',
    metadata?: Record<string, any>,
  ): Promise<PaymentIntentResponse> {
    console.log(`💳 Creating PaymentIntent for ${amount} ${currency}`);

    try {
      const { data, error } = await supabase.functions.invoke('create-payment-intent', {
        body: { amount, currency, metadata },
      });

      if (error) {
        console.error('💳 Payment Intent Error:', error);
        return {
          clientSecret: '',
          error: error.message || 'Failed to create payment intent',
        };
      }

      return {
        clientSecret: data.clientSecret,
        paymentIntentId: data.paymentIntentId,
      };
    } catch (err) {
      console.error('💳 Unexpected error creating payment intent:', err);
      return {
        clientSecret: '',
        error: 'Unexpected error occurred',
      };
    }
  },
};
