import { NextResponse } from 'next/server'
import { handleWordPressWebhook } from '@/lib/webhook/handler'
import { verifyWebhookSignature, extractSignatureFromHeader } from '@/lib/webhook/validator'
import { WordPressWebhookSchema } from '@/lib/validation/schemas'

export async function POST(request: Request) {
  try {
    const bodyText = await request.text()

    const signature = extractSignatureFromHeader(request.headers)
    const secret = process.env.WP_WEBHOOK_SECRET || process.env.GUMROAD_WEBHOOK_SECRET || ''

    if (secret && signature) {
      const isValid = verifyWebhookSignature(bodyText, signature, secret)
      if (!isValid) {
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
      }
    }

    let payload: Record<string, unknown>
    try {
      payload = JSON.parse(bodyText)
    } catch {
      return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 })
    }

    const parsed = WordPressWebhookSchema.safeParse(payload)
    if (!parsed.success) {
      return NextResponse.json({ received: true, warning: 'Unrecognized payload format' })
    }

    const result = await handleWordPressWebhook(parsed.data)

    if (result.action === 'throttled') {
      return NextResponse.json({
        received: true,
        message: 'Rebuild throttled (too soon since last rebuild)',
      })
    }

    return NextResponse.json({
      received: result.received,
      action: result.action || 'processed',
    })
  } catch (error) {
    console.error('[WordPress Webhook] Error:', error)
    return NextResponse.json({ received: true }, { status: 200 })
  }
}
