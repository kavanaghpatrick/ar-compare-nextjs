'use client';

import { useCSRFToken } from '@/hooks/useCSRFToken';
import { useState } from 'react';
import logger from '@/lib/logger';

// Example component demonstrating CSRF-protected API calls
export function CSRFExample() {
  const { csrfToken, fetchWithCSRF } = useCSRFToken();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleCompareProducts = async () => {
    if (!csrfToken) {
      logger.error('CSRF token not available');
      return;
    }

    setLoading(true);
    try {
      const response = await fetchWithCSRF('/api/products/compare', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productIds: ['apple-vision-pro', 'meta-quest-pro']
        })
      });

      if (!response.ok) {
        throw new Error('Failed to compare products');
      }

      const data = await response.json();
      setResult(data);
    } catch (error) {
      logger.error('Error comparing products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">CSRF Protected API Example</h2>
      <p className="mb-2">CSRF Token: {csrfToken ? '✓ Available' : '✗ Not available'}</p>
      
      <button
        onClick={handleCompareProducts}
        disabled={!csrfToken || loading}
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? 'Loading...' : 'Compare Products (POST)'}
      </button>
      
      {result && (
        <pre className="mt-4 p-4 bg-gray-100 rounded overflow-auto">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}