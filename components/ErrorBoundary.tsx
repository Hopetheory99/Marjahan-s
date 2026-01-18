import { Component, ErrorInfo, ReactNode } from 'react';
import { logger } from '../services/logger';
import Button from './Button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logger.error('Uncaught error in component tree', error, {
      componentStack: errorInfo.componentStack,
    });
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[400px] w-full flex items-center justify-center p-8 bg-surface-1 rounded-3xl border border-brand-burgundy/10 shadow-luxury">
          <div className="text-center max-w-lg">
            <div className="text-5xl mb-6">👑</div>
            <h1 className="text-3xl font-serif text-brand-burgundy mb-4">Something went wrong</h1>
            <p className="text-brand-warm-gray mb-8 leading-relaxed">
              We&apos;ve encountered an unexpected glitch in the palace. Our craftsmen have been
              notified and are working on the restoration.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={() => window.location.reload()} className="px-8">
                Refresh Page
              </Button>
              <Button
                variant="secondary"
                onClick={() => (window.location.href = '/')}
                className="px-8 border border-surface-3"
              >
                Return to Gallery
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
