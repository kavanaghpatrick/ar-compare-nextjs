'use client';

import { useEffect, useMemo } from 'react';
import { EnhancedProduct } from '@/types';

// Type declarations for Performance API - commented out as no longer needed
// interface PerformanceEventTiming extends PerformanceEntry {
//   processingStart: number;
//   startTime: number;
// }

// interface LayoutShift extends PerformanceEntry {
//   hadRecentInput: boolean;
//   value: number;
// }

// Extend window to include gtag
// Global declarations moved to Analytics.tsx

interface PerformanceOptimizationProps {
  product?: EnhancedProduct;
  products?: EnhancedProduct[];
  pageType: 'home' | 'product' | 'category' | 'comparison';
  enableLazyLoading?: boolean;
  enableCriticalCSS?: boolean;
  enableResourceHints?: boolean;
  disableInDev?: boolean; // New flag to disable in development
}

export function PerformanceOptimization({
  product,
  products = [],
  pageType,
  enableLazyLoading = true,
  enableCriticalCSS = true,
  enableResourceHints = true,
  disableInDev = true
}: PerformanceOptimizationProps) {
  // Check if we're in development mode
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  // Early return if disabled in development
  if (isDevelopment && disableInDev) {
    return null;
  }

  // Critical CSS injection for above-the-fold content
  const criticalCSS = useMemo(() => {
    if (!enableCriticalCSS) return '';

    const baseCriticalCSS = `
      /* Critical styles for immediate render */
      .app-container { max-width: 1200px; margin: 0 auto; padding: 0 1rem; }
      .product-hero { display: flex; gap: 2rem; margin-bottom: 2rem; }
      .product-image-section { flex-shrink: 0; }
      .product-hero-image { width: 300px; height: 200px; object-fit: cover; border-radius: 8px; }
      .product-title { font-size: 2rem; font-weight: bold; margin-bottom: 1rem; }
      .product-pricing { display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem; }
      .current-price { font-size: 1.5rem; font-weight: bold; color: #059669; }
      .rating-stars { display: flex; gap: 0.25rem; }
      .loading-skeleton { background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%); background-size: 200% 100%; animation: loading 1.5s infinite; }
      @keyframes loading { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
    `;

    const pageSpecificCSS = {
      home: `
        .product-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem; }
        .product-card { border: 1px solid #e5e7eb; border-radius: 8px; padding: 1rem; }
      `,
      product: `
        .product-tabs { border-bottom: 1px solid #e5e7eb; margin-bottom: 2rem; }
        .tab-button { padding: 0.75rem 1rem; border: none; background: none; cursor: pointer; }
        .tab-button.active { border-bottom: 2px solid #3b82f6; }
      `,
      category: `
        .filter-bar { display: flex; gap: 1rem; margin-bottom: 2rem; padding: 1rem; background: #f9fafb; border-radius: 8px; }
        .sort-controls { display: flex; gap: 0.5rem; align-items: center; }
      `,
      comparison: `
        .comparison-table { width: 100%; border-collapse: collapse; }
        .comparison-table th, .comparison-table td { padding: 0.75rem; border: 1px solid #e5e7eb; text-align: left; }
      `
    };

    return baseCriticalCSS + (pageSpecificCSS[pageType] || '');
  }, [pageType, enableCriticalCSS]);

  // SIMPLIFIED: Resource hints - only critical preconnections
  const resourceHints = useMemo(() => {
    if (!enableResourceHints) return [];

    const hints: Array<{
      rel: string;
      href: string;
      as?: string;
      type?: string;
      crossOrigin?: 'anonymous' | 'use-credentials';
    }> = [
      // Only critical preconnections
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' as const },
    ];

    // REMOVED: Heavy page-specific preloads and DNS prefetching
    // These can be lazy-loaded when actually needed

    return hints;
  }, [enableResourceHints]);

  // COMMENTED OUT: Lazy loading intersection observer setup
  // Heavy operations moved to lazy-loaded utilities
  // useEffect(() => {
  //   if (!enableLazyLoading || typeof window === 'undefined') return;

  //   const imageObserver = new IntersectionObserver(
  //     (entries) => {
  //       entries.forEach(entry => {
  //         if (entry.isIntersecting) {
  //           const img = entry.target as HTMLImageElement;
  //           const dataSrc = img.getAttribute('data-src');
  //           if (dataSrc) {
  //             img.src = dataSrc;
  //             img.removeAttribute('data-src');
  //             img.classList.remove('lazy-loading');
  //             img.classList.add('lazy-loaded');
  //             imageObserver.unobserve(img);
  //           }
  //         }
  //       });
  //     },
  //     {
  //       rootMargin: '50px 0px', // Start loading 50px before entering viewport
  //       threshold: 0.1
  //     }
  //   );

  //   // Observe all lazy images
  //   const lazyImages = document.querySelectorAll('img[data-src]');
  //   lazyImages.forEach(img => imageObserver.observe(img));

  //   // Component/section lazy loading
  //   const componentObserver = new IntersectionObserver(
  //     (entries) => {
  //       entries.forEach(entry => {
  //         if (entry.isIntersecting) {
  //           const element = entry.target as HTMLElement;
  //           element.classList.add('component-loaded');
  //           element.classList.remove('component-loading');
  //           componentObserver.unobserve(element);
  //         }
  //       });
  //     },
  //     {
  //       rootMargin: '100px 0px',
  //       threshold: 0.1
  //     }
  //   );

  //   // Observe lazy components
  //   const lazyComponents = document.querySelectorAll('[data-lazy-component]');
  //   lazyComponents.forEach(component => componentObserver.observe(component));

  //   return () => {
  //     imageObserver.disconnect();
  //     componentObserver.disconnect();
  //   };
  // }, [enableLazyLoading]);

  // SIMPLIFIED: Prefetch logic moved to lazy-loaded module
  // Only critical prefetching remains
  // useEffect(() => {
  //   if (typeof window === 'undefined') return;
  //   // Prefetching logic can be lazy-loaded when needed
  // }, [pageType, product, products]);

  // REMOVED: Performance monitoring and reporting
  // This heavy monitoring code has been removed to reduce initialization overhead
  // Can be lazy-loaded separately if needed for production monitoring

  // Lazy load heavy operations on demand
  useEffect(() => {
    // Only load heavy operations if not in development or if explicitly enabled
    if (isDevelopment && disableInDev) return;

    // Track cleanup functions
    const cleanupFunctions: Array<() => void> = [];

    // Lazy load performance utilities after initial render
    const loadPerformanceUtilities = async () => {
      try {
        const utilities = await import('./PerformanceOptimization.lazy');
        
        if (enableLazyLoading) {
          const cleanup = utilities.initializeLazyImageLoading();
          if (cleanup) cleanupFunctions.push(cleanup);
        }
        
        // Only initialize heavy operations in production
        if (!isDevelopment) {
          // Delay prefetching to avoid initial load impact
          setTimeout(() => {
            const cleanup = utilities.initializePrefetching(pageType, product, products);
            if (cleanup) cleanupFunctions.push(cleanup);
          }, 3000);
          
          // Delay performance monitoring even more
          setTimeout(() => {
            utilities.initializePerformanceMonitoring();
          }, 5000);
          
          // Advanced resource hints after everything else
          setTimeout(() => {
            const cleanup = utilities.initializeAdvancedResourceHints(pageType, product, products);
            if (cleanup) cleanupFunctions.push(cleanup);
          }, 2000);
        }
      } catch (error) {
        console.warn('Failed to load performance utilities:', error);
      }
    };

    // Use requestIdleCallback if available, otherwise setTimeout
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(() => loadPerformanceUtilities());
    } else {
      setTimeout(loadPerformanceUtilities, 1000);
    }

    // Return cleanup function
    return () => {
      cleanupFunctions.forEach(cleanup => {
        try {
          cleanup();
        } catch (error) {
          // Ignore cleanup errors
        }
      });
    };
  }, [isDevelopment, disableInDev, enableLazyLoading, pageType, product, products]);

  return (
    <>
      {/* Critical CSS injection - always keep this for fast initial render */}
      {enableCriticalCSS && criticalCSS && (
        <style
          dangerouslySetInnerHTML={{
            __html: criticalCSS
          }}
        />
      )}

      {/* Minimal resource hints - only critical ones */}
      {resourceHints.map((hint, index) => (
        <link key={`resource-hint-${index}`} {...hint} />
      ))}

      {/* REMOVED: Cache optimization headers - can interfere with development */}
      
      {/* Minimal lazy loading CSS - keep for visual smoothness */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .lazy-loading {
              filter: blur(5px);
              transition: filter 0.3s;
            }
            .lazy-loaded {
              filter: none;
            }
            .component-loading {
              opacity: 0;
              transform: translateY(20px);
              transition: opacity 0.3s ease, transform 0.3s ease;
            }
            .component-loaded {
              opacity: 1;
              transform: translateY(0);
            }
          `
        }}
      />
    </>
  );
}

// Simplified utility function for lazy loading images
// Now uses native browser lazy loading instead of intersection observer
export const LazyImage = ({ 
  src, 
  alt, 
  className = '', 
  width, 
  height,
  priority = false 
}: {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
}) => {
  // Use native lazy loading - much simpler and performant
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      width={width}
      height={height}
      loading={priority ? "eager" : "lazy"}
    />
  );
};

// Simplified utility component for lazy loading sections
// Removed intersection observer dependency
export const LazySection = ({ 
  children, 
  className = ''
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  // Simple div wrapper - intersection observer can be added via lazy module if needed
  return (
    <div className={className}>
      {children}
    </div>
  );
};