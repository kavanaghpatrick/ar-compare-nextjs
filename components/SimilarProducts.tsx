'use client';

import React, { useState, useMemo } from 'react';
import {
  Star,
  Eye,
  Weight,
  Zap,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  Users,
  Shuffle,
  Heart,
  Plus,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { EnhancedProduct } from '@/types';
import { useComparison } from '@/contexts/ComparisonContext';
import { OptimizedImage } from '@/components/OptimizedImage';

interface SimilarProductsProps {
  currentProduct: EnhancedProduct;
  allProducts: EnhancedProduct[];
  className?: string;
}

interface ProductRecommendation {
  product: EnhancedProduct;
  similarity: number;
  reason: string;
  type: 'similar' | 'alternative' | 'upgrade' | 'downgrade' | 'cross-brand';
  highlights: string[];
}

interface RecommendationSection {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  products: ProductRecommendation[];
}

export function SimilarProducts({ 
  currentProduct, 
  allProducts, 
  className = "" 
}: SimilarProductsProps) {
  const [activeCarousel, setActiveCarousel] = useState<string>('similar');
  const [carouselIndices, setCarouselIndices] = useState<Record<string, number>>({});
  const { addItem, isInComparison } = useComparison();

  // Calculate product similarities and recommendations
  const recommendations = useMemo((): RecommendationSection[] => {
    const otherProducts = allProducts.filter(p => p.id !== currentProduct.id);
    
    // Similar Products (same category, similar price)
    const similarProducts: ProductRecommendation[] = otherProducts
      .filter(p => p.category === currentProduct.category)
      .map(product => {
        let similarity = 60; // Base similarity for same category
        const reasons: string[] = [];
        const highlights: string[] = [];
        
        // Price similarity
        const priceDiff = Math.abs(product.price - currentProduct.price);
        const priceRatio = priceDiff / currentProduct.price;
        if (priceRatio <= 0.2) {
          similarity += 20;
          reasons.push('Similar pricing');
        } else if (priceRatio <= 0.4) {
          similarity += 10;
        }
        
        // Rating similarity
        const ratingDiff = Math.abs(product.rating - currentProduct.rating);
        if (ratingDiff <= 0.3) {
          similarity += 15;
          reasons.push('Similar user ratings');
        }
        
        // Spec similarities
        const currentFov = parseInt(currentProduct.specifications.display.fov) || 0;
        const productFov = parseInt(product.specifications.display.fov) || 0;
        if (Math.abs(currentFov - productFov) <= 10) {
          similarity += 10;
          highlights.push(`Similar ${productFov}° FOV`);
        }
        
        const currentWeight = parseInt(currentProduct.specifications.design.weight) || 0;
        const productWeight = parseInt(product.specifications.design.weight) || 0;
        if (Math.abs(currentWeight - productWeight) <= 10) {
          similarity += 5;
          highlights.push(`Similar ${productWeight}g weight`);
        }
        
        // Brand relationship
        if (product.brand === currentProduct.brand) {
          similarity += 15;
          reasons.push('Same brand family');
        }
        
        return {
          product,
          similarity,
          reason: reasons.join(', ') || 'Same category',
          type: 'similar' as const,
          highlights
        };
      })
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 6);

    // Alternative Products (different approach, similar use case)
    const alternativeProducts: ProductRecommendation[] = otherProducts
      .filter(p => p.category !== currentProduct.category)
      .map(product => {
        let similarity = 20; // Base for different category
        const reasons: string[] = [];
        const highlights: string[] = [];
        
        // Price proximity
        const priceDiff = Math.abs(product.price - currentProduct.price);
        if (priceDiff <= 100) {
          similarity += 25;
          reasons.push('Similar price point');
        } else if (priceDiff <= 200) {
          similarity += 15;
        }
        
        // Use case overlap
        if (currentProduct.marketContext?.useCases && product.marketContext?.useCases) {
          const overlap = currentProduct.marketContext.useCases.filter(uc => 
            product.marketContext!.useCases!.includes(uc)
          );
          if (overlap.length > 0) {
            similarity += overlap.length * 15;
            reasons.push(`${overlap.length} shared use cases`);
          }
        }
        
        // Target audience overlap
        if (currentProduct.marketContext?.targetAudience.includes('professional') && 
            product.marketContext?.targetAudience.includes('professional')) {
          similarity += 20;
          reasons.push('Professional target audience');
        }
        
        // Competitive features
        highlights.push(`${product.category} approach`);
        if (product.rating > currentProduct.rating) {
          highlights.push(`Higher rated (${product.rating})`);
        }
        
        return {
          product,
          similarity,
          reason: reasons.join(', ') || 'Different approach',
          type: 'alternative' as const,
          highlights
        };
      })
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 6);

    // Upgrade Options (more expensive, better specs)
    const upgradeProducts: ProductRecommendation[] = otherProducts
      .filter(p => p.price > currentProduct.price && p.price <= currentProduct.price * 1.5)
      .map(product => {
        let similarity = 30;
        const reasons: string[] = [];
        const highlights: string[] = [];
        
        // Better specs
        const currentFov = parseInt(currentProduct.specifications.display.fov) || 0;
        const productFov = parseInt(product.specifications.display.fov) || 0;
        if (productFov > currentFov) {
          similarity += 20;
          highlights.push(`Larger ${productFov}° FOV`);
        }
        
        const currentBrightness = parseInt(currentProduct.specifications.display.brightness) || 0;
        const productBrightness = parseInt(product.specifications.display.brightness) || 0;
        if (productBrightness > currentBrightness) {
          similarity += 15;
          highlights.push(`Brighter ${productBrightness} nits`);
        }
        
        if (product.rating > currentProduct.rating) {
          similarity += 15;
          highlights.push(`Higher rating (${product.rating})`);
        }
        
        // Premium features
        if (product.category === 'Premium' && currentProduct.category !== 'Premium') {
          similarity += 25;
          reasons.push('Premium upgrade');
        }
        
        const pricePremium = product.price - currentProduct.price;
        reasons.push(`+$${pricePremium} upgrade`);
        
        return {
          product,
          similarity,
          reason: reasons.join(', '),
          type: 'upgrade' as const,
          highlights
        };
      })
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 4);

    // Downgrade Options (cheaper, good value)
    const downgradeProducts: ProductRecommendation[] = otherProducts
      .filter(p => p.price < currentProduct.price && p.price >= currentProduct.price * 0.5)
      .map(product => {
        let similarity = 30;
        const reasons: string[] = [];
        const highlights: string[] = [];
        
        // Value proposition
        const savings = currentProduct.price - product.price;
        const valueScore = (product.rating / product.price) * 1000;
        const currentValueScore = (currentProduct.rating / currentProduct.price) * 1000;
        
        if (valueScore > currentValueScore) {
          similarity += 25;
          reasons.push('Better value');
        }
        
        if (product.rating >= currentProduct.rating - 0.3) {
          similarity += 20;
          highlights.push(`Similar quality (${product.rating})`);
        }
        
        // Still good specs despite lower price
        const currentFov = parseInt(currentProduct.specifications.display.fov) || 0;
        const productFov = parseInt(product.specifications.display.fov) || 0;
        if (productFov >= currentFov * 0.8) {
          similarity += 15;
          highlights.push(`Good ${productFov}° FOV`);
        }
        
        reasons.push(`Save $${savings}`);
        
        return {
          product,
          similarity,
          reason: reasons.join(', '),
          type: 'downgrade' as const,
          highlights
        };
      })
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 4);

    // Cross-brand Comparisons
    const crossBrandProducts: ProductRecommendation[] = otherProducts
      .filter(p => p.brand !== currentProduct.brand)
      .map(product => {
        let similarity = 25;
        const reasons: string[] = [];
        const highlights: string[] = [];
        
        // Direct competitors
        if (product.category === currentProduct.category) {
          similarity += 30;
          reasons.push('Direct competitor');
        }
        
        // Price competition
        const priceDiff = Math.abs(product.price - currentProduct.price);
        if (priceDiff <= 50) {
          similarity += 20;
          reasons.push('Price competitive');
        }
        
        // Brand comparison
        const currentMarketShare = parseFloat(currentProduct.companyInfo?.marketShare || '0');
        const productMarketShare = parseFloat(product.companyInfo?.marketShare || '0');
        
        if (productMarketShare > currentMarketShare) {
          similarity += 15;
          highlights.push('Market leader');
        }
        
        // Unique selling points
        highlights.push(`${product.brand} alternative`);
        if (product.marketContext?.competitiveAdvantage) {
          highlights.push(product.marketContext.competitiveAdvantage.split(',')[0]);
        }
        
        return {
          product,
          similarity,
          reason: reasons.join(', ') || 'Cross-brand option',
          type: 'cross-brand' as const,
          highlights
        };
      })
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 6);

    return [
      {
        title: 'Similar Products',
        subtitle: 'Products in the same category with similar features',
        icon: <Shuffle size={20} />,
        products: similarProducts
      },
      {
        title: 'Alternative Approaches',
        subtitle: 'Different solutions for similar use cases',
        icon: <ArrowUpRight size={20} />,
        products: alternativeProducts
      },
      {
        title: 'Upgrade Options',
        subtitle: 'Premium alternatives with enhanced features',
        icon: <TrendingUp size={20} />,
        products: upgradeProducts
      },
      {
        title: 'Budget Alternatives',
        subtitle: 'Cost-effective options with good value',
        icon: <TrendingDown size={20} />,
        products: downgradeProducts
      },
      {
        title: 'Cross-Brand Competitors',
        subtitle: 'Compare across different manufacturers',
        icon: <Users size={20} />,
        products: crossBrandProducts
      }
    ].filter(section => section.products.length > 0);
  }, [currentProduct, allProducts]);

  // Carousel navigation
  const navigateCarousel = (sectionTitle: string, direction: 'prev' | 'next') => {
    const section = recommendations.find(r => r.title === sectionTitle);
    if (!section) return;
    
    const currentIndex = carouselIndices[sectionTitle] || 0;
    const maxIndex = Math.max(0, section.products.length - 3); // Show 3 items at a time
    
    let newIndex;
    if (direction === 'prev') {
      newIndex = Math.max(0, currentIndex - 1);
    } else {
      newIndex = Math.min(maxIndex, currentIndex + 1);
    }
    
    setCarouselIndices(prev => ({
      ...prev,
      [sectionTitle]: newIndex
    }));
  };

  // Get visible products for a carousel
  const getVisibleProducts = (section: RecommendationSection) => {
    const startIndex = carouselIndices[section.title] || 0;
    return section.products.slice(startIndex, startIndex + 3);
  };

  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case 'upgrade': return <TrendingUp size={14} className="text-green-400" />;
      case 'downgrade': return <TrendingDown size={14} className="text-blue-400" />;
      case 'alternative': return <ArrowUpRight size={14} className="text-purple-400" />;
      case 'cross-brand': return <Users size={14} className="text-orange-400" />;
      default: return <Shuffle size={14} className="text-gray-400" />;
    }
  };

  if (recommendations.length === 0) {
    return (
      <div className={`similar-products ${className}`}>
        <div className="similar-products-header">
          <h3 className="similar-products-title">Similar Products</h3>
          <p className="similar-products-subtitle">No similar products found</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`similar-products ${className}`}>
      <div className="similar-products-header">
        <h3 className="similar-products-title">
          <Heart size={24} />
          You Might Also Like
        </h3>
        <p className="similar-products-subtitle">
          Discover alternatives and related products
        </p>
      </div>

      {/* Recommendation Sections */}
      {recommendations.map((section) => (
        <div key={section.title} className="recommendation-section">
          <div className="section-header">
            <div className="section-title">
              {section.icon}
              <h4>{section.title}</h4>
            </div>
            <p className="section-subtitle">{section.subtitle}</p>
            
            {/* Carousel Controls */}
            {section.products.length > 3 && (
              <div className="carousel-controls">
                <button
                  onClick={() => navigateCarousel(section.title, 'prev')}
                  className="carousel-btn"
                  disabled={(carouselIndices[section.title] || 0) === 0}
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={() => navigateCarousel(section.title, 'next')}
                  className="carousel-btn"
                  disabled={(carouselIndices[section.title] || 0) >= section.products.length - 3}
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>

          <div className="products-carousel">
            <div className="products-grid">
              {getVisibleProducts(section).map((recommendation) => (
                <div key={recommendation.product.id} className="recommendation-card">
                  <div className="card-header">
                    <div className="product-image">
                      <OptimizedImage
                        src={recommendation.product.image}
                        alt={recommendation.product.name}
                        width={120}
                        height={120}
                        className="object-contain w-full h-full"
                        sizes="120px"
                      />
                    </div>
                    <div className="recommendation-type">
                      {getRecommendationIcon(recommendation.type)}
                    </div>
                  </div>

                  <div className="card-content">
                    <h5 className="product-name">{recommendation.product.name}</h5>
                    <div className="product-brand">{recommendation.product.brand}</div>
                    
                    <div className="product-stats">
                      <div className="price">${recommendation.product.price}</div>
                      <div className="rating">
                        <Star size={12} className="text-yellow-400 fill-current" />
                        <span>{recommendation.product.rating}</span>
                      </div>
                    </div>

                    <div className="key-specs">
                      <div className="spec">
                        <Eye size={12} />
                        <span>{recommendation.product.specifications.display.fov}</span>
                      </div>
                      <div className="spec">
                        <Weight size={12} />
                        <span>{recommendation.product.specifications.design.weight}</span>
                      </div>
                      <div className="spec">
                        <Zap size={12} />
                        <span>{recommendation.product.specifications.display.brightness}</span>
                      </div>
                    </div>

                    <div className="recommendation-reason">
                      <span className="reason-text">{recommendation.reason}</span>
                    </div>

                    {recommendation.highlights.length > 0 && (
                      <div className="highlights">
                        {recommendation.highlights.slice(0, 2).map((highlight, index) => (
                          <span key={index} className="highlight-tag">
                            {highlight}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="card-actions">
                    <button
                      onClick={() => addItem(recommendation.product.id)}
                      className={`compare-btn ${isInComparison(recommendation.product.id) ? 'added' : ''}`}
                      disabled={isInComparison(recommendation.product.id)}
                    >
                      <Plus size={14} />
                      {isInComparison(recommendation.product.id) ? 'Added' : 'Compare'}
                    </button>
                    
                    <a 
                      href={`/products/${recommendation.product.id}`}
                      className="view-btn"
                    >
                      View Details
                    </a>
                  </div>

                  {/* Similarity Indicator */}
                  <div className="similarity-indicator">
                    <div className="similarity-bar">
                      <div 
                        className="similarity-fill" 
                        style={{ width: `${recommendation.similarity}%` }}
                      ></div>
                    </div>
                    <span className="similarity-text">{recommendation.similarity}% match</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}

      {/* "Customers Also Viewed" Section */}
      <div className="also-viewed-section">
        <h4>
          <Users size={20} />
          Customers Also Viewed
        </h4>
        <div className="also-viewed-grid">
          {recommendations[0]?.products.slice(0, 4).map((recommendation) => (
            <div key={recommendation.product.id} className="also-viewed-item">
              <div className="item-image">
                <OptimizedImage
                  src={recommendation.product.image}
                  alt={recommendation.product.name}
                  width={80}
                  height={80}
                  className="object-contain w-full h-full"
                  sizes="80px"
                />
              </div>
              <div className="item-info">
                <h6>{recommendation.product.name}</h6>
                <div className="item-price">${recommendation.product.price}</div>
                <div className="item-rating">
                  <Star size={10} className="text-yellow-400 fill-current" />
                  <span>{recommendation.product.rating}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}