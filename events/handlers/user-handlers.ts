import { EventTypes, EventPayload } from '../index'
import { eventDispatcher } from '../dispatcher'
import { notificationService } from '@/lib/notification-service'
import WelcomeEmail from '@/emails/templates/WelcomeEmail'
import EmailVerification from '@/emails/templates/EmailVerification'
import PasswordResetEmail from '@/emails/templates/PasswordResetEmail'
import LoginAlertEmail from '@/emails/templates/LoginAlertEmail'
import AccountUpdate from '@/emails/templates/AccountUpdate'

export function registerUserHandlers(): void {
  eventDispatcher.on(EventTypes.USER_REGISTERED, handleUserRegistered)
  eventDispatcher.on(EventTypes.EMAIL_VERIFICATION_REQUESTED, handleEmailVerification)
  eventDispatcher.on(EventTypes.PASSWORD_RESET_REQUESTED, handlePasswordReset)
  eventDispatcher.on(EventTypes.USER_LOGGED_IN, handleUserLoggedIn)
  eventDispatcher.on(EventTypes.PASSWORD_CHANGED, handlePasswordChanged)
}

async function handleUserRegistered(payload: EventPayload): Promise<void> {
  const { email, name } = payload
  if (!email || typeof email !== 'string') return

  await notificationService.sendUserEmail(
    'USER_REGISTERED',
    { email, name: typeof name === 'string' ? name : '' },
    WelcomeEmail,
    {
      userName: typeof name === 'string' ? name : '',
      dashboardUrl: `${process.env.NEXT_PUBLIC_APP_URL || ''}/dashboard`,
    }
  )
}

async function handleEmailVerification(payload: EventPayload): Promise<void> {
  const { email, name, verificationUrl } = payload
  if (!email || typeof email !== 'string') return

  await notificationService.sendUserEmail(
    'EMAIL_VERIFICATION_REQUESTED',
    { email, name: typeof name === 'string' ? name : '' },
    EmailVerification,
    {
      userName: typeof name === 'string' ? name : '',
      verificationUrl: typeof verificationUrl === 'string' ? verificationUrl : undefined,
    }
  )
}

async function handlePasswordReset(payload: EventPayload): Promise<void> {
  const { email, name, resetToken } = payload
  if (!email || typeof email !== 'string') return

  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || ''}/reset-password?token=${typeof resetToken === 'string' ? resetToken : ''}`

  await notificationService.sendUserEmail(
    'PASSWORD_RESET_REQUESTED',
    { email, name: typeof name === 'string' ? name : '' },
    PasswordResetEmail,
    {
      userName: typeof name === 'string' ? name : '',
      resetUrl,
    }
  )
}

async function handleUserLoggedIn(payload: EventPayload): Promise<void> {
  const { email, name, ipAddress, location, device } = payload
  if (!email || typeof email !== 'string') return

  await notificationService.sendUserEmail(
    'USER_LOGGED_IN',
    { email, name: typeof name === 'string' ? name : '' },
    LoginAlertEmail,
    {
      userName: typeof name === 'string' ? name : '',
      ipAddress: typeof ipAddress === 'string' ? ipAddress : undefined,
      location: typeof location === 'string' ? location : undefined,
      device: typeof device === 'string' ? device : undefined,
      dashboardUrl: `${process.env.NEXT_PUBLIC_APP_URL || ''}/dashboard`,
    }
  )
}

async function handlePasswordChanged(payload: EventPayload): Promise<void> {
  const { email, name } = payload
  if (!email || typeof email !== 'string') return

  await notificationService.sendUserEmail(
    'PASSWORD_CHANGED',
    { email, name: typeof name === 'string' ? name : '' },
    AccountUpdate,
    {
      userName: typeof name === 'string' ? name : '',
      changes: 'Your password was changed successfully.',
      dashboardUrl: `${process.env.NEXT_PUBLIC_APP_URL || ''}/dashboard/settings`,
    }
  )
}
