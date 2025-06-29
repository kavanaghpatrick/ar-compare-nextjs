import { useEffect, useState } from 'react';

export function useCSRFToken() {
  const [csrfToken, setCSRFToken] = useState<string | null>(null);

  useEffect(() => {
    // Get CSRF token from cookies
    const getCookie = (name: string): string | null => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) {
        return parts.pop()?.split(';').shift() || null;
      }
      return null;
    };

    const token = getCookie('csrf-token');
    setCSRFToken(token);
  }, []);

  // Helper function to add CSRF token to fetch requests
  const fetchWithCSRF = async (url: string, options: RequestInit = {}) => {
    const headers = new Headers(options.headers);
    
    if (csrfToken) {
      headers.set('x-csrf-token', csrfToken);
    }

    return fetch(url, {
      ...options,
      headers,
    });
  };

  return { csrfToken, fetchWithCSRF };
}