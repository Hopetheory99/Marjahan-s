/**
 * Server configuration module
 * Centralized environment and configuration management
 */

module.exports = {
  PORT: process.env.PORT || 3001,
  NODE_ENV: process.env.NODE_ENV || 'development',

  // JWT Configuration
  JWT: {
    SECRET: process.env.JWT_SECRET || 'your-super-secret-key-change-in-production',
    REFRESH_SECRET:
      process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key-change-in-production',
    EXPIRY: '15m',
    REFRESH_EXPIRY: '7d',
  },

  // Admin Credentials (development only; use proper OAuth in production)
  ADMIN: {
    PASSWORD: process.env.ADMIN_PASSWORD || null,
  },

  // Stripe Configuration
  STRIPE: {
    SECRET_KEY: process.env.STRIPE_SECRET_KEY || null,
    PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY || null,
    WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET || null,
  },

  // Database Configuration
  DATABASE: {
    URL: process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/marjahans',
    POOL_SIZE: 20,
  },

  // Logging
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',

  // Feature Flags
  FEATURES: {
    ENABLE_REAL_STRIPE: !!process.env.STRIPE_SECRET_KEY,
    ENABLE_DATABASE: !!process.env.DATABASE_URL,
  },
};
