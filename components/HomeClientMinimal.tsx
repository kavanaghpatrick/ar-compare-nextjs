'use client';

import { Product } from '@/types';

interface HomeClientProps {
  initialProducts: Product[];
  searchParams: { search?: string; category?: string };
}

export function HomeClientMinimal({ initialProducts, searchParams }: HomeClientProps) {
  console.log('[HomeClientMinimal] Rendering with:', {
    productsCount: initialProducts?.length,
    searchParams
  });
  
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #0f172a 100%)',
      color: 'white',
      padding: '2rem'
    }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>
        AR Compare - Minimal Test
      </h1>
      
      <div style={{ marginBottom: '2rem' }}>
        <p>Products loaded: {initialProducts?.length || 0}</p>
        <p>Search: {searchParams?.search || 'none'}</p>
        <p>Category: {searchParams?.category || 'none'}</p>
      </div>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '1rem' 
      }}>
        {initialProducts?.slice(0, 6).map((product) => (
          <div 
            key={product.id} 
            style={{ 
              background: 'rgba(255, 255, 255, 0.1)',
              padding: '1rem',
              borderRadius: '0.5rem'
            }}
          >
            <h3 style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>
              {product.fullName}
            </h3>
            <p>${product.price}</p>
            <p style={{ fontSize: '0.875rem', opacity: 0.8 }}>
              {product.category}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}