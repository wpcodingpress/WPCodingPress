import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import prisma from '@/lib/prisma'

async function createNotification(userId: string, type: string, title: string, message: string, link?: string) {
  try {
    await prisma.notification.create({
      data: { userId, type, title, message, link }
    })
  } catch (error) {
    console.error('Error creating notification:', error)
  }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')

    if (!session) {
      return NextResponse.json([], { status: 200 })
    }

    const userId = session.user?.id
    if (!userId) {
      return NextResponse.json([], { status: 200 })
    }

    let notifications: Array<{
      id: string
      type: string
      title: string
      message: string
      isRead: boolean
      createdAt: string
      link?: string
    }> = []

    if (type === 'admin') {
      const [dbNotifications, recentOrders, recentContacts, recentSubscriptions] = await Promise.all([
        prisma.notification.findMany({
          orderBy: { createdAt: 'desc' },
          take: 50
        }),
        prisma.order.findMany({
          where: { createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } },
          orderBy: { createdAt: 'desc' },
          take: 10,
          include: { service: true }
        }),
        prisma.contact.findMany({
          where: { createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } },
          orderBy: { createdAt: 'desc' },
          take: 10
        }),
        prisma.subscription.findMany({
          where: { 
            createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
            status: 'active'
          },
          orderBy: { createdAt: 'desc' },
          take: 10,
          include: { user: { select: { name: true, email: true } } }
        })
      ])

      dbNotifications.forEach(n => {
        notifications.push({
          id: n.id,
          type: n.type,
          title: n.title,
          message: n.message,
          isRead: n.isRead,
          createdAt: n.createdAt.toISOString(),
          link: n.link || undefined
        })
      })

      recentOrders.forEach(order => {
        const existing = notifications.find(n => n.type === 'order' && n.message.includes(order.id))
        if (!existing) {
          notifications.push({
            id: `order-${order.id}`,
            type: 'order',
            title: 'New Order Received',
            message: `${order.clientName} ordered ${order.service?.name || 'a service'} - $${order.amount}`,
            isRead: false,
            createdAt: order.createdAt.toISOString(),
            link: '/admin/orders'
          })
        }
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
    } else {
      const [dbNotifications, userOrders, userCustomOrders, userSubscriptions, userSites, userJobs] = await Promise.all([
        prisma.notification.findMany({
          where: { userId },
          orderBy: { createdAt: 'desc' },
          take: 50
        }),
        prisma.order.findMany({
          where: { userId },
          orderBy: { updatedAt: 'desc' },
          take: 10,
          include: { service: true }
        }),
        prisma.customOrder.findMany({
          where: { userId },
          orderBy: { updatedAt: 'desc' },
          take: 10
        }),
        prisma.subscription.findMany({
          where: { userId },
          orderBy: { updatedAt: 'desc' },
          take: 10
        }),
        prisma.site.findMany({
          where: { userId },
          orderBy: { updatedAt: 'desc' },
          take: 10
        }),
        prisma.job.findMany({
          where: { userId },
          orderBy: { updatedAt: 'desc' },
          take: 10
        })
      ])

      dbNotifications.forEach(n => {
        notifications.push({
          id: n.id,
          type: n.type,
          title: n.title,
          message: n.message,
          isRead: n.isRead,
          createdAt: n.createdAt.toISOString(),
          link: n.link || undefined
        })
      })

      const orderStatusMessages: Record<string, string> = {
        pending: 'is being processed',
        processing: 'is being prepared',
        completed: 'has been completed',
        cancelled: 'was cancelled',
        refunded: 'has been refunded'
      }

      userOrders.forEach(order => {
        const existing = notifications.find(n => n.type === 'order' && n.message.includes(order.id))
        if (!existing && orderStatusMessages[order.status]) {
          notifications.push({
            id: `order-${order.id}`,
            type: 'order',
            title: `Order ${order.status.replace(/_/g, ' ')}`,
            message: `Your order for ${order.service?.name || 'service'} ${orderStatusMessages[order.status]}`,
            isRead: false,
            createdAt: order.updatedAt.toISOString(),
            link: '/dashboard/orders'
          })
        }
      })

      userCustomOrders.forEach(order => {
        const existing = notifications.find(n => n.type === 'custom_order' && n.message.includes(order.id))
        if (!existing && orderStatusMessages[order.status]) {
          notifications.push({
            id: `custom-order-${order.id}`,
            type: 'custom_order',
            title: `Custom Order ${order.status.replace(/_/g, ' ')}`,
            message: `Your custom project "${order.projectName}" ${orderStatusMessages[order.status]}`,
            isRead: false,
            createdAt: order.updatedAt.toISOString(),
            link: '/dashboard/invoices'
          })
        }

        if (!existing && order.advancePaid && !order.remainingPaid) {
          const existingPayment = notifications.find(n => n.type === 'payment' && n.message.includes(order.id))
          if (!existingPayment) {
            notifications.push({
              id: `custom-payment-${order.id}`,
              type: 'payment',
              title: 'Payment Received',
              message: `Advance payment of $${order.advanceAmount} received for "${order.projectName}"`,
              isRead: false,
              createdAt: order.updatedAt.toISOString(),
              link: '/dashboard/invoices'
            })
          }
        }
      })

      const subStatusMessages: Record<string, string> = {
        active: 'is now active',
        cancelled: 'has been cancelled',
        expired: 'has expired',
        past_due: 'needs attention'
      }

      userSubscriptions.forEach(sub => {
        const existing = notifications.find(n => n.type === 'subscription' && n.message.includes(sub.id))
        if (!existing && subStatusMessages[sub.status]) {
          notifications.push({
            id: `sub-${sub.id}`,
            type: 'subscription',
            title: `${sub.plan.charAt(0).toUpperCase() + sub.plan.slice(1)} Plan ${sub.status === 'active' ? 'Active' : sub.status}`,
            message: `Your ${sub.plan} subscription ${subStatusMessages[sub.status]}`,
            isRead: false,
            createdAt: sub.updatedAt.toISOString(),
            link: '/dashboard/subscription'
          })
        }

        if (sub.currentPeriodEnd && new Date(sub.currentPeriodEnd) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) && sub.status === 'active') {
          const existingExpiring = notifications.find(n => n.type === 'subscription' && n.message.includes('expiring'))
          if (!existingExpiring) {
            notifications.push({
              id: `sub-expiring-${sub.id}`,
              type: 'subscription',
              title: 'Subscription Expiring Soon',
              message: `Your ${sub.plan} plan subscription expires on ${new Date(sub.currentPeriodEnd).toLocaleDateString()}`,
              isRead: false,
              createdAt: new Date().toISOString(),
              link: '/dashboard/subscription'
            })
          }
        }
      })

      const siteStatusMessages: Record<string, string> = {
        connected: 'has been connected successfully',
        disconnected: 'has been disconnected',
        error: 'has an error - check your connection'
      }

      userSites.forEach(site => {
        const existing = notifications.find(n => n.type === 'site' && n.message.includes(site.id))
        if (!existing && siteStatusMessages[site.status]) {
          notifications.push({
            id: `site-${site.id}`,
            type: 'site',
            title: 'Site Status Update',
            message: `Your site "${site.domain}" ${siteStatusMessages[site.status]}`,
            isRead: false,
            createdAt: site.updatedAt.toISOString(),
            link: '/dashboard/sites'
          })
        }
      })

      const jobStatusMessages: Record<string, string> = {
        pending: 'is queued for processing',
        processing: 'is being converted',
        completed: 'conversion completed successfully',
        failed: 'conversion failed - please check the logs',
        queued: 'is queued for conversion'
      }

      userJobs.forEach(job => {
        const existing = notifications.find(n => n.type === 'job' && n.message.includes(job.id))
        if (!existing && jobStatusMessages[job.status]) {
          notifications.push({
            id: `job-${job.id}`,
            type: 'job',
            title: 'Conversion Job Update',
            message: `Your conversion job ${jobStatusMessages[job.status]}`,
            isRead: false,
            createdAt: job.updatedAt.toISOString(),
            link: '/dashboard/sites'
          })
        }
      })
    }

    notifications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    notifications.splice(50)

    return NextResponse.json(notifications)
  } catch (error) {
    console.error('Notifications API error:', error)
    return NextResponse.json([], { status: 200 })
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { notificationId, markAllRead } = await request.json()
    const userId = session.user.id

    if (markAllRead) {
      await prisma.notification.updateMany({
        where: { userId, isRead: false },
        data: { isRead: true }
      })
      return NextResponse.json({ success: true })
    }

    if (notificationId) {
      await prisma.notification.update({
        where: { id: notificationId },
        data: { isRead: true }
      })
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  } catch (error) {
    console.error('Error marking notification as read:', error)
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
  }
}

export { createNotification }
export { createNotification as POST }