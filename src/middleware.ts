import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const protectedRoutes = ['/jobs', '/resumes', '/applications', '/settings', '/admin', '/consent'];
const authRoutes = ['/login', '/signup'];

export function middleware(request: NextRequest) {
  const token = request.cookies.get('firebaseIdToken');
  const { pathname } = request.nextUrl;

  if (!token && protectedRoutes.some(p => pathname.startsWith(p))) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (token && authRoutes.some(p => pathname.startsWith(p))) {
    return NextResponse.redirect(new URL('/jobs', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
