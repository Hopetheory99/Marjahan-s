import React, { Component, ErrorInfo, ReactNode } from 'react';
import { logger } from '../services/logger';
import Button from './Button';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logger.error('Uncaught error in component tree', error, {
      componentStack: errorInfo.componentStack,
    });
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-brand-ivory p-6">
          <div className="text-center max-w-md">
            <h1 className="text-3xl font-serif text-brand-burgundy mb-4">Something went wrong</h1>
            <p className="text-brand-charcoal mb-8">
              We apologize for the inconvenience. Our team has been notified.
            </p>
            <Button onClick={() => window.location.reload()}>Refresh Page</Button>
            <div className="mt-4">
              <Button variant="secondary" onClick={() => window.location.href = '/'}>Go Home</Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
