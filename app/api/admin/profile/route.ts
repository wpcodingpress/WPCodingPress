import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, email, action, currentPassword, newPassword, notifOrders, notifSubscribers, notifContact } = body

    // Update profile
    if (action === undefined) {
      const updated = await prisma.adminUser.update({
        where: { email: session.user.email },
        data: name ? { name } : {}
      })
      return NextResponse.json({ success: true, user: updated })
    }

    // Update password
    if (action === 'password') {
      const admin = await prisma.adminUser.findUnique({ where: { email: session.user.email } })
      if (!admin) return NextResponse.json({ error: 'User not found' }, { status: 404 })

      const valid = await bcrypt.compare(currentPassword, admin.password)
      if (!valid) return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 })

      const hashed = await bcrypt.hash(newPassword, 12)
      await prisma.adminUser.update({
        where: { email: session.user.email },
        data: { password: hashed }
      })
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Profile error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}