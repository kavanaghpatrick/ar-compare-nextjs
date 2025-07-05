import React from 'react';
import { Eye, Zap, Volume2, Weight, ExternalLink, Search, Crown, Star, DollarSign, Gamepad2, Briefcase, Glasses, Wrench, Target } from 'lucide-react';
import Link from 'next/link';
import { Product } from '@/types';
import { OptimizedImage } from '@/components/OptimizedImage';

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
        return <Crown {...iconProps} className="category-icon-style category-icon-premium" />;
      case 'Mid-range':
        return <Star {...iconProps} className="category-icon-style category-icon-midrange" />;
      case 'Budget':
        return <DollarSign {...iconProps} className="category-icon-style category-icon-budget" />;
      case 'Gaming':
        return <Gamepad2 {...iconProps} className="category-icon-style category-icon-gaming" />;
      case 'Professional':
        return <Briefcase {...iconProps} className="category-icon-style category-icon-professional" />;
      case 'Everyday':
        return <Glasses {...iconProps} className="category-icon-style category-icon-everyday" />;
      case 'Developer':
        return <Wrench {...iconProps} className="category-icon-style category-icon-developer" />;
      case 'Specialized':
        return <Target {...iconProps} className="category-icon-style category-icon-specialized" />;
      default:
        return <Glasses {...iconProps} className="category-icon-style category-icon-default" />;
    }
  };

  return (
    <article className="product-card" aria-labelledby={`product-title-${product.id}`}>
      {/* Product Image with explicit dimensions */}
      <div className="relative mb-4 rounded-lg overflow-hidden bg-gray-100">
        <OptimizedImage
          src={product.image}
          alt={product.fullName}
          width={400}
          height={300}
          aspectRatio
          className="object-cover w-full h-full"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>
      
      <h2 id={`product-title-${product.id}`} className="product-title">{product.fullName}</h2>
      
      <div className="product-category-indicator">
        <div className="product-icon">
          {getCategoryIcon(product.category)}
        </div>
        <span className="product-category-text">
          {product.category}
        </span>
      </div>
      <p className="product-description">{product.description}</p>
      
      <div className="product-price">
        ${product.price}
        {product.originalPrice && product.originalPrice !== product.price && (
          <span className="product-original-price">
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
    </article>
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