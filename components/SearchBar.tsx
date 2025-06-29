'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { debounce } from '@/lib/performance-utils';

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  debounceMs?: number;
}

export const SearchBar = React.memo(({ 
  searchTerm, 
  onSearchChange, 
  placeholder = "Search AR glasses...",
  className = "",
  debounceMs = 300
}: SearchBarProps) => {
  const [localValue, setLocalValue] = useState(searchTerm);

  // Create debounced search handler
  const debouncedSearch = useCallback(
    debounce((value: string) => {
      onSearchChange(value);
    }, debounceMs),
    [onSearchChange, debounceMs]
  );

  // Update local value when external searchTerm changes
  useEffect(() => {
    setLocalValue(searchTerm);
  }, [searchTerm]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalValue(value);
    debouncedSearch(value);
  };

  return (
    <div className={className}>
      <input
        type="text"
        placeholder={placeholder}
        value={localValue}
        onChange={handleChange}
        className="search-input"
        aria-label="Search products"
      />
    </div>
  );
});

SearchBar.displayName = 'SearchBar';