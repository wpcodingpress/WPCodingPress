export type EmailStatus = 'pending' | 'sent' | 'failed'

export type EventType =
  | 'USER_REGISTERED'
  | 'USER_LOGGED_IN'
  | 'EMAIL_VERIFICATION_REQUESTED'
  | 'PASSWORD_RESET_REQUESTED'
  | 'PASSWORD_CHANGED'
  | 'GUMROAD_PURCHASE_COMPLETED'
  | 'SUBSCRIPTION_ACTIVATED'
  | 'SUBSCRIPTION_UPGRADED'
  | 'SUBSCRIPTION_CANCELLED'
  | 'PAYMENT_CONFIRMED'
  | 'PAYMENT_FAILED'
  | 'INVOICE_AVAILABLE'
  | 'ONBOARDING_STARTED'
  | 'ONBOARDING_COMPLETED'
  | 'FEATURE_ACCESS_GRANTED'
  | 'ACCOUNT_UPDATED'
  | 'SUPPORT_TICKET_CREATED'
  | 'SUPPORT_REPLIED'
  | 'SUSPICIOUS_ACTIVITY_DETECTED'

export interface SendEmailResult {
  success: boolean
  data?: { id: string }
  error?: unknown
}

export interface EmailLogInput {
  recipient: string
  subject: string
  eventType?: string
  template?: string
  status: EmailStatus
  error?: string
}

export interface EmailTemplateData {
  userName?: string
  userEmail?: string
  planName?: string
  planDisplay?: string
  billingCycle?: string
  amount?: number
  currency?: string
  resetToken?: string
  resetUrl?: string
  loginUrl?: string
  dashboardUrl?: string
  orderId?: string
  invoiceId?: string
  invoiceUrl?: string
  subscriptionId?: string
  ipAddress?: string
  location?: string
  device?: string
  reason?: string
  featureName?: string
  supportMessage?: string
  replyContent?: string
  ticketId?: string
  productName?: string
  serviceName?: string
  packageType?: string
  company?: string
  onboardingUrl?: string
  verificationUrl?: string
  [key: string]: unknown
}

export interface EventPayload {
  userId?: string
  email?: string
  name?: string
  plan?: string
  planDisplay?: string
  billingCycle?: string
  amount?: number
  currency?: string
  productName?: string
  subscriptionId?: string
  orderId?: string
  invoiceId?: string
  ipAddress?: string
  location?: string
  device?: string
  reason?: string
  featureName?: string
  resetToken?: string
  supportMessage?: string
  replyContent?: string
  ticketId?: string
  message?: string
  [key: string]: unknown
}
