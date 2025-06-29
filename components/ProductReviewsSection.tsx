'use client';

import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { EnhancedProduct } from '@/types';
import ReviewsOverview from './ReviewsOverview';
import CustomerInsights from './CustomerInsights';
import ReviewFilters from './ReviewFilters';
import SentimentAnalysis from './SentimentAnalysis';

interface ProductReviewsSectionProps {
  product: EnhancedProduct;
  className?: string;
}

interface FilterState {
  rating: number | null;
  verified: boolean | null;
  timeframe: string;
  sortBy: string;
  searchQuery: string;
}

/**
 * Comprehensive product reviews section that integrates all review components
 * 
 * This component demonstrates how to use:
 * - ReviewsOverview: Overall ratings and review quality indicators
 * - CustomerInsights: Detailed pros/cons and satisfaction metrics
 * - ReviewFilters: Advanced filtering and sorting capabilities
 * - SentimentAnalysis: Emotional analysis and sentiment trends
 * 
 * Usage:
 * ```tsx
 * import { ProductReviewsSection } from '@/components';
 * import { enhancedArGlassesData } from '@/data/products';
 * 
 * <ProductReviewsSection 
 *   product={enhancedArGlassesData[0]} 
 *   className="mt-8"
 * />
 * ```
 */
const ProductReviewsSection: React.FC<ProductReviewsSectionProps> = ({ product, className }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    rating: null,
    verified: null,
    timeframe: 'all',
    sortBy: 'newest',
    searchQuery: ''
  });

  // Extract review count for filter component
  const getReviewCount = (): number => {
    const reviewText = product.amazon.reviewCount || '0 reviews';
    const match = reviewText.match(/(\d+[\d,]*)/);
    return match ? parseInt(match[1].replace(/,/g, '')) : 0;
  };

  const totalReviews = getReviewCount();

  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    // In a real implementation, you would filter actual review data here
    console.log('Filters changed:', newFilters);
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Customer Reviews & Analysis
          </h2>
          <p className="text-gray-600 mt-1">
            Comprehensive insights from {totalReviews.toLocaleString()} customer reviews
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
          </svg>
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </Button>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="bg-gray-50 rounded-lg p-4 border">
          <ReviewFilters
            onFiltersChange={handleFiltersChange}
            totalReviews={totalReviews}
          />
        </div>
      )}

      {/* Main Review Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="insights">Customer Insights</TabsTrigger>
          <TabsTrigger value="sentiment">Sentiment Analysis</TabsTrigger>
          <TabsTrigger value="comparison">Compare Reviews</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <ReviewsOverview product={product} />
          
          {/* Quick Actions */}
          <div className="flex flex-wrap gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-medium text-blue-900">
                Want more detailed insights?
              </span>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setActiveTab('insights')}
              >
                View Customer Insights
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setActiveTab('sentiment')}
              >
                Analyze Sentiment
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <CustomerInsights product={product} />
          
          {/* Insight Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h3 className="font-semibold text-green-900 mb-2">Top Strengths</h3>
              <p className="text-sm text-green-700 mb-3">
                Customers love the {product.customerInsights.topPros[0]?.toLowerCase()}
              </p>
              <Button size="sm" variant="outline" onClick={() => setActiveTab('sentiment')}>
                See Emotional Impact
              </Button>
            </div>
            
            <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
              <h3 className="font-semibold text-orange-900 mb-2">Areas to Consider</h3>
              <p className="text-sm text-orange-700 mb-3">
                Be aware of {product.customerInsights.topCons[0]?.toLowerCase()}
              </p>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => setFilters({ ...filters, searchQuery: product.customerInsights.topCons[0]?.split(' ')[0] || '' })}
              >
                Filter Related Reviews
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="sentiment" className="space-y-6">
          <SentimentAnalysis product={product} />
          
          {/* Sentiment Summary */}
          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-purple-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <div>
                <h3 className="font-semibold text-purple-900 mb-2">
                  Sentiment Insights for {product.fullName}
                </h3>
                <p className="text-sm text-purple-700">
                  {product.customerInsights.overallSentiment}. 
                  Most customers feel {product.rating >= 4.5 ? 'very satisfied' : product.rating >= 4 ? 'satisfied' : 'mixed'} with their purchase, 
                  with particular praise for {product.customerInsights.topPros[0]?.toLowerCase()}.
                </p>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="comparison" className="space-y-6">
          {/* Competitive Review Comparison */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Review Quality Comparison</h3>
              <div className="space-y-3">
                {[
                  { name: product.fullName, rating: product.rating, reviews: totalReviews, verified: 78 },
                  { name: 'Xreal One', rating: 4.3, reviews: 1200, verified: 82 },
                  { name: 'Viture Pro XR', rating: 4.2, reviews: 2100, verified: 75 },
                  { name: 'Industry Average', rating: 3.8, reviews: 950, verified: 65 }
                ].map((item, index) => (
                  <div key={index} className={cn('p-3 rounded-lg border', item.name === product.fullName ? 'bg-blue-50 border-blue-200' : 'bg-gray-50')}>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{item.name}</div>
                        <div className="text-sm text-gray-600">
                          {item.rating} stars • {item.reviews.toLocaleString()} reviews • {item.verified}% verified
                        </div>
                      </div>
                      {item.name === product.fullName && (
                        <div className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          Current Product
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Common Review Themes</h3>
              <div className="space-y-2">
                {[
                  'Display Quality',
                  'Audio Performance',
                  'Comfort & Ergonomics',
                  'Build Quality',
                  'Value for Money',
                  'Setup Experience'
                ].map((theme, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm">{theme}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 px-2 text-xs"
                      onClick={() => setFilters({ ...filters, searchQuery: theme.toLowerCase() })}
                    >
                      Filter
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Integration Help */}
      <div className="border-t pt-6">
        <details className="group">
          <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-900 flex items-center gap-2">
            <svg className="w-4 h-4 group-open:rotate-90 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            Developer Integration Guide
          </summary>
          <div className="mt-4 p-4 bg-gray-50 rounded-lg text-sm space-y-3">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Individual Component Usage:</h4>
              <pre className="bg-white p-3 rounded border text-xs overflow-x-auto">
{`// Import individual components
import { ReviewsOverview, CustomerInsights, ReviewFilters, SentimentAnalysis } from '@/components';

// Use individually
<ReviewsOverview product={product} />
<CustomerInsights product={product} />
<ReviewFilters onFiltersChange={handleFilters} totalReviews={1200} />
<SentimentAnalysis product={product} />`}
              </pre>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Complete Integration:</h4>
              <pre className="bg-white p-3 rounded border text-xs overflow-x-auto">
{`// Use the complete section
import { ProductReviewsSection } from '@/components';

<ProductReviewsSection product={enhancedProduct} className="mt-8" />`}
              </pre>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Required Data Structure:</h4>
              <p className="text-gray-600">
                Components expect an <code className="bg-white px-1 rounded">EnhancedProduct</code> type with 
                <code className="bg-white px-1 rounded">customerInsights</code>, 
                <code className="bg-white px-1 rounded">amazon</code>, and 
                <code className="bg-white px-1 rounded">purchaseRecommendation</code> fields.
              </p>
            </div>
          </div>
        </details>
      </div>
    </div>
  );
};

export default ProductReviewsSection;