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

  // Skip auth check for login pages and API routes - allow through
  if (pathname === '/login' || pathname === '/admin-login' || pathname.startsWith('/api/auth')) {
    return NextResponse.next()
  }

  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })

    // Not logged in - redirect to appropriate login
    if (!token) {
      if (isDashboardRoute) {
        return NextResponse.redirect(new URL('/login', request.url))
      }
      if (isAdminRoute) {
        return NextResponse.redirect(new URL('/admin-login', request.url))
      }
      return NextResponse.next()
    }

    // Session invalidated
    if (token.role === 'invalidated') {
      const response = NextResponse.redirect(new URL('/login', request.url))
      response.cookies.set('next-auth.token', '', { expires: new Date(0) })
      response.cookies.set('next-auth.session-token', '', { expires: new Date(0) })
      return response
    }

    // Role-based access
    const userRole = (token.role as string) || 'user'
    
    // Non-admin/editor/manager trying to access admin routes
    if (isAdminRoute && !['admin', 'editor', 'manager'].includes(userRole)) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    // Already logged in user trying to access login page - redirect based on role
    if (pathname === '/login') {
      if (['admin', 'editor', 'manager'].includes(userRole)) {
        return NextResponse.redirect(new URL('/admin-login', request.url))
      } else {
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
    }

    if (pathname === '/admin-login' && userRole === 'admin') {
      return NextResponse.redirect(new URL('/admin', request.url))
    }

    return NextResponse.next()
  } catch (error) {
    // Error - allow request
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
    '/login',
  ],
}