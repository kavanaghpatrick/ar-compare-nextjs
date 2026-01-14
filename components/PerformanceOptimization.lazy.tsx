'use client';

import { EnhancedProduct } from '@/types';

// Type declarations for Performance API
interface PerformanceEventTiming extends PerformanceEntry {
  processingStart: number;
  startTime: number;
}

interface LayoutShift extends PerformanceEntry {
  hadRecentInput: boolean;
  value: number;
}

declare global {
  interface Window {
    gtag?: (command: string, targetId: string, config?: Record<string, unknown>) => void;
  }
}

// Lazy-loaded image observer setup
export function initializeLazyImageLoading() {
  if (typeof window === 'undefined') return;

  const imageObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          const dataSrc = img.getAttribute('data-src');
          if (dataSrc) {
            img.src = dataSrc;
            img.removeAttribute('data-src');
            img.classList.remove('lazy-loading');
            img.classList.add('lazy-loaded');
            imageObserver.unobserve(img);
          }
        }
      });
    },
    {
      rootMargin: '50px 0px',
      threshold: 0.1
    }
  );

  // Observe all lazy images
  const lazyImages = document.querySelectorAll('img[data-src]');
  lazyImages.forEach(img => imageObserver.observe(img));

  // Component/section lazy loading
  const componentObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target as HTMLElement;
          element.classList.add('component-loaded');
          element.classList.remove('component-loading');
          componentObserver.unobserve(element);
        }
      });
    },
    {
      rootMargin: '100px 0px',
      threshold: 0.1
    }
  );

  // Observe lazy components
  const lazyComponents = document.querySelectorAll('[data-lazy-component]');
  lazyComponents.forEach(component => componentObserver.observe(component));

  return () => {
    imageObserver.disconnect();
    componentObserver.disconnect();
  };
}

// Prefetch next likely pages
export function initializePrefetching(
  pageType: 'home' | 'product' | 'category' | 'comparison',
  product?: EnhancedProduct,
  products: EnhancedProduct[] = []
) {
  if (typeof window === 'undefined') return;

  const prefetchUrls: string[] = [];

  // Page-specific prefetching strategy
  switch (pageType) {
    case 'home':
      // Prefetch top-rated products
      const topProducts = products
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 3);
      topProducts.forEach(prod => {
        prefetchUrls.push(`/products/${prod.id}`);
      });
      prefetchUrls.push('/compare');
      break;

    case 'product':
      if (product) {
        // Prefetch similar products
        const similarProducts = products
          .filter(p => p.id !== product.id && p.brand === product.brand)
          .slice(0, 2);
        similarProducts.forEach(prod => {
          prefetchUrls.push(`/products/${prod.id}`);
        });
        
        // Prefetch comparison page
        prefetchUrls.push('/compare');
        
        // Prefetch brand page
        prefetchUrls.push(`/brand/${product.brand.toLowerCase().replace(/\s+/g, '-')}`);
      }
      break;

    case 'category':
      // Prefetch individual products in category
      products.slice(0, 5).forEach(prod => {
        prefetchUrls.push(`/products/${prod.id}`);
      });
      break;

    case 'comparison':
      // Prefetch individual product pages from comparison
      products.forEach(prod => {
        prefetchUrls.push(`/products/${prod.id}`);
      });
      break;
  }

  // Implement prefetching with requestIdleCallback - with proper cleanup
  const prefetchedLinks: HTMLLinkElement[] = [];
  
  const prefetchLinks = () => {
    prefetchUrls.forEach(url => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = url;
      link.as = 'document';
      prefetchedLinks.push(link);
      document.head.appendChild(link);
    });
  };

  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(prefetchLinks);
  } else {
    setTimeout(prefetchLinks, 2000);
  }
  
  // Return cleanup function
  return () => {
    prefetchedLinks.forEach(link => {
      if (link.parentNode) {
        link.parentNode.removeChild(link);
      }
    });
  };
}

