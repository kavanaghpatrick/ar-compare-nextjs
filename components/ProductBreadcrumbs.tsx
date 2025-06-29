'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { ChevronRight, Home, Search, BarChart3 } from 'lucide-react';
import { Product } from '@/types';

interface ProductBreadcrumbsProps {
  product?: Product;
  category?: string;
  searchTerm?: string;
  comparisonContext?: boolean;
  customPath?: Array<{ label: string; href: string }>;
}

export function ProductBreadcrumbs({ 
  product, 
  category, 
  searchTerm, 
  comparisonContext = false,
  customPath 
}: ProductBreadcrumbsProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const buildBreadcrumbs = () => {
    const breadcrumbs: Array<{ label: string; href: string; icon?: React.ReactNode }> = [
      { 
        label: 'Home', 
        href: '/', 
        icon: <Home size={16} /> 
      }
    ];

    // Handle custom path
    if (customPath) {
      breadcrumbs.push(...customPath);
      return breadcrumbs;
    }

    // Handle search context
    if (searchTerm) {
      breadcrumbs.push({
        label: 'Products',
        href: '/'
      });
      breadcrumbs.push({
        label: `Search: "${searchTerm}"`,
        href: `/?search=${encodeURIComponent(searchTerm)}`,
        icon: <Search size={16} />
      });
    }

    // Handle comparison context
    if (comparisonContext) {
      breadcrumbs.push({
        label: 'Products',
        href: '/'
      });
      breadcrumbs.push({
        label: 'Compare',
        href: '/compare',
        icon: <BarChart3 size={16} />
      });
    }

    // Handle category context
    if (category && !searchTerm && !comparisonContext) {
      breadcrumbs.push({
        label: 'Products',
        href: '/'
      });
      breadcrumbs.push({
        label: category,
        href: `/?category=${encodeURIComponent(category)}`
      });
    }

    // Handle product detail page
    if (product) {
      if (!category && !searchTerm && !comparisonContext) {
        breadcrumbs.push({
          label: 'Products',
          href: '/'
        });
        breadcrumbs.push({
          label: product.category,
          href: `/?category=${encodeURIComponent(product.category)}`
        });
      }
      breadcrumbs.push({
        label: product.name || product.fullName,
        href: `/products/${product.id}`
      });
    }

    return breadcrumbs;
  };

  const breadcrumbs = buildBreadcrumbs();

  if (breadcrumbs.length <= 1) {
    return null;
  }

  return (
    <nav 
      className="breadcrumbs" 
      aria-label="Breadcrumb navigation"
      role="navigation"
    >
      <ol className="breadcrumbs-list">
        {breadcrumbs.map((crumb, index) => (
          <li key={index} className="breadcrumb-item">
            {index < breadcrumbs.length - 1 ? (
              <Link 
                href={crumb.href} 
                className="breadcrumb-link"
                aria-label={`Go to ${crumb.label}`}
              >
                {crumb.icon && <span className="breadcrumb-icon">{crumb.icon}</span>}
                {crumb.label}
              </Link>
            ) : (
              <span className="breadcrumb-current" aria-current="page">
                {crumb.icon && <span className="breadcrumb-icon">{crumb.icon}</span>}
                {crumb.label}
              </span>
            )}
            {index < breadcrumbs.length - 1 && (
              <ChevronRight 
                size={16} 
                className="breadcrumb-separator" 
                aria-hidden="true"
              />
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

// Hook for easy breadcrumb context detection
export function useBreadcrumbContext() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const searchTerm = searchParams.get('search') || undefined;
  const category = searchParams.get('category') || undefined;
  const comparisonContext = pathname.includes('/compare');
  
  return {
    searchTerm,
    category,
    comparisonContext,
    pathname
  };
}