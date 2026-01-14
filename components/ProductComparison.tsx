'use client';

import React, { useState, useMemo } from 'react';
import {
  Eye,
  Zap,
  Weight,
  Star,
  ArrowUpDown,
  CheckCircle,
  XCircle,
  Minus,
  Plus,
  TrendingUp,
  DollarSign
} from 'lucide-react';
import { EnhancedProduct } from '@/types';
import { useComparison } from '@/contexts/ComparisonContext';
import { OptimizedImage } from '@/components/OptimizedImage';

interface ProductComparisonProps {
  currentProduct: EnhancedProduct;
  allProducts: EnhancedProduct[];
  className?: string;
}

type ComparisonView = 'quick' | 'detailed' | 'features' | 'prices';

interface SpecComparison {
  name: string;
  icon: React.ReactNode;
  getValue: (product: EnhancedProduct) => string | number;
  format: (value: string | number) => string;
  isHigherBetter: boolean;
  category: string;
}

const specComparisons: SpecComparison[] = [
  {
    name: 'Field of View',
    icon: <Eye size={16} />,
    getValue: (p) => parseInt(p.specifications.display.fov) || 0,
    format: (v) => `${v}°`,
    isHigherBetter: true,
    category: 'Display'
  },
  {
    name: 'Brightness',
    icon: <Zap size={16} />,
    getValue: (p) => parseInt(p.specifications.display.brightness) || 0,
    format: (v) => `${v} nits`,
    isHigherBetter: true,
    category: 'Display'
  },
  {
    name: 'Weight',
    icon: <Weight size={16} />,
    getValue: (p) => parseInt(p.specifications.design.weight) || 0,
    format: (v) => `${v}g`,
    isHigherBetter: false,
    category: 'Design'
  },
  {
    name: 'Price',
    icon: <DollarSign size={16} />,
    getValue: (p) => p.price,
    format: (v) => `$${v}`,
    isHigherBetter: false,
    category: 'Value'
  },
  {
    name: 'Rating',
    icon: <Star size={16} />,
    getValue: (p) => p.rating,
    format: (v) => `${v}/5`,
    isHigherBetter: true,
    category: 'Overall'
  }
];