// Performance monitoring and reporting
export function initializePerformanceMonitoring() {
  if (typeof window === 'undefined') return;

  // Track observers for cleanup
  const observers: PerformanceObserver[] = [];
  let loadHandler: (() => void) | null = null;

  // Core Web Vitals monitoring
  const reportWebVitals = () => {
    // LCP (Largest Contentful Paint)
    if ('PerformanceObserver' in window) {
      try {
        const lcpObserver = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          const lastEntry = entries[entries.length - 1];

          // Report to analytics (no console.log in production)
          if (window.gtag) {
            window.gtag('event', 'web_vitals', {
              name: 'LCP',
              value: Math.round(lastEntry.startTime),
              event_category: 'performance'
            });
          }
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        observers.push(lcpObserver);
      } catch {
        // LCP observation not supported
      }

      try {
        // FID (First Input Delay)
        const fidObserver = new PerformanceObserver((entryList) => {
          entryList.getEntries().forEach((entry) => {
            const fidEntry = entry as PerformanceEventTiming;

            if (window.gtag) {
              window.gtag('event', 'web_vitals', {
                name: 'FID',
                value: Math.round(fidEntry.processingStart - fidEntry.startTime),
                event_category: 'performance'
              });
            }
          });
        });
        fidObserver.observe({ entryTypes: ['first-input'] });
        observers.push(fidObserver);
      } catch {
        // FID observation not supported
      }

      try {
        // CLS (Cumulative Layout Shift)
        let clsValue = 0;
        const clsObserver = new PerformanceObserver(function(entryList) {
          for (const entry of entryList.getEntries()) {
            const layoutShiftEntry = entry as LayoutShift;
            if (!layoutShiftEntry.hadRecentInput) {
              clsValue += layoutShiftEntry.value;
            }
          }

          if (window.gtag) {
            window.gtag('event', 'web_vitals', {
              name: 'CLS',
              value: Math.round(clsValue * 1000),
              event_category: 'performance'
            });
          }
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });
        observers.push(clsObserver);
      } catch {
        // CLS observation not supported
      }
    }
  };

  // Report after page load
  if (document.readyState === 'complete') {
    reportWebVitals();
  } else {
    loadHandler = reportWebVitals;
    window.addEventListener('load', loadHandler);
  }

  // Return cleanup function to prevent memory leaks
  return () => {
    // Disconnect all PerformanceObservers
    observers.forEach(observer => {
      try {
        observer.disconnect();
      } catch {
        // Ignore disconnect errors
      }
    });

    // Remove load event listener if it was added
    if (loadHandler) {
      window.removeEventListener('load', loadHandler);
    }
  };
}

// Advanced resource hints
export function initializeAdvancedResourceHints(
  pageType: 'home' | 'product' | 'category' | 'comparison',
  product?: EnhancedProduct,
  products: EnhancedProduct[] = []
) {
  if (typeof window === 'undefined') return;

  // Track all created links for cleanup
  const createdLinks: HTMLLinkElement[] = [];

  // DNS prefetch for likely destinations
  const dnsPrefetchUrls = [
    'https://amazon.com',
    'https://www.google-analytics.com',
    'https://cdnjs.cloudflare.com',
    'https://api.placeholder.com'
  ];

  dnsPrefetchUrls.forEach(url => {
    try {
      const link = document.createElement('link');
      link.rel = 'dns-prefetch';
      link.href = url;
      createdLinks.push(link);
      document.head.appendChild(link);
    } catch {
      // DNS prefetch failed - non-critical
    }
  });

  // Page-specific preloads
  if (pageType === 'product' && product) {
    try {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = product.image;
      link.as = 'image';
      link.type = 'image/jpeg';
      link.crossOrigin = 'anonymous';
      createdLinks.push(link);
      document.head.appendChild(link);
    } catch {
      // Image preload failed - non-critical
    }
  }

  if (pageType === 'home' || pageType === 'category') {
    // Preload first few product images
    products.slice(0, 3).forEach(prod => {
      try {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = prod.image;
        link.as = 'image';
        link.type = 'image/jpeg';
        link.crossOrigin = 'anonymous';
        createdLinks.push(link);
        document.head.appendChild(link);
      } catch {
        // Image preload failed - non-critical
      }
    });
  }

  // Return cleanup function
  return () => {
    createdLinks.forEach(link => {
      try {
        if (link.parentNode) {
          link.parentNode.removeChild(link);
        }
      } catch (error) {
        // Ignore cleanup errors during React unmount
      }
    });
  };
}