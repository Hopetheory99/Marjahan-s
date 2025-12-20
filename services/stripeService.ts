import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

export interface StripeSessionResponse {
  sessionId?: string;
  sessionUrl?: string;
  order?: any;
}

export const stripeService = {
  createCheckoutSession: async (payload: any): Promise<StripeSessionResponse> => {
    if (!API_BASE) {
      // No backend configured; return mock response for client-side fallback.
      return { sessionUrl: '/confirmation' };
    }
    const res = await axios.post(`${API_BASE.replace(/\/$/, '')}/api/stripe/create-checkout-session`, payload);
    return res.data as StripeSessionResponse;
  }
};

export default stripeService;
