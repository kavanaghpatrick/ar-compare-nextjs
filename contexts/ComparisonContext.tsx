'use client';

import React, { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react';
import { ComparisonState, ComparisonItem } from '@/types';
import logger from '@/lib/logger';

const MAX_COMPARISON_ITEMS = 4;
const STORAGE_KEY = 'ar-compare-comparison';

interface ComparisonContextType {
  comparison: ComparisonState;
  addItem: (productId: string) => void;
  removeItem: (productId: string) => void;
  clearComparison: () => void;
  isInComparison: (productId: string) => boolean;
  isHydrated: boolean;
}

const ComparisonContext = createContext<ComparisonContextType | undefined>(undefined);

// Helper function to safely get from localStorage
function getStoredComparison(): ComparisonState | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    logger.error('Failed to load comparison from localStorage:', error);
  }
  return null;
}

// Helper function to safely save to localStorage
function saveComparison(comparison: ComparisonState): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(comparison));
  } catch (error) {
    logger.error('Failed to save comparison to localStorage:', error);
  }
}

export function ComparisonProvider({ children }: { children: React.ReactNode }) {
  // Initialize state with default values, load from localStorage after mount
  const [comparison, setComparison] = useState<ComparisonState>({
    items: [],
    maxItems: MAX_COMPARISON_ITEMS,
  });
  const [isHydrated, setIsHydrated] = useState(false);

  // Load from localStorage after component mounts
  useEffect(() => {
    const stored = getStoredComparison();
    if (stored) {
      setComparison(stored);
    }
    setIsHydrated(true);
  }, []);

  // Save to localStorage whenever comparison changes (but only after hydration)
  useEffect(() => {
    if (isHydrated) {
      saveComparison(comparison);
    }
  }, [comparison, isHydrated]);

  const addItem = useCallback((productId: string) => {
    setComparison((prev) => {
      if (prev.items.length >= prev.maxItems) {
        logger.info(`Cannot add item. Maximum comparison items (${prev.maxItems}) reached.`);
        return prev;
      }
      
      if (prev.items.some(item => item.productId === productId)) {
        logger.info(`Product ${productId} is already in comparison.`);
        return prev;
      }

      logger.info(`Adding product ${productId} to comparison.`);
      return {
        ...prev,
        items: [...prev.items, { productId, position: prev.items.length }],
      };
    });
  }, []);

  const removeItem = useCallback((productId: string) => {
    setComparison((prev) => {
      logger.info(`Removing product ${productId} from comparison.`);
      return {
        ...prev,
        items: prev.items
          .filter(item => item.productId !== productId)
          .map((item, index) => ({ ...item, position: index })),
      };
    });
  }, []);

  const clearComparison = useCallback(() => {
    logger.info('Clearing comparison.');
    setComparison((prev) => ({
      ...prev,
      items: [],
    }));
  }, []);

  const isInComparison = useCallback((productId: string) => {
    return comparison.items.some(item => item.productId === productId);
  }, [comparison.items]);

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    comparison,
    addItem,
    removeItem,
    clearComparison,
    isInComparison,
    isHydrated,
  }), [comparison, addItem, removeItem, clearComparison, isInComparison, isHydrated]);

  return (
    <ComparisonContext.Provider value={contextValue}>
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