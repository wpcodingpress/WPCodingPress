import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import prisma from '@/lib/prisma'

export async function POST() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const userAny = session.user as Record<string, any>
    const userId = userAny.id

    // Delete all sessions for this user
    await prisma.userSession.deleteMany({ where: { userId } })

    return NextResponse.json({ success: true, message: 'Logged out from all devices' })
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json({ error: 'Failed to logout' }, { status: 500 })
  }
}