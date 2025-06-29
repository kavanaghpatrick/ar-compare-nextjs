import React from 'react';
import { Product } from '@/types';
import { ProductCard } from './ProductCard';

interface ProductListingProps {
  products: Product[];
  onCompare?: (productId: string) => void;
  onShowDetails?: (product: Product) => void;
  onQuickView?: (product: Product) => void;
  comparisonItems?: string[];
  showBreadcrumbs?: boolean;
  context?: 'search' | 'category' | 'main' | 'related';
}

// Memoized ProductListing component for performance
export const ProductListing = React.memo(({
  products,
  onCompare,
  onShowDetails,
  onQuickView,
  comparisonItems = [],
  showBreadcrumbs = false,
  context = 'main'
}: ProductListingProps) => {
  return (
    <div className="products-grid">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onCompare={onCompare}
          onShowDetails={onShowDetails}
          onQuickView={onQuickView}
          isInComparison={comparisonItems.includes(product.id)}
          showBreadcrumbs={showBreadcrumbs}
          context={context}
        />
      ))}
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison function
  return (
    prevProps.products === nextProps.products &&
    prevProps.comparisonItems === nextProps.comparisonItems &&
    prevProps.showBreadcrumbs === nextProps.showBreadcrumbs &&
    prevProps.context === nextProps.context &&
    prevProps.onCompare === nextProps.onCompare &&
    prevProps.onShowDetails === nextProps.onShowDetails &&
    prevProps.onQuickView === nextProps.onQuickView
  );
});

ProductListing.displayName = 'ProductListing';