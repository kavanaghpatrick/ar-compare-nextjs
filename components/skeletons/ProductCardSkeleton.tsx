'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface ProductCardSkeletonProps {
  className?: string;
}

export function ProductCardSkeleton({ className }: ProductCardSkeletonProps) {
  return (
    <div className={cn("product-card animate-pulse", className)}>
      {/* Title skeleton */}
      <div className="h-6 bg-gray-200 rounded-md mb-4 w-3/4"></div>
      
      {/* Category skeleton */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-4 h-4 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-200 rounded-md w-24"></div>
      </div>
      
      {/* Description skeleton */}
      <div className="space-y-2 mb-4">
        <div className="h-4 bg-gray-200 rounded-md w-full"></div>
        <div className="h-4 bg-gray-200 rounded-md w-5/6"></div>
      </div>
      
      {/* Price skeleton */}
      <div className="flex items-center gap-2 mb-4">
        <div className="h-6 bg-gray-200 rounded-md w-20"></div>
        <div className="h-4 bg-gray-200 rounded-md w-16"></div>
      </div>
      
      {/* Rating skeleton */}
      <div className="flex items-center gap-2 mb-4">
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-4 h-4 bg-gray-200 rounded"></div>
          ))}
        </div>
        <div className="h-4 bg-gray-200 rounded-md w-8"></div>
        <div className="h-4 bg-gray-200 rounded-md w-20"></div>
      </div>
      
      {/* Specs grid skeleton */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded-md w-16"></div>
          </div>
        ))}
      </div>
      
      {/* Action buttons skeleton */}
      <div className="flex gap-2">
        <div className="h-10 bg-gray-200 rounded-lg flex-1"></div>
        <div className="h-10 bg-gray-200 rounded-lg flex-1"></div>
      </div>
    </div>
  );
}