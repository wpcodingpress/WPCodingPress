import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100
    })

    console.log('Users count:', users.length)
    return NextResponse.json(users)
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { userId, plan, status, action, role, name, email, isActive } = body

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    if (action === 'update_role') {
      const user = await prisma.user.update({
        where: { id: userId },
        data: { role: role || 'user' }
      })
      return NextResponse.json({ success: true, message: 'Role updated', user })
    }

    if (action === 'update_profile') {
      const user = await prisma.user.update({
        where: { id: userId },
        data: { 
          name: name,
          email: email,
          isActive: isActive !== undefined ? isActive : undefined
        }
      })
      return NextResponse.json({ success: true, message: 'Profile updated', user })
    }

    if (action === 'toggle_active') {
      const existingUser = await prisma.user.findUnique({ where: { id: userId } })
      const user = await prisma.user.update({
        where: { id: userId },
        data: { isActive: !existingUser?.isActive }
      })
      return NextResponse.json({ success: true, message: 'User status updated', user })
    }

    if (action === 'delete_user') {
      await prisma.user.delete({ where: { id: userId } })
      return NextResponse.json({ success: true, message: 'User deleted' })
    }

    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        subscriptions: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    })

    if (!existingUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    if (action === 'update_subscription') {
      const activeSub = existingUser.subscriptions?.[0]

      if (activeSub) {
        await prisma.subscription.update({
          where: { id: activeSub.id },
          data: {
            plan: plan || activeSub.plan,
            status: status || activeSub.status,
          },
        })
      }

      return NextResponse.json({ 
        success: true, 
        message: 'Subscription updated for user' 
      })
    }

    if (action === 'cancel_subscription') {
      const activeSub = existingUser.subscriptions?.[0]
      if (activeSub) {
        await prisma.subscription.update({
          where: { id: activeSub.id },
          data: {
            status: 'cancelled',
            cancelAtPeriodEnd: true,
          },
        })
      }

      return NextResponse.json({ 
        success: true, 
        message: 'Subscription will be cancelled at period end' 
      })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Error updating user subscription:', error)
    return NextResponse.json({ error: 'Failed to update subscription' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, password, role } = body

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Name, email and password required' }, { status: 400 })
    }

    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return NextResponse.json({ error: 'User with this email already exists' }, { status: 400 })
    }

    const bcrypt = require('bcryptjs')
    const hashedPassword = await bcrypt.hash(password, 12)

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role || 'user',
        isActive: true,
      }
    })

    return NextResponse.json({ success: true, message: 'User created', user })
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 })
  }
}