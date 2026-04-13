import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Define role-based routes
  const adminRoutes = ['/admin']
  const dashboardRoutes = ['/dashboard']

  // Check if accessing admin routes
  const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route))
  // Check if accessing dashboard routes  
  const isDashboardRoute = dashboardRoutes.some(route => pathname.startsWith(route))

  // Skip if on login pages
  if (pathname === '/login' || pathname === '/admin-login' || pathname.startsWith('/api/auth')) {
    return NextResponse.next()
  }

  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })

    if (!token) {
      // Not logged in - redirect based on route
      if (isDashboardRoute) {
        return NextResponse.redirect(new URL('/login', request.url))
      }
      if (isAdminRoute) {
        return NextResponse.redirect(new URL('/admin-login', request.url))
      }
      return NextResponse.next()
    }

    // Check if session was invalidated
    if (token.role === 'invalidated') {
      // Clear the cookie and redirect to login
      const response = NextResponse.redirect(new URL('/login', request.url))
      response.cookies.set('next-auth.token', '', { expires: new Date(0) })
      response.cookies.set('next-auth.session-token', '', { expires: new Date(0) })
      return response
    }

    // Role-based access control
    // Editor/Manager/Admin can access admin routes
    const userRole = (token.role as string) || 'user'
    if (isAdminRoute && !['admin', 'editor', 'manager'].includes(userRole)) {
      // Non-admin/editor/manager trying to access admin - redirect to dashboard
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    // If user tries to access login page but is already logged in with proper role, redirect to appropriate page
    if (pathname === '/login') {
      if (['admin', 'editor', 'manager'].includes(userRole)) {
        // Admins going to /login should be allowed - let them through to login page
        // They will be handled by the login page logic
        return NextResponse.next()
      } else {
        // Regular users already logged in going to /login should go to dashboard
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
    }

    if (pathname === '/admin-login' && userRole === 'admin') {
      return NextResponse.redirect(new URL('/admin', request.url))
    }

    return NextResponse.next()
  } catch (error) {
    // Error checking token - allow request
    return NextResponse.next()
  }
}

export const config = {
  matcher: [
    '/dashboard',
    '/dashboard/:path*',
    '/admin',
    '/admin/:path*',
    '/admin-login',
  ],
}