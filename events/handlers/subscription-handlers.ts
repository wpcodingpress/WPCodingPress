import { EventTypes, EventPayload } from '../index'
import { eventDispatcher } from '../dispatcher'
import { notificationService } from '@/lib/notification-service'
import GumroadPurchaseSuccess from '@/emails/templates/GumroadPurchaseSuccess'
import SubscriptionActivated from '@/emails/templates/SubscriptionActivated'
import SubscriptionUpgraded from '@/emails/templates/SubscriptionUpgraded'
import SubscriptionCancelled from '@/emails/templates/SubscriptionCancelled'
import PaymentConfirmation from '@/emails/templates/PaymentConfirmation'
import PaymentFailed from '@/emails/templates/PaymentFailed'

export function registerSubscriptionHandlers(): void {
  eventDispatcher.on(EventTypes.GUMROAD_PURCHASE_COMPLETED, handleGumroadPurchase)
  eventDispatcher.on(EventTypes.SUBSCRIPTION_ACTIVATED, handleSubscriptionActivated)
  eventDispatcher.on(EventTypes.SUBSCRIPTION_UPGRADED, handleSubscriptionUpgraded)
  eventDispatcher.on(EventTypes.SUBSCRIPTION_CANCELLED, handleSubscriptionCancelled)
  eventDispatcher.on(EventTypes.PAYMENT_CONFIRMED, handlePaymentConfirmed)
  eventDispatcher.on(EventTypes.PAYMENT_FAILED, handlePaymentFailed)
}

async function handleGumroadPurchase(payload: EventPayload): Promise<void> {
  const { email, name, planDisplay, productName, amount, currency, onboardingUrl } = payload
  if (!email || typeof email !== 'string') return

  await notificationService.sendUserEmail(
    'GUMROAD_PURCHASE_COMPLETED',
    { email, name: typeof name === 'string' ? name : '' },
    GumroadPurchaseSuccess,
    {
      userName: typeof name === 'string' ? name : '',
      productName: typeof productName === 'string' ? productName : undefined,
      planDisplay: typeof planDisplay === 'string' ? planDisplay : undefined,
      amount: typeof amount === 'number' ? amount : undefined,
      currency: typeof currency === 'string' ? currency : undefined,
      onboardingUrl: typeof onboardingUrl === 'string' ? onboardingUrl : undefined,
    }
  )
}

async function handleSubscriptionActivated(payload: EventPayload): Promise<void> {
  const { email, name, planDisplay, billingCycle } = payload
  if (!email || typeof email !== 'string') return

  await notificationService.sendUserEmail(
    'SUBSCRIPTION_ACTIVATED',
    { email, name: typeof name === 'string' ? name : '' },
    SubscriptionActivated,
    {
      userName: typeof name === 'string' ? name : '',
      planDisplay: typeof planDisplay === 'string' ? planDisplay : undefined,
      billingCycle: typeof billingCycle === 'string' ? billingCycle : undefined,
    }
  )
}

async function handleSubscriptionUpgraded(payload: EventPayload): Promise<void> {
  const { email, name, planDisplay } = payload
  if (!email || typeof email !== 'string') return

  await notificationService.sendUserEmail(
    'SUBSCRIPTION_UPGRADED',
    { email, name: typeof name === 'string' ? name : '' },
    SubscriptionUpgraded,
    {
      userName: typeof name === 'string' ? name : '',
      planDisplay: typeof planDisplay === 'string' ? planDisplay : undefined,
    }
  )
}

async function handleSubscriptionCancelled(payload: EventPayload): Promise<void> {
  const { email, name, planDisplay, reason } = payload
  if (!email || typeof email !== 'string') return

  await notificationService.sendUserEmail(
    'SUBSCRIPTION_CANCELLED',
    { email, name: typeof name === 'string' ? name : '' },
    SubscriptionCancelled,
    {
      userName: typeof name === 'string' ? name : '',
      planDisplay: typeof planDisplay === 'string' ? planDisplay : undefined,
      reason: typeof reason === 'string' ? reason : undefined,
    }
  )
}

async function handlePaymentConfirmed(payload: EventPayload): Promise<void> {
  const { email, name, amount, currency, planDisplay } = payload
  if (!email || typeof email !== 'string') return

  await notificationService.sendUserEmail(
    'PAYMENT_CONFIRMED',
    { email, name: typeof name === 'string' ? name : '' },
    PaymentConfirmation,
    {
      userName: typeof name === 'string' ? name : '',
      amount: typeof amount === 'number' ? amount : undefined,
      currency: typeof currency === 'string' ? currency : undefined,
      planDisplay: typeof planDisplay === 'string' ? planDisplay : undefined,
    }
  )
}

async function handlePaymentFailed(payload: EventPayload): Promise<void> {
  const { email, name, amount, currency, planDisplay } = payload
  if (!email || typeof email !== 'string') return

  await notificationService.sendUserEmail(
    'PAYMENT_FAILED',
    { email, name: typeof name === 'string' ? name : '' },
    PaymentFailed,
    {
      userName: typeof name === 'string' ? name : '',
      amount: typeof amount === 'number' ? amount : undefined,
      currency: typeof currency === 'string' ? currency : undefined,
      planDisplay: typeof planDisplay === 'string' ? planDisplay : undefined,
    }
  )
}
