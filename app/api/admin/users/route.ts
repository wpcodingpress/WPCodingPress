import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const audit = searchParams.get('audit')

    const [users, adminUsers] = await Promise.all([
      prisma.user.findMany({ orderBy: { createdAt: 'desc' } }),
      prisma.adminUser.findMany({ orderBy: { createdAt: 'desc' } })
    ])

    const adminAsUsers = adminUsers.map(admin => ({
      id: admin.id,
      name: admin.name,
      email: admin.email,
      phone: null,
      company: null,
      role: admin.role || 'admin',
      isActive: true,
      createdAt: admin.createdAt,
      isAdminUser: true
    }))

    const allUsers = [...adminAsUsers, ...users]

    if (audit === 'true') {
      // Return audit logs if requested
      const auditLogs = await prisma.roleAuditLog.findMany({
        orderBy: { changedAt: 'desc' },
        take: 50
      })
      return NextResponse.json({ auditLogs })
    }

    return NextResponse.json(allUsers)
  } catch (err: any) {
    console.error("API Error:", err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
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
      // Get current user to log old role
      const currentUser = await prisma.user.findUnique({ where: { id: userId } })
      if (!currentUser) {
        // Check if it's an admin user
        const adminUser = await prisma.adminUser.findUnique({ where: { id: userId } })
        if (!adminUser) {
          return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }
        // Update admin user role
        const updatedAdmin = await prisma.adminUser.update({
          where: { id: userId },
          data: { role }
        })
        // Log the change
        await prisma.roleAuditLog.create({
          data: {
            userId: userId,
            userName: adminUser.name,
            oldRole: adminUser.role,
            newRole: role,
            changedBy: 'admin'
          }
        })
        return NextResponse.json({ success: true, message: 'Role updated', user: updatedAdmin, sessionsInvalidated: false })
      }

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { role: role || 'user' }
      })
      // Log the change
      await prisma.roleAuditLog.create({
        data: {
          userId: userId,
          userName: currentUser.name,
          oldRole: currentUser.role,
          newRole: role,
          changedBy: 'admin'
        }
      })
      // Invalidate all user sessions (logout from all devices)
      await prisma.userSession.deleteMany({ where: { userId: userId } })
      return NextResponse.json({ success: true, message: 'Role updated', user: updatedUser, sessionsInvalidated: true })
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