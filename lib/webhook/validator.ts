import crypto from 'crypto'

export function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  if (!secret || !signature) {
    return false
  }

  try {
    const hmac = crypto.createHmac('sha256', secret)
    const digest = hmac.update(payload).digest('hex')
    return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(signature))
  } catch {
    return false
  }
}

export function extractSignatureFromHeader(
  headers: Headers
): string | null {
  const signature =
    headers.get('x-webhook-signature') ||
    headers.get('x-signature') ||
    headers.get('signature')

  if (!signature) return null

  return signature.trim()
}
