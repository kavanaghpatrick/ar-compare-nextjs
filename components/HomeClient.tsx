'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import { useComparison } from '@/contexts/ComparisonContext';
import { SearchBar } from '@/components/SearchBar';
import { ProductCard } from '@/components/ProductCard';
import { NavigationSimple } from '@/components/NavigationSimple';
import { Footer } from '@/components/Footer';
import { Product } from '@/types';

// Temporarily disable dynamic imports to debug loading issue
import ComparisonCart from '@/components/ComparisonCart';
import { QuickView } from '@/components/QuickView';
import { ProductBreadcrumbsSuspense as ProductBreadcrumbs } from '@/components/ProductBreadcrumbsSuspense';

interface HomeClientProps {
  initialProducts: Product[];
  searchParams: { search?: string; category?: string };
}

export function HomeClient({ initialProducts, searchParams: serverSearchParams }: HomeClientProps) {
  console.log('[HomeClient] Component rendering...', { 
    productsCount: initialProducts?.length,
    serverSearchParams 
  });
  const { addItem, removeItem, isInComparison } = useComparison();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isClient, setIsClient] = useState(false);
  
  // Safely use searchParams with try-catch to handle potential SSR issues
  let clientSearchParams: URLSearchParams | null = null;
  try {
    clientSearchParams = useSearchParams();
  } catch (error) {
    console.warn('useSearchParams error:', error);
  }
  
  // Get URL parameters - prefer client-side params when available
  const urlSearch = (isClient && clientSearchParams ? clientSearchParams.get('search') : serverSearchParams.search) || '';
  const urlCategory = (isClient && clientSearchParams ? clientSearchParams.get('category') : serverSearchParams.category) || '';

  useEffect(() => {
    console.log('[HomeClient] useEffect - setting isClient to true');
    setIsClient(true);
  }, []);

  useEffect(() => {
    // Only update state from URL params after client-side hydration
    if (isClient) {
      setSearchTerm(urlSearch);
      setSelectedCategory(urlCategory);
    }
  }, [isClient, urlSearch, urlCategory]);

  // Memoize filtered products calculation
  const filteredProducts = useMemo(() => {
    let filtered = initialProducts;

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

  // Remove loading state that causes hydration mismatch
  // Instead, use CSS to hide content until hydrated

  console.log('[HomeClient] Rendering full component, isClient is true');
  
  // Generate structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://ar-compare.com/#website",
        "url": "https://ar-compare.com",
        "name": "AR Compare",
        "description": "Compare AR glasses and smart glasses from top manufacturers. Expert reviews, real-time pricing, and comprehensive specifications.",
        "potentialAction": {
          "@type": "SearchAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": "https://ar-compare.com/?search={search_term_string}"
          },
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "Organization",
        "@id": "https://ar-compare.com/#organization",
        "name": "AR Compare",
        "url": "https://ar-compare.com",
        "logo": {
          "@type": "ImageObject",
          "url": "https://ar-compare.com/logo.png"
        },
        "description": "Leading platform for comparing AR glasses and smart glasses with expert analysis and real-time market data.",
        "address": {
          "@type": "PostalAddress",
          "addressCountry": "US"
        }
      },
      {
        "@type": "WebPage",
        "@id": "https://ar-compare.com/#webpage",
        "url": "https://ar-compare.com",
        "name": pageTitle,
        "description": pageDescription,
        "isPartOf": {
          "@id": "https://ar-compare.com/#website"
        },
        "about": {
          "@id": "https://ar-compare.com/#organization"
        },
        "mainEntity": {
          "@type": "ItemList",
          "numberOfItems": filteredProducts.length,
          "itemListElement": filteredProducts.slice(0, 10).map((product, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "item": {
              "@type": "Product",
              "name": product.fullName,
              "description": product.description,
              "brand": {
                "@type": "Brand",
                "name": product.brand
              },
              "offers": {
                "@type": "Offer",
                "price": product.price,
                "priceCurrency": "USD",
                "availability": "https://schema.org/InStock"
              }
            }
          }))
        }
      }
    ]
  };

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <div className="app-container">
        <NavigationSimple />
        <ComparisonCart onQuickView={handleQuickView} />
        
        {/* Skip to main content for accessibility */}
        <a href="#main-content" className="skip-to-content">
          Skip to main content
        </a>
        
        {/* Breadcrumbs */}
        <ProductBreadcrumbs 
          searchTerm={urlSearch}
          category={urlCategory}
        />
      
      {/* Enhanced Hero Section */}
      <section className="hero-enhanced">
        <div className="hero-container">
          {/* Trust Badge */}
          <div className="trust-badge">
            <span className="badge-icon">✓</span>
            <span>Trusted by 50,000+ AR enthusiasts worldwide</span>
          </div>
          
          <h1 className="hero-title-enhanced">
            Compare AR Glasses & 
            <span className="gradient-text">Smart Glasses</span>
          </h1>
          
          <p className="hero-subtitle-enhanced">
            Make informed decisions with our comprehensive database of AR glasses. 
            Compare specs, read expert reviews, and find the perfect device for your needs.
          </p>
          
          {/* Value Propositions */}
          <div className="value-props">
            <div className="value-prop">
              <div className="value-icon">🔍</div>
              <span>Expert Analysis</span>
            </div>
            <div className="value-prop">
              <div className="value-icon">📊</div>
              <span>Real-time Pricing</span>
            </div>
            <div className="value-prop">
              <div className="value-icon">⭐</div>
              <span>User Reviews</span>
            </div>
          </div>
          
          <div className="hero-buttons-enhanced">
            <button className="btn-primary-enhanced" onClick={() => {
              document.querySelector('.products-section')?.scrollIntoView({ behavior: 'smooth' });
            }}>
              <span>Start Comparing Now</span>
              <span className="btn-arrow">→</span>
            </button>
            <button className="btn-secondary-enhanced" onClick={() => {
              document.querySelector('.products-grid')?.scrollIntoView({ behavior: 'smooth' });
            }}>
              View All {filteredProducts.length} Products
            </button>
          </div>

          {/* Enhanced Stats with Social Proof */}
          <div className="stats-enhanced">
            <div className="stat-enhanced">
              <div className="stat-number-enhanced">8+</div>
              <div className="stat-label-enhanced">Top Brands</div>
              <div className="stat-detail">Meta, Apple, XREAL & more</div>
            </div>
            <div className="stat-enhanced">
              <div className="stat-number-enhanced">{filteredProducts.length}+</div>
              <div className="stat-label-enhanced">Products</div>
              <div className="stat-detail">Updated daily</div>
            </div>
            <div className="stat-enhanced">
              <div className="stat-number-enhanced">50K+</div>
              <div className="stat-label-enhanced">Users</div>
              <div className="stat-detail">Trust our analysis</div>
            </div>
            <div className="stat-enhanced">
              <div className="stat-number-enhanced">4.8</div>
              <div className="stat-label-enhanced">Rating</div>
              <div className="stat-detail">From 2,000+ reviews</div>
            </div>
          </div>
          
          {/* Social Proof Logos */}
          <div className="social-proof">
            <p className="social-proof-text">Featured in:</p>
            <div className="brand-logos">
              <div className="brand-logo">TechCrunch</div>
              <div className="brand-logo">The Verge</div>
              <div className="brand-logo">Wired</div>
              <div className="brand-logo">Engadget</div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Products Section */}
      <main id="main-content">
        <section className="products-section-enhanced">
          <div className="products-container">
          {/* Enhanced Search Section */}
          <div className="search-section">
            <div className="search-header">
              <h2 className="search-title">Find Your Perfect AR Glasses</h2>
              <p className="search-subtitle">
                Compare specs, prices, and reviews from top manufacturers
              </p>
            </div>
            
            <div className="search-container-enhanced">
              <SearchBar
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                placeholder="Search by brand, model, or feature..."
              />
              <div className="search-suggestions">
                <span className="suggestion-label">Popular:</span>
                <button className="suggestion-btn" onClick={() => setSearchTerm('Meta Ray-Ban')}>Meta Ray-Ban</button>
                <button className="suggestion-btn" onClick={() => setSearchTerm('Apple Vision')}>Apple Vision</button>
                <button className="suggestion-btn" onClick={() => setSearchTerm('XREAL')}>XREAL</button>
              </div>
            </div>
          </div>

          {/* Results Header */}
          <div className="results-header">
            <div className="results-info">
              <h3 className="results-title">
                {filteredProducts.length} AR Glasses Found
                {urlCategory && ` in ${urlCategory}`}
                {urlSearch && ` for "${urlSearch}"`}
              </h3>
              <p className="results-subtitle">
                Updated daily with real-time pricing, customer reviews, and expert analysis
              </p>
            </div>
            
            {/* Enhanced Category Filters */}
            {!urlCategory && !urlSearch && (
              <div className="category-filters-enhanced">
                <h4 className="filter-title">Browse by Category:</h4>
                <div className="category-filter-grid">
                  {categories.map(category => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category === selectedCategory ? '' : category)}
                      className={`category-filter-card ${
                        selectedCategory === category ? 'active' : ''
                      }`}
                    >
                      <span className="category-icon">
                        {category === 'Premium' ? '👑' : 
                         category === 'Enterprise' ? '🏢' : 
                         category === 'Consumer' ? '👥' : '🎯'}
                      </span>
                      <span className="category-name">{category}</span>
                      <span className="category-count">
                        {initialProducts.filter(p => p.category === category).length} products
                      </span>
                    </button>
                  ))}
                </div>
                {selectedCategory && (
                  <button
                    onClick={() => setSelectedCategory('')}
                    className="clear-filters-btn"
                  >
                    Clear Filter ×
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Products Grid */}
          <div className="products-grid-enhanced">
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
          
          {/* No Results State */}
          {filteredProducts.length === 0 && (
            <div className="no-results">
              <div className="no-results-icon">🔍</div>
              <h3 className="no-results-title">No AR glasses found</h3>
              <p className="no-results-text">
                Try adjusting your search terms or browse all categories
              </p>
              <button 
                className="btn-primary-enhanced"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('');
                }}
              >
                Show All Products
              </button>
            </div>
          )}
          </div>
        </section>
      </main>
      
      {/* Quick View Modal */}
      <QuickView
        product={quickViewProduct}
        isOpen={quickViewProduct !== null}
        onClose={closeQuickView}
      />
      
      {/* Footer */}
      <Footer />
      </div>
    </>
  );
}