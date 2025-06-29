import { Product } from '@/types';

// Memoized product filtering function
export const createProductFilter = () => {
  const cache = new Map<string, Product[]>();
  
  return (
    products: Product[],
    searchTerm: string,
    category: string
  ): Product[] => {
    const cacheKey = `${searchTerm}-${category}`;
    
    if (cache.has(cacheKey)) {
      return cache.get(cacheKey)!;
    }
    
    let filtered = products;
    
    // Apply category filter
    if (category && category !== 'all') {
      filtered = filtered.filter(product => product.category === category);
    }
    
    // Apply search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(product => 
        product.fullName.toLowerCase().includes(search) ||
        product.brand.toLowerCase().includes(search) ||
        product.description.toLowerCase().includes(search) ||
        product.keyFeatures.some(feature => feature.toLowerCase().includes(search))
      );
    }
    
    cache.set(cacheKey, filtered);
    
    // Clear cache if it gets too large
    if (cache.size > 100) {
      const firstKey = cache.keys().next().value;
      if (firstKey !== undefined) {
        cache.delete(firstKey);
      }
    }
    
    return filtered;
  };
};

// Debounce utility for search inputs
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    
    timeout = setTimeout(later, wait);
  };
}

// Throttle utility for scroll events
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(null, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Virtual scrolling helper
export function calculateVisibleItems<T>(
  items: T[],
  containerHeight: number,
  itemHeight: number,
  scrollTop: number,
  overscan: number = 3
): {
  visibleItems: T[];
  startIndex: number;
  endIndex: number;
  totalHeight: number;
} {
  const totalHeight = items.length * itemHeight;
  const visibleCount = Math.ceil(containerHeight / itemHeight);
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    items.length - 1,
    startIndex + visibleCount + overscan * 2
  );
  
  return {
    visibleItems: items.slice(startIndex, endIndex + 1),
    startIndex,
    endIndex,
    totalHeight
  };
}

// Request idle callback wrapper
export function scheduleIdleTask(callback: () => void): void {
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(callback);
  } else {
    setTimeout(callback, 0);
  }
}

// Batch DOM updates
export function batchUpdates(updates: (() => void)[]): void {
  requestAnimationFrame(() => {
    updates.forEach(update => update());
  });
}

// Memoized category counter
export const createCategoryCounter = () => {
  const cache = new Map<string, Map<string, number>>();
  
  return (products: Product[]): Map<string, number> => {
    const cacheKey = products.map(p => p.id).join(',');
    
    if (cache.has(cacheKey)) {
      return cache.get(cacheKey)!;
    }
    
    const categoryCount = new Map<string, number>();
    
    products.forEach(product => {
      const count = categoryCount.get(product.category) || 0;
      categoryCount.set(product.category, count + 1);
    });
    
    cache.set(cacheKey, categoryCount);
    
    // Clear cache if it gets too large
    if (cache.size > 50) {
      const firstKey = cache.keys().next().value;
      if (firstKey !== undefined) {
        cache.delete(firstKey);
      }
    }
    
    return categoryCount;
  };
};

// Intersection Observer factory for lazy loading
export function createLazyLoadObserver(
  onIntersect: (element: Element) => void,
  options?: IntersectionObserverInit
): IntersectionObserver {
  return new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        onIntersect(entry.target);
      }
    });
  }, {
    rootMargin: '50px',
    threshold: 0.01,
    ...options
  });
}