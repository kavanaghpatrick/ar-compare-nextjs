'use client';

import { Component, ReactNode } from 'react';
import { HomeClientFixed } from './HomeClientFixed';
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

export class HomeClientErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error details for debugging
    console.error('[HomeClientErrorBoundary] Component error:', {
      error: error.toString(),
      stack: error.stack,
      componentStack: errorInfo.componentStack,
    });
    
    // Update state with error info
    this.setState({
      errorInfo
    });
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
                Oops! Something went wrong
              </h1>
              
              <div className="mb-6">
                <p className="text-gray-300 mb-2">
                  We encountered an error while loading the AR Compare application.
                </p>
                <p className="text-gray-400 text-sm">
                  Error: {this.state.error?.message || 'Unknown error'}
                </p>
              </div>

              {/* Show detailed error info in development */}
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="mb-6">
                  <summary className="cursor-pointer text-gray-400 hover:text-gray-300 mb-2">
                    Show error details (development only)
                  </summary>
                  <pre className="bg-black/50 p-4 rounded text-xs overflow-auto max-h-64">
                    <code className="text-red-300">
                      {this.state.error.stack}
                    </code>
                  </pre>
                  {this.state.errorInfo && (
                    <pre className="bg-black/50 p-4 rounded text-xs overflow-auto max-h-64 mt-2">
                      <code className="text-yellow-300">
                        Component Stack:
                        {this.state.errorInfo.componentStack}
                      </code>
                    </pre>
                  )}
                </details>
              )}

              <div className="flex gap-4">
                <button 
                  onClick={this.handleReset}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Try Again
                </button>
                <button 
                  onClick={() => window.location.href = '/'}
                  className="bg-gray-700 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors font-medium"
                >
                  Go to Homepage
                </button>
              </div>
            </div>

            {/* Fallback content */}
            <div className="mt-8 p-6 bg-gray-800 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">While we fix this...</h2>
              <p className="text-gray-300 mb-4">
                You can still browse our AR glasses comparison database:
              </p>
              <ul className="list-disc list-inside text-gray-400 space-y-2">
                <li>Try refreshing the page</li>
                <li>Clear your browser cache</li>
                <li>Check back in a few minutes</li>
                <li>Contact support if the issue persists</li>
              </ul>
            </div>
          </div>
        </div>
      );
    }

    // Render the fixed HomeClient component when there's no error
    return <HomeClientFixed {...this.props} />;
  }
}