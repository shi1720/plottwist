import { NextResponse } from 'next/server';
/** Baseline response hardening without breaking React hydration or local card export. */
export function middleware() {
  const response = NextResponse.next();
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set(
    'Content-Security-Policy',
    "frame-ancestors 'none'; object-src 'none'; base-uri 'self'",
  );
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=()',
  );
  return response;
}
export const config = {
  matcher: ['/((?!_next/static|favicon.svg|cast-ensemble.webp).*)'],
};
