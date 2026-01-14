/**
 * Tests for ComparisonContext and useComparison hook
 */

import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { renderHook } from '@testing-library/react';
import { ComparisonProvider, useComparison } from '@/contexts/ComparisonContext';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Helper wrapper for rendering hooks with provider
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ComparisonProvider>{children}</ComparisonProvider>
);

describe('ComparisonContext', () => {
  beforeEach(() => {
    localStorageMock.clear();
    jest.clearAllMocks();
  });

  describe('useComparison hook', () => {
    it('should throw error when used outside provider', () => {
      // Suppress console.error for this test
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        renderHook(() => useComparison());
      }).toThrow('useComparison must be used within a ComparisonProvider');

      consoleSpy.mockRestore();
    });

    it('should initialize with empty comparison state', () => {
      const { result } = renderHook(() => useComparison(), { wrapper });

      expect(result.current.comparison.items).toEqual([]);
      expect(result.current.comparison.maxItems).toBe(4);
    });

    it('should provide isHydrated flag', async () => {
      const { result } = renderHook(() => useComparison(), { wrapper });

      // After hydration, isHydrated should be true
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      expect(result.current.isHydrated).toBe(true);
    });
  });

  describe('addItem', () => {
    it('should add a product to comparison', async () => {
      const { result } = renderHook(() => useComparison(), { wrapper });

      await act(async () => {
        result.current.addItem('product-1');
      });

      expect(result.current.comparison.items).toHaveLength(1);
      expect(result.current.comparison.items[0].productId).toBe('product-1');
      expect(result.current.comparison.items[0].position).toBe(0);
    });

    it('should add multiple products with correct positions', async () => {
      const { result } = renderHook(() => useComparison(), { wrapper });

      await act(async () => {
        result.current.addItem('product-1');
        result.current.addItem('product-2');
        result.current.addItem('product-3');
      });

      expect(result.current.comparison.items).toHaveLength(3);
      expect(result.current.comparison.items[0].position).toBe(0);
      expect(result.current.comparison.items[1].position).toBe(1);
      expect(result.current.comparison.items[2].position).toBe(2);
    });

    it('should not add duplicate products', async () => {
      const { result } = renderHook(() => useComparison(), { wrapper });

      await act(async () => {
        result.current.addItem('product-1');
        result.current.addItem('product-1');
      });

      expect(result.current.comparison.items).toHaveLength(1);
    });

    it('should not exceed max items (4)', async () => {
      const { result } = renderHook(() => useComparison(), { wrapper });

      await act(async () => {
        result.current.addItem('product-1');
        result.current.addItem('product-2');
        result.current.addItem('product-3');
        result.current.addItem('product-4');
        result.current.addItem('product-5'); // Should not be added
      });

      expect(result.current.comparison.items).toHaveLength(4);
      expect(result.current.comparison.items.some(item => item.productId === 'product-5')).toBe(false);
    });
  });

  describe('removeItem', () => {
    it('should remove a product from comparison', async () => {
      const { result } = renderHook(() => useComparison(), { wrapper });

      await act(async () => {
        result.current.addItem('product-1');
        result.current.addItem('product-2');
      });

      await act(async () => {
        result.current.removeItem('product-1');
      });

      expect(result.current.comparison.items).toHaveLength(1);
      expect(result.current.comparison.items[0].productId).toBe('product-2');
    });

    it('should reindex positions after removal', async () => {
      const { result } = renderHook(() => useComparison(), { wrapper });

      await act(async () => {
        result.current.addItem('product-1');
        result.current.addItem('product-2');
        result.current.addItem('product-3');
      });

      await act(async () => {
        result.current.removeItem('product-2'); // Remove middle item
      });

      expect(result.current.comparison.items).toHaveLength(2);
      expect(result.current.comparison.items[0].position).toBe(0);
      expect(result.current.comparison.items[1].position).toBe(1);
    });

    it('should handle removing non-existent product gracefully', async () => {
      const { result } = renderHook(() => useComparison(), { wrapper });

      await act(async () => {
        result.current.addItem('product-1');
      });

      await act(async () => {
        result.current.removeItem('non-existent');
      });

      expect(result.current.comparison.items).toHaveLength(1);
    });
  });

  describe('clearComparison', () => {
    it('should remove all items from comparison', async () => {
      const { result } = renderHook(() => useComparison(), { wrapper });

      await act(async () => {
        result.current.addItem('product-1');
        result.current.addItem('product-2');
        result.current.addItem('product-3');
      });

      await act(async () => {
        result.current.clearComparison();
      });

      expect(result.current.comparison.items).toHaveLength(0);
    });

    it('should preserve maxItems setting', async () => {
      const { result } = renderHook(() => useComparison(), { wrapper });

      await act(async () => {
        result.current.addItem('product-1');
        result.current.clearComparison();
      });

      expect(result.current.comparison.maxItems).toBe(4);
    });
  });

  describe('isInComparison', () => {
    it('should return true for products in comparison', async () => {
      const { result } = renderHook(() => useComparison(), { wrapper });

      await act(async () => {
        result.current.addItem('product-1');
      });

      expect(result.current.isInComparison('product-1')).toBe(true);
    });

    it('should return false for products not in comparison', async () => {
      const { result } = renderHook(() => useComparison(), { wrapper });

      await act(async () => {
        result.current.addItem('product-1');
      });

      expect(result.current.isInComparison('product-2')).toBe(false);
    });

    it('should update when items change', async () => {
      const { result } = renderHook(() => useComparison(), { wrapper });

      await act(async () => {
        result.current.addItem('product-1');
      });

      expect(result.current.isInComparison('product-1')).toBe(true);

      await act(async () => {
        result.current.removeItem('product-1');
      });

      expect(result.current.isInComparison('product-1')).toBe(false);
    });
  });

  describe('localStorage persistence', () => {
    it('should save to localStorage when items change', async () => {
      const { result } = renderHook(() => useComparison(), { wrapper });

      // Wait for hydration
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      await act(async () => {
        result.current.addItem('product-1');
      });

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'ar-compare-comparison',
        expect.any(String)
      );
    });

    it('should load from localStorage on mount', async () => {
      const savedState = JSON.stringify({
        items: [{ productId: 'saved-product', position: 0 }],
        maxItems: 4,
      });
      localStorageMock.getItem.mockReturnValue(savedState);

      const { result } = renderHook(() => useComparison(), { wrapper });

      // Wait for hydration
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      expect(result.current.comparison.items).toHaveLength(1);
      expect(result.current.comparison.items[0].productId).toBe('saved-product');
    });
  });
});

describe('ComparisonProvider', () => {
  it('should render children', () => {
    render(
      <ComparisonProvider>
        <div data-testid="child">Child content</div>
      </ComparisonProvider>
    );

    expect(screen.getByTestId('child')).toBeInTheDocument();
  });
});
