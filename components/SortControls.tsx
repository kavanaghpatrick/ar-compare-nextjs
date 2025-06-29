'use client';

import { SortAsc, SortDesc } from 'lucide-react';
import { SortOption, SortOrder } from '@/types';

interface SortControlsProps {
  sortBy: SortOption;
  sortOrder: SortOrder;
  onSortByChange: (sortBy: SortOption) => void;
  onSortOrderChange: (sortOrder: SortOrder) => void;
  className?: string;
}

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'price', label: 'Sort by Price' },
  { value: 'rating', label: 'Sort by Rating' },
  { value: 'brand', label: 'Sort by Brand' },
  { value: 'fov', label: 'Sort by Field of View' },
  { value: 'weight', label: 'Sort by Weight' },
];

export function SortControls({
  sortBy,
  sortOrder,
  onSortByChange,
  onSortOrderChange,
  className = ""
}: SortControlsProps) {
  const toggleSortOrder = () => {
    onSortOrderChange(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  return (
    <div className={`sort-controls ${className}`}>
      <select
        value={sortBy}
        onChange={(e) => onSortByChange(e.target.value as SortOption)}
        className="sort-select"
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <button
        onClick={toggleSortOrder}
        className="sort-order-btn"
        title={`Sort ${sortOrder === 'asc' ? 'descending' : 'ascending'}`}
      >
        {sortOrder === 'asc' ? <SortAsc size={16} /> : <SortDesc size={16} />}
      </button>
    </div>
  );
}