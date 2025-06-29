'use client';

import { NavigationSimple } from '@/components/NavigationSimple';
import { Footer } from '@/components/Footer';
import { ComparisonCart } from '@/components/ComparisonCart';
import { QuickView } from '@/components/QuickView';
import { useState } from 'react';
import { Product } from '@/types';

interface PageLayoutProps {
  children: React.ReactNode;
  showComparisonCart?: boolean;
}

export function PageLayout({ children, showComparisonCart = true }: PageLayoutProps) {
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  
  const handleQuickView = (product: Product | null) => {
    setQuickViewProduct(product);
  };
  
  const closeQuickView = () => {
    setQuickViewProduct(null);
  };
  
  return (
    <div className="app-container">
      <NavigationSimple />
      {showComparisonCart && <ComparisonCart onQuickView={handleQuickView} />}
      
      {children}
      
      {/* Quick View Modal */}
      <QuickView
        product={quickViewProduct}
        isOpen={quickViewProduct !== null}
        onClose={closeQuickView}
      />
      
      <Footer />
    </div>
  );
}