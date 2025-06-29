'use client';

import React, { useState } from 'react';
import { EnhancedProduct } from '@/types';
import { 
  ProductComparison, 
  PurchaseRecommendations, 
  MarketContext, 
  SimilarProducts 
} from '@/components';

interface ProductDetailsEnhancedProps {
  product: EnhancedProduct;
  allProducts: EnhancedProduct[];
  className?: string;
}

type EnhancedTab = 'comparison' | 'recommendations' | 'market' | 'similar';

export function ProductDetailsEnhanced({ 
  product, 
  allProducts, 
  className = "" 
}: ProductDetailsEnhancedProps) {
  const [activeTab, setActiveTab] = useState<EnhancedTab>('comparison');

  return (
    <div className={`product-details-enhanced ${className}`}>
      {/* Enhanced Navigation */}
      <div className="enhanced-nav">
        <h2 className="enhanced-nav-title">Detailed Analysis</h2>
        <div className="enhanced-tabs">
          <button
            onClick={() => setActiveTab('comparison')}
            className={`enhanced-tab ${activeTab === 'comparison' ? 'active' : ''}`}
          >
            Product Comparison
          </button>
          <button
            onClick={() => setActiveTab('recommendations')}
            className={`enhanced-tab ${activeTab === 'recommendations' ? 'active' : ''}`}
          >
            Purchase Guide
          </button>
          <button
            onClick={() => setActiveTab('market')}
            className={`enhanced-tab ${activeTab === 'market' ? 'active' : ''}`}
          >
            Market Analysis
          </button>
          <button
            onClick={() => setActiveTab('similar')}
            className={`enhanced-tab ${activeTab === 'similar' ? 'active' : ''}`}
          >
            Similar Products
          </button>
        </div>
      </div>

      {/* Enhanced Content */}
      <div className="enhanced-content">
        {activeTab === 'comparison' && (
          <ProductComparison 
            currentProduct={product}
            allProducts={allProducts}
          />
        )}
        
        {activeTab === 'recommendations' && (
          <PurchaseRecommendations 
            product={product}
            allProducts={allProducts}
          />
        )}
        
        {activeTab === 'market' && (
          <MarketContext 
            product={product}
            allProducts={allProducts}
          />
        )}
        
        {activeTab === 'similar' && (
          <SimilarProducts 
            currentProduct={product}
            allProducts={allProducts}
          />
        )}
      </div>
    </div>
  );
}

// Enhanced styles for the container component
export const ProductDetailsEnhancedStyles = `
  .product-details-enhanced {
    @apply mt-8;
  }

  .enhanced-nav {
    @apply mb-6;
  }

  .enhanced-nav-title {
    @apply text-white font-bold text-2xl mb-4;
  }

  .enhanced-tabs {
    @apply flex flex-wrap gap-2 bg-white/10 rounded-lg p-2 border border-white/20;
  }

  .enhanced-tab {
    @apply px-4 py-3 rounded-lg font-medium text-white/80 transition-all duration-200 cursor-pointer border-none bg-transparent hover:bg-white/10;
  }

  .enhanced-tab.active {
    @apply bg-blue-600 text-white;
  }

  .enhanced-content {
    @apply space-y-6;
  }

  @media (max-width: 768px) {
    .enhanced-tabs {
      @apply flex-col gap-1;
    }
    
    .enhanced-tab {
      @apply text-center;
    }
  }
`;

export default ProductDetailsEnhanced;