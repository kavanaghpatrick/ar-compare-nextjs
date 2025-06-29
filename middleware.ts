import { NextRequest, NextResponse } from 'next/server';
import { csrfMiddleware } from '@/lib/csrf';

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  
  // Redirect old search URLs to new routes
  if (pathname === '/search') {
    const type = searchParams.get('type');
    if (type === 'news') {
      return NextResponse.redirect(new URL('/news', request.url));
    }
    if (type === 'reviews') {
      return NextResponse.redirect(new URL('/reviews', request.url));
    }
  }
  
  // Apply CSRF protection to API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const csrfResponse = csrfMiddleware(request);
    if (csrfResponse) {
      return csrfResponse;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};