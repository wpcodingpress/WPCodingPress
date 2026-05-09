import { NextRequest, NextResponse } from 'next/server'
import { notificationService } from '@/lib/notification-service'

export async function POST(request: NextRequest) {
  try {
    const { to, subject, body, type, notificationId } = await request.json()

    if (!to || !subject) {
      return NextResponse.json({ error: 'Email and subject required' }, { status: 400 })
    }

    const eventType = type === 'notification' ? 'NOTIFICATION' : (type || 'QUEUED_EMAIL')

    await notificationService.sendUserEmail(
      eventType,
      { email: to },
      (await import('@/emails/templates/AccountUpdate')).default,
      {
        changes: body || subject,
        dashboardUrl: `${process.env.NEXT_PUBLIC_APP_URL || ''}/dashboard`,
      }
    )

    return NextResponse.json({ success: true, message: 'Email sent successfully' })
  } catch (error) {
    console.error('Email queue error:', error)
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }
}
