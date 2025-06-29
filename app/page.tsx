'use client';

import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useComparison } from '@/contexts/ComparisonContext';
import { SearchBar } from '@/components/SearchBar';
import { ProductCard } from '@/components/ProductCard';
import { ComparisonCart } from '@/components/ComparisonCart';
import { QuickView } from '@/components/QuickView';
import { ProductBreadcrumbs } from '@/components/ProductBreadcrumbs';
import { Navigation } from '@/components/Navigation';
import arGlassesData from '@/data/products';
import { Product } from '@/types';

export default function Home() {
  const { addItem, removeItem, isInComparison } = useComparison();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isClient, setIsClient] = useState(false);
  
  // Get URL parameters
  const urlSearch = searchParams.get('search') || '';
  const urlCategory = searchParams.get('category') || '';

  useEffect(() => {
    setIsClient(true);
    // Set initial state from URL params
    setSearchTerm(urlSearch);
    setSelectedCategory(urlCategory);
  }, [urlSearch, urlCategory]);

  // Filter and search products
  const filteredProducts = useMemo(() => {
    let filtered = arGlassesData;

    // Apply category filter
    if (selectedCategory || urlCategory) {
      const category = selectedCategory || urlCategory;
      filtered = filtered.filter(product => product.category === category);
    }

    // Apply search filter
    const currentSearch = searchTerm || urlSearch;
    if (currentSearch) {
      const search = currentSearch.toLowerCase();
      filtered = filtered.filter(product => 
        product.fullName.toLowerCase().includes(search) ||
        product.brand.toLowerCase().includes(search) ||
        product.description.toLowerCase().includes(search) ||
        product.keyFeatures.some(feature => feature.toLowerCase().includes(search))
      );
    }

    return filtered;
  }, [searchTerm, selectedCategory, urlSearch, urlCategory]);
  
  // Get unique categories for display
  const categories = useMemo(() => {
    return Array.from(new Set(arGlassesData.map(product => product.category)));
  }, []);

  const handleToggleComparison = (productId: string) => {
    if (isInComparison(productId)) {
      removeItem(productId);
    } else {
      addItem(productId);
    }
  };
  
  const handleQuickView = (product: Product) => {
    setQuickViewProduct(product);
  };
  
  const closeQuickView = () => {
    setQuickViewProduct(null);
  };
  
  const getPageTitle = () => {
    if (urlSearch) {
      return `Search Results for "${urlSearch}"`;
    }
    if (urlCategory) {
      return `${urlCategory} AR Glasses`;
    }
    return 'AR Glasses Comparison';
  };
  
  const getPageDescription = () => {
    if (urlSearch) {
      return `Found ${filteredProducts.length} AR glasses matching "${urlSearch}". Compare specs, features, and prices.`;
    }
    if (urlCategory) {
      return `Compare ${filteredProducts.length} ${urlCategory.toLowerCase()} AR glasses. Find the perfect device for your needs.`;
    }
    return 'Compare specs, features, and prices of the latest AR glasses from top manufacturers. Make informed decisions with our comprehensive database.';
  };

  // Don't render until client-side hydration is complete
  if (!isClient) {
    return (
      <div className="app-container">
        <section className="hero">
          <div className="hero-container">
            <h1 className="hero-title">The Ultimate AR & AI Glasses Comparison</h1>
            <p className="hero-subtitle">Loading...</p>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="app-container">
      <Navigation />
      <ComparisonCart onQuickView={handleQuickView} />
      
      {/* Breadcrumbs */}
      <ProductBreadcrumbs 
        searchTerm={urlSearch}
        category={urlCategory}
      />
      {/* <StructuredData products={filteredProducts} page="home" /> */}
      
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-container">
          <h1 className="hero-title">{getPageTitle()}</h1>
          <p className="hero-subtitle">
            {getPageDescription()}
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
    </div>
  );
}