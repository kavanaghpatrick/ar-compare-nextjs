'use client';

import { useState, useCallback } from 'react';
import { useComparison } from '@/contexts/ComparisonContext';
import { NavigationSimple } from '@/components/NavigationSimple';
import { Footer } from '@/components/Footer';
import { MarketSummary } from '@/components/MarketSummary';
import { PageNavigation } from '@/components/PageNavigation';
import { Product } from '@/types';
import { Star, CheckCircle, Shield, Zap } from 'lucide-react';
import ComparisonCart from '@/components/ComparisonCart';
import { QuickView } from '@/components/QuickView';

interface HomeClientProps {
  initialProducts: Product[];
  searchParams: { search?: string; category?: string };
}

export function HomeClientEnhanced({ initialProducts, searchParams: serverSearchParams }: HomeClientProps) {
  const { addItem, removeItem, isInComparison } = useComparison();
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

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
    "url": "https://arcompare.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://arcompare.com/?search={search_term_string}",
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
                <a href="/market-analysis" className="cta-primary">
                  <span>View Market Analysis</span>
                  <Zap className="cta-icon" />
                </a>
                <a href="#faq-section" className="cta-secondary">
                  <span>Learn More</span>
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
                  <p>Consider your primary use case (gaming, productivity, entertainment), budget range, device compatibility, and comfort requirements. Check our market analysis for detailed comparisons.</p>
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
                  <a href="/market-analysis" className="text-blue-600 hover:text-blue-800 underline">
                    View Market Analysis
                  </a>
                  <span className="text-gray-400">•</span>
                  <a href="/blog" className="text-blue-600 hover:text-blue-800 underline">
                    Read Our Blog
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