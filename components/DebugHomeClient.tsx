'use client';

import { useState, useEffect } from 'react';
import { useComparison } from '@/contexts/ComparisonContext';
import { Product } from '@/types';

interface HomeClientProps {
  initialProducts: Product[];
  searchParams: { search?: string; category?: string };
}

export function DebugHomeClient({ initialProducts, searchParams }: HomeClientProps) {
  console.log('[DebugHomeClient] Component mounting...');
  console.log('[DebugHomeClient] Initial products:', initialProducts?.length);
  console.log('[DebugHomeClient] Search params:', searchParams);

  const [mounted, setMounted] = useState(false);
  
  // Check if context is accessible
  try {
    const context = useComparison();
    console.log('[DebugHomeClient] Context loaded successfully:', context);
  } catch (error) {
    console.error('[DebugHomeClient] Context error:', error);
  }

  useEffect(() => {
    console.log('[DebugHomeClient] useEffect running...');
    setMounted(true);
    return () => {
      console.log('[DebugHomeClient] Component unmounting...');
    };
  }, []);

  if (!mounted) {
    console.log('[DebugHomeClient] Not mounted yet, returning loading...');
    return <div>Loading (not mounted)...</div>;
  }

  console.log('[DebugHomeClient] Rendering main content...');
  
  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <h1 className="text-2xl font-bold mb-4">Debug Home Client</h1>
      <div className="space-y-2">
        <p>Component mounted: {mounted ? 'Yes' : 'No'}</p>
        <p>Products loaded: {initialProducts?.length || 0}</p>
        <p>Search: {searchParams.search || 'none'}</p>
        <p>Category: {searchParams.category || 'none'}</p>
      </div>
      <div className="mt-4 p-4 bg-gray-800 rounded">
        <h2 className="text-lg font-semibold mb-2">Products:</h2>
        <ul className="space-y-1">
          {initialProducts?.slice(0, 5).map((product, index) => (
            <li key={product.id || index}>
              {product.fullName} - ${product.price}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}