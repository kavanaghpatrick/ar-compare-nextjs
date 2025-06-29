import { NextRequest, NextResponse } from 'next/server';

const CSRF_TOKEN_HEADER = 'x-csrf-token';
const CSRF_TOKEN_COOKIE = 'csrf-token';
const CSRF_SECRET_LENGTH = 32;

// Generate a secure CSRF token using Web Crypto API (Edge Runtime compatible)
export function generateCSRFToken(): string {
  const array = new Uint8Array(CSRF_SECRET_LENGTH);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

// Verify CSRF token for protected methods
export function verifyCSRFToken(request: NextRequest): boolean {
  // Skip CSRF check for safe methods
  const method = request.method.toUpperCase();
  if (['GET', 'HEAD', 'OPTIONS'].includes(method)) {
    return true;
  }

  // Get token from cookie
  const cookieToken = request.cookies.get(CSRF_TOKEN_COOKIE)?.value;
  if (!cookieToken) {
    return false;
  }

  // Get token from header
  const headerToken = request.headers.get(CSRF_TOKEN_HEADER);
  if (!headerToken) {
    return false;
  }

  // Verify tokens match
  return cookieToken === headerToken;
}

// Middleware to handle CSRF protection
export function csrfMiddleware(request: NextRequest): NextResponse | null {
  // Generate and set CSRF token for GET requests
  if (request.method === 'GET') {
    const response = NextResponse.next();
    
    // Only set if not already present
    if (!request.cookies.get(CSRF_TOKEN_COOKIE)) {
      const token = generateCSRFToken();
      response.cookies.set(CSRF_TOKEN_COOKIE, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: 86400 // 24 hours
      });
    }
    
    return response;
  }

  // Verify CSRF token for state-changing methods
  if (!verifyCSRFToken(request)) {
    return NextResponse.json(
      { error: 'Invalid or missing CSRF token' },
      { status: 403 }
    );
  }

  return null;
}

// Helper to get CSRF token from request cookies
export function getCSRFToken(request: NextRequest): string | undefined {
  return request.cookies.get(CSRF_TOKEN_COOKIE)?.value;
}