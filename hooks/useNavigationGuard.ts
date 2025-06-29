'use client';

import { useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';

export function useNavigationGuard() {
  const router = useRouter();
  const isNavigatingRef = useRef(false);
  const navigationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const guardedPush = useCallback((url: string) => {
    // Prevent rapid navigation
    if (isNavigatingRef.current) {
      console.log('[Navigation Guard] Blocking rapid navigation to:', url);
      return;
    }

    // Set navigation flag
    isNavigatingRef.current = true;

    // Clear any existing timeout
    if (navigationTimeoutRef.current) {
      clearTimeout(navigationTimeoutRef.current);
    }

    // Perform navigation
    router.push(url);

    // Reset flag after a short delay (300ms should be enough for Next.js to start transition)
    navigationTimeoutRef.current = setTimeout(() => {
      isNavigatingRef.current = false;
    }, 300);
  }, [router]);

  const guardedReplace = useCallback((url: string) => {
    if (isNavigatingRef.current) {
      console.log('[Navigation Guard] Blocking rapid replace to:', url);
      return;
    }

    isNavigatingRef.current = true;

    if (navigationTimeoutRef.current) {
      clearTimeout(navigationTimeoutRef.current);
    }

    router.replace(url);

    navigationTimeoutRef.current = setTimeout(() => {
      isNavigatingRef.current = false;
    }, 300);
  }, [router]);

  return {
    push: guardedPush,
    replace: guardedReplace,
    isNavigating: () => isNavigatingRef.current
  };
}