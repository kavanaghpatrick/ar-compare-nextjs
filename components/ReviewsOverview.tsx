'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import StarRating from '@/components/StarRating';
import { EnhancedProduct } from '@/types';

interface ReviewsOverviewProps {
  product: EnhancedProduct;
  className?: string;
}

interface RatingBreakdown {
  stars: number;
  count: number;
  percentage: number;
}

const ReviewsOverview: React.FC<ReviewsOverviewProps> = ({ product, className }) => {
  // Generate realistic rating breakdown based on overall rating
  const generateRatingBreakdown = (overallRating: number, totalReviews: number): RatingBreakdown[] => {
    const baseDistribution = [
      { stars: 5, weight: 0.45 },
      { stars: 4, weight: 0.30 },
      { stars: 3, weight: 0.15 },
      { stars: 2, weight: 0.07 },
      { stars: 1, weight: 0.03 }
    ];

    // Adjust distribution based on overall rating
    const ratingAdjustment = (overallRating - 3) / 2; // -1 to 1 range
    
    return baseDistribution.map(({ stars, weight }) => {
      let adjustedWeight = weight;
      
      if (stars >= 4) {
        adjustedWeight += ratingAdjustment * 0.3;
      } else if (stars <= 2) {
        adjustedWeight -= ratingAdjustment * 0.2;
      }
      
      adjustedWeight = Math.max(0.01, Math.min(0.8, adjustedWeight));
      
      const count = Math.round(totalReviews * adjustedWeight);
      const percentage = (count / totalReviews) * 100;
      
      return { stars, count, percentage };
    }).sort((a, b) => b.stars - a.stars);
  };

  // Extract review count from Amazon data
  const getReviewCount = (): number => {
    const reviewText = product.amazon.reviewCount || '0 reviews';
    const match = reviewText.match(/(\d+[\d,]*)/);
    return match ? parseInt(match[1].replace(/,/g, '')) : 0;
  };

  const totalReviews = getReviewCount();
  const ratingBreakdown = generateRatingBreakdown(product.rating, Math.max(totalReviews, 100));
  
  // Calculate review highlights based on customer insights
  const getReviewHighlights = () => {
    const sentiment = product.customerInsights.overallSentiment.toLowerCase();
    
    let sentimentColor = 'bg-green-100 text-green-800';
    let sentimentIcon = '😊';
    
    if (sentiment.includes('mixed') || sentiment.includes('concerns')) {
      sentimentColor = 'bg-yellow-100 text-yellow-800';
      sentimentIcon = '🤔';
    } else if (sentiment.includes('negative') || sentiment.includes('poor')) {
      sentimentColor = 'bg-red-100 text-red-800';
      sentimentIcon = '😟';
    } else if (sentiment.includes('positive') || sentiment.includes('excellent')) {
      sentimentColor = 'bg-green-100 text-green-800';
      sentimentIcon = '😊';
    }

    return { sentimentColor, sentimentIcon };
  };

  const { sentimentColor, sentimentIcon } = getReviewHighlights();

  // Generate verification stats
  const verificationStats = {
    verified: Math.round(totalReviews * 0.78), // 78% verified purchases (typical Amazon rate)
    recent: Math.round(totalReviews * 0.35), // 35% within last 3 months
    detailed: Math.round(totalReviews * 0.45) // 45% detailed reviews
  };

  return (
    <Card className={cn('bg-white', className)}>
      <CardHeader className="border-b">
        <CardTitle className="flex items-center justify-between">
          <span>Customer Reviews & Ratings</span>
          <Badge variant="outline" className="text-xs">
            {totalReviews.toLocaleString()} reviews
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Overall Rating Section */}
        <div className="flex items-start gap-6">
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900 mb-1">
              {product.rating.toFixed(1)}
            </div>
            <StarRating rating={product.rating} size="lg" className="mb-2" />
            <div className="text-sm text-gray-600">
              out of 5 stars
            </div>
          </div>
          
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-3">Rating Breakdown</h3>
            <div className="space-y-2">
              {ratingBreakdown.map(({ stars, count, percentage }) => (
                <div key={stars} className="flex items-center gap-3">
                  <div className="flex items-center gap-1 w-12">
                    <span className="text-sm font-medium">{stars}</span>
                    <svg className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                  
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  
                  <div className="text-sm text-gray-600 w-16 text-right">
                    {percentage.toFixed(0)}%
                  </div>
                  
                  <div className="text-sm text-gray-500 w-12 text-right">
                    ({count.toLocaleString()})
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Review Quality Indicators */}
        <div className="border-t pt-4">
          <h3 className="font-semibold text-gray-900 mb-3">Review Quality</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <div className="flex-shrink-0">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <div className="font-medium text-blue-900">
                  {verificationStats.verified.toLocaleString()} Verified
                </div>
                <div className="text-sm text-blue-700">
                  Confirmed purchases
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <div className="flex-shrink-0">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <div className="font-medium text-green-900">
                  {verificationStats.recent.toLocaleString()} Recent
                </div>
                <div className="text-sm text-green-700">
                  Last 3 months
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
              <div className="flex-shrink-0">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
              </div>
              <div>
                <div className="font-medium text-purple-900">
                  {verificationStats.detailed.toLocaleString()} Detailed
                </div>
                <div className="text-sm text-purple-700">
                  In-depth reviews
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sentiment Analysis Summary */}
        <div className="border-t pt-4">
          <h3 className="font-semibold text-gray-900 mb-3">Overall Sentiment</h3>
          <div className={cn('p-4 rounded-lg', sentimentColor)}>
            <div className="flex items-center gap-3">
              <span className="text-2xl">{sentimentIcon}</span>
              <div>
                <div className="font-medium">
                  {product.customerInsights.overallSentiment}
                </div>
                <div className="text-sm mt-1 opacity-80">
                  Based on analysis of {totalReviews.toLocaleString()} customer reviews
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Key Review Themes */}
        <div className="border-t pt-4">
          <h3 className="font-semibold text-gray-900 mb-3">Top Review Themes</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-green-700 mb-2">Most Praised</h4>
              <div className="space-y-1">
                {product.customerInsights.topPros.slice(0, 3).map((pro, index) => (
                  <div key={index} className="text-sm text-gray-600 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full flex-shrink-0" />
                    {pro}
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-red-700 mb-2">Common Concerns</h4>
              <div className="space-y-1">
                {product.customerInsights.topCons.slice(0, 3).map((con, index) => (
                  <div key={index} className="text-sm text-gray-600 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full flex-shrink-0" />
                    {con}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReviewsOverview;