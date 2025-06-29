'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Grid, Search, BarChart3, List } from 'lucide-react';
import { Product } from '@/types';
import { ProductCard } from './ProductCard';
import arGlassesData from '@/data/products';

interface ProductNavigationProps {
  currentProduct: Product;
  searchTerm?: string;
  category?: string;
  onQuickView?: (product: Product) => void;
}

export function ProductNavigation({ 
  currentProduct, 
  searchTerm, 
  category,
  onQuickView 
}: ProductNavigationProps) {
  // Filter products based on context (search, category, or all)
  const filteredProducts = useMemo(() => {
    let products = arGlassesData;

    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      products = products.filter(product => 
        product.fullName.toLowerCase().includes(search) ||
        product.brand.toLowerCase().includes(search) ||
        product.description.toLowerCase().includes(search) ||
        product.keyFeatures.some(feature => feature.toLowerCase().includes(search))
      );
    } else if (category) {
      products = products.filter(product => product.category === category);
    }

    return products;
  }, [searchTerm, category]);

  const currentIndex = filteredProducts.findIndex(p => p.id === currentProduct.id);
  const previousProduct = currentIndex > 0 ? filteredProducts[currentIndex - 1] : null;
  const nextProduct = currentIndex < filteredProducts.length - 1 ? filteredProducts[currentIndex + 1] : null;

  // Get related products (same category, different product)
  const relatedProducts = useMemo(() => {
    return arGlassesData
      .filter(product => 
        product.category === currentProduct.category && 
        product.id !== currentProduct.id
      )
      .slice(0, 3);
  }, [currentProduct]);

  const getBackToListUrl = () => {
    if (searchTerm) {
      return `/?search=${encodeURIComponent(searchTerm)}`;
    }
    if (category) {
      return `/?category=${encodeURIComponent(category)}`;
    }
    return '/';
  };

  const getBackToListLabel = () => {
    if (searchTerm) {
      return `Back to Search Results (${filteredProducts.length})`;
    }
    if (category) {
      return `Back to ${category} Products (${filteredProducts.length})`;
    }
    return `Back to All Products (${filteredProducts.length})`;
  };

  return (
    <div className="product-navigation">
      {/* Back to List Navigation */}
      <div className="navigation-back">
        <Link 
          href={getBackToListUrl()} 
          className="back-to-list-btn"
          aria-label={getBackToListLabel()}
        >
          <Grid size={20} />
          <span>{getBackToListLabel()}</span>
        </Link>
        
        {searchTerm && (
          <div className="search-context">
            <Search size={16} />
            <span>Search: "{searchTerm}"</span>
          </div>
        )}
      </div>

      {/* Previous/Next Product Navigation */}
      <div className="navigation-adjacent">
        {previousProduct && (
          <Link 
            href={`/products/${previousProduct.id}`}
            className="nav-adjacent-btn nav-previous"
            aria-label={`Previous product: ${previousProduct.fullName}`}
          >
            <ArrowLeft size={20} />
            <div className="nav-adjacent-info">
              <span className="nav-adjacent-label">Previous</span>
              <span className="nav-adjacent-name">{previousProduct.fullName}</span>
              <span className="nav-adjacent-price">${previousProduct.price}</span>
            </div>
          </Link>
        )}

        <div className="nav-position">
          {currentIndex + 1} of {filteredProducts.length}
        </div>

        {nextProduct && (
          <Link 
            href={`/products/${nextProduct.id}`}
            className="nav-adjacent-btn nav-next"
            aria-label={`Next product: ${nextProduct.fullName}`}
          >
            <div className="nav-adjacent-info">
              <span className="nav-adjacent-label">Next</span>
              <span className="nav-adjacent-name">{nextProduct.fullName}</span>
              <span className="nav-adjacent-price">${nextProduct.price}</span>
            </div>
            <ArrowRight size={20} />
          </Link>
        )}
      </div>

      {/* Quick Navigation Menu */}
      <div className="navigation-quick">
        <Link href="/" className="quick-nav-btn">
          <List size={16} />
          All Products
        </Link>
        <Link href="/compare" className="quick-nav-btn">
          <BarChart3 size={16} />
          Compare
        </Link>
        <Link href={`/?category=${encodeURIComponent(currentProduct.category)}`} className="quick-nav-btn">
          <Grid size={16} />
          {currentProduct.category}
        </Link>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="navigation-related">
          <h3 className="related-title">More {currentProduct.category} Products</h3>
          <div className="related-products-grid">
            {relatedProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={onQuickView}
                context="related"
                showBreadcrumbs={false}
              />
            ))}
          </div>
          <Link 
            href={`/?category=${encodeURIComponent(currentProduct.category)}`}
            className="view-all-category-btn"
          >
            View All {currentProduct.category} Products
          </Link>
        </div>
      )}
    </div>
  );
}