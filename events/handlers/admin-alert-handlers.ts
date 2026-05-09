import { EventTypes, EventPayload } from '../index'
import { eventDispatcher } from '../dispatcher'
import { notificationService } from '@/lib/notification-service'
import NewUserSignupAlert from '@/emails/templates/admin/NewUserSignupAlert'
import NewGumroadPurchaseAlert from '@/emails/templates/admin/NewGumroadPurchaseAlert'
import FailedPaymentAlert from '@/emails/templates/admin/FailedPaymentAlert'
import SuspiciousActivityAlert from '@/emails/templates/admin/SuspiciousActivityAlert'
import SupportTicketAlert from '@/emails/templates/admin/SupportTicketAlert'

export function registerAdminAlertHandlers(): void {
  eventDispatcher.on(EventTypes.USER_REGISTERED, handleNewUserSignup)
  eventDispatcher.on(EventTypes.GUMROAD_PURCHASE_COMPLETED, handleNewPurchase)
  eventDispatcher.on(EventTypes.PAYMENT_FAILED, handleFailedPayment)
  eventDispatcher.on(EventTypes.SUSPICIOUS_ACTIVITY_DETECTED, handleSuspiciousActivity)
  eventDispatcher.on(EventTypes.SUPPORT_TICKET_CREATED, handleSupportTicket)
}

async function handleNewUserSignup(payload: EventPayload): Promise<void> {
  const { email, name } = payload

  await notificationService.sendAdminAlert(
    'USER_REGISTERED',
    NewUserSignupAlert,
    {
      userName: typeof name === 'string' ? name : undefined,
      userEmail: typeof email === 'string' ? email : undefined,
      createdAt: new Date().toLocaleString(),
    }
  )
}

async function handleNewPurchase(payload: EventPayload): Promise<void> {
  const { email, name, productName, planDisplay, amount, currency, billingCycle } = payload

  await notificationService.sendAdminAlert(
    'GUMROAD_PURCHASE_COMPLETED',
    NewGumroadPurchaseAlert,
    {
      userName: typeof name === 'string' ? name : undefined,
      userEmail: typeof email === 'string' ? email : undefined,
      productName: typeof productName === 'string' ? productName : undefined,
      planDisplay: typeof planDisplay === 'string' ? planDisplay : undefined,
      amount: typeof amount === 'number' ? amount : undefined,
      currency: typeof currency === 'string' ? currency : undefined,
      billingCycle: typeof billingCycle === 'string' ? billingCycle : undefined,
    }
  )
}

async function handleFailedPayment(payload: EventPayload): Promise<void> {
  const { email, name, amount, currency, planDisplay } = payload

  await notificationService.sendAdminAlert(
    'PAYMENT_FAILED',
    FailedPaymentAlert,
    {
      userName: typeof name === 'string' ? name : undefined,
      userEmail: typeof email === 'string' ? email : undefined,
      amount: typeof amount === 'number' ? amount : undefined,
      currency: typeof currency === 'string' ? currency : undefined,
      planDisplay: typeof planDisplay === 'string' ? planDisplay : undefined,
    }
  )
}

async function handleSuspiciousActivity(payload: EventPayload): Promise<void> {
  const { email, name, ipAddress, location, device } = payload

  await notificationService.sendAdminAlert(
    'SUSPICIOUS_ACTIVITY_DETECTED',
    SuspiciousActivityAlert,
    {
      userName: typeof name === 'string' ? name : undefined,
      userEmail: typeof email === 'string' ? email : undefined,
      ipAddress: typeof ipAddress === 'string' ? ipAddress : undefined,
      location: typeof location === 'string' ? location : undefined,
      device: typeof device === 'string' ? device : undefined,
    }
  )
}

async function handleSupportTicket(payload: EventPayload): Promise<void> {
  const { email, name, ticketId, message } = payload

  await notificationService.sendAdminAlert(
    'SUPPORT_TICKET_CREATED',
    SupportTicketAlert,
    {
      userName: typeof name === 'string' ? name : undefined,
      userEmail: typeof email === 'string' ? email : undefined,
      ticketId: typeof ticketId === 'string' ? ticketId : undefined,
      supportMessage: typeof message === 'string' ? message : undefined,
    }
  )
}
