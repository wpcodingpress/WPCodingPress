import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const userAny = session.user as Record<string, any>
    return NextResponse.json({
      user: {
        id: userAny.id,
        name: session.user.name,
        email: session.user.email,
        role: userAny.role || 'user'
      }
    })
  } catch (error) {
    console.error('Me error:', error)
    return NextResponse.json({ error: 'Failed to get user' }, { status: 500 })
  }
}