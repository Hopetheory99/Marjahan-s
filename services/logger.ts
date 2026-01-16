import * as Sentry from '@sentry/react';

const isProduction = import.meta.env.PROD;

export const initLogger = () => {
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

export const logger = {
  error: (message: string, error?: any, context?: Record<string, any>) => {
    if (isProduction) {
      Sentry.captureException(error || new Error(message), {
        extra: { message, ...context },
      });
    } else {
      console.error(`[Logger] ${message}`, error, context);
    }
  },
  info: (message: string, context?: Record<string, any>) => {
    if (isProduction) {
      Sentry.captureMessage(message, {
        level: 'info',
        extra: context,
      });
    } else {
      console.info(`[Logger] ${message}`, context);
    }
  },
  warn: (message: string, context?: Record<string, any>) => {
    if (isProduction) {
      Sentry.captureMessage(message, {
        level: 'warning',
        extra: context,
      });
    } else {
      console.warn(`[Logger] ${message}`, context);
    }
  },
};
