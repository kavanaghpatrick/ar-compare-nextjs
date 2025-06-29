"use client";

import React from 'react';
import { ThumbsUp, ThumbsDown, Users, Target, Lightbulb, TrendingUp, Award, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EnhancedProduct } from '@/types';
import { cn } from '@/lib/utils';

interface ProductInsightsProps {
  product: EnhancedProduct;
}

export function ProductInsights({ product }: ProductInsightsProps) {
  const getSentimentColor = (sentiment: string) => {
    const lowerSentiment = sentiment.toLowerCase();
    if (lowerSentiment.includes('positive') || lowerSentiment.includes('excellent')) {
      return 'text-green-400 bg-green-500/20 border-green-500/30';
    }
    if (lowerSentiment.includes('mixed') || lowerSentiment.includes('moderate')) {
      return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
    }
    if (lowerSentiment.includes('negative') || lowerSentiment.includes('poor')) {
      return 'text-red-400 bg-red-500/20 border-red-500/30';
    }
    return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
  };

  const getTargetAudienceIcon = (audience: string) => {
    const lowerAudience = audience.toLowerCase();
    if (lowerAudience.includes('professional') || lowerAudience.includes('enterprise')) {
      return Award;
    }
    if (lowerAudience.includes('developer') || lowerAudience.includes('enthusiast')) {
      return Lightbulb;
    }
    if (lowerAudience.includes('consumer') || lowerAudience.includes('mainstream')) {
      return Users;
    }
    return Target;
  };

  const getPositioningColor = (positioning: string) => {
    const lowerPositioning = positioning.toLowerCase();
    if (lowerPositioning.includes('premium') || lowerPositioning.includes('high-end')) {
      return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
    }
    if (lowerPositioning.includes('budget') || lowerPositioning.includes('entry')) {
      return 'bg-green-500/20 text-green-400 border-green-500/30';
    }
    if (lowerPositioning.includes('mid-range') || lowerPositioning.includes('value')) {
      return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    }
    return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
  };

  const TargetIcon = getTargetAudienceIcon(product.marketContext.targetAudience);

  return (
    <div className="w-full space-y-6">
      <div className="text-center space-y-4">
        <h2 className="text-2xl lg:text-3xl font-bold text-white">
          Market Insights & Analysis
        </h2>
        <p className="text-white/70 max-w-2xl mx-auto">
          Real customer feedback, market positioning, and expert recommendations based on comprehensive research
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Customer Sentiment */}
        <Card className="bg-white/5 backdrop-blur-lg border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-white">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <TrendingUp className="w-5 h-5 text-blue-400" />
              </div>
              Customer Sentiment
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-lg border border-white/10 bg-white/5">
              <Badge className={getSentimentColor(product.customerInsights.overallSentiment)}>
                {product.customerInsights.overallSentiment}
              </Badge>
              <p className="text-white/80 mt-3 text-sm leading-relaxed">
                {product.customerInsights.overallSentiment}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Market Positioning */}
        <Card className="bg-white/5 backdrop-blur-lg border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-white">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Target className="w-5 h-5 text-purple-400" />
              </div>
              Market Positioning
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <span className="text-white/70 text-sm">Price Positioning</span>
                <div className="mt-1">
                  <Badge className={getPositioningColor(product.marketContext.pricePositioning)}>
                    {product.marketContext.pricePositioning}
                  </Badge>
                </div>
              </div>
              <div>
                <span className="text-white/70 text-sm">Competitive Advantage</span>
                <p className="text-white/90 text-sm mt-1 leading-relaxed">
                  {product.marketContext.competitiveAdvantage}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pros and Cons from Real Reviews */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top Pros */}
        <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 backdrop-blur-lg border-green-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-white">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <ThumbsUp className="w-5 h-5 text-green-400" />
              </div>
              What Customers Love
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {product.customerInsights.topPros.map((pro, index) => (
                <li key={index} className="flex items-start gap-3 p-3 bg-white/5 rounded-lg border border-green-500/20">
                  <ThumbsUp className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-white text-sm leading-relaxed">{pro}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Top Cons */}
        <Card className="bg-gradient-to-br from-red-500/10 to-red-600/5 backdrop-blur-lg border-red-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-white">
              <div className="p-2 bg-red-500/20 rounded-lg">
                <ThumbsDown className="w-5 h-5 text-red-400" />
              </div>
              Common Concerns
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {product.customerInsights.topCons.map((con, index) => (
                <li key={index} className="flex items-start gap-3 p-3 bg-white/5 rounded-lg border border-red-500/20">
                  <ThumbsDown className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                  <span className="text-white text-sm leading-relaxed">{con}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Target Audience & Use Cases */}
      <Card className="bg-white/5 backdrop-blur-lg border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-white">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <TargetIcon className="w-5 h-5 text-blue-400" />
            </div>
            Target Audience & Use Cases
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h4 className="text-white font-semibold mb-3">Primary Target Audience</h4>
            <p className="text-white/80 text-sm leading-relaxed bg-white/5 p-4 rounded-lg border border-white/10">
              {product.marketContext.targetAudience}
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3">Ideal Use Cases</h4>
            <div className="grid sm:grid-cols-2 gap-3">
              {product.marketContext.useCases.map((useCase, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/10">
                  <Lightbulb className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                  <span className="text-white/90 text-sm">{useCase}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Purchase Decision Matrix */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Best For */}
        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 backdrop-blur-lg border-blue-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-white">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Award className="w-5 h-5 text-blue-400" />
              </div>
              Perfect Match For
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {product.purchaseRecommendation.bestFor.map((recommendation, index) => (
                <li key={index} className="flex items-start gap-3 p-3 bg-white/5 rounded-lg border border-blue-500/20">
                  <Award className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                  <span className="text-white text-sm leading-relaxed">{recommendation}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Avoid If */}
        <Card className="bg-gradient-to-br from-orange-500/10 to-orange-600/5 backdrop-blur-lg border-orange-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-white">
              <div className="p-2 bg-orange-500/20 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-orange-400" />
              </div>
              Consider Alternatives If
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {product.purchaseRecommendation.avoidIf.map((warning, index) => (
                <li key={index} className="flex items-start gap-3 p-3 bg-white/5 rounded-lg border border-orange-500/20">
                  <AlertTriangle className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                  <span className="text-white text-sm leading-relaxed">{warning}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Alternative Recommendation */}
      {product.purchaseRecommendation.alternativeConsider && (
        <Card className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-lg border-purple-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-white">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Lightbulb className="w-5 h-5 text-purple-400" />
              </div>
              Expert Alternative Recommendation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-white/90 leading-relaxed">
              {product.purchaseRecommendation.alternativeConsider}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}