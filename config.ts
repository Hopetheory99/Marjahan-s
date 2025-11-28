
// Centralized configuration to avoid magic strings and allow easy environment switching.
// Supports both Vite (import.meta.env) and standard process.env patterns.

export const CONFIG = {
  APP_NAME: 'Marjahan\'s Jewelry',
  // In a real app, these would come from .env files
  API_BASE_URL: '', 
  DEFAULT_CURRENCY: 'USD',
  CURRENCY_SYMBOL: '$',
  TAX_RATE: 0.08, // 8% sales tax
  FREE_SHIPPING_THRESHOLD: 500,
  CONTACT_EMAIL: 'support@marjahans.com',
  // Feature flags
  FEATURES: {
    ENABLE_REVIEWS: false,
    ENABLE_WISHLIST: false,
  }
};
