'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

declare global {
  interface Window {
    gtag?: (command: string, targetId: string, config?: Record<string, unknown>) => void;
    dataLayer?: any[];
  }
}

export function Analytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const scriptsRef = useRef<HTMLScriptElement[]>([]);

  useEffect(() => {
    if (!GA_MEASUREMENT_ID || typeof window === 'undefined') return;

    // Clean up any existing scripts first
    scriptsRef.current.forEach(script => {
      try {
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
      } catch (error) {
        // Ignore cleanup errors
      }
    });
    scriptsRef.current = [];

    // Load Google Analytics script
    const script1 = document.createElement('script');
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    script1.async = true;
    
    const script2 = document.createElement('script');
    script2.textContent = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${GA_MEASUREMENT_ID}', {
        page_title: document.title,
        page_location: window.location.href,
        send_page_view: false
      });
    `;

    try {
      document.head.appendChild(script1);
      document.head.appendChild(script2);
      scriptsRef.current = [script1, script2];
    } catch (error) {
      console.error('Failed to load analytics scripts:', error);
    }

    return () => {
      // Safe cleanup
      scriptsRef.current.forEach(script => {
        try {
          if (script.parentNode) {
            script.parentNode.removeChild(script);
          }
        } catch (error) {
          // Ignore cleanup errors during React unmount
        }
      });
      scriptsRef.current = [];
    };
  }, [GA_MEASUREMENT_ID]);

  useEffect(() => {
    if (!GA_MEASUREMENT_ID || !window.gtag) return;

    const url = pathname + searchParams.toString();
    
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: url,
      page_title: document.title,
      page_location: window.location.href,
    });
  }, [pathname, searchParams, GA_MEASUREMENT_ID]);

  // Don't render anything in development or if GA_MEASUREMENT_ID is not set
  if (process.env.NODE_ENV !== 'production' || !GA_MEASUREMENT_ID) {
    return null;
  }

  return null;
}

// Helper functions for tracking events
export const trackEvent = (eventName: string, parameters?: Record<string, unknown>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, parameters);
  }
};

export const trackProductView = (productId: string, productName: string, price: number) => {
  trackEvent('view_item', {
    item_id: productId,
    item_name: productName,
    value: price,
    currency: 'USD',
  });
};

export const trackProductCompare = (productIds: string[]) => {
  trackEvent('compare_products', {
    item_ids: productIds,
    product_count: productIds.length,
  });
};

export const trackSearch = (searchTerm: string) => {
  trackEvent('search', {
    search_term: searchTerm,
  });
};