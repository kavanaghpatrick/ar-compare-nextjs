'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import StarRating from '@/components/StarRating';

interface FilterState {
  rating: number | null;
  verified: boolean | null;
  timeframe: string;
  sortBy: string;
  searchQuery: string;
}

interface ReviewFiltersProps {
  onFiltersChange?: (filters: FilterState) => void;
  totalReviews: number;
  className?: string;
}

const ReviewFilters: React.FC<ReviewFiltersProps> = ({ onFiltersChange, totalReviews, className }) => {
  const [filters, setFilters] = useState<FilterState>({
    rating: null,
    verified: null,
    timeframe: 'all',
    sortBy: 'newest',
    searchQuery: ''
  });

  const [activeFiltersCount, setActiveFiltersCount] = useState(0);

  const updateFilters = (newFilters: Partial<FilterState>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    
    // Count active filters
    let count = 0;
    if (updatedFilters.rating !== null) count++;
    if (updatedFilters.verified !== null) count++;
    if (updatedFilters.timeframe !== 'all') count++;
    if (updatedFilters.searchQuery.trim() !== '') count++;
    
    setActiveFiltersCount(count);
    
    onFiltersChange?.(updatedFilters);
  };

  const clearAllFilters = () => {
    const clearedFilters: FilterState = {
      rating: null,
      verified: null,
      timeframe: 'all',
      sortBy: 'newest',
      searchQuery: ''
    };
    setFilters(clearedFilters);
    setActiveFiltersCount(0);
    onFiltersChange?.(clearedFilters);
  };

  const ratingOptions = [
    { value: 5, label: '5 Stars', count: Math.round(totalReviews * 0.45) },
    { value: 4, label: '4 Stars', count: Math.round(totalReviews * 0.30) },
    { value: 3, label: '3 Stars', count: Math.round(totalReviews * 0.15) },
    { value: 2, label: '2 Stars', count: Math.round(totalReviews * 0.07) },
    { value: 1, label: '1 Star', count: Math.round(totalReviews * 0.03) },
  ];

  const timeframeOptions = [
    { value: 'all', label: 'All Time' },
    { value: '30days', label: 'Last 30 Days' },
    { value: '3months', label: 'Last 3 Months' },
    { value: '6months', label: 'Last 6 Months' },
    { value: '1year', label: 'Last Year' },
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'highest', label: 'Highest Rated' },
    { value: 'lowest', label: 'Lowest Rated' },
    { value: 'helpful', label: 'Most Helpful' },
    { value: 'detailed', label: 'Most Detailed' },
  ];

  return (
    <Card className={cn('bg-white', className)}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span>Filter & Sort Reviews</span>
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="text-xs">
                {activeFiltersCount} active
              </Badge>
            )}
          </div>
          {activeFiltersCount > 0 && (
            <Button variant="outline" size="sm" onClick={clearAllFilters}>
              Clear All
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Search Bar */}
        <div>
          <label htmlFor="review-search" className="block text-sm font-medium text-gray-700 mb-2">
            Search Reviews
          </label>
          <div className="relative">
            <Input
              id="review-search"
              type="text"
              placeholder="Search for specific topics, features, or issues..."
              value={filters.searchQuery}
              onChange={(e) => updateFilters({ searchQuery: e.target.value })}
              className="pl-10"
            />
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Rating Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Filter by Rating
          </label>
          <div className="space-y-2">
            <Button
              variant={filters.rating === null ? 'default' : 'outline'}
              size="sm"
              onClick={() => updateFilters({ rating: null })}
              className="w-full justify-between"
            >
              <span>All Ratings</span>
              <span className="text-xs text-gray-500">
                ({totalReviews.toLocaleString()})
              </span>
            </Button>
            
            {ratingOptions.map((option) => (
              <Button
                key={option.value}
                variant={filters.rating === option.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => updateFilters({ rating: option.value })}
                className="w-full justify-between"
              >
                <div className="flex items-center gap-2">
                  <StarRating rating={option.value} size="sm" />
                  <span>& up</span>
                </div>
                <span className="text-xs text-gray-500">
                  ({option.count.toLocaleString()})
                </span>
              </Button>
            ))}
          </div>
        </div>

        {/* Verification Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Review Type
          </label>
          <div className="space-y-2">
            <Button
              variant={filters.verified === null ? 'default' : 'outline'}
              size="sm"
              onClick={() => updateFilters({ verified: null })}
              className="w-full justify-between"
            >
              <span>All Reviews</span>
              <span className="text-xs text-gray-500">
                ({totalReviews.toLocaleString()})
              </span>
            </Button>
            
            <Button
              variant={filters.verified === true ? 'default' : 'outline'}
              size="sm"
              onClick={() => updateFilters({ verified: true })}
              className="w-full justify-between"
            >
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Verified Purchases Only</span>
              </div>
              <span className="text-xs text-gray-500">
                ({Math.round(totalReviews * 0.78).toLocaleString()})
              </span>
            </Button>

            <Button
              variant={filters.verified === false ? 'default' : 'outline'}
              size="sm"
              onClick={() => updateFilters({ verified: false })}
              className="w-full justify-between"
            >
              <span>Unverified Reviews</span>
              <span className="text-xs text-gray-500">
                ({Math.round(totalReviews * 0.22).toLocaleString()})
              </span>
            </Button>
          </div>
        </div>

        {/* Timeframe Filter */}
        <div>
          <label htmlFor="timeframe-select" className="block text-sm font-medium text-gray-700 mb-2">
            Time Period
          </label>
          <Select
            value={filters.timeframe}
            onValueChange={(value) => updateFilters({ timeframe: value })}
          >
            <SelectTrigger id="timeframe-select">
              <SelectValue placeholder="Select time period" />
            </SelectTrigger>
            <SelectContent>
              {timeframeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Sort Options */}
        <div>
          <label htmlFor="sort-select" className="block text-sm font-medium text-gray-700 mb-2">
            Sort By
          </label>
          <Select
            value={filters.sortBy}
            onValueChange={(value) => updateFilters({ sortBy: value })}
          >
            <SelectTrigger id="sort-select">
              <SelectValue placeholder="Select sorting option" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Quick Filter Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Quick Filters
          </label>
          <div className="flex flex-wrap gap-2">
            {[
              'Display Quality',
              'Audio Quality',
              'Comfort',
              'Build Quality',
              'Value for Money',
              'Battery Life',
              'Compatibility',
              'Setup Process'
            ].map((tag) => (
              <Button
                key={tag}
                variant="outline"
                size="sm"
                className="text-xs h-7"
                onClick={() => updateFilters({ searchQuery: tag.toLowerCase() })}
              >
                {tag}
              </Button>
            ))}
          </div>
        </div>

        {/* Applied Filters Summary */}
        {activeFiltersCount > 0 && (
          <div className="border-t pt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Active Filters:</h4>
            <div className="flex flex-wrap gap-2">
              {filters.rating !== null && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <StarRating rating={filters.rating} size="sm" />
                  <span>& up</span>
                  <button
                    onClick={() => updateFilters({ rating: null })}
                    className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </Badge>
              )}
              
              {filters.verified !== null && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  {filters.verified ? 'Verified' : 'Unverified'}
                  <button
                    onClick={() => updateFilters({ verified: null })}
                    className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </Badge>
              )}
              
              {filters.timeframe !== 'all' && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  {timeframeOptions.find(opt => opt.value === filters.timeframe)?.label}
                  <button
                    onClick={() => updateFilters({ timeframe: 'all' })}
                    className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </Badge>
              )}
              
              {filters.searchQuery.trim() !== '' && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Search: "{filters.searchQuery.slice(0, 20)}{filters.searchQuery.length > 20 ? '...' : ''}"
                  <button
                    onClick={() => updateFilters({ searchQuery: '' })}
                    className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ReviewFilters;