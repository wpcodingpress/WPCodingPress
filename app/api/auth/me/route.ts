import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const userAny = session.user as Record<string, any>
    const userId = userAny.id
    
    // Only check session version if user has logged in before (has sessionVersion > 1)
    // New logins with version 1 should always work
    let actualRole = 'user'
    let tokenVersion = userAny.sessionVersion || 1
    
    if (userId) {
      const dbUser = await prisma.user.findUnique({
        where: { id: userId },
        select: { role: true, sessionVersion: true }
      })
      if (dbUser) {
        actualRole = dbUser.role
        
        // Only invalidate if DB version is HIGHER than token version (older session trying to use new)
        // If user just logged in (token=1, db=3), allow it - they need to get new token
        // If token version < db version AND both > 1, then invalidate
        if (dbUser.sessionVersion > 1 && tokenVersion < dbUser.sessionVersion) {
          // Session invalidated - user needs to re-login
          // But don't block - let them continue, dashboard will redirect
        }
        
        // Update the token version to match DB for future requests
        tokenVersion = dbUser.sessionVersion
      }
    }

    return NextResponse.json({
      user: {
        id: userId,
        name: session.user.name,
        email: session.user.email,
        role: actualRole,
        sessionVersion: tokenVersion
      }
    })
  } catch (error) {
    console.error('Me error:', error)
    return NextResponse.json({ error: 'Failed to get user' }, { status: 500 })
  }
}