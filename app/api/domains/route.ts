import { NextResponse } from 'next/server'
import { requireActiveSubscription } from '@/lib/subscription'
import {
  addCustomDomain,
  removeCustomDomain,
  getUserDomains,
  DomainError,
} from '@/lib/domain/service'
import { canAddDomain } from '@/lib/quotas/service'
import { DomainAddSchema, DomainDeleteSchema } from '@/lib/validation/schemas'

export async function GET() {
  try {
    const auth = await requireActiveSubscription()
    if ('error' in auth) {
      return NextResponse.json({ error: auth.error }, { status: auth.status })
    }

    const domains = await getUserDomains(auth.userId)
    return NextResponse.json({ domains })
  } catch (error) {
    console.error('[Domains API] GET Error:', error)
    return NextResponse.json({ error: 'Failed to get domains' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const auth = await requireActiveSubscription()
    if ('error' in auth) {
      return NextResponse.json({ error: auth.error }, { status: auth.status })
    }

    const { userId } = auth
    const body = await request.json()

    const parsed = DomainAddSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || 'Invalid request' },
        { status: 400 }
      )
    }

    const quotaCheck = await canAddDomain(userId)
    if (!quotaCheck.allowed) {
      return NextResponse.json({ error: quotaCheck.error }, { status: 403 })
    }

    const result = await addCustomDomain(
      userId,
      parsed.data.siteId,
      parsed.data.domain
    )

    return NextResponse.json(
      {
        domainId: result.domainId,
        dnsRecords: result.dnsRecords,
        message: 'Domain added. Please configure your DNS records as shown below.',
      },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof DomainError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode })
    }
    console.error('[Domains API] POST Error:', error)
    return NextResponse.json({ error: 'Failed to add domain' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const auth = await requireActiveSubscription()
    if ('error' in auth) {
      return NextResponse.json({ error: auth.error }, { status: auth.status })
    }

    const { searchParams } = new URL(request.url)
    const domainId = searchParams.get('domainId')

    if (!domainId) {
      return NextResponse.json({ error: 'Domain ID is required' }, { status: 400 })
    }

    await removeCustomDomain(auth.userId, domainId)
    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof DomainError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode })
    }
    console.error('[Domains API] DELETE Error:', error)
    return NextResponse.json({ error: 'Failed to remove domain' }, { status: 500 })
  }
}
