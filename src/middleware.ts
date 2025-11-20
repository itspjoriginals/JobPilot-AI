import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// NOTE: This middleware is NOT currently in use because auth state is managed
// on the client-side in the AuthProvider. If you need server-side protection,
// you would need a way to verify the Firebase token on the server.

export function middleware(request: NextRequest) {
  // This is a placeholder. For real server-side auth, you'd verify a JWT here.
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
