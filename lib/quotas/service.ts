import prisma from '@/lib/prisma'

export const PLAN_LIMITS = {
  free: {
    maxSites: 0,
    maxDeployments: 0,
    maxDomains: 0,
    customDomain: false,
    autoSync: false,
    analytics: false,
  },
  pro: {
    maxSites: 1,
    maxDeployments: 1,
    maxDomains: 1,
    customDomain: true,
    autoSync: true,
    analytics: true,
  },
  enterprise: {
    maxSites: 3,
    maxDeployments: 3,
    maxDomains: 3,
    customDomain: true,
    autoSync: true,
    analytics: true,
  },
} as const

export type PlanType = keyof typeof PLAN_LIMITS
export type PlanLimits = (typeof PLAN_LIMITS)[PlanType]

export function getPlanLimits(plan: string | null | undefined): PlanLimits {
  if (!plan) return PLAN_LIMITS.free
  const key = plan.toLowerCase() as PlanType
  return PLAN_LIMITS[key] || PLAN_LIMITS.free
}

export interface QuotaResult {
  allowed: boolean
  error?: string
  current: number
  limit: number
}

export async function getUserPlan(userId: string): Promise<{ plan: string; status: string }> {
  const testingMode = process.env.TESTING_MODE === 'true'
  if (testingMode) {
    return { plan: 'enterprise', status: 'active' }
  }

  const subscription = await prisma.subscription.findFirst({
    where: {
      userId,
      status: 'active',
    },
    orderBy: { createdAt: 'desc' },
  })

  if (!subscription) {
    return { plan: 'free', status: 'inactive' }
  }

  return { plan: subscription.plan, status: subscription.status }
}

export async function canCreateSite(userId: string): Promise<QuotaResult> {
  const { plan } = await getUserPlan(userId)
  const limits = getPlanLimits(plan)

  const siteCount = await prisma.site.count({
    where: { userId },
  })

  if (siteCount >= limits.maxSites) {
    return {
      allowed: false,
      error: `Your ${plan} plan allows maximum ${limits.maxSites} site(s). Upgrade to add more.`,
      current: siteCount,
      limit: limits.maxSites,
    }
  }

  return { allowed: true, current: siteCount, limit: limits.maxSites }
}

export async function canDeploy(userId: string): Promise<QuotaResult> {
  const { plan } = await getUserPlan(userId)
  const limits = getPlanLimits(plan)

  const deploymentCount = await prisma.deployment.count({
    where: {
      userId,
      status: { notIn: ['failed', 'cancelled'] },
    },
  })

  if (deploymentCount >= limits.maxDeployments) {
    return {
      allowed: false,
      error: `Your ${plan} plan allows maximum ${limits.maxDeployments} deployment(s). Upgrade to deploy more.`,
      current: deploymentCount,
      limit: limits.maxDeployments,
    }
  }

  return { allowed: true, current: deploymentCount, limit: limits.maxDeployments }
}

export async function canAddDomain(userId: string): Promise<QuotaResult> {
  const { plan } = await getUserPlan(userId)
  const limits = getPlanLimits(plan)

  if (!limits.customDomain) {
    return {
      allowed: false,
      error: 'Custom domains are not available on your current plan. Upgrade to Pro or Enterprise.',
      current: 0,
      limit: 0,
    }
  }

  const domainCount = await prisma.domain.count({
    where: { userId },
  })

  if (domainCount >= limits.maxDomains) {
    return {
      allowed: false,
      error: `Your ${plan} plan allows maximum ${limits.maxDomains} custom domain(s).`,
      current: domainCount,
      limit: limits.maxDomains,
    }
  }

  return { allowed: true, current: domainCount, limit: limits.maxDomains }
}

export async function getUserUsage(userId: string) {
  const { plan, status } = await getUserPlan(userId)
  const limits = getPlanLimits(plan)

  const [siteCount, deploymentCount, domainCount] = await Promise.all([
    prisma.site.count({ where: { userId } }),
    prisma.deployment.count({ where: { userId } }),
    prisma.domain.count({ where: { userId } }),
  ])

  return {
    plan,
    status,
    limits,
    usage: {
      sites: { current: siteCount, limit: limits.maxSites },
      deployments: { current: deploymentCount, limit: limits.maxDeployments },
      domains: { current: domainCount, limit: limits.maxDomains },
    },
    features: {
      customDomain: limits.customDomain,
      autoSync: limits.autoSync,
      analytics: limits.analytics,
    },
  }
}
