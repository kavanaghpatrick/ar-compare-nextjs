'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { ComparisonState, ComparisonItem } from '@/types';

const MAX_COMPARISON_ITEMS = 4;

interface ComparisonContextType {
  comparison: ComparisonState;
  addItem: (productId: string) => void;
  removeItem: (productId: string) => void;
  clearComparison: () => void;
  isInComparison: (productId: string) => boolean;
}

const ComparisonContext = createContext<ComparisonContextType | undefined>(undefined);

export function ComparisonProvider({ children }: { children: React.ReactNode }) {
  const [comparison, setComparison] = useState<ComparisonState>({
    items: [],
    maxItems: MAX_COMPARISON_ITEMS,
  });

  // Load comparison from localStorage on mount
  useEffect(() => {
    // Only access localStorage on client side
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ar-compare-comparison');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setComparison(parsed);
        } catch (error) {
          console.error('Failed to load comparison from localStorage:', error);
        }
      }
    }
  }, []);

  // Save to localStorage whenever comparison changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('ar-compare-comparison', JSON.stringify(comparison));
    }
  }, [comparison]);

  const addItem = useCallback((productId: string) => {
    setComparison((prev) => {
      if (prev.items.length >= prev.maxItems) {
        return prev;
      }
      
      if (prev.items.some(item => item.productId === productId)) {
        return prev;
      }

      return {
        ...prev,
        items: [...prev.items, { productId, position: prev.items.length }],
      };
    });
  }, []);

  const removeItem = useCallback((productId: string) => {
    setComparison((prev) => ({
      ...prev,
      items: prev.items
        .filter(item => item.productId !== productId)
        .map((item, index) => ({ ...item, position: index })),
    }));
  }, []);

  const clearComparison = useCallback(() => {
    setComparison((prev) => ({
      ...prev,
      items: [],
    }));
  }, []);

  const isInComparison = useCallback((productId: string) => {
    return comparison.items.some(item => item.productId === productId);
  }, [comparison.items]);

  return (
    <ComparisonContext.Provider value={{
      comparison,
      addItem,
      removeItem,
      clearComparison,
      isInComparison,
    }}>
      {children}
    </ComparisonContext.Provider>
  );
}

export function useComparison() {
  const context = useContext(ComparisonContext);
  if (context === undefined) {
    throw new Error('useComparison must be used within a ComparisonProvider');
  }
  return context;
}