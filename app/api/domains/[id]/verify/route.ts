import { NextResponse } from 'next/server'
import { requireActiveSubscription } from '@/lib/subscription'
import { verifyDomainStatus, DomainError } from '@/lib/domain/service'

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireActiveSubscription()
    if ('error' in auth) {
      return NextResponse.json({ error: auth.error }, { status: auth.status })
    }

    const { id } = await params

    const result = await verifyDomainStatus(auth.userId, id)

    return NextResponse.json({
      domainId: id,
      verificationStatus: result.verificationStatus,
      sslStatus: result.sslStatus,
      message:
        result.verificationStatus === 'verified'
          ? 'Domain verified successfully! SSL will be provisioned automatically.'
          : 'Domain verification failed. Please check your DNS configuration and try again.',
    })
  } catch (error) {
    if (error instanceof DomainError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode })
    }
    console.error('[Domain Verify] Error:', error)
    return NextResponse.json({ error: 'Failed to verify domain' }, { status: 500 })
  }
}
