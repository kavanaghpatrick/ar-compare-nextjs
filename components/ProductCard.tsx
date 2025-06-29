import React from 'react';
import { Eye, Zap, Volume2, Weight, ExternalLink, Search, Crown, Star, DollarSign, Gamepad2, Briefcase, Glasses, Wrench, Target } from 'lucide-react';
import Link from 'next/link';
import { Product } from '@/types';

interface ProductCardProps {
  product: Product;
  onCompare?: (productId: string) => void;
  onShowDetails?: (product: Product) => void;
  onQuickView?: (product: Product) => void;
  isInComparison?: boolean;
  showBreadcrumbs?: boolean;
  context?: 'search' | 'category' | 'main' | 'related';
}

// Memoized ProductCard component for performance
export const ProductCard = React.memo(({ 
  product, 
  onCompare, 
  onShowDetails, 
  onQuickView,
  isInComparison = false,
  showBreadcrumbs = false,
  context = 'main'
}: ProductCardProps) => {
  const getCategoryIcon = (category: string) => {
    const iconProps = { size: 16, className: "category-icon-style" };
    
    switch (category) {
      case 'Premium':
        return <Crown {...iconProps} style={{ color: '#fbbf24' }} />;
      case 'Mid-range':
        return <Star {...iconProps} style={{ color: '#3b82f6' }} />;
      case 'Budget':
        return <DollarSign {...iconProps} style={{ color: '#10b981' }} />;
      case 'Gaming':
        return <Gamepad2 {...iconProps} style={{ color: '#8b5cf6' }} />;
      case 'Professional':
        return <Briefcase {...iconProps} style={{ color: '#6b7280' }} />;
      case 'Everyday':
        return <Glasses {...iconProps} style={{ color: '#06b6d4' }} />;
      case 'Developer':
        return <Wrench {...iconProps} style={{ color: '#f59e0b' }} />;
      case 'Specialized':
        return <Target {...iconProps} style={{ color: '#ef4444' }} />;
      default:
        return <Glasses {...iconProps} style={{ color: '#06b6d4' }} />;
    }
  };

  return (
    <div className="product-card" role="article" aria-labelledby={`product-title-${product.id}`}>
      <h2 id={`product-title-${product.id}`} className="product-title">{product.fullName}</h2>
      
      <div className="product-category-indicator">
        <div className="product-icon">
          {getCategoryIcon(product.category)}
        </div>
        <span style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.6)' }}>
          {product.category}
        </span>
      </div>
      <p className="product-description">{product.description}</p>
      
      <div className="product-price">
        ${product.price}
        {product.originalPrice && product.originalPrice !== product.price && (
          <span 
            style={{
              textDecoration: 'line-through',
              fontSize: '1rem',
              color: 'rgba(255, 255, 255, 0.5)',
              marginLeft: '0.5rem'
            }}
          >
            ${product.originalPrice}
          </span>
        )}
      </div>

      <div className="rating" aria-label={`Rating: ${product.rating} out of 5 stars`}>
        <div className="stars" role="img" aria-hidden="true">
          {[...Array(5)].map((_, i) => (
            <span
              key={i}
              className={`star ${i < Math.floor(product.rating) ? 'star-filled' : 'star-empty'}`}
            >
              ★
            </span>
          ))}
        </div>
        <span className="rating-text">
          {product.rating}
        </span>
        <span className="rating-reviews">
          ({product.specifications?.reviews || 'No reviews yet'})
        </span>
      </div>

      <div className="specs-grid">
        <div className="spec-item" aria-label={`Field of view: ${product.specifications.display.fov}`}>
          <Eye size={14} aria-hidden="true" />
          <span>{product.specifications.display.fov}</span>
        </div>
        <div className="spec-item" aria-label={`Brightness: ${product.specifications.display.brightness}`}>
          <Zap size={14} aria-hidden="true" />
          <span>{product.specifications.display.brightness}</span>
        </div>
        <div className="spec-item" aria-label={`Audio: ${product.specifications.audio.speakers}`}>
          <Volume2 size={14} aria-hidden="true" />
          <span>{product.specifications.audio.speakers}</span>
        </div>
        <div className="spec-item" aria-label={`Weight: ${product.specifications.design.weight}`}>
          <Weight size={14} aria-hidden="true" />
          <span>{product.specifications.design.weight}</span>
        </div>
      </div>

      {showBreadcrumbs && (
        <div className="product-breadcrumbs">
          <span className="breadcrumb-context">
            {context === 'search' && 'Search Results'}
            {context === 'category' && `Category: ${product.category}`}
            {context === 'related' && 'Related Products'}
            {context === 'main' && 'All Products'}
          </span>
        </div>
      )}

      <div className="product-actions">
        <button
          onClick={() => onCompare?.(product.id)}
          className={`action-btn action-btn-compare ${
            isInComparison ? 'selected' : ''
          }`}
          aria-label={isInComparison ? 'Remove from comparison' : 'Add to comparison'}
        >
          {isInComparison ? '✓ Added' : '+Compare'}
        </button>
        
        <div className="action-btn-group">
          {onQuickView && (
            <button
              onClick={() => onQuickView(product)}
              className="action-btn action-btn-quick-view"
              aria-label="Quick view product details"
            >
              <Search size={16} />
              Quick View
            </button>
          )}
          
          <Link
            href={`/products/${product.id}`}
            className="action-btn action-btn-details"
            aria-label={`View full details for ${product.fullName}`}
          >
            <ExternalLink size={16} />
            View Details
          </Link>
          
          {onShowDetails && (
            <button
              onClick={() => onShowDetails(product)}
              className="action-btn action-btn-legacy"
            >
              Show Details
            </button>
          )}
        </div>
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison function for better performance
  return (
    prevProps.product.id === nextProps.product.id &&
    prevProps.isInComparison === nextProps.isInComparison &&
    prevProps.showBreadcrumbs === nextProps.showBreadcrumbs &&
    prevProps.context === nextProps.context
  );
});

ProductCard.displayName = 'ProductCard';