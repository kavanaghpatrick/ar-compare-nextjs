'use client';

import React from 'react';
import { Filter } from 'lucide-react';

interface FilterBarProps {
  filterCategory: string;
  onFilterChange: (category: string) => void;
  categories?: string[];
  className?: string;
}

const defaultCategories = [
  'all',
  'Premium',
  'Mid-range', 
  'Budget',
  'Gaming',
  'Professional',
  'Everyday',
  'Developer',
  'Specialized'
];

// Memoized FilterBar component for performance
export const FilterBar = React.memo(({ 
  filterCategory, 
  onFilterChange, 
  categories = defaultCategories,
  className = ""
}: FilterBarProps) => {
  return (
    <div className={`filter-container ${className}`}>
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-white/60" />
        <span className="text-sm font-medium text-white/80">Filter by category:</span>
      </div>
      <div className="flex flex-wrap gap-2 mt-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onFilterChange(category)}
            className={`filter-btn ${
              filterCategory === category ? 'active' : ''
            }`}
          >
            {category === 'all' ? 'All Categories' : category}
          </button>
        ))}
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison function
  return (
    prevProps.filterCategory === nextProps.filterCategory &&
    prevProps.categories === nextProps.categories &&
    prevProps.className === nextProps.className
  );
});

FilterBar.displayName = 'FilterBar';