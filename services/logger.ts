import * as Sentry from '@sentry/react';

const isProduction = import.meta.env.PROD;

/**
 * Initialize the logger with Sentry for production error tracking
 */
export const initLogger = (): void => {
  if (isProduction && import.meta.env.VITE_SENTRY_DSN) {
    Sentry.init({
      dsn: import.meta.env.VITE_SENTRY_DSN,
      integrations: [Sentry.browserTracingIntegration(), Sentry.replayIntegration()],
      // Performance Monitoring
      tracesSampleRate: 1.0,
      // Session Replay
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0,
    });
  }
};

/**
 * Logger service with Sentry integration for production
 * Falls back to console logging in development
 */
export const logger = {
  /**
   * Log an error with optional error object and context
   * @param message - Error message
   * @param error - Error object or unknown error
   * @param context - Additional context for debugging
   */
  error: (message: string, error?: Error | unknown, context?: Record<string, unknown>): void => {
    if (isProduction) {
      Sentry.captureException(error || new Error(message), {
        extra: { message, ...context },
      });
    } else {
      console.error(`[Logger] ${message}`, error, context);
    }
  },

  /**
   * Log an informational message
   * @param message - Info message
   * @param context - Additional context
   */
  info: (message: string, context?: Record<string, unknown>): void => {
    if (isProduction) {
      Sentry.captureMessage(message, {
        level: 'info',
        extra: context,
      });
    } else {
      console.info(`[Logger] ${message}`, context);
    }
  },

  /**
   * Log a warning message
   * @param message - Warning message
   * @param context - Additional context
   */
  warn: (message: string, context?: Record<string, unknown>): void => {
    if (isProduction) {
      Sentry.captureMessage(message, {
        level: 'warning',
        extra: context,
      });
    } else {
      console.warn(`[Logger] ${message}`, context);
    }
  },

  /**
   * Log a debug message (development only)
   * @param message - Debug message
   * @param context - Additional context
   */
  debug: (message: string, context?: Record<string, unknown>): void => {
    if (!isProduction) {
      console.debug(`[Logger] ${message}`, context);
    }
  },
};
