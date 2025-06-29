'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { useComparison } from '@/contexts/ComparisonContext';
import { SearchBar } from '@/components/SearchBar';
import { ProductCard } from '@/components/ProductCard';
import { NavigationSimple } from '@/components/NavigationSimple';
import { Footer } from '@/components/Footer';
import { Product } from '@/types';
import { Star, CheckCircle, Users, Shield, TrendingUp, Eye, Zap, Award } from 'lucide-react';
import ComparisonCart from '@/components/ComparisonCart';
import { QuickView } from '@/components/QuickView';

interface HomeClientProps {
  initialProducts: Product[];
  searchParams: { search?: string; category?: string };
}

export function HomeClientEnhanced({ initialProducts, searchParams: serverSearchParams }: HomeClientProps) {
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

  // Structured Data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "AR Compare",
    "description": "Find your perfect AR glasses with our comprehensive comparison of 15+ models from top brands",
    "url": "https://ar-compare.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://ar-compare.com/?search={search_term_string}",
      "query-input": "required name=search_term_string"
    },
    "publisher": {
      "@type": "Organization",
      "name": "AR Compare",
      "description": "The most trusted source for AR glasses comparisons and reviews"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <div className="app-container">
        {/* Skip to content for accessibility */}
        <a href="#main-content" className="skip-to-content">
          Skip to main content
        </a>
        
        <NavigationSimple />
        <ComparisonCart onQuickView={handleQuickView} />
        
        <main id="main-content">
          {/* Enhanced Hero Section */}
          <section className="hero-enhanced">
            <div className="hero-container">
              {/* Trust Badges Row */}
              <div className="trust-badges">
                <div className="trust-badge">
                  <CheckCircle className="trust-icon" />
                  <span>Trusted by 50,000+ AR enthusiasts</span>
                </div>
                <div className="trust-badge">
                  <Star className="trust-icon" />
                  <span>4.8/5 from 2,000+ reviews</span>
                </div>
                <div className="trust-badge">
                  <Shield className="trust-icon" />
                  <span>100% unbiased recommendations</span>
                </div>
              </div>

              <h1 className="hero-title-enhanced">
                Find Your Perfect AR Glasses in Minutes
              </h1>
              
              <p className="hero-subtitle-enhanced">
                Stop wasting time on confusing specs. Our AI-powered comparison engine analyzes 50+ data points 
                to match you with the ideal AR glasses for your needs and budget.
              </p>

              {/* Value Propositions */}
              <div className="value-props">
                <div className="value-prop">
                  <Eye className="value-icon" />
                  <div>
                    <h3>Expert Analysis</h3>
                    <p>Professional reviews from AR specialists</p>
                  </div>
                </div>
                <div className="value-prop">
                  <TrendingUp className="value-icon" />
                  <div>
                    <h3>Real-time Pricing</h3>
                    <p>Live Amazon pricing updated hourly</p>
                  </div>
                </div>
                <div className="value-prop">
                  <Users className="value-icon" />
                  <div>
                    <h3>User Reviews</h3>
                    <p>Verified buyer experiences and ratings</p>
                  </div>
                </div>
              </div>

              {/* Enhanced CTAs */}
              <div className="hero-actions">
                <button className="cta-primary">
                  <span>Find My Perfect AR Glasses</span>
                  <Zap className="cta-icon" />
                </button>
                <button className="cta-secondary">
                  <span>Compare All Models</span>
                </button>
              </div>

              {/* Social Proof */}
              <div className="social-proof">
                <p className="social-proof-text">Join 50,000+ smart shoppers who found their perfect AR glasses</p>
                <div className="rating-display">
                  <div className="stars">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="star-filled" />
                    ))}
                  </div>
                  <span>4.8/5 stars • 2,000+ reviews</span>
                </div>
              </div>
            </div>
          </section>

          {/* Enhanced Search & Filter Section */}
          <section className="search-section-enhanced">
            <div className="search-container">
              <h2 className="search-title">Compare {initialProducts.length} Top-Rated AR Glasses</h2>
              
              <div className="search-bar-enhanced">
                <SearchBar
                  searchTerm={searchTerm}
                  onSearchChange={setSearchTerm}
                  placeholder="Search by brand, model, or feature..."
                />
                
                {/* Popular Searches */}
                <div className="popular-searches">
                  <span className="popular-label">Popular:</span>
                  <button onClick={() => setSearchTerm('Xreal')}>Xreal</button>
                  <button onClick={() => setSearchTerm('gaming')}>Gaming</button>
                  <button onClick={() => setSearchTerm('lightweight')}>Lightweight</button>
                </div>
              </div>

              {/* Category Filter Cards */}
              <div className="category-filter-enhanced">
                <h3>Shop by Category</h3>
                <div className="category-cards">
                  <button
                    onClick={() => setSelectedCategory('')}
                    className={`category-card ${!selectedCategory ? 'active' : ''}`}
                  >
                    <Award className="category-icon" />
                    <span>All AR Glasses</span>
                    <span className="category-count">{initialProducts.length}</span>
                  </button>
                  
                  {categories.map(category => {
                    const categoryCount = initialProducts.filter(p => p.category === category).length;
                    return (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category === selectedCategory ? '' : category)}
                        className={`category-card ${selectedCategory === category ? 'active' : ''}`}
                      >
                        <Eye className="category-icon" />
                        <span>{category}</span>
                        <span className="category-count">{categoryCount}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>

          {/* Enhanced Products Section */}
          <section className="products-section-enhanced">
            <div className="products-container">
              {/* Results Header */}
              <div className="results-header">
                <h2 className="results-title">
                  {filteredProducts.length} AR Glasses Found
                  {(urlCategory || selectedCategory) && (
                    <span className="category-filter-indicator">
                      in {selectedCategory || urlCategory}
                    </span>
                  )}
                  {(urlSearch || searchTerm) && (
                    <span className="search-filter-indicator">
                      for "{searchTerm || urlSearch}"
                    </span>
                  )}
                </h2>
                
                {(selectedCategory || searchTerm) && (
                  <button 
                    onClick={() => {
                      setSelectedCategory('');
                      setSearchTerm('');
                    }}
                    className="clear-filters-btn"
                  >
                    Clear all filters
                  </button>
                )}
              </div>

              {/* Products Grid */}
              {filteredProducts.length > 0 ? (
                <div className="products-grid-enhanced">
                  {filteredProducts.map((product, index) => (
                    <div
                      key={product.id}
                      className="product-card-wrapper"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <ProductCard
                        product={product}
                        onCompare={handleToggleComparison}
                        onQuickView={handleQuickView}
                        isInComparison={isInComparison(product.id)}
                        context={urlSearch ? 'search' : urlCategory ? 'category' : 'main'}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-results">
                  <div className="no-results-content">
                    <Eye className="no-results-icon" />
                    <h3>No AR glasses found</h3>
                    <p>Try adjusting your search terms or category filters</p>
                    <button 
                      onClick={() => {
                        setSelectedCategory('');
                        setSearchTerm('');
                      }}
                      className="reset-search-btn"
                    >
                      View All AR Glasses
                    </button>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* FAQ Section */}
          <section className="faq-section">
            <div className="faq-container">
              <h2>Frequently Asked Questions</h2>
              <div className="faq-grid">
                <div className="faq-item">
                  <h3>What are the best AR glasses for 2024?</h3>
                  <p>The top AR glasses include the Xreal One Pro for premium experience, RayNeo X3 Pro for gaming, and Viture One for best value.</p>
                </div>
                <div className="faq-item">
                  <h3>How do I choose the right AR glasses?</h3>
                  <p>Consider your primary use case (gaming, productivity, entertainment), budget, device compatibility, and comfort preferences.</p>
                </div>
                <div className="faq-item">
                  <h3>Are these real Amazon prices?</h3>
                  <p>Yes! We update pricing hourly directly from Amazon's API and highlight any available discounts or deals.</p>
                </div>
                <div className="faq-item">
                  <h3>Do AR glasses work with iPhones?</h3>
                  <p>Most modern AR glasses are compatible with iPhones via USB-C or Lightning adapters. We clearly mark compatibility for each model.</p>
                </div>
              </div>
            </div>
          </section>
        </main>
        
        {/* Quick View Modal */}
        <QuickView
          product={quickViewProduct}
          isOpen={quickViewProduct !== null}
          onClose={closeQuickView}
        />
        
        <Footer />
      </div>
    </>
  );
}