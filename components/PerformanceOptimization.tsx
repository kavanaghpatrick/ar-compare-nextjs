'use client';

import { useEffect, useMemo } from 'react';
import { EnhancedProduct } from '@/types';

interface PerformanceOptimizationProps {
  product?: EnhancedProduct;
  products?: EnhancedProduct[];
  pageType: 'home' | 'product' | 'category' | 'comparison';
  enableLazyLoading?: boolean;
  enableCriticalCSS?: boolean;
  enableResourceHints?: boolean;
}

export function PerformanceOptimization({
  product,
  products = [],
  pageType,
  enableLazyLoading = true,
  enableCriticalCSS = true,
  enableResourceHints = true
}: PerformanceOptimizationProps) {

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

  // Resource hints and preload directives
  const resourceHints = useMemo(() => {
    if (!enableResourceHints) return [];

    const hints = [
      // Preconnect to external domains
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
      { rel: 'preconnect', href: 'https://api.placeholder.com' },
      
      // DNS prefetch for likely destinations
      { rel: 'dns-prefetch', href: 'https://amazon.com' },
      { rel: 'dns-prefetch', href: 'https://www.google-analytics.com' },
      { rel: 'dns-prefetch', href: 'https://cdnjs.cloudflare.com' },
      
      // Preload critical fonts
      { 
        rel: 'preload', 
        href: '/fonts/geist-sans-400.woff2', 
        as: 'font', 
        type: 'font/woff2', 
        crossOrigin: 'anonymous' 
      },
      { 
        rel: 'preload', 
        href: '/fonts/geist-sans-700.woff2', 
        as: 'font', 
        type: 'font/woff2', 
        crossOrigin: 'anonymous' 
      }
    ];

    // Page-specific preloads
    if (pageType === 'product' && product) {
      hints.push({
        rel: 'preload',
        href: product.image,
        as: 'image',
        type: 'image/jpeg'
      });
    }

    if (pageType === 'home' || pageType === 'category') {
      // Preload first few product images
      products.slice(0, 3).forEach(prod => {
        hints.push({
          rel: 'preload',
          href: prod.image,
          as: 'image',
          type: 'image/jpeg'
        });
      });
    }

    return hints;
  }, [enableResourceHints, pageType, product, products]);

  // Lazy loading intersection observer setup
  useEffect(() => {
    if (!enableLazyLoading || typeof window === 'undefined') return;

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
        rootMargin: '50px 0px', // Start loading 50px before entering viewport
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
  }, [enableLazyLoading]);

  // Prefetch next likely pages
  useEffect(() => {
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

    // Implement prefetching with requestIdleCallback
    const prefetchLinks = () => {
      prefetchUrls.forEach(url => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = url;
        link.as = 'document';
        document.head.appendChild(link);
      });
    };

    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(prefetchLinks);
    } else {
      setTimeout(prefetchLinks, 2000);
    }
  }, [pageType, product, products]);

  // Performance monitoring and reporting
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Core Web Vitals monitoring
    const reportWebVitals = () => {
      // LCP (Largest Contentful Paint)
      if ('PerformanceObserver' in window) {
        const lcpObserver = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          const lastEntry = entries[entries.length - 1];
          console.log('LCP:', lastEntry.startTime);
          
          // Report to analytics (implementation depends on your analytics setup)
          if (window.gtag) {
            window.gtag('event', 'web_vitals', {
              name: 'LCP',
              value: Math.round(lastEntry.startTime),
              event_category: 'performance'
            });
          }
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

        // FID (First Input Delay) 
        const fidObserver = new PerformanceObserver((entryList) => {
          entryList.getEntries().forEach((entry) => {
            console.log('FID:', entry.processingStart - entry.startTime);
            
            if (window.gtag) {
              window.gtag('event', 'web_vitals', {
                name: 'FID',
                value: Math.round(entry.processingStart - entry.startTime),
                event_category: 'performance'
              });
            }
          });
        });
        fidObserver.observe({ entryTypes: ['first-input'] });

        // CLS (Cumulative Layout Shift)
        let clsValue = 0;
        const clsObserver = new PerformanceObserver(function(entryList) {
          for (const entry of entryList.getEntries()) {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          }
          console.log('CLS:', clsValue);
          
          if (window.gtag) {
            window.gtag('event', 'web_vitals', {
              name: 'CLS', 
              value: Math.round(clsValue * 1000),
              event_category: 'performance'
            });
          }
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });
      }
    };

    // Report after page load
    if (document.readyState === 'complete') {
      reportWebVitals();
    } else {
      window.addEventListener('load', reportWebVitals);
    }
  }, []);

  return (
    <>
      {/* Critical CSS injection */}
      {enableCriticalCSS && criticalCSS && (
        <style
          dangerouslySetInnerHTML={{
            __html: criticalCSS
          }}
        />
      )}

      {/* Resource hints */}
      {resourceHints.map((hint, index) => (
        <link key={`resource-hint-${index}`} {...hint} />
      ))}

      {/* Cache optimization headers via meta tags */}
      <meta httpEquiv="Cache-Control" content="public, max-age=31536000, immutable" />
      <meta httpEquiv="Expires" content={new Date(Date.now() + 31536000 * 1000).toUTCString()} />
      
      {/* Service Worker registration for caching */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', function() {
                navigator.serviceWorker.register('/sw.js').then(function(registration) {
                  console.log('SW registered: ', registration);
                }).catch(function(registrationError) {
                  console.log('SW registration failed: ', registrationError);
                });
              });
            }
          `
        }}
      />

      {/* Image lazy loading CSS */}
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

// Utility function for lazy loading images
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
  if (priority) {
    // Load immediately for critical images
    return (
      <img
        src={src}
        alt={alt}
        className={className}
        width={width}
        height={height}
        loading="eager"
      />
    );
  }

  return (
    <img
      data-src={src}
      alt={alt}
      className={`${className} lazy-loading`}
      width={width}
      height={height}
      loading="lazy"
      // Placeholder while loading
      src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect width='100%25' height='100%25' fill='%23f0f0f0'/%3E%3C/svg%3E"
    />
  );
};

// Utility component for lazy loading sections
export const LazySection = ({ 
  children, 
  className = '',
  threshold = 0.1 
}: {
  children: React.ReactNode;
  className?: string;
  threshold?: number;
}) => {
  return (
    <div 
      className={`${className} component-loading`}
      data-lazy-component
      data-threshold={threshold}
    >
      {children}
    </div>
  );
};

// Global performance optimization utilities
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}