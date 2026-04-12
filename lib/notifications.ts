import prisma from '@/lib/prisma'

export type NotificationType = 
  | 'order' 
  | 'custom_order' 
  | 'invoice' 
  | 'subscription' 
  | 'site' 
  | 'job' 
  | 'payment' 
  | 'system'

export type NotificationPriority = 'low' | 'medium' | 'high'

export interface CreateNotificationParams {
  userId: string
  type: NotificationType
  title: string
  message: string
  link?: string
  priority?: NotificationPriority
  sendEmail?: boolean
}

export async function createNotification({
  userId,
  type,
  title,
  message,
  link,
  priority = 'medium',
  sendEmail = false
}: CreateNotificationParams): Promise<boolean> {
  try {
    const notification = await prisma.notification.create({
      data: {
        userId,
        type,
        title,
        message,
        link,
        priority,
        isRead: false,
      },
    })

    if (sendEmail) {
      queueEmailNotification(userId, notification.id, title, message)
    }

    return true
  } catch (error) {
    console.error('Error creating notification:', error)
    return false
  }
}

async function queueEmailNotification(
  userId: string,
  notificationId: string,
  title: string,
  message: string
): Promise<void> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, notifyOrderUpdates: true, notifyPromotional: true },
    })

    if (!user?.email) return

    await fetch('/api/email/queue', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: user.email,
        subject: title,
        body: message,
        type: 'notification',
        notificationId,
      }),
    }).catch(() => {})
  } catch (error) {
    console.error('Error queueing email notification:', error)
  }
}

export async function notifyAdmins(params: Omit<CreateNotificationParams, 'userId'>): Promise<void> {
  try {
    const admins = await prisma.adminUser.findMany({
      select: { id: true },
    })

    await Promise.all(
      admins.map((admin) =>
        createNotification({
          ...params,
          userId: admin.id,
          type: 'system',
        })
      )
    )
  } catch (error) {
    console.error('Error notifying admins:', error)
  }
}

export async function markNotificationAsRead(
  notificationId: string,
  userId: string
): Promise<boolean> {
  try {
    await prisma.notification.update({
      where: { id: notificationId, userId },
      data: { isRead: true },
    })
    return true
  } catch (error) {
    console.error('Error marking notification as read:', error)
    return false
  }
}

export async function markAllNotificationsAsRead(userId: string): Promise<boolean> {
  try {
    await prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    })
    return true
  } catch (error) {
    console.error('Error marking all notifications as read:', error)
    return false
  }
}

export async function getUnreadCount(userId: string): Promise<number> {
  try {
    return await prisma.notification.count({
      where: { userId, isRead: false },
    })
  } catch (error) {
    console.error('Error getting unread count:', error)
    return 0
  }
}