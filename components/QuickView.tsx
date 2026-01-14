'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { X, Star, ExternalLink, ShoppingCart, Eye, Zap, Volume2, Weight } from 'lucide-react';
import { Product } from '@/types';
import { useComparison } from '@/contexts/ComparisonContext';
import { OptimizedImage } from '@/components/OptimizedImage';

interface QuickViewProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export function QuickView({ product, isOpen, onClose }: QuickViewProps) {
  const { addItem, removeItem, isInComparison } = useComparison();
  const [isVisible, setIsVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (isOpen) {
      setIsVisible(true);
      // Store original overflow value
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      // Handle Escape key to close modal
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };
      document.addEventListener('keydown', handleKeyDown);

      return () => {
        // Restore original overflow value
        document.body.style.overflow = originalOverflow;
        document.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  const handleToggleComparison = () => {
    if (!product) return;
    
    if (isInComparison(product.id)) {
      removeItem(product.id);
    } else {
      addItem(product.id);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < Math.floor(rating)
            ? 'text-yellow-400 fill-current'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  if (!isVisible || !product || !mounted) return null;

  const hasDiscount = product.price < product.originalPrice;
  const discountPercentage = hasDiscount 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const modalContent = (
    <div 
      className={`quick-view-overlay ${isOpen ? 'open' : ''}`}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="quick-view-title"
    >
      <div 
        className="quick-view-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="quick-view-header">
          <h2 id="quick-view-title" className="quick-view-title">
            Quick View: {product.fullName}
          </h2>
          <button 
            className="quick-view-close"
            onClick={onClose}
            aria-label="Close quick view"
          >
            <X size={24} />
          </button>
        </div>

        <div className="quick-view-content">
          <div className="quick-view-image-section">
            <OptimizedImage
              src={product.image}
              alt={product.fullName}
              width={400}
              height={400}
              className="quick-view-image object-contain"
              sizes="400px"
              priority
            />
            <div className="quick-view-badges">
              {product.availability === 'Pre-order' && (
                <span className="badge badge-warning">Pre-order</span>
              )}
              {product.category === 'Premium' && (
                <span className="badge badge-premium">Premium</span>
              )}
              {hasDiscount && (
                <span className="badge badge-discount">-{discountPercentage}%</span>
              )}
            </div>
          </div>

          <div className="quick-view-info">
            <div className="quick-view-brand">{product.brand}</div>
            
            <div className="quick-view-rating">
              <div className="stars">
                {renderStars(product.rating)}
              </div>
              <span className="rating-value">({product.rating}/5)</span>
            </div>

            <div className="quick-view-pricing">
              <div className="current-price">${product.price}</div>
              {hasDiscount && (
                <div className="original-price">${product.originalPrice}</div>
              )}
              <div className="availability">{product.availability}</div>
            </div>

            <p className="quick-view-description">{product.description}</p>

            <div className="quick-view-specs">
              <h4>Key Specifications</h4>
              <div className="specs-grid-compact">
                <div className="spec-item">
                  <Eye size={16} />
                  <span>FOV: {product.specifications?.display?.fov || 'N/A'}</span>
                </div>
                <div className="spec-item">
                  <Zap size={16} />
                  <span>Brightness: {product.specifications?.display?.brightness || 'N/A'}</span>
                </div>
                <div className="spec-item">
                  <Volume2 size={16} />
                  <span>Audio: {product.specifications?.audio?.speakers || 'N/A'}</span>
                </div>
                <div className="spec-item">
                  <Weight size={16} />
                  <span>Weight: {product.specifications?.design?.weight || 'N/A'}</span>
                </div>
              </div>
            </div>

            <div className="quick-view-features">
              <h4>Key Features</h4>
              <ul>
                {product.keyFeatures?.slice(0, 4).map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="quick-view-actions">
          <button
            onClick={handleToggleComparison}
            className={`action-btn action-btn-compare ${
              isInComparison(product.id) ? 'selected' : ''
            }`}
          >
            {isInComparison(product.id) ? '✓ In Comparison' : 'Add to Compare'}
          </button>
          
          <Link
            href={`/products/${product.id}`}
            className="action-btn action-btn-primary"
            onClick={onClose}
          >
            <ExternalLink size={16} />
            View Full Details
          </Link>
        </div>
      </div>
    </div>
  );

  // Use React Portal to render modal at document body level
  return createPortal(modalContent, document.body);
}