import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendEmail({
  to,
  subject,
  html,
  from = 'WPCodingPress <noreply@wpcodingpress.com>'
}: {
  to: string
  subject: string
  html: string
  from?: string
}) {
  try {
    const data = await resend.emails.send({
      from,
      to,
      subject,
      html,
    })
    return { success: true, data }
  } catch (error) {
    console.error('Email send error:', error)
    return { success: false, error }
  }
}

export async function sendWelcomeEmail(email: string, name: string) {
  return sendEmail({
    to: email,
    subject: 'Welcome to WPCodingPress!',
    html: `
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
              <h1>Welcome to WPCodingPress!</h1>
            </div>
            <div class="content">
              <p>Hi ${name},</p>
              <p>Thank you for joining WPCodingPress! We're excited to have you on board.</p>
              <p>You can now:</p>
              <ul>
                <li>Browse our premium WordPress plugins</li>
                <li>Access MCP servers</li>
                <li>View and manage your orders</li>
                <li>Download purchased products</li>
              </ul>
              <p>Get started by exploring our products!</p>
              <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/products" class="button">View Products</a></p>
            </div>
          </div>
        </body>
      </html>
    `
  })
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
  return sendEmail({
    to: email,
    subject: `Order Confirmed - #${orderId}`,
    html: `
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
              <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/orders" style="color: #000;">View Order</a></p>
            </div>
          </div>
        </body>
      </html>
    `
  })
}

export async function sendPasswordResetEmail(email: string, resetToken: string) {
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`
  
  return sendEmail({
    to: email,
    subject: 'Reset Your Password - WPCodingPress',
    html: `
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
  })
}
