import { describe, it, expect, vi, beforeEach } from 'vitest';
import { stripeService, getStripe } from '../stripeService';
import { supabase } from '../supabaseClient';
import { CartItem } from '../../types';

// Mock Supabase client
vi.mock('../supabaseClient', () => ({
  supabase: {
    functions: {
      invoke: vi.fn(),
    },
  },
}));

// Mock Stripe loader
vi.mock('@stripe/stripe-js', () => ({
  loadStripe: vi.fn().mockResolvedValue({}),
  Stripe: vi.fn(),
}));

describe('stripeService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockItems: CartItem[] = [
    { id: '1', name: 'Test Item', price: 100, quantity: 1, image: 'img.png' },
  ];

  describe('getStripe', () => {
    it('should return a stripe promise', async () => {
      const stripePromise = getStripe();
      expect(stripePromise).toBeDefined();
      expect(await stripePromise).toEqual({});
    });
  });

  describe('createPaymentIntent', () => {
    it('should successfully create a payment intent', async () => {
      const mockResponse = {
        data: {
          clientSecret: 'test_secret',
          paymentIntentId: 'pi_123',
        },
        error: null,
      };

      (supabase.functions.invoke as any).mockResolvedValue(mockResponse);

      const result = await stripeService.createPaymentIntent(mockItems, 'usd', { orderId: '123' });

      expect(supabase.functions.invoke).toHaveBeenCalledWith('create-payment-intent', {
        body: {
          items: mockItems,
          currency: 'usd',
          metadata: { orderId: '123' },
        },
      });

      expect(result).toEqual({
        clientSecret: 'test_secret',
        paymentIntentId: 'pi_123',
      });
    });

    it('should handle Supabase function error', async () => {
      const mockResponse = {
        data: null,
        error: { message: 'Function failed' },
      };

      (supabase.functions.invoke as any).mockResolvedValue(mockResponse);

      const result = await stripeService.createPaymentIntent(mockItems);

      expect(result).toEqual({
        clientSecret: '',
        error: 'Function failed',
      });
    });

    it('should handle unexpected network errors', async () => {
      (supabase.functions.invoke as any).mockRejectedValue(new Error('Network error'));

      const result = await stripeService.createPaymentIntent(mockItems);

      expect(result).toEqual({
        clientSecret: '',
        error: 'Unexpected error occurred',
      });
    });
  });
});
