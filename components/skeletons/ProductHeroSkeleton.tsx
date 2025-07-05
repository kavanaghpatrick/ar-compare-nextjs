'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

export function ProductHeroSkeleton() {
  return (
    <div className="w-full">
      <Card className="bg-white/5 backdrop-blur-lg border-white/10">
        <CardContent className="p-8">
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            {/* Image skeleton with exact dimensions */}
            <div className="relative group">
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-white/5 backdrop-blur-sm border border-white/10">
                <div className="absolute inset-0 bg-gray-700/20 animate-pulse"></div>
                
                {/* Badge skeletons */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  <div className="h-6 w-20 bg-gray-700/30 rounded-full animate-pulse"></div>
                  <div className="h-6 w-16 bg-gray-700/30 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* Product info skeleton */}
            <div className="space-y-6">
              {/* Brand and availability badges */}
              <div className="flex items-center gap-3">
                <div className="h-6 w-24 bg-gray-700/30 rounded-full animate-pulse"></div>
                <div className="h-6 w-28 bg-gray-700/30 rounded-full animate-pulse"></div>
              </div>

              {/* Title */}
              <div className="space-y-3">
                <div className="h-10 w-3/4 bg-gray-700/30 rounded-md animate-pulse"></div>
                <div className="h-10 w-1/2 bg-gray-700/30 rounded-md animate-pulse"></div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <div className="h-5 w-full bg-gray-700/30 rounded-md animate-pulse"></div>
                <div className="h-5 w-5/6 bg-gray-700/30 rounded-md animate-pulse"></div>
                <div className="h-5 w-4/6 bg-gray-700/30 rounded-md animate-pulse"></div>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-4">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-4 h-4 bg-gray-700/30 rounded animate-pulse"></div>
                  ))}
                </div>
                <div className="h-5 w-12 bg-gray-700/30 rounded-md animate-pulse"></div>
                <div className="h-5 w-16 bg-gray-700/30 rounded-md animate-pulse"></div>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <div className="h-8 w-24 bg-gray-700/30 rounded-md animate-pulse"></div>
                <div className="h-6 w-20 bg-gray-700/30 rounded-md animate-pulse"></div>
              </div>

              {/* Amazon price box */}
              <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                <div className="h-full w-full bg-gray-700/20 rounded animate-pulse" style={{ height: '80px' }}></div>
              </div>

              {/* Key features */}
              <div className="space-y-3">
                <div className="h-5 w-24 bg-gray-700/30 rounded-md animate-pulse"></div>
                <div className="space-y-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-4 h-4 bg-gray-700/30 rounded animate-pulse"></div>
                      <div className="h-4 w-48 bg-gray-700/30 rounded-md animate-pulse"></div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <div className="h-12 bg-gray-700/30 rounded-lg flex-1 animate-pulse"></div>
                <div className="h-12 bg-gray-700/30 rounded-lg flex-1 animate-pulse"></div>
              </div>

              {/* Best for tags */}
              <div className="space-y-3">
                <div className="h-4 w-20 bg-gray-700/30 rounded-md animate-pulse"></div>
                <div className="flex flex-wrap gap-2">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-6 w-24 bg-gray-700/30 rounded-full animate-pulse"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}