"use client";

import React, { useState } from 'react';
import { ShoppingCart, ExternalLink, TrendingDown, TrendingUp, Star, Truck, Shield, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { EnhancedProduct } from '@/types';
import { cn } from '@/lib/utils';

interface ProductPurchasingProps {
  product: EnhancedProduct;
  onPurchaseClick?: (source: string) => void;
}

export function ProductPurchasing({ product, onPurchaseClick }: ProductPurchasingProps) {
  const [priceAlertEnabled, setPriceAlertEnabled] = useState(false);

  const hasDiscount = product.price < product.originalPrice;
  const discountPercentage = hasDiscount 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const getPriceColor = (price: string) => {
    // Simple logic to determine if price is competitive
    const numericPrice = parseFloat(price.replace(/[^\d.]/g, ''));
    if (numericPrice < 300) return 'text-green-400';
    if (numericPrice < 600) return 'text-blue-400';
    return 'text-orange-400';
  };

  const getAvailabilityStatus = (availability: string) => {
    const lower = availability.toLowerCase();
    if (lower.includes('in stock') || lower.includes('available')) {
      return { color: 'bg-green-500/20 text-green-400 border-green-500/30', icon: CheckCircle };
    }
    if (lower.includes('pre-order')) {
      return { color: 'bg-blue-500/20 text-blue-400 border-blue-500/30', icon: AlertCircle };
    }
    if (lower.includes('sold out') || lower.includes('unavailable')) {
      return { color: 'bg-red-500/20 text-red-400 border-red-500/30', icon: AlertCircle };
    }
    return { color: 'bg-gray-500/20 text-gray-400 border-gray-500/30', icon: AlertCircle };
  };

  const directAvailabilityStatus = getAvailabilityStatus(product.availability);
  const amazonAvailabilityStatus = getAvailabilityStatus(product.amazon?.availability || 'Unknown');

  // Mock price history data (in a real app, this would come from your backend)
  const mockPriceHistory = [
    { period: '30 days ago', price: product.originalPrice },
    { period: '14 days ago', price: product.originalPrice * 0.95 },
    { period: '7 days ago', price: product.price * 1.05 },
    { period: 'Today', price: product.price },
  ];

  const renderPriceHistory = () => (
    <div className="space-y-3">
      {mockPriceHistory.map((entry, index) => (
        <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
          <span className="text-white/70 text-sm">{entry.period}</span>
          <div className="flex items-center gap-2">
            <span className="text-white font-medium">${entry.price}</span>
            {index < mockPriceHistory.length - 1 && (
              <div className="flex items-center">
                {entry.price > mockPriceHistory[index + 1].price ? (
                  <TrendingDown className="w-4 h-4 text-green-400" />
                ) : (
                  <TrendingUp className="w-4 h-4 text-red-400" />
                )}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="w-full space-y-6">
      <div className="text-center space-y-4">
        <h2 className="text-2xl lg:text-3xl font-bold text-white">
          Purchase Information
        </h2>
        <p className="text-white/70 max-w-2xl mx-auto">
          Complete purchasing guide with pricing analysis, availability, and buying recommendations
        </p>
      </div>

      {/* Price Comparison Section */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Direct Purchase */}
        <Card className="bg-white/5 backdrop-blur-lg border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-white">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <ShoppingCart className="w-5 h-5 text-blue-400" />
              </div>
              Direct from {product.brand}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-baseline gap-3">
                <span className={cn("text-3xl font-bold", getPriceColor(`${product.price}`))}>
                  ${product.price}
                </span>
                {hasDiscount && (
                  <span className="text-xl text-white/50 line-through">
                    ${product.originalPrice}
                  </span>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <Badge className={directAvailabilityStatus.color}>
                  <directAvailabilityStatus.icon className="w-3 h-3 mr-1" />
                  {product.availability}
                </Badge>
                {hasDiscount && (
                  <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                    -{discountPercentage}% OFF
                  </Badge>
                )}
              </div>

              <div className="pt-4 space-y-3">
                <Button 
                  onClick={() => onPurchaseClick?.('direct')}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  size="lg"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Buy Direct
                </Button>
                
                <div className="text-sm text-white/60 space-y-1">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    <span>Manufacturer warranty included</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4" />
                    <span>Standard shipping available</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Amazon Purchase */}
        {product.amazon && (
          <Card className="bg-gradient-to-br from-orange-500/10 to-orange-600/5 backdrop-blur-lg border-orange-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-white">
                <div className="p-2 bg-orange-500/20 rounded-lg">
                  <ExternalLink className="w-5 h-5 text-orange-400" />
                </div>
                Amazon
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-baseline gap-3">
                  <span className={cn("text-3xl font-bold", getPriceColor(product.amazon.price))}>
                    {product.amazon.price}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge className={amazonAvailabilityStatus.color}>
                    <amazonAvailabilityStatus.icon className="w-3 h-3 mr-1" />
                    {product.amazon.availability}
                  </Badge>
                  {product.amazon.rating && (
                    <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                      <Star className="w-3 h-3 mr-1 fill-current" />
                      {product.amazon.rating}
                    </Badge>
                  )}
                </div>

                {product.amazon.reviewCount && (
                  <div className="text-sm text-white/60">
                    {product.amazon.reviewCount} customer reviews
                  </div>
                )}

                <div className="pt-4 space-y-3">
                  <Button 
                    onClick={() => onPurchaseClick?.('amazon')}
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                    size="lg"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Buy on Amazon
                  </Button>
                  
                  <div className="text-sm text-white/60 space-y-1">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      <span>Amazon's return policy</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4" />
                      <span>{product.amazon.shipping}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Price History & Alerts */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Price History */}
        <Card className="bg-white/5 backdrop-blur-lg border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-white">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <TrendingDown className="w-5 h-5 text-green-400" />
              </div>
              Price History
            </CardTitle>
          </CardHeader>
          <CardContent>
            {renderPriceHistory()}
          </CardContent>
        </Card>

        {/* Price Alerts */}
        <Card className="bg-white/5 backdrop-blur-lg border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-white">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <AlertCircle className="w-5 h-5 text-purple-400" />
              </div>
              Price Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                <div>
                  <div className="font-medium text-white">Current Price</div>
                  <div className="text-sm text-white/60">Get notified of price drops</div>
                </div>
                <Button
                  onClick={() => setPriceAlertEnabled(!priceAlertEnabled)}
                  variant={priceAlertEnabled ? "default" : "outline"}
                  size="sm"
                >
                  {priceAlertEnabled ? "Alert On" : "Set Alert"}
                </Button>
              </div>
              
              {priceAlertEnabled && (
                <Alert className="bg-green-500/10 border-green-500/20">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <AlertDescription className="text-green-400">
                    You'll be notified when the price drops below ${Math.round(product.price * 0.9)}.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Purchasing Recommendations */}
      <Card className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-lg border-blue-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-white">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <CheckCircle className="w-5 h-5 text-blue-400" />
            </div>
            Purchasing Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-semibold text-white">Best Time to Buy</h4>
              <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                <div className="text-sm text-white/80">
                  {hasDiscount ? (
                    "Great deal! Current discount makes this an excellent time to buy."
                  ) : (
                    "Wait for potential seasonal sales or consider setting up a price alert."
                  )}
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold text-white">Recommended Source</h4>
              <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                <div className="text-sm text-white/80">
                  {product.amazon?.shipping.includes('Prime') ? (
                    "Amazon recommended for fast Prime shipping and easy returns."
                  ) : (
                    "Direct purchase recommended for best warranty support."
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Return Policy & Warranty */}
      <Card className="bg-white/5 backdrop-blur-lg border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-white">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <Shield className="w-5 h-5 text-green-400" />
            </div>
            Return Policy & Warranty
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold text-white">Return Policy</h4>
              <div className="space-y-2 text-sm text-white/80">
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-green-400" />
                  <span>30-day return window</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-green-400" />
                  <span>Original packaging required</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>Full refund if unused</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold text-white">Warranty Coverage</h4>
              <div className="space-y-2 text-sm text-white/80">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-blue-400" />
                  <span>1-year manufacturer warranty</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-400" />
                  <span>Covers manufacturing defects</span>
                </div>
                <div className="flex items-center gap-2">
                  <ExternalLink className="w-4 h-4 text-blue-400" />
                  <span>Extended warranty available</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}