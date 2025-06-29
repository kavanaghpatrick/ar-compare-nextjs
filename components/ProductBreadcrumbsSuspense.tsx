'use client';

import { Suspense } from 'react';
import { ProductBreadcrumbs } from './ProductBreadcrumbs';
import type { Product } from '@/types';

interface ProductBreadcrumbsProps {
  product?: Product;
  category?: string;
  searchTerm?: string;
  comparisonContext?: boolean;
  customPath?: Array<{ label: string; href: string }>;
}

// Loading component for breadcrumbs
function BreadcrumbsLoading() {
  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb navigation">
      <div className="breadcrumbs-list">
        <div className="animate-pulse flex items-center gap-2">
          <div className="h-4 w-12 bg-white/20 rounded"></div>
          <div className="h-4 w-4 bg-white/20 rounded"></div>
          <div className="h-4 w-20 bg-white/20 rounded"></div>
        </div>
      </div>
    </nav>
  );
}

// Wrapper component that includes Suspense
export function ProductBreadcrumbsSuspense(props: ProductBreadcrumbsProps) {
  return (
    <Suspense fallback={<BreadcrumbsLoading />}>
      <ProductBreadcrumbs {...props} />
    </Suspense>
  );
}