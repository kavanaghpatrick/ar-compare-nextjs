'use client';

import React from 'react';
import { Eye, Zap, Volume2, Weight, ExternalLink, Search } from 'lucide-react';
import Link from 'next/link';
import { Product } from '@/types';

interface ProductCardProps {
  product: Product;
  onCompare?: (productId: string) => void;
  onQuickView?: (product: Product) => void;
  isInComparison?: boolean;
}

export const ProductCardClean = React.memo(({ 
  product, 
  onCompare, 
  onQuickView,
  isInComparison = false
}: ProductCardProps) => {
  // Inline styles to ensure they work correctly
  const styles = {
    card: {
      backgroundColor: '#ffffff',
      border: '1px solid #e5e7eb',
      borderRadius: '12px',
      padding: '1.5rem',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      transition: 'all 0.2s ease',
      height: '100%',
      display: 'flex',
      flexDirection: 'column' as const,
    },
    title: {
      fontSize: '1.25rem',
      fontWeight: '700',
      color: '#111827',
      marginBottom: '0.5rem',
      lineHeight: '1.4',
    },
    category: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.25rem 0.75rem',
      backgroundColor: '#eff6ff',
      border: '1px solid #dbeafe',
      borderRadius: '6px',
      marginBottom: '0.75rem',
      fontSize: '0.875rem',
      color: '#1e40af',
      fontWeight: '500',
    },
    description: {
      fontSize: '0.875rem',
      color: '#6b7280',
      marginBottom: '1rem',
      lineHeight: '1.5',
      flexGrow: 1,
    },
    price: {
      fontSize: '1.75rem',
      fontWeight: '700',
      color: '#1e40af',
      marginBottom: '1rem',
      display: 'flex',
      alignItems: 'baseline',
      gap: '0.5rem',
    },
    originalPrice: {
      fontSize: '1.25rem',
      color: '#9ca3af',
      textDecoration: 'line-through',
      fontWeight: '400',
    },
    rating: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      marginBottom: '1rem',
      fontSize: '0.875rem',
    },
    stars: {
      color: '#fbbf24',
      fontSize: '1rem',
    },
    specsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '0.5rem',
      marginBottom: '1rem',
      fontSize: '0.875rem',
    },
    specItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.25rem',
      color: '#4b5563',
    },
    actions: {
      display: 'flex',
      gap: '0.5rem',
      marginTop: 'auto',
    },
    compareBtn: {
      flex: 1,
      padding: '0.5rem 1rem',
      backgroundColor: isInComparison ? '#10b981' : '#3b82f6',
      color: '#ffffff',
      border: 'none',
      borderRadius: '6px',
      fontSize: '0.875rem',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'background-color 0.2s',
    },
    actionBtn: {
      padding: '0.5rem',
      backgroundColor: '#f3f4f6',
      color: '#374151',
      border: '1px solid #e5e7eb',
      borderRadius: '6px',
      fontSize: '0.875rem',
      cursor: 'pointer',
      transition: 'all 0.2s',
      display: 'flex',
      alignItems: 'center',
      gap: '0.25rem',
      textDecoration: 'none',
    },
  };

  return (
    <div style={{...styles.card, color: '#111827'}}>
      <h3 style={{...styles.title, color: '#111827'}}>{product.fullName}</h3>
      
      <div style={{...styles.category, color: '#1e40af'}}>
        {product.category}
      </div>
      
      <p style={{...styles.description, color: '#6b7280'}}>{product.description}</p>
      
      <div style={{...styles.price, color: '#1e40af'}}>
        ${product.price}
        {product.originalPrice && product.originalPrice !== product.price && (
          <span style={{...styles.originalPrice, color: '#9ca3af'}}>
            ${product.originalPrice}
          </span>
        )}
      </div>

      <div style={{...styles.rating, color: '#374151'}}>
        <span style={{...styles.stars, color: '#fbbf24'}}>
          {[...Array(5)].map((_, i) => (
            <span key={i} style={{ opacity: i < Math.floor(product.rating) ? 1 : 0.3, color: '#fbbf24' }}>
              ★
            </span>
          ))}
        </span>
        <span style={{ color: '#374151' }}>
          {product.rating}
        </span>
        <span style={{ color: '#6b7280' }}>
          ({product.specifications?.reviews || 'No reviews'})
        </span>
      </div>

      <div style={{...styles.specsGrid, color: '#4b5563'}}>
        <div style={{...styles.specItem, color: '#4b5563'}}>
          <Eye size={14} style={{color: '#4b5563'}} />
          <span style={{color: '#4b5563'}}>{product.specifications.display.fov}</span>
        </div>
        <div style={{...styles.specItem, color: '#4b5563'}}>
          <Zap size={14} style={{color: '#4b5563'}} />
          <span style={{color: '#4b5563'}}>{product.specifications.display.brightness}</span>
        </div>
        <div style={{...styles.specItem, color: '#4b5563'}}>
          <Volume2 size={14} style={{color: '#4b5563'}} />
          <span style={{color: '#4b5563'}}>{product.specifications.audio.speakers}</span>
        </div>
        <div style={{...styles.specItem, color: '#4b5563'}}>
          <Weight size={14} style={{color: '#4b5563'}} />
          <span style={{color: '#4b5563'}}>{product.specifications.design.weight}</span>
        </div>
      </div>

      <div style={styles.actions}>
        <button
          onClick={() => onCompare?.(product.id)}
          style={{...styles.compareBtn, color: '#ffffff'}}
        >
          {isInComparison ? '✓ Added' : '+ Compare'}
        </button>
        
        {onQuickView && (
          <button
            onClick={() => onQuickView(product)}
            style={{...styles.actionBtn, color: '#374151'}}
          >
            <Search size={16} style={{color: '#374151'}} />
          </button>
        )}
        
        <Link
          href={`/products/${product.id}`}
          style={{...styles.actionBtn, color: '#374151'}}
        >
          <ExternalLink size={16} style={{color: '#374151'}} />
        </Link>
      </div>
    </div>
  );
});

ProductCardClean.displayName = 'ProductCardClean';