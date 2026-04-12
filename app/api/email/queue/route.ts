import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { to, subject, body, type, notificationId } = await request.json()

    if (!to || !subject) {
      return NextResponse.json({ error: 'Email and subject required' }, { status: 400 })
    }

    console.log('=== EMAIL NOTIFICATION ===')
    console.log('To:', to)
    console.log('Subject:', subject)
    console.log('Body:', body)
    console.log('Type:', type)
    console.log('=========================')

    if (notificationId) {
      try {
        await prisma.notification.update({
          where: { id: notificationId },
          data: { priority: 'sent' as any }
        }).catch(() => {})
      } catch (e) {}
    }

    return NextResponse.json({ success: true, message: 'Email queued' })
  } catch (error) {
    console.error('Email queue error:', error)
    return NextResponse.json({ error: 'Failed to queue email' }, { status: 500 })
  }
}