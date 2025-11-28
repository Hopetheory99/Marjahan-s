import React, { ErrorInfo, ReactNode } from 'react';
import Button from './Button';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-brand-light text-brand-dark p-6 text-center">
            <div className="max-w-md w-full bg-white p-10 rounded-lg shadow-xl border border-gray-100">
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>
                <h1 className="text-3xl font-serif font-bold mb-4">Something went wrong.</h1>
                <p className="text-gray-500 mb-8 font-sans">
                    We apologize for the inconvenience. An unexpected error has occurred within our system.
                </p>
                <div className="space-y-4">
                    <Button onClick={() => window.location.reload()} fullWidth>
                        Reload Page
                    </Button>
                    <button 
                        onClick={() => window.location.href = '/'}
                        className="text-sm text-gray-400 hover:text-brand-dark transition-colors uppercase tracking-widest block w-full text-center"
                    >
                        Return to Home
                    </button>
                </div>
            </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;