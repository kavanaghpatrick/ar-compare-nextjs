"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { EnhancedProduct, Product } from '@/types';
import { ProductHero } from '@/components/ProductHero';
import ProductTabsClient from '@/components/ProductTabsClient';
import { ProductBreadcrumbsSuspense as ProductBreadcrumbs } from '@/components/ProductBreadcrumbsSuspense';
import { ProductNavigation } from '@/components/ProductNavigation';
import { NavigationSimple } from '@/components/NavigationSimple';
import { ComparisonCart } from '@/components/ComparisonCart';
import { QuickView } from '@/components/QuickView';
import { useComparison } from '@/contexts/ComparisonContext';

interface ProductPageClientProps {
  product: EnhancedProduct;
}

export function ProductPageClient({ product }: ProductPageClientProps) {
  const { addItem, removeItem, isInComparison } = useComparison();
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  
  const handleAddToCompare = () => {
    if (isInComparison(product.id)) {
      removeItem(product.id);
    } else {
      addItem(product.id);
    }
  };
  
  const handleQuickView = (productToView: Product) => {
    setQuickViewProduct(productToView);
  };
  
  const closeQuickView = () => {
    setQuickViewProduct(null);
  };

  const handleBuyOnAmazon = () => {
    // In a real app, this would redirect to Amazon
    if (product.amazon?.asin) {
      window.open(`https://amazon.com/dp/${product.amazon.asin}`, '_blank');
    } else {
      // Fallback to search Amazon for the product
      const searchQuery = encodeURIComponent(`${product.brand} ${product.model}`);
      window.open(`https://amazon.com/s?k=${searchQuery}`, '_blank');
    }
  };

  return (
    <div className="app-container">
      <NavigationSimple />
      <ComparisonCart onQuickView={handleQuickView} />
      
      {/* Breadcrumbs */}
      <ProductBreadcrumbs product={product} />
      
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-12 relative z-10">
        {/* Back Navigation */}
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Products
        </Link>
        
        {/* Product Hero Section */}
        <ProductHero 
          product={product}
          onAddToCompare={handleAddToCompare}
          onBuyOnAmazon={handleBuyOnAmazon}
        />

        {/* Detailed Product Information */}
        <ProductTabsClient product={product} />
        
        {/* Product Navigation */}
        <ProductNavigation 
          currentProduct={product} 
          onQuickView={handleQuickView}
        />
      </div>
      
      {/* Quick View Modal */}
      <QuickView
        product={quickViewProduct}
        isOpen={quickViewProduct !== null}
        onClose={closeQuickView}
      />
    </div>
  );
}