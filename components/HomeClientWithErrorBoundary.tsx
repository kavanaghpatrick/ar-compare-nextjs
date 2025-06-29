'use client';

import { Component, ReactNode } from 'react';
import { HomeClientImmediate } from './HomeClientImmediate';
import { Product } from '@/types';

interface Props {
  initialProducts: Product[];
  searchParams: { search?: string; category?: string };
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('HomeClient Error Boundary:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-red-900/20 border border-red-700 rounded-lg p-8">
              <h1 className="text-3xl font-bold mb-4 text-red-400">
                Something went wrong
              </h1>
              
              <div className="mb-6">
                <p className="text-gray-300 mb-2">
                  We encountered an error while loading the AR Compare application.
                </p>
                <p className="text-gray-400 text-sm">
                  Error: {this.state.error?.message || 'Unknown error'}
                </p>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={this.handleReset}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Try Again
                </button>
                <button 
                  onClick={() => window.location.reload()}
                  className="bg-gray-700 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors font-medium"
                >
                  Reload Page
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return <HomeClientImmediate {...this.props} />;
  }
}

export { ErrorBoundary as HomeClientWithErrorBoundary };