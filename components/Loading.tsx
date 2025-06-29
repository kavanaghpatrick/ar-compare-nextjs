'use client';

import { Loader2 } from 'lucide-react';

interface LoadingProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
}

export function Loading({ 
  message = 'Loading...', 
  size = 'md',
  fullScreen = false 
}: LoadingProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8', 
    lg: 'w-12 h-12'
  };

  const containerClasses = fullScreen 
    ? 'fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50'
    : 'flex items-center justify-center p-8';

  return (
    <div className={containerClasses}>
      <div className="text-center">
        <Loader2 className={`${sizeClasses[size]} animate-spin text-blue-400 mx-auto mb-2`} />
        <p className="text-white/80">{message}</p>
      </div>
    </div>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="product-card animate-pulse">
      <div className="product-header">
        <div className="skeleton w-10 h-10 rounded-full"></div>
        <div className="skeleton w-16 h-4"></div>
      </div>
      <div className="skeleton-title w-3/4 mb-2"></div>
      <div className="skeleton-text w-5/6 mb-3"></div>
      <div className="skeleton-title w-24 mb-4"></div>
      <div className="flex items-center gap-2 mb-4">
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="skeleton w-4 h-4"></div>
          ))}
        </div>
        <div className="skeleton w-8 h-4"></div>
        <div className="skeleton w-20 h-4"></div>
      </div>
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="skeleton-text"></div>
        <div className="skeleton-text"></div>
        <div className="skeleton-text"></div>
        <div className="skeleton-text"></div>
      </div>
      <div className="product-actions gap-2">
        <div className="skeleton h-8 flex-1"></div>
        <div className="skeleton h-8 flex-1"></div>
      </div>
    </div>
  );
}

export function ProductDetailSkeleton() {
  return (
    <div className="app-container">
      <div className="product-details animate-pulse">
        <div className="product-details-header">
          <div className="skeleton h-10 w-48 mb-6"></div>
          <div className="skeleton-title w-3/4 mb-4"></div>
          <div className="skeleton h-8 w-32"></div>
        </div>

        <div className="product-tabs">
          <div className="skeleton h-12 w-32"></div>
          <div className="skeleton h-12 w-24"></div>
          <div className="skeleton h-12 w-28"></div>
          <div className="skeleton h-12 w-36"></div>
        </div>

        <div className="product-content">
          <div className="specs-grid">
            <div className="spec-section">
              <div className="skeleton-title w-20 mb-4"></div>
              <div className="space-y-2">
                <div className="skeleton-text"></div>
                <div className="skeleton-text w-4/5"></div>
                <div className="skeleton-text w-3/5"></div>
                <div className="skeleton-text w-2/3"></div>
              </div>
            </div>
            <div className="spec-section">
              <div className="skeleton-title w-16 mb-4"></div>
              <div className="space-y-2">
                <div className="skeleton-text"></div>
                <div className="skeleton-text w-5/6"></div>
                <div className="skeleton-text w-3/4"></div>
              </div>
            </div>
            <div className="spec-section">
              <div className="skeleton-title w-14 mb-4"></div>
              <div className="space-y-2">
                <div className="skeleton-text w-4/5"></div>
                <div className="skeleton-text w-3/5"></div>
              </div>
            </div>
            <div className="spec-section">
              <div className="skeleton-title w-24 mb-4"></div>
              <div className="space-y-2">
                <div className="skeleton-text"></div>
                <div className="skeleton-text w-5/6"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}