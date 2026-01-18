import { loadStripe, Stripe } from '@stripe/stripe-js';
import { supabase } from './supabaseClient';
import { CartItem } from '../types';
import { logger } from './logger';

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
    items: CartItem[],
    currency: string = 'usd',
    metadata?: Record<string, any>,
  ): Promise<PaymentIntentResponse> {
    // Calculate total amount from items for logging/fallback (server validates true price)
    const amount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    logger.info(`Creating PaymentIntent`, {
      itemCount: items.length,
      total: amount,
      currency,
      service: 'stripe',
    });

    try {
      const { data, error } = await supabase.functions.invoke('create-payment-intent', {
        body: { items, currency, metadata },
      });

      if (error) {
        logger.error('Payment Intent Error', error, { service: 'stripe' });
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
      logger.error('Unexpected error creating payment intent', err as Error, { service: 'stripe' });
      return {
        clientSecret: '',
        error: 'Unexpected error occurred',
      };
    }
  },
};