export function ProductComparison({ 
  currentProduct, 
  allProducts, 
  className = "" 
}: ProductComparisonProps) {
  const [view, setView] = useState<ComparisonView>('quick');
  const [expandedFeatures, setExpandedFeatures] = useState<Set<string>>(new Set());
  const { addItem, isInComparison } = useComparison();

  // Find similar products for comparison
  const similarProducts = useMemo(() => {
    const sameCategoryProducts = allProducts.filter(p => 
      p.id !== currentProduct.id && 
      p.category === currentProduct.category
    );
    
    const priceRange = currentProduct.price * 0.3;
    const similarPriceProducts = allProducts.filter(p => 
      p.id !== currentProduct.id && 
      Math.abs(p.price - currentProduct.price) <= priceRange
    );

    // Combine and deduplicate
    const combined = [...sameCategoryProducts, ...similarPriceProducts];
    const unique = combined.filter((product, index, self) => 
      index === self.findIndex(p => p.id === product.id)
    );

    // Sort by relevance (same category first, then by price proximity)
    return unique
      .sort((a, b) => {
        if (a.category === currentProduct.category && b.category !== currentProduct.category) return -1;
        if (b.category === currentProduct.category && a.category !== currentProduct.category) return 1;
        return Math.abs(a.price - currentProduct.price) - Math.abs(b.price - currentProduct.price);
      })
      .slice(0, 3);
  }, [currentProduct, allProducts]);

  const compareProducts = [currentProduct, ...similarProducts];

  const getComparisonResult = (spec: SpecComparison, currentValue: number, compareValue: number) => {
    if (currentValue === compareValue) return 'equal';
    if (spec.isHigherBetter) {
      return currentValue > compareValue ? 'better' : 'worse';
    } else {
      return currentValue < compareValue ? 'better' : 'worse';
    }
  };

  const getComparisonIcon = (result: string) => {
    switch (result) {
      case 'better': return <CheckCircle size={14} className="text-green-400" />;
      case 'worse': return <XCircle size={14} className="text-red-400" />;
      case 'equal': return <Minus size={14} className="text-yellow-400" />;
      default: return null;
    }
  };

  const toggleFeatureExpansion = (featureId: string) => {
    const newExpanded = new Set(expandedFeatures);
    if (newExpanded.has(featureId)) {
      newExpanded.delete(featureId);
    } else {
      newExpanded.add(featureId);
    }
    setExpandedFeatures(newExpanded);
  };

  if (similarProducts.length === 0) {
    return (
      <div className={`comparison-container ${className}`}>
        <div className="comparison-header">
          <h3 className="comparison-title">Product Comparison</h3>
          <p className="comparison-subtitle">No similar products found for comparison</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`comparison-container ${className}`}>
      <div className="comparison-header">
        <h3 className="comparison-title">
          <ArrowUpDown size={24} />
          Product Comparison
        </h3>
        <p className="comparison-subtitle">
          Compare {currentProduct.name} with similar products
        </p>

        {/* View Toggle */}
        <div className="comparison-view-toggle">
          <button
            onClick={() => setView('quick')}
            className={`view-btn ${view === 'quick' ? 'active' : ''}`}
          >
            Quick
          </button>
          <button
            onClick={() => setView('detailed')}
            className={`view-btn ${view === 'detailed' ? 'active' : ''}`}
          >
            Detailed
          </button>
          <button
            onClick={() => setView('features')}
            className={`view-btn ${view === 'features' ? 'active' : ''}`}
          >
            Features
          </button>
          <button
            onClick={() => setView('prices')}
            className={`view-btn ${view === 'prices' ? 'active' : ''}`}
          >
            Pricing
          </button>
        </div>
      </div>

      {/* Quick Comparison View */}
      {view === 'quick' && (
        <div className="quick-comparison">
          <div className="comparison-grid">
            {compareProducts.map((product, index) => (
              <div 
                key={product.id} 
                className={`comparison-card ${index === 0 ? 'current-product' : ''}`}
              >
                <div className="product-header">
                  <div className="product-image">
                    <OptimizedImage
                      src={product.image}
                      alt={product.name}
                      width={100}
                      height={100}
                      className="object-contain w-full h-full"
                      sizes="100px"
                    />
                  </div>
                  <div className="product-info">
                    <h4 className="product-name">{product.name}</h4>
                    <div className="product-price">${product.price}</div>
                    <div className="product-rating">
                      <Star size={14} className="text-yellow-400 fill-current" />
                      <span>{product.rating}</span>
                    </div>
                  </div>
                  {index === 0 && (
                    <div className="current-badge">Current</div>
                  )}
                </div>

                <div className="quick-specs">
                  {specComparisons.slice(0, 4).map((spec) => {
                    const value = spec.getValue(product);
                    const currentValue = spec.getValue(currentProduct);
                    const result = index === 0 ? 'current' : getComparisonResult(spec, currentValue as number, value as number);
                    
                    return (
                      <div key={spec.name} className="spec-row">
                        <div className="spec-info">
                          {spec.icon}
                          <span className="spec-name">{spec.name}</span>
                        </div>
                        <div className="spec-value">
                          <span>{spec.format(value)}</span>
                          {index !== 0 && getComparisonIcon(result)}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {index !== 0 && (
                  <div className="comparison-actions">
                    <button
                      onClick={() => addItem(product.id)}
                      className={`compare-btn ${isInComparison(product.id) ? 'added' : ''}`}
                      disabled={isInComparison(product.id)}
                    >
                      {isInComparison(product.id) ? 'Added to Compare' : 'Add to Compare'}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Detailed Comparison View */}
      {view === 'detailed' && (
        <div className="detailed-comparison">
          <div className="comparison-table-container">
            <table className="comparison-table">
              <thead>
                <tr>
                  <th className="spec-header">Specification</th>
                  {compareProducts.map((product, index) => (
                    <th key={product.id} className={index === 0 ? 'current-product-header' : ''}>
                      <div className="product-header-cell">
                        <div className="product-name">{product.brand} {product.model}</div>
                        <div className="product-price">${product.price}</div>
                        {index === 0 && <div className="current-indicator">Current</div>}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {specComparisons.map((spec) => (
                  <tr key={spec.name}>
                    <td className="spec-name">
                      {spec.icon}
                      {spec.name}
                    </td>
                    {compareProducts.map((product, index) => {
                      const value = spec.getValue(product);
                      const currentValue = spec.getValue(currentProduct);
                      const result = index === 0 ? 'current' : getComparisonResult(spec, currentValue as number, value as number);
                      
                      return (
                        <td key={product.id} className={`spec-value ${result}`}>
                          <div className="value-container">
                            <span>{spec.format(value)}</span>
                            {index !== 0 && getComparisonIcon(result)}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Features Comparison View */}
      {view === 'features' && (
        <div className="features-comparison">
          <div className="features-grid">
            {compareProducts.map((product, index) => (
              <div key={product.id} className={`feature-card ${index === 0 ? 'current-product' : ''}`}>
                <div className="feature-header">
                  <h4>{product.name}</h4>
                  {index === 0 && <span className="current-badge">Current</span>}
                </div>
                
                <div className="pros-cons-section">
                  <div className="pros-section">
                    <h5>
                      <CheckCircle size={16} className="text-green-400" />
                      Pros
                    </h5>
                    <ul>
                      {product.pros.slice(0, expandedFeatures.has(`${product.id}-pros`) ? undefined : 3).map((pro, idx) => (
                        <li key={idx}>{pro}</li>
                      ))}
                    </ul>
                    {product.pros.length > 3 && (
                      <button
                        onClick={() => toggleFeatureExpansion(`${product.id}-pros`)}
                        className="expand-btn"
                      >
                        {expandedFeatures.has(`${product.id}-pros`) ? (
                          <>Show Less <Minus size={14} /></>
                        ) : (
                          <>Show More <Plus size={14} /></>
                        )}
                      </button>
                    )}
                  </div>

                  <div className="cons-section">
                    <h5>
                      <XCircle size={16} className="text-red-400" />
                      Cons
                    </h5>
                    <ul>
                      {product.cons.slice(0, expandedFeatures.has(`${product.id}-cons`) ? undefined : 3).map((con, idx) => (
                        <li key={idx}>{con}</li>
                      ))}
                    </ul>
                    {product.cons.length > 3 && (
                      <button
                        onClick={() => toggleFeatureExpansion(`${product.id}-cons`)}
                        className="expand-btn"
                      >
                        {expandedFeatures.has(`${product.id}-cons`) ? (
                          <>Show Less <Minus size={14} /></>
                        ) : (
                          <>Show More <Plus size={14} /></>
                        )}
                      </button>
                    )}
                  </div>
                </div>

                <div className="key-features">
                  <h5>Key Features</h5>
                  <ul>
                    {product.keyFeatures.slice(0, 4).map((feature, idx) => (
                      <li key={idx}>
                        <Zap size={12} />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {index !== 0 && (
                  <div className="feature-actions">
                    <button
                      onClick={() => addItem(product.id)}
                      className={`compare-btn ${isInComparison(product.id) ? 'added' : ''}`}
                      disabled={isInComparison(product.id)}
                    >
                      {isInComparison(product.id) ? 'Added' : 'Add to Compare'}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Price Comparison View */}
      {view === 'prices' && (
        <div className="price-comparison">
          <div className="price-analysis">
            <h4>Price Analysis</h4>
            <div className="price-cards">
              {compareProducts.map((product, index) => {
                const hasDiscount = product.price < product.originalPrice;
                const discountPercent = hasDiscount 
                  ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                  : 0;

                return (
                  <div key={product.id} className={`price-card ${index === 0 ? 'current-product' : ''}`}>
                    <div className="price-header">
                      <h5>{product.name}</h5>
                      {index === 0 && <span className="current-badge">Current</span>}
                    </div>
                    
                    <div className="price-info">
                      <div className="current-price">${product.price}</div>
                      {hasDiscount && (
                        <div className="original-price">${product.originalPrice}</div>
                      )}
                      {hasDiscount && (
                        <div className="discount-badge">-{discountPercent}%</div>
                      )}
                    </div>

                    {product.amazon && (
                      <div className="amazon-pricing">
                        <div className="amazon-label">Amazon</div>
                        <div className="amazon-price">{product.amazon.price}</div>
                        <div className="amazon-availability">{product.amazon.availability}</div>
                        {product.amazon.shipping && (
                          <div className="shipping-info">{product.amazon.shipping}</div>
                        )}
                      </div>
                    )}

                    <div className="value-assessment">
                      <div className="value-rating">
                        <TrendingUp size={14} />
                        <span>Value Score: {Math.round((product.rating / product.price) * 1000)}</span>
                      </div>
                    </div>

                    {product.marketContext && (
                      <div className="price-positioning">{product.marketContext.pricePositioning}</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Better Alternatives Section */}
      <div className="alternatives-section">
        <h4>Better Alternatives to Consider</h4>
        <div className="alternatives-grid">
          {similarProducts.slice(0, 2).map((product) => {
            const betterSpecs = specComparisons.filter(spec => {
              const currentValue = spec.getValue(currentProduct) as number;
              const altValue = spec.getValue(product) as number;
              return getComparisonResult(spec, altValue, currentValue) === 'better';
            });

            if (betterSpecs.length > 0) {
              return (
                <div key={product.id} className="alternative-card">
                  <h5>{product.name}</h5>
                  <div className="better-at">
                    <span>Better at:</span>
                    <ul>
                      {betterSpecs.slice(0, 3).map((spec) => (
                        <li key={spec.name}>
                          {spec.icon}
                          {spec.name}: {spec.format(spec.getValue(product))}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="price-difference">
                    {product.price > currentProduct.price ? (
                      <span className="more-expensive">+${product.price - currentProduct.price} more</span>
                    ) : (
                      <span className="less-expensive">${currentProduct.price - product.price} less</span>
                    )}
                  </div>
                </div>
              );
            }
            return null;
          }).filter(Boolean)}
        </div>
      </div>
    </div>
  );
}