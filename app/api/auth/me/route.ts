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
    
    // Check session version
    let sessionValid = true
    let actualRole = 'user'
    if (userId) {
      const dbUser = await prisma.user.findUnique({
        where: { id: userId },
        select: { role: true, sessionVersion: true }
      })
      if (dbUser) {
        // Check if token's sessionVersion matches DB
        const tokenVersion = userAny.sessionVersion || 1
        if (dbUser.sessionVersion !== tokenVersion) {
          sessionValid = false
        }
        actualRole = dbUser.role
      }
    }

    if (!sessionValid) {
      return NextResponse.json({
        user: {
          id: userId,
          name: session.user.name,
          email: session.user.email,
          role: 'invalidated'
        }
      })
    }

    return NextResponse.json({
      user: {
        id: userId,
        name: session.user.name,
        email: session.user.email,
        role: actualRole,
        sessionVersion: userAny.sessionVersion
      }
    })
  } catch (error) {
    console.error('Me error:', error)
    return NextResponse.json({ error: 'Failed to get user' }, { status: 500 })
  }
}