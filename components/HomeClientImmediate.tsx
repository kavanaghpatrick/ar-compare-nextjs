'use client';

import { useState, useMemo, useCallback } from 'react';
import { useComparison } from '@/contexts/ComparisonContext';
import { SearchBar } from '@/components/SearchBar';
import { ProductCard } from '@/components/ProductCard';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Product } from '@/types';
import ComparisonCart from '@/components/ComparisonCart';
import { QuickView } from '@/components/QuickView';
import { ProductBreadcrumbsSuspense as ProductBreadcrumbs } from '@/components/ProductBreadcrumbsSuspense';

interface HomeClientProps {
  initialProducts: Product[];
  searchParams: { search?: string; category?: string };
}

export function HomeClientImmediate({ initialProducts, searchParams: serverSearchParams }: HomeClientProps) {
  const { addItem, removeItem, isInComparison } = useComparison();
  
  // Use server search params directly - no client-side hooks that could cause hydration issues
  const urlSearch = serverSearchParams.search || '';
  const urlCategory = serverSearchParams.category || '';
  
  // Local state for interactive filtering
  const [searchTerm, setSearchTerm] = useState(urlSearch);
  const [selectedCategory, setSelectedCategory] = useState(urlCategory);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Memoize filtered products calculation
  const filteredProducts = useMemo(() => {
    let filtered = initialProducts;

    // Apply category filter
    const activeCategory = selectedCategory || urlCategory;
    if (activeCategory) {
      filtered = filtered.filter(product => product.category === activeCategory);
    }

    // Apply search filter
    const activeSearch = searchTerm || urlSearch;
    if (activeSearch) {
      const search = activeSearch.toLowerCase();
      filtered = filtered.filter(product => 
        product.fullName.toLowerCase().includes(search) ||
        product.brand.toLowerCase().includes(search) ||
        product.description.toLowerCase().includes(search) ||
        product.keyFeatures.some(feature => feature.toLowerCase().includes(search))
      );
    }

    return filtered;
  }, [searchTerm, selectedCategory, urlSearch, urlCategory, initialProducts]);
  
  // Memoize unique categories
  const categories = useMemo(() => {
    return Array.from(new Set(initialProducts.map(product => product.category)));
  }, [initialProducts]);

  // Memoize callback functions
  const handleToggleComparison = useCallback((productId: string) => {
    if (isInComparison(productId)) {
      removeItem(productId);
    } else {
      addItem(productId);
    }
  }, [isInComparison, removeItem, addItem]);
  
  const handleQuickView = useCallback((product: Product) => {
    setQuickViewProduct(product);
  }, []);
  
  const closeQuickView = useCallback(() => {
    setQuickViewProduct(null);
  }, []);
  
  // Memoize page title and description
  const pageTitle = useMemo(() => {
    if (urlSearch) {
      return `Search Results for "${urlSearch}"`;
    }
    if (urlCategory) {
      return `${urlCategory} AR Glasses`;
    }
    return 'AR Glasses Comparison';
  }, [urlSearch, urlCategory]);
  
  const pageDescription = useMemo(() => {
    if (urlSearch) {
      return `Found ${filteredProducts.length} AR glasses matching "${urlSearch}". Compare specs, features, and prices.`;
    }
    if (urlCategory) {
      return `Compare ${filteredProducts.length} ${urlCategory.toLowerCase()} AR glasses. Find the perfect device for your needs.`;
    }
    return 'Compare specs, features, and prices of the latest AR glasses from top manufacturers. Make informed decisions with our comprehensive database.';
  }, [urlSearch, urlCategory, filteredProducts.length]);

  // Render immediately - no loading states, no client checks
  return (
    <div className="app-container">
      <Navigation />
      <ComparisonCart onQuickView={handleQuickView} />
      
      {/* Breadcrumbs */}
      <ProductBreadcrumbs 
        searchTerm={urlSearch}
        category={urlCategory}
      />
      
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-container">
          <h1 className="hero-title">{pageTitle}</h1>
          <p className="hero-subtitle">
            {pageDescription}
          </p>
          
          <div className="hero-buttons">
            <button className="btn btn-primary">Start Comparing</button>
            <button className="btn btn-outline">View All Products</button>
          </div>

          <div className="stats">
            <div className="stat">
              <div className="stat-number">8+</div>
              <div className="stat-label">Brands</div>
            </div>
            <div className="stat">
              <div className="stat-number">15+</div>
              <div className="stat-label">Products</div>
            </div>
            <div className="stat">
              <div className="stat-number">Daily</div>
              <div className="stat-label">Updates</div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="products-section">
        <div className="products-container">
          <div className="search-container">
            <SearchBar
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              placeholder="Search AR glasses..."
            />
          </div>

          <div className="text-center mb-6">
            <h2 className="section-title">{filteredProducts.length} Products Found</h2>
            <p className="text-white/60 mb-4">
              {urlCategory && `Showing ${urlCategory} category. `}
              {urlSearch && `Search results for "${urlSearch}". `}
              Enhanced with comprehensive Amazon research, customer reviews, and market analysis
            </p>
            
            {/* Category Filter Quick Links */}
            {!urlCategory && !urlSearch && (
              <div className="category-filter-links">
                <span className="filter-label">Quick Filter:</span>
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category === selectedCategory ? '' : category)}
                    className={`category-filter-btn ${
                      selectedCategory === category ? 'active' : ''
                    }`}
                  >
                    {category}
                  </button>
                ))}
                {selectedCategory && (
                  <button
                    onClick={() => setSelectedCategory('')}
                    className="category-filter-clear"
                  >
                    Clear Filter
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="products-grid">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onCompare={handleToggleComparison}
                onQuickView={handleQuickView}
                isInComparison={isInComparison(product.id)}
                context={urlSearch ? 'search' : urlCategory ? 'category' : 'main'}
              />
            ))}
          </div>
        </div>
      </section>
      
      {/* Quick View Modal */}
      <QuickView
        product={quickViewProduct}
        isOpen={quickViewProduct !== null}
        onClose={closeQuickView}
      />
      
      {/* Footer */}
      <Footer />
    </div>
  );
}