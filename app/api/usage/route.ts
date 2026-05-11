import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { getUserUsage } from '@/lib/quotas/service'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const usage = await getUserUsage(session.user.id)
    return NextResponse.json(usage)
  } catch (error) {
    console.error('[Usage API] Error:', error)
    return NextResponse.json({ error: 'Failed to get usage info' }, { status: 500 })
  }
}
