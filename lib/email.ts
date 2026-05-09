import { createElement } from 'react'
import { Resend } from 'resend'
import { render } from '@react-email/components'
import prisma from '@/lib/prisma'
import type { SendEmailResult } from '@/types/email'

let resend: Resend | null = null

function getResend(): Resend | null {
  if (!resend) {
    if (!process.env.RESEND_API_KEY) {
      console.warn('[Email] RESEND_API_KEY not set — emails will be logged only')
      return null
    }
    resend = new Resend(process.env.RESEND_API_KEY)
  }
  return resend
}

export function getEmailFromAddress(): string {
  return process.env.EMAIL_FROM || 'WPCodingPress <noreply@wpcodingpress.com>'
}

async function logEmail(
  recipient: string,
  subject: string,
  eventType: string | null,
  template: string | null,
  status: 'pending' | 'sent' | 'failed',
  error?: string
): Promise<void> {
  try {
    await prisma.emailLog.create({
      data: {
        recipient,
        subject,
        eventType,
        template,
        status,
        error,
        sentAt: status === 'sent' ? new Date() : null,
      },
    })
  } catch (logError) {
    console.error('[Email] Failed to log email:', logError)
  }
}

async function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function sendWithRetry(
  to: string,
  subject: string,
  html: string,
  from: string,
  maxRetries = 3
): Promise<SendEmailResult> {
  const resendClient = getResend()

  if (!resendClient) {
    return { success: true, data: { id: 'mock-email-id' } }
  }

  let lastError: unknown

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await resendClient.emails.send({
        from,
        to,
        subject,
        html,
      })
      if (response.error) {
        throw new Error(response.error.message || 'Resend API error')
      }
      return { success: true, data: response.data }
    } catch (error) {
      lastError = error
      console.error(`[Email] Send attempt ${attempt}/${maxRetries} failed:`, error)
      if (attempt < maxRetries) {
        await wait(1000 * attempt)
      }
    }
  }

  return { success: false, error: lastError }
}

export async function sendEmail({
  to,
  subject,
  html,
  from = getEmailFromAddress(),
  eventType,
  template,
}: {
  to: string
  subject: string
  html: string
  from?: string
  eventType?: string
  template?: string
}): Promise<SendEmailResult> {
  const result = await sendWithRetry(to, subject, html, from)

  if (result.success) {
    await logEmail(to, subject, eventType || null, template || null, 'sent')
  } else {
    const errorMsg = result.error instanceof Error ? result.error.message : 'Unknown error'
    await logEmail(to, subject, eventType || null, template || null, 'failed', errorMsg)
  }

  return result
}

export async function renderTemplate(
  component: React.ReactElement
): Promise<string> {
  return render(component)
}

export async function sendTemplateEmail(
  to: string,
  subject: string,
  component: React.ReactElement,
  eventType?: string,
  templateName?: string
): Promise<SendEmailResult> {
  try {
    const html = await renderTemplate(component)
    return sendEmail({
      to,
      subject,
      html,
      eventType,
      template: templateName,
    })
  } catch (error) {
    console.error('[Email] Failed to render/send template email:', error)
    const errorMsg = error instanceof Error ? error.message : 'Template render failed'
    await logEmail(to, subject, eventType || null, templateName || null, 'failed', errorMsg)
    return { success: false, error }
  }
}

export async function sendWelcomeEmail(email: string, name: string) {
  const WelcomeEmail = (await import('@/emails/templates/WelcomeEmail')).default
  const element = createElement(WelcomeEmail, {
    userName: name,
    dashboardUrl: `${process.env.NEXT_PUBLIC_APP_URL || ''}/dashboard`,
  })
  return sendTemplateEmail(
    email,
    'Welcome to WPCodingPress!',
    element,
    'USER_REGISTERED',
    'WelcomeEmail'
  )
}

export async function sendOrderConfirmation(
  email: string,
  name: string,
  orderId: string,
  orderDetails: {
    productName?: string
    serviceName?: string
    packageType: string
    amount: number
  }
) {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #000; color: #fff; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .order-details { background: #fff; padding: 15px; border-radius: 5px; margin: 15px 0; }
          .total { font-size: 18px; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Order Confirmed!</h1>
          </div>
          <div class="content">
            <p>Hi ${name},</p>
            <p>Thank you for your order! We've received your request.</p>
            <div class="order-details">
              <p><strong>Order ID:</strong> #${orderId}</p>
              <p><strong>Product/Service:</strong> ${orderDetails.productName || orderDetails.serviceName}</p>
              <p><strong>Package:</strong> ${orderDetails.packageType}</p>
              <p class="total"><strong>Total:</strong> $${orderDetails.amount}</p>
            </div>
            <p>We'll review your order and get back to you soon.</p>
            <p>Track your order status in your dashboard:</p>
            <p><a href="${process.env.NEXT_PUBLIC_APP_URL || ''}/dashboard/orders" style="color: #000;">View Order</a></p>
          </div>
        </div>
      </body>
    </html>
  `

  return sendEmail({
    to: email,
    subject: `Order Confirmed - #${orderId}`,
    html,
    eventType: 'ORDER_CONFIRMED',
    template: 'OrderConfirmation',
  })
}

export async function sendPasswordResetEmail(email: string, resetToken: string) {
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || ''}/reset-password?token=${resetToken}`

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #000; color: #fff; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .button { display: inline-block; padding: 12px 24px; background: #000; color: #fff; text-decoration: none; border-radius: 5px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Reset Your Password</h1>
          </div>
          <div class="content">
            <p>You requested a password reset for your WPCodingPress account.</p>
            <p>Click the button below to reset your password:</p>
            <p><a href="${resetUrl}" class="button">Reset Password</a></p>
            <p>Or copy and paste this link:</p>
            <p>${resetUrl}</p>
            <p>This link expires in 1 hour.</p>
            <p>If you didn't request this, please ignore this email.</p>
          </div>
        </div>
      </body>
    </html>
  `

  return sendEmail({
    to: email,
    subject: 'Reset Your Password - WPCodingPress',
    html,
    eventType: 'PASSWORD_RESET_REQUESTED',
    template: 'PasswordReset',
  })
}
