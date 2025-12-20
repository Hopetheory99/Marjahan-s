import { describe, it, expect } from 'vitest';
import { stripeService } from '../stripeService';

describe('stripeService', () => {
  it('returns fallback sessionUrl when no API_BASE configured', async () => {
    const res = await stripeService.createCheckoutSession({});
    expect(res).toBeDefined();
    // dev fallback is /confirmation
    expect(res.sessionUrl).toBe('/confirmation');
  });
});
