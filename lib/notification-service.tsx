import prisma from '@/lib/prisma'
import { sendTemplateEmail } from '@/lib/email'

interface EmailRecipient {
  email: string
  name?: string
}

function getPropsFromComponent(component: React.ReactElement): Record<string, unknown> {
  return (component.props as Record<string, unknown>) || {}
}

function createComponent(
  Component: React.ComponentType<Record<string, unknown>>,
  data: Record<string, unknown>
): React.ReactElement {
  return <Component {...data} />
}

function getSubjectForEvent(eventType: string, data: Record<string, unknown>): string {
  const subjects: Record<string, string> = {
    USER_REGISTERED: 'Welcome to WPCodingPress!',
    EMAIL_VERIFICATION_REQUESTED: 'Verify Your Email Address',
    PASSWORD_RESET_REQUESTED: 'Reset Your Password - WPCodingPress',
    PASSWORD_CHANGED: 'Password Changed Successfully',
    USER_LOGGED_IN: 'New Sign-In to Your Account',
    GUMROAD_PURCHASE_COMPLETED: `Thank you for your purchase${data.planDisplay ? ` - ${data.planDisplay} Plan` : ''}!`,
    SUBSCRIPTION_ACTIVATED: `Subscription Activated${data.planDisplay ? ` - ${data.planDisplay}` : ''}`,
    SUBSCRIPTION_UPGRADED: `Plan Upgraded${data.planDisplay ? ` to ${data.planDisplay}` : ''}`,
    SUBSCRIPTION_CANCELLED: `Subscription Cancelled${data.planDisplay ? ` - ${data.planDisplay}` : ''}`,
    PAYMENT_CONFIRMED: 'Payment Confirmed',
    PAYMENT_FAILED: 'Payment Failed - Action Required',
    INVOICE_AVAILABLE: `Invoice${data.invoiceId ? ` #${data.invoiceId}` : ''} Available`,
    ONBOARDING_STARTED: 'Welcome Aboard - Let\'s Get Started!',
    ONBOARDING_COMPLETED: 'Onboarding Complete - Next Steps',
    FEATURE_ACCESS_GRANTED: `New Feature Available${data.featureName ? `: ${data.featureName}` : ''}`,
    ACCOUNT_UPDATED: 'Account Updated',
    SUPPORT_TICKET_CREATED: `Support Ticket${data.ticketId ? ` #${data.ticketId}` : ''} Received`,
    SUPPORT_REPLIED: `Support Reply${data.ticketId ? ` - Ticket #${data.ticketId}` : ''}`,
    SUSPICIOUS_ACTIVITY_DETECTED: 'Suspicious Activity Detected',
  }

  const defaultSubject = 'Notification from WPCodingPress'
  const adminPrefix = eventType.startsWith('ADMIN_') ? '[Admin] ' : ''

  const adminSubjects: Record<string, string> = {
    USER_REGISTERED: 'New User Registration',
    GUMROAD_PURCHASE_COMPLETED: 'New Gumroad Purchase',
    PAYMENT_FAILED: 'Payment Failed - Immediate Attention',
    SUSPICIOUS_ACTIVITY_DETECTED: 'Suspicious Activity Detected - Review Required',
    SUPPORT_TICKET_CREATED: `New Support Ticket${data.ticketId ? ` #${data.ticketId}` : ''}`,
  }

  return adminPrefix + (adminSubjects[eventType] || subjects[eventType] || defaultSubject)
}

class NotificationService {
  async sendUserEmail(
    eventType: string,
    recipient: EmailRecipient,
    Component: React.ComponentType<Record<string, unknown>>,
    data: Record<string, unknown> = {}
  ): Promise<boolean> {
    try {
      if (!recipient.email) return false

      const element = createComponent(Component, {
        ...data,
        userName: recipient.name || data.userName || '',
      })

      const subject = getSubjectForEvent(eventType, data)

      const result = await sendTemplateEmail(
        recipient.email,
        subject,
        element,
        eventType,
        Component.name || eventType
      )

      return result.success
    } catch (error) {
      console.error(`[NotificationService] Failed to send ${eventType} email:`, error)
      return false
    }
  }

  async sendAdminAlert(
    eventType: string,
    Component: React.ComponentType<Record<string, unknown>>,
    data: Record<string, unknown> = {}
  ): Promise<boolean> {
    try {
      const admins = await prisma.adminUser.findMany({
        select: { email: true, name: true },
      })

      if (admins.length === 0) {
        const adminEmail = process.env.ADMIN_EMAIL || process.env.NEXT_PUBLIC_ADMIN_EMAIL
        if (adminEmail) {
          return this.sendUserEmail(eventType, { email: adminEmail }, Component, data)
        }
        return false
      }

      const results = await Promise.allSettled(
        admins.map((admin) =>
          this.sendUserEmail(
            eventType,
            { email: admin.email, name: admin.name },
            Component,
            data
          )
        )
      )

      return results.some((r) => r.status === 'fulfilled' && r.value)
    } catch (error) {
      console.error(`[NotificationService] Failed to send admin alert ${eventType}:`, error)
      return false
    }
  }
}

export const notificationService = new NotificationService()
