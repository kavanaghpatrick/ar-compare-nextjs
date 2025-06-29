import { Eye, Zap, Volume2, Weight } from 'lucide-react';
import { Product } from '@/types';

interface ProductCardProps {
  product: Product;
  onCompare?: (productId: string) => void;
  onShowDetails?: (product: Product) => void;
  isInComparison?: boolean;
}

export function ProductCard({ 
  product, 
  onCompare, 
  onShowDetails, 
  isInComparison = false 
}: ProductCardProps) {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Premium':
      case 'Mid-range':
        return '⚡';
      case 'Budget':
        return '💰';
      case 'Gaming':
        return '🎮';
      case 'Professional':
        return '💼';
      case 'Everyday':
        return '👓';
      case 'Developer':
        return '🔧';
      case 'Specialized':
        return '🎯';
      default:
        return '👓';
    }
  };

  return (
    <div className="product-card">
      <div className="product-header">
        <div className="product-icon">
          {getCategoryIcon(product.category)}
        </div>
        <span style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.6)' }}>
          {product.category}
        </span>
      </div>
      
      <h3 className="product-title">{product.fullName}</h3>
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

      <div className="rating">
        <div className="stars">
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
        <div className="spec-item">
          <Eye size={14} />
          <span>{product.specifications.display.fov}</span>
        </div>
        <div className="spec-item">
          <Zap size={14} />
          <span>{product.specifications.display.brightness}</span>
        </div>
        <div className="spec-item">
          <Volume2 size={14} />
          <span>{product.specifications.audio.speakers}</span>
        </div>
        <div className="spec-item">
          <Weight size={14} />
          <span>{product.specifications.design.weight}</span>
        </div>
      </div>

      <div className="product-actions">
        <button
          onClick={() => onCompare?.(product.id)}
          className={`action-btn action-btn-compare ${
            isInComparison ? 'selected' : ''
          }`}
        >
          {isInComparison ? '✓ Added' : '+Compare'}
        </button>
        {onShowDetails && (
          <button
            onClick={() => onShowDetails(product)}
            className="action-btn action-btn-details"
          >
            View Details
          </button>
        )}
      </div>
    </div>
  );
}