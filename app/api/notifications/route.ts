import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import prisma from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')

    if (!session) {
      return NextResponse.json([], { status: 200 })
    }

    const notifications = []

    if (type === 'admin') {
      const [recentOrders, recentContacts, recentSubscriptions] = await Promise.all([
        prisma.order.findMany({
          where: { createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } },
          orderBy: { createdAt: 'desc' },
          take: 5,
          include: { service: true }
        }),
        prisma.contact.findMany({
          where: { createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } },
          orderBy: { createdAt: 'desc' },
          take: 5,
          isRead: false
        }),
        prisma.subscription.findMany({
          where: { 
            createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
            status: 'active'
          },
          orderBy: { createdAt: 'desc' },
          take: 5,
          include: { user: { select: { name: true, email: true } } }
        })
      ])

      recentOrders.forEach(order => {
        notifications.push({
          id: `order-${order.id}`,
          type: 'order',
          title: 'New Order Received',
          message: `${order.clientName} ordered ${order.service?.name || 'a service'} - $${order.amount}`,
          isRead: false,
          createdAt: order.createdAt.toISOString(),
          link: '/admin/orders'
        })
      })

      recentContacts.forEach(contact => {
        notifications.push({
          id: `contact-${contact.id}`,
          type: 'contact',
          title: 'New Contact Message',
          message: `${contact.name}: ${contact.message.substring(0, 50)}...`,
          isRead: contact.isRead,
          createdAt: contact.createdAt.toISOString(),
          link: '/admin/contacts'
        })
      })

      recentSubscriptions.forEach(sub => {
        if (sub.plan !== 'free') {
          notifications.push({
            id: `sub-${sub.id}`,
            type: 'subscriber',
            title: `New ${sub.plan.charAt(0).toUpperCase() + sub.plan.slice(1)} Subscriber`,
            message: `${sub.user.name} (${sub.user.email}) subscribed to ${sub.plan} plan`,
            isRead: false,
            createdAt: sub.createdAt.toISOString(),
            link: '/admin/subscribers'
          })
        }
      })
    } else if (type === 'user') {
      const userId = session.user?.id
      if (userId) {
        const [userOrders, userSubscriptions] = await Promise.all([
          prisma.order.findMany({
            where: { userId },
            orderBy: { updatedAt: 'desc' },
            take: 5,
            include: { service: true }
          }),
          prisma.subscription.findMany({
            where: { userId },
            orderBy: { updatedAt: 'desc' },
            take: 5
          })
        ])

        userOrders.forEach(order => {
          if (order.status !== 'pending') {
            notifications.push({
              id: `order-${order.id}`,
              type: 'order',
              title: `Order ${order.status.replace('_', ' ')}`,
              message: `Your order for ${order.service?.name || 'service'} is now ${order.status.replace('_', ' ')}`,
              isRead: false,
              createdAt: order.updatedAt.toISOString(),
              link: '/dashboard/orders'
            })
          }
        })

        userSubscriptions.forEach(sub => {
          notifications.push({
            id: `sub-${sub.id}`,
            type: 'subscriber',
            title: `${sub.plan.charAt(0).toUpperCase() + sub.plan.slice(1)} Plan Active`,
            message: `Your ${sub.plan} subscription is ${sub.status}`,
            isRead: false,
            createdAt: sub.updatedAt.toISOString(),
            link: '/dashboard/subscription'
          })
        })
      }
    }

    notifications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    return NextResponse.json(notifications)
  } catch (error) {
    console.error('Notifications API error:', error)
    return NextResponse.json([], { status: 200 })
  }
}
