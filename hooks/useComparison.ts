'use client';

import { useState, useCallback } from 'react';
import { ComparisonState, ComparisonItem } from '@/types';

const MAX_COMPARISON_ITEMS = 4;

export function useComparison() {
  const [comparison, setComparison] = useState<ComparisonState>({
    items: [],
    maxItems: MAX_COMPARISON_ITEMS,
  });

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

  return {
    comparison,
    addItem,
    removeItem,
    clearComparison,
  };
}