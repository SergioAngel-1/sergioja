'use client';

import React, { Component, ReactNode } from 'react';
import { fluidSizing } from '@/lib/utils/fluidSizing';
import { logger } from '@/lib/logger';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class IframeErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log del error usando logger centralizado
    logger.error('IframeErrorBoundary caught an error', {
      error,
      errorInfo,
      componentStack: errorInfo.componentStack,
    }, 'IframeErrorBoundary');
    
    // Callback opcional
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="w-full h-full flex items-center justify-center text-text-muted">
          <div className="text-center">
            <svg 
              className="mx-auto opacity-50" 
              style={{ 
                width: fluidSizing.size.hexButton, 
                height: fluidSizing.size.hexButton,
                marginBottom: fluidSizing.space.md,
              }} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p style={{ fontSize: fluidSizing.text.sm }}>Error al cargar la vista previa</p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
