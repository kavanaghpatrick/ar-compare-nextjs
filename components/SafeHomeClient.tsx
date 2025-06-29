'use client';

import { Component, ReactNode } from 'react';
import { HomeClient } from './HomeClient';
import { Product } from '@/types';

interface Props {
  initialProducts: Product[];
  searchParams: { search?: string; category?: string };
}

interface State {
  hasError: boolean;
  error?: Error;
}

class SafeHomeClient extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    console.error('[SafeHomeClient] Error caught:', error);
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('[SafeHomeClient] Error details:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-900 text-white p-8 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
            <p className="text-gray-400 mb-4">
              Error: {this.state.error?.message || 'Unknown error'}
            </p>
            <button 
              onClick={() => this.setState({ hasError: false, error: undefined })}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return <HomeClient {...this.props} />;
  }
}

export { SafeHomeClient };