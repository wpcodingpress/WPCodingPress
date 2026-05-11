import prisma from '@/lib/prisma'
import { startDeployment } from '@/lib/deployment/service'
import { createNotification } from '@/lib/notifications'

const MIN_REBUILD_INTERVAL = 60000

interface WordPressWebhookPayload {
  action: 'post_updated' | 'post_published' | 'post_deleted' | 'page_updated' | 'media_updated'
  post_id?: number
  post_type?: string
  site_id?: string
  api_key?: string
  timestamp?: string
}

export async function handleWordPressWebhook(
  payload: WordPressWebhookPayload
): Promise<{ received: boolean; action?: string }> {
  if (!payload.site_id && !payload.api_key) {
    return { received: false }
  }

  const site = await prisma.site.findFirst({
    where: {
      OR: [
        { id: payload.site_id },
        { wpApiKey: payload.api_key },
      ],
    },
  })

  if (!site) {
    return { received: false }
  }

  const subscription = await prisma.subscription.findFirst({
    where: {
      userId: site.userId,
      status: 'active',
    },
    orderBy: { createdAt: 'desc' },
  })

  if (!subscription) {
    return { received: true }
  }

  if (subscription.plan === 'free') {
    return { received: true }
  }

  if (!process.env.VERCEL_TEMPLATE_PROJECT_ID) {
    return { received: true }
  }

  const hasPreviousDeployment = await prisma.deployment.findFirst({
    where: { siteId: site.id, status: 'deployed' },
  })

  if (!hasPreviousDeployment) {
    return { received: true }
  }

  const lastRebuild = await prisma.rebuildLog.findFirst({
    where: { siteId: site.id },
    orderBy: { createdAt: 'desc' },
  })

  if (lastRebuild) {
    const timeSinceLastRebuild = Date.now() - lastRebuild.createdAt.getTime()
    if (timeSinceLastRebuild < MIN_REBUILD_INTERVAL) {
      await prisma.rebuildLog.create({
        data: {
          siteId: site.id,
          trigger: 'webhook',
          status: 'skipped',
          webhookPayload: payload as never,
        },
      })
      return { received: true, action: 'throttled' }
    }
  }

  const rebuildLog = await prisma.rebuildLog.create({
    data: {
      siteId: site.id,
      trigger: 'webhook',
      status: 'pending',
      webhookPayload: payload as never,
    },
  })

  try {
    await startDeployment(site.userId, site.id, {
      template: site.template,
    })

    await prisma.rebuildLog.update({
      where: { id: rebuildLog.id },
      data: { status: 'deployed', completedAt: new Date() },
    })

    await prisma.site.update({
      where: { id: site.id },
      data: { lastSyncAt: new Date() },
    })

    await createNotification({
      userId: site.userId,
      type: 'site',
      title: 'Site Auto-Re built',
      message: `Your site was automatically rebuilt after WordPress content update.`,
      link: '/dashboard/sites',
      priority: 'low',
    })

    return { received: true, action: 'rebuild_triggered' }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'

    await prisma.rebuildLog.update({
      where: { id: rebuildLog.id },
      data: { status: 'failed', error: errorMessage },
    })

    return { received: true, action: 'rebuild_failed' }
  }
}
