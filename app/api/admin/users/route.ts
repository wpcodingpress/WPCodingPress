import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import prisma from '@/lib/prisma'

const TESTING_MODE = process.env.TESTING_MODE === 'true'

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const plan = searchParams.get('plan') || ''

    const where: any = {}

    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { name: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (plan) {
      where.subscriptions = {
        some: {
          plan: plan
        }
      }
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        include: {
          subscriptions: {
            where: { status: 'active' }
          }
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.user.count({ where })
    ])

    return NextResponse.json({
      users,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    })
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { userId, plan, status, action } = body

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
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
      } else if (plan && plan !== 'free') {
        await prisma.subscription.create({
          data: {
            userId: existingUser.id,
            plan: plan,
            status: 'active',
            currentPeriodStart: new Date(),
            currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          },
        })
      }

      return NextResponse.json({ 
        success: true, 
        message: `Subscription ${TESTING_MODE ? '(TESTING_MODE) ' : ''}updated for user` 
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
