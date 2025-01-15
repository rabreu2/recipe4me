import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname
  
    // Public paths
    const isPublicPath = path === '/signup' || path === '/verifyemail' || path === '/login' || path === '/'
  
    const token = request.cookies.get('token')?.value;
  
  
  // If trying to access a protected path without a token, redirect to the login page
    if (!isPublicPath && !token) {
      return NextResponse.redirect(new URL('/login', request.nextUrl))
    }
      
  }
  
  // It specifies the paths for which this middleware should be executed. 
  // In this case, it's applied to '/', '/savedrecipes', '/login', and '/signup'.
  export const config = {
    matcher: ['/savedrecipes', '/:path*/savedrecipes'],
  }