import prisma from '@/lib/prisma'
import {
  addDomain as vercelAddDomain,
  removeDomain as vercelRemoveDomain,
  getDomainConfig,
  verifyDomain as vercelVerifyDomain,
} from '@/lib/vercel/domains'
import { createNotification } from '@/lib/notifications'

export class DomainError extends Error {
  constructor(
    message: string,
    public code: 'QUOTA_EXCEEDED' | 'NOT_FOUND' | 'VERCEL_API' | 'ALREADY_EXISTS',
    public statusCode = 500
  ) {
    super(message)
    this.name = 'DomainError'
  }
}

export async function addCustomDomain(
  userId: string,
  siteId: string,
  domain: string
): Promise<{
  domainId: string
  dnsRecords: Array<{ type: string; name: string; value: string }>
}> {
  const site = await prisma.site.findFirst({
    where: { id: siteId, userId },
    include: { domains: true },
  })

  if (!site) {
    throw new DomainError('Site not found', 'NOT_FOUND', 404)
  }

  if (!site.vercelProjectId) {
    throw new DomainError(
      'Please deploy your site first before adding a custom domain.',
      'NOT_FOUND',
      400
    )
  }

  const existing = await prisma.domain.findUnique({
    where: { domain },
  })

  if (existing) {
    throw new DomainError(
      'This domain is already in use by another site.',
      'ALREADY_EXISTS',
      400
    )
  }

  const normalizedDomain = domain.toLowerCase().replace(/^(https?:\/\/)/, '').replace(/\/$/, '')

  try {
    const vercelResult = await vercelAddDomain(site.vercelProjectId, normalizedDomain)

    const dnsRecords = (vercelResult.records || []).map((r) => ({
      type: r.type,
      name: r.name || normalizedDomain,
      value: r.value,
    }))

    const domainRecord = await prisma.domain.create({
      data: {
        siteId,
        userId,
        domain: normalizedDomain,
        vercelDomainId: vercelResult.domain?.id || null,
        verificationStatus: 'pending',
        sslStatus: 'pending',
        dnsRecords: dnsRecords,
      },
    })

    await createNotification({
      userId,
      type: 'site',
      title: 'Custom Domain Added',
      message: `Domain ${normalizedDomain} has been added. Please configure your DNS records.`,
      link: '/dashboard/sites',
      priority: 'medium',
    })

    return {
      domainId: domainRecord.id,
      dnsRecords,
    }
  } catch (error) {
    if (error instanceof DomainError) throw error
    const message = error instanceof Error ? error.message : 'Failed to add domain'
    throw new DomainError(`Vercel domain error: ${message}`, 'VERCEL_API')
  }
}

export async function removeCustomDomain(userId: string, domainId: string): Promise<void> {
  const domainRecord = await prisma.domain.findFirst({
    where: { id: domainId, userId },
    include: { site: true },
  })

  if (!domainRecord) {
    throw new DomainError('Domain not found', 'NOT_FOUND', 404)
  }

  if (domainRecord.site.vercelProjectId) {
    try {
      await vercelRemoveDomain(domainRecord.site.vercelProjectId, domainRecord.domain)
    } catch (error) {
      console.error('[Domain] Failed to remove from Vercel:', error)
    }
  }

  await prisma.domain.delete({ where: { id: domainId } })

  if (domainRecord.site.customDomain === domainRecord.domain) {
    await prisma.site.update({
      where: { id: domainRecord.siteId },
      data: { customDomain: null },
    })
  }

  await createNotification({
    userId,
    type: 'site',
    title: 'Custom Domain Removed',
    message: `Domain ${domainRecord.domain} has been removed.`,
    link: '/dashboard/sites',
    priority: 'low',
  })
}

export async function verifyDomainStatus(
  userId: string,
  domainId: string
): Promise<{
  verificationStatus: string
  sslStatus: string
}> {
  const domainRecord = await prisma.domain.findFirst({
    where: { id: domainId, userId },
    include: { site: true },
  })

  if (!domainRecord) {
    throw new DomainError('Domain not found', 'NOT_FOUND', 404)
  }

  if (!domainRecord.site.vercelProjectId) {
    throw new DomainError('Site has no Vercel project', 'NOT_FOUND', 400)
  }

  try {
    const config = await getDomainConfig(
      domainRecord.site.vercelProjectId,
      domainRecord.domain
    )

    const isVerified = config.verified

    const updateData: Record<string, unknown> = {
      lastCheckedAt: new Date(),
    }

    if (isVerified) {
      updateData.verificationStatus = 'verified'
      updateData.verifiedAt = new Date()
      updateData.sslStatus = 'verified'

      await prisma.site.update({
        where: { id: domainRecord.siteId },
        data: { customDomain: domainRecord.domain },
      })
    } else {
      updateData.verificationStatus = 'failed'
    }

    if (config.verification) {
      updateData.dnsRecords = config.verification.map((v) => ({
        type: v.type,
        name: v.domain,
        value: v.value,
      }))
    }

    await prisma.domain.update({
      where: { id: domainId },
      data: updateData as never,
    })

    return {
      verificationStatus: (updateData.verificationStatus as string) || 'pending',
      sslStatus: (updateData.sslStatus as string) || 'pending',
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Verification failed'
    throw new DomainError(`Verification error: ${message}`, 'VERCEL_API')
  }
}

export async function getUserDomains(userId: string) {
  return prisma.domain.findMany({
    where: { userId },
    include: { site: { select: { id: true, domain: true, wpSiteUrl: true } } },
    orderBy: { createdAt: 'desc' },
  })
}
