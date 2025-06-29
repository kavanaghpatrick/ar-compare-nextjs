'use client';

import { useState, useEffect } from 'react';
import { Product } from '@/types';

interface HomeClientProps {
  initialProducts: Product[];
  searchParams: { search?: string; category?: string };
}

export function HomeClientSimplified({ initialProducts, searchParams }: HomeClientProps) {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    console.log('[HomeClientSimplified] Mounting...');
    setIsClient(true);
  }, []);
  
  console.log('[HomeClientSimplified] Render - isClient:', isClient);
  
  return (
    <div className="app-container">
      <div className="min-h-screen p-8">
        <h1 className="text-3xl font-bold text-white mb-4">
          AR Compare - Simplified
        </h1>
        <p className="text-white/80 mb-8">
          {isClient ? 'Client-side rendered' : 'Server-side rendered'}
        </p>
        
        <div className="space-y-4">
          <div className="bg-white/10 p-4 rounded-lg">
            <h2 className="text-xl font-semibold text-white mb-2">Status</h2>
            <p className="text-white/80">Products loaded: {initialProducts?.length || 0}</p>
            <p className="text-white/80">Search: {searchParams.search || 'none'}</p>
            <p className="text-white/80">Category: {searchParams.category || 'none'}</p>
          </div>
          
          <div className="bg-white/10 p-4 rounded-lg">
            <h2 className="text-xl font-semibold text-white mb-2">First 5 Products</h2>
            <ul className="space-y-2">
              {initialProducts?.slice(0, 5).map((product) => (
                <li key={product.id} className="text-white/80">
                  {product.fullName} - ${product.price}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}