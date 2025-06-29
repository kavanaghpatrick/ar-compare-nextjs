'use client';

import { useState } from 'react';
import { Product } from '@/types';
import { ProductCard } from '@/components/ProductCard';

interface HomeClientSimpleProps {
  initialProducts: Product[];
  searchParams: { search?: string; category?: string };
}

export function HomeClientSimple({ initialProducts, searchParams }: HomeClientSimpleProps) {
  const [products] = useState(initialProducts);
  
  return (
    <div className="app-container">
      <section className="hero">
        <div className="hero-container">
          <h1 className="hero-title">The Ultimate AR & AI Glasses Comparison</h1>
          <p className="hero-subtitle">
            Compare {products.length} cutting-edge AR and AI glasses
          </p>
        </div>
      </section>
      
      <section className="products-section">
        <div className="products-container">
          <h2 className="section-title">All Products</h2>
          <div className="products-grid">
            {products.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={() => console.log('Quick view:', product.name)}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}