'use client';

import React, { Component, ReactNode } from 'react';
import { logger } from '@/lib/logger';
import Button from './atoms/Button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

/**
 * Error Boundary component with integrated logging
 * Catches React errors and logs them automatically
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error with full details
    logger.error('React Error Boundary caught an error', {
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
      },
      componentStack: errorInfo.componentStack,
    }, 'ErrorBoundary');

    this.setState({ errorInfo });
  }

  handleReset = () => {
    logger.info('Error boundary reset', 'ErrorBoundary');
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI with cyberpunk theme
      return (
        <div className="min-h-screen flex items-center justify-center bg-background-dark px-4">
          <div className="max-w-2xl w-full">
            <div className="card-cyber text-center">
              <div className="mb-6">
                <div className="inline-block p-4 bg-cyber-red/20 rounded-full mb-4">
                  <svg
                    className="w-16 h-16 text-cyber-red"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
                <h1 className="font-orbitron text-3xl font-bold text-cyber-red mb-2">
                  SYSTEM ERROR
                </h1>
                <p className="text-text-secondary font-rajdhani">
                  Something went wrong in the application
                </p>
              </div>

              {process.env.NEXT_PUBLIC_ENV === 'development' && this.state.error && (
                <div className="mb-6 p-4 bg-background-elevated rounded-lg text-left">
                  <p className="font-mono text-sm text-cyber-red mb-2">
                    {this.state.error.name}: {this.state.error.message}
                  </p>
                  {this.state.error.stack && (
                    <pre className="text-xs text-text-muted overflow-x-auto">
                      {this.state.error.stack}
                    </pre>
                  )}
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="red" size="lg" onClick={this.handleReset}>
                  Try Again
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => (window.location.href = '/')}
                >
                  Go Home
                </Button>
              </div>

              <p className="mt-6 text-sm text-text-muted font-mono">
                Error ID: {Date.now().toString(36)}
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
