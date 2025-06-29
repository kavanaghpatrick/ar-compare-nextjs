'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

export function CanonicalURL() {
  const pathname = usePathname();
  const canonicalRef = useRef<HTMLLinkElement | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const siteUrl = process.env.NODE_ENV === 'production' 
      ? 'https://arcompare.com' 
      : 'http://localhost:3000';

    try {
      // Clean up existing canonical link if we created it
      if (canonicalRef.current && canonicalRef.current.parentNode) {
        canonicalRef.current.parentNode.removeChild(canonicalRef.current);
        canonicalRef.current = null;
      }

      // Remove any other existing canonical links (but be careful)
      const existingCanonicals = document.querySelectorAll('link[rel="canonical"]');
      existingCanonicals.forEach(link => {
        try {
          if (link.parentNode) {
            link.parentNode.removeChild(link);
          }
        } catch (error) {
          // Ignore removal errors
        }
      });

      // Add new canonical link
      const canonical = document.createElement('link');
      canonical.rel = 'canonical';
      canonical.href = `${siteUrl}${pathname}`;
      document.head.appendChild(canonical);
      canonicalRef.current = canonical;
    } catch (error) {
      console.error('Failed to update canonical URL:', error);
    }

    return () => {
      // Safe cleanup on unmount
      try {
        if (canonicalRef.current && canonicalRef.current.parentNode) {
          canonicalRef.current.parentNode.removeChild(canonicalRef.current);
        }
      } catch (error) {
        // Ignore cleanup errors during React unmount
      }
      canonicalRef.current = null;
    };
  }, [pathname]);

  return null;
}