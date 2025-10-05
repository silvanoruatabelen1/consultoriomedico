import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Protect staff routes
  if (request.nextUrl.pathname.startsWith('/staff')) {
    // In a real implementation, you would check for authentication
    // For now, we'll allow access (implement proper auth later)
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/staff/:path*'
  ]
}
