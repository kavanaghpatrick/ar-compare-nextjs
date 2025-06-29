"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { Star, ShoppingCart, GitCompare, ExternalLink, Zap, Shield, Truck, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { EnhancedProduct } from '@/types';
import { cn } from '@/lib/utils';

interface ProductHeroProps {
  product: EnhancedProduct;
  onAddToCompare?: () => void;
  onBuyOnAmazon?: () => void;
}

export function ProductHero({ product, onAddToCompare, onBuyOnAmazon }: ProductHeroProps) {
  const [imageHovered, setImageHovered] = useState(false);
  
  const hasDiscount = product.price < product.originalPrice;
  const discountPercentage = hasDiscount 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={cn(
          "w-4 h-4 transition-colors",
          index < Math.floor(rating)
            ? "text-yellow-400 fill-current"
            : "text-gray-400"
        )}
      />
    ));
  };

  const getAvailabilityStatus = (availability: string) => {
    switch (availability.toLowerCase()) {
      case 'in stock':
        return { color: 'bg-green-500/20 text-green-400 border-green-500/30', icon: Shield };
      case 'pre-order':
        return { color: 'bg-blue-500/20 text-blue-400 border-blue-500/30', icon: Zap };
      case 'sold out':
        return { color: 'bg-red-500/20 text-red-400 border-red-500/30', icon: ExternalLink };
      default:
        return { color: 'bg-gray-500/20 text-gray-400 border-gray-500/30', icon: Shield };
    }
  };

  const availabilityStatus = getAvailabilityStatus(product.availability);

  return (
    <div className="w-full">
      <Card className="bg-white/5 backdrop-blur-lg border-white/10 text-white">
        <CardContent className="p-8">
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            {/* Product Image Section */}
            <div className="relative group">
              <div 
                className="relative aspect-square rounded-2xl overflow-hidden bg-white/5 backdrop-blur-sm border border-white/10 transition-all duration-300"
                onMouseEnter={() => setImageHovered(true)}
                onMouseLeave={() => setImageHovered(false)}
              >
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className={cn(
                    "object-contain p-8 transition-transform duration-300",
                    imageHovered && "scale-105"
                  )}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                
                {/* Floating Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {product.category === 'Premium' && (
                    <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                      <Award className="w-3 h-3 mr-1" />
                      Premium
                    </Badge>
                  )}
                  {hasDiscount && (
                    <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                      -{discountPercentage}% OFF
                    </Badge>
                  )}
                  {product.availability === 'Pre-order' && (
                    <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                      <Zap className="w-3 h-3 mr-1" />
                      Pre-order
                    </Badge>
                  )}
                </div>

                {/* Hover Effect Overlay */}
                <div className={cn(
                  "absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300",
                  imageHovered && "opacity-100"
                )} />
              </div>
            </div>

            {/* Product Info Section */}
            <div className="space-y-6">
              {/* Brand and Model */}
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className="text-sm">
                    {product.brand}
                  </Badge>
                  <Badge className={availabilityStatus.color}>
                    <availabilityStatus.icon className="w-3 h-3 mr-1" />
                    {product.availability}
                  </Badge>
                </div>
                <h1 className="text-3xl lg:text-4xl font-bold text-white">
                  {product.name}
                </h1>
                <p className="text-lg text-white/70 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Rating and Reviews */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {renderStars(product.rating)}
                  </div>
                  <span className="font-semibold text-white">
                    {product.rating}/5
                  </span>
                </div>
                {product.amazon?.reviewCount && (
                  <div className="text-sm text-white/60">
                    ({product.amazon.reviewCount})
                  </div>
                )}
              </div>

              {/* Pricing Section */}
              <div className="space-y-4">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-bold text-white">
                    ${product.price}
                  </span>
                  {hasDiscount && (
                    <span className="text-xl text-white/50 line-through">
                      ${product.originalPrice}
                    </span>
                  )}
                  <span className="text-sm text-white/60">
                    {product.currency}
                  </span>
                </div>

                {/* Amazon Price Comparison */}
                {product.amazon && (
                  <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <ExternalLink className="w-4 h-4 text-orange-400" />
                          <span className="font-semibold text-orange-400">Amazon Price</span>
                        </div>
                        <div className="text-2xl font-bold text-white">
                          {product.amazon.price}
                        </div>
                        <div className="text-sm text-white/60">
                          {product.amazon.availability}
                        </div>
                      </div>
                      {product.amazon.rating && (
                        <div className="text-right">
                          <div className="flex items-center gap-1 justify-end mb-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="font-semibold">{product.amazon.rating}</span>
                          </div>
                          <div className="text-sm text-white/60">
                            {product.amazon.reviewCount}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Key Features Preview */}
              <div className="space-y-3">
                <h3 className="font-semibold text-white">Key Features</h3>
                <div className="grid gap-2">
                  {product.keyFeatures.slice(0, 4).map((feature, index) => (
                    <div key={index} className="flex items-center gap-3 text-white/80">
                      <Zap className="w-4 h-4 text-blue-400 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Info */}
              {product.amazon?.shipping && (
                <div className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <Truck className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-green-400 font-medium">
                    {product.amazon.shipping}
                  </span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button 
                  onClick={onAddToCompare}
                  variant="secondary" 
                  size="lg"
                  className="flex-1 bg-white/10 hover:bg-white/20 border-white/20 text-white"
                >
                  <GitCompare className="w-4 h-4 mr-2" />
                  Add to Compare
                </Button>
                <Button 
                  onClick={onBuyOnAmazon}
                  size="lg"
                  className="flex-1 bg-orange-600 hover:bg-orange-700 text-white"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Buy on Amazon
                </Button>
              </div>

              {/* Purchase Recommendation Tags */}
              {product.purchaseRecommendation?.bestFor && (
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-white/80">Best For:</h4>
                  <div className="flex flex-wrap gap-2">
                    {product.purchaseRecommendation.bestFor.slice(0, 3).map((rec, index) => (
                      <Badge 
                        key={index} 
                        variant="outline" 
                        className="bg-blue-500/10 text-blue-400 border-blue-500/30"
                      >
                        {rec}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}