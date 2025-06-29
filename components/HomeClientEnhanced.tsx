'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { useComparison } from '@/contexts/ComparisonContext';
import { SearchBar } from '@/components/SearchBar';
import { ProductCard } from '@/components/ProductCard';
import { NavigationSimple } from '@/components/NavigationSimple';
import { Footer } from '@/components/Footer';
import { MarketSummary } from '@/components/MarketSummary';
import { BuyingGuide } from '@/components/BuyingGuide';
import { PageNavigation, QuickNav } from '@/components/PageNavigation';
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
        <QuickNav />
        <ComparisonCart onQuickView={handleQuickView} />
        <PageNavigation />
        
        <main id="main-content">
          {/* Streamlined Hero Section */}
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
                Stop wasting time on confusing specs. Our expert analysis helps you find the ideal AR glasses 
                for your needs and budget from 15+ top-rated models.
              </p>

              {/* Simplified CTAs */}
              <div className="hero-actions">
                <a href="#buying-guide" className="cta-primary">
                  <span>Get My Recommendation</span>
                  <Zap className="cta-icon" />
                </a>
                <a href="#products-section" className="cta-secondary">
                  <span>Browse All Models</span>
                </a>
              </div>

              {/* Condensed Social Proof */}
              <div className="social-proof">
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

          {/* Market Summary Section */}
          <div id="market-insights"><MarketSummary className="py-16 bg-gray-50" /></div>

          {/* Buying Guide Section */}
          <BuyingGuide id="buying-guide" className="py-16 bg-white" />

          {/* Enhanced Search & Filter Section */}
          <section id="search-section" className="search-section-enhanced py-16 bg-gray-50">
            <div className="search-container">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-3">
                  Explore All {initialProducts.length} AR Glasses Models
                </h2>
                <p className="text-lg text-gray-600">
                  Use our smart filters to find exactly what you're looking for, or browse by category
                </p>
              </div>
              
              <div className="search-bar-enhanced">
                <SearchBar
                  searchTerm={searchTerm}
                  onSearchChange={setSearchTerm}
                  placeholder="Search by brand, model, or feature..."
                />
                
                {/* Popular Searches */}
                <div className="popular-searches">
                  <span className="popular-label">Popular searches:</span>
                  <button onClick={() => setSearchTerm('Xreal')} className="popular-tag">Xreal</button>
                  <button onClick={() => setSearchTerm('gaming')} className="popular-tag">Gaming</button>
                  <button onClick={() => setSearchTerm('lightweight')} className="popular-tag">Lightweight</button>
                  <button onClick={() => setSearchTerm('budget')} className="popular-tag">Budget</button>
                </div>
              </div>

              {/* Enhanced Category Filter Cards */}
              <div className="category-filter-enhanced">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Browse by Price Category</h3>
                <div className="category-cards">
                  <button
                    onClick={() => setSelectedCategory('')}
                    className={`category-card ${!selectedCategory ? 'active' : ''}`}
                  >
                    <Award className="category-icon" />
                    <div>
                      <span className="category-name">All Models</span>
                      <span className="category-description">Complete collection</span>
                    </div>
                    <span className="category-count">{initialProducts.length}</span>
                  </button>
                  
                  {categories.map(category => {
                    const categoryCount = initialProducts.filter(p => p.category === category).length;
                    const categoryDescription = {
                      'Budget': 'Under $350',
                      'Mid-Range': '$350-550',
                      'Premium': '$550-700',
                      'Enterprise': '$700+'
                    }[category] || 'Various prices';
                    
                    return (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category === selectedCategory ? '' : category)}
                        className={`category-card ${selectedCategory === category ? 'active' : ''}`}
                      >
                        <Eye className="category-icon" />
                        <div>
                          <span className="category-name">{category}</span>
                          <span className="category-description">{categoryDescription}</span>
                        </div>
                        <span className="category-count">{categoryCount}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>

          {/* Enhanced Products Section */}
          <section id="products-section" className="products-section-enhanced py-16 bg-white">
            <div className="products-container">
              {/* Results Header */}
              <div className="results-header">
                <div className="results-header-content">
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
                  
                  {!selectedCategory && !searchTerm && (
                    <p className="results-subtitle">
                      Compare specs, prices, and reviews across all models. Each product includes expert analysis and user ratings.
                    </p>
                  )}
                </div>
                
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
          <section id="faq-section" className="faq-section py-16 bg-gray-50">
            <div className="faq-container">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Frequently Asked Questions
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Get answers to the most common questions about AR glasses and our comparison process
                </p>
              </div>

              <div className="faq-grid">
                <div className="faq-item">
                  <h3>What are the best AR glasses for 2024?</h3>
                  <p>Based on our comprehensive analysis, the Xreal One Pro leads overall performance, while the Xreal One offers the best value. For innovation, the Rokid AR Spatial stands out with advanced AI features.</p>
                </div>
                <div className="faq-item">
                  <h3>How do I choose the right AR glasses?</h3>
                  <p>Start with our buying guide above! Consider your primary use case (gaming, productivity, entertainment), budget range, device compatibility, and comfort requirements. Our recommendation engine matches you with ideal models.</p>
                </div>
                <div className="faq-item">
                  <h3>Are these real Amazon prices?</h3>
                  <p>Yes! We update pricing every hour directly from Amazon's API and highlight any available discounts or deals. Prices may vary slightly due to real-time changes.</p>
                </div>
                <div className="faq-item">
                  <h3>Do AR glasses work with iPhones?</h3>
                  <p>Most modern AR glasses are compatible with iPhones via USB-C or Lightning adapters. We clearly mark compatibility for each model, including any required accessories.</p>
                </div>
                <div className="faq-item">
                  <h3>What's the difference between price categories?</h3>
                  <p>Budget models ($200-350) offer basic AR functionality. Mid-range ($400-550) provides quality displays and features. Premium ($550+) includes advanced tech and superior build quality.</p>
                </div>
                <div className="faq-item">
                  <h3>How accurate are your reviews?</h3>
                  <p>Our analysis combines expert testing, user reviews, and technical specifications. We maintain strict editorial independence and never accept payment for positive reviews.</p>
                </div>
              </div>

              {/* Additional CTA */}
              <div className="text-center mt-12">
                <p className="text-gray-600 mb-4">Still have questions?</p>
                <div className="flex justify-center gap-4">
                  <a href="#buying-guide" className="text-blue-600 hover:text-blue-800 underline">
                    Check our Buying Guide
                  </a>
                  <span className="text-gray-400">•</span>
                  <a href="#market-insights" className="text-blue-600 hover:text-blue-800 underline">
                    View Market Analysis
                  </a>
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