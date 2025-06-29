'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

export function CanonicalURL() {
  const pathname = usePathname();

  useEffect(() => {
    const siteUrl = process.env.NODE_ENV === 'production' 
      ? 'https://ar-compare.com' 
      : 'http://localhost:3000';

    // Remove any existing canonical link
    const existingCanonical = document.querySelector('link[rel="canonical"]');
    if (existingCanonical) {
      existingCanonical.remove();
    }

    // Add new canonical link
    const canonical = document.createElement('link');
    canonical.rel = 'canonical';
    canonical.href = `${siteUrl}${pathname}`;
    document.head.appendChild(canonical);

    return () => {
      // Cleanup on unmount
      const linkToRemove = document.querySelector('link[rel="canonical"]');
      if (linkToRemove) {
        linkToRemove.remove();
      }
    };
  }, [pathname]);

  return null;
}