import prisma from '@/lib/prisma'
import { setProjectEnvironmentVariables } from '@/lib/vercel/projects'
import { createDeployment, getDeployment, isDeploymentFinal, isDeploymentSuccessful } from '@/lib/vercel/deployments'
import { buildDeploymentEnvVars, sanitizeProjectName } from './builder'
import { createNotification } from '@/lib/notifications'
import { fetchWordPressData, transformWPData } from './wp-data'

const POLL_INTERVAL = 5000
const MAX_POLL_TIME = 300000

function getTemplateProjectId(): string {
  const projectId = process.env.VERCEL_TEMPLATE_PROJECT_ID
  if (!projectId) {
    throw new DeploymentError(
      'VERCEL_TEMPLATE_PROJECT_ID is not configured. Please set it in your environment variables.',
      'VERCEL_API'
    )
  }
  return projectId
}

export class DeploymentError extends Error {
  constructor(
    message: string,
    public code: 'QUOTA_EXCEEDED' | 'DUPLICATE' | 'VERCEL_API' | 'WP_FETCH' | 'BUILD_FAILED' | 'NOT_FOUND',
    public statusCode = 500
  ) {
    super(message)
    this.name = 'DeploymentError'
  }
}

export async function startDeployment(
  userId: string,
  siteId: string,
  options: { template?: string } = {}
): Promise<{ deploymentId: string; status: string }> {
  const site = await prisma.site.findFirst({
    where: { id: siteId, userId },
  })

  if (!site) {
    throw new DeploymentError('Site not found', 'NOT_FOUND', 404)
  }

  if (site.status !== 'connected') {
    throw new DeploymentError('Site is not connected. Please reconnect your WordPress site.', 'NOT_FOUND', 400)
  }

  const existingActive = await prisma.deployment.findFirst({
    where: {
      siteId,
      status: { in: ['pending', 'queued', 'building'] },
    },
  })

  if (existingActive) {
    throw new DeploymentError(
      'A deployment is already in progress for this site.',
      'DUPLICATE',
      400
    )
  }

  const template = options.template || site.template || 'news'
  const validTemplates = ['news', 'business', 'modern', 'advanced']
  if (!validTemplates.includes(template)) {
    throw new DeploymentError('Invalid template selected', 'NOT_FOUND', 400)
  }

  const deployment = await prisma.deployment.create({
    data: {
      userId,
      siteId,
      status: 'pending',
      template,
      buildLogs: `Deployment queued at ${new Date().toISOString()}\n`,
    },
  })

  processDeployment(deployment.id, site).catch((err) => {
    console.error('[Deployment] Background processing failed:', err)
  })

  return {
    deploymentId: deployment.id,
    status: 'pending',
  }
}

async function processDeployment(
  deploymentId: string,
  site: {
    id: string
    userId: string
    wpSiteUrl: string
    wpApiKey: string | null
    domain: string
    template: string
  }
): Promise<void> {
  let logs = ''

  try {
    await updateDeployment(deploymentId, { status: 'building' })

    const projectId = getTemplateProjectId()

    logs += `[${new Date().toISOString()}] Starting deployment for ${site.domain}\n`
    logs += `Template: ${site.template}\n`
    logs += `Vercel Project: ${projectId}\n\n`

    logs += `Step 1: Fetching WordPress data from ${site.wpSiteUrl}...\n`
    await appendLog(deploymentId, logs)
    const wpData = await fetchWordPressData(site.wpSiteUrl, site.wpApiKey || '')
    logs += `✓ Fetched WordPress data successfully\n`

    logs += `\nStep 2: Transforming data for Next.js format...\n`
    await appendLog(deploymentId, logs)
    const transformedData = transformWPData(wpData, site.wpSiteUrl)
    logs += `✓ Data transformed (${transformedData.posts.length} posts, ${transformedData.categories.length} categories)\n`

    logs += `\nStep 3: Building deployment env vars...\n`
    await appendLog(deploymentId, logs)
    const envVars = buildDeploymentEnvVars({
      siteId: site.id,
      wpSiteUrl: site.wpSiteUrl,
      wpApiKey: site.wpApiKey || '',
      domain: site.domain,
      template: site.template,
      transformedData: transformedData as unknown as Record<string, unknown>,
    })
    logs += `✓ Environment variables configured (${Object.keys(envVars).length} vars)\n`

    logs += `\nStep 4: Setting project environment variables on Vercel...\n`
    await appendLog(deploymentId, logs)

    try {
      await setProjectEnvironmentVariables(projectId, envVars)
      logs += `✓ Environment variables set (${Object.keys(envVars).length} vars)\n`
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to set env vars'
      logs += `⚠ Warning: ${message}\n`
    }
    await appendLog(deploymentId, logs)

    logs += `\nStep 5: Triggering Vercel deployment...\n`
    await appendLog(deploymentId, logs)

    try {
      const deployment = await createDeployment({
        projectId,
        name: sanitizeProjectName(site.domain),
      })

      await updateDeployment(deploymentId, {
        vercelDeploymentId: deployment.id,
        deploymentUrl: deployment.url,
      })

      await prisma.site.update({
        where: { id: site.id },
        data: { vercelProjectId: projectId },
      })

      logs += `✓ Deployment triggered: ${deployment.url}\n`
      logs += `Deployment ID: ${deployment.id}\n`
      await appendLog(deploymentId, logs)

      logs += `\nStep 6: Waiting for build to complete...\n`
      await appendLog(deploymentId, logs)

      const result = await pollDeploymentStatus(deployment.id, deploymentId, logs)

      if (result.success) {
        logs += `\n✅ Deployment successful!\n`
        logs += `Live URL: https://${result.url}\n`
        await appendLog(deploymentId, logs)

        await prisma.deployment.update({
          where: { id: deploymentId },
          data: {
            status: 'deployed',
            deploymentUrl: `https://${result.url}`,
            buildLogs: logs,
            completedAt: new Date(),
          },
        })

        await prisma.site.update({
          where: { id: site.id },
          data: {
            vercelProjectUrl: `https://${result.url}`,
            deploymentStatus: 'deployed',
            lastSyncAt: new Date(),
            template: site.template,
          },
        })

        await createNotification({
          userId: site.userId,
          type: 'site',
          title: 'Site Deployed Successfully!',
          message: `Your headless site is live at https://${result.url}`,
          link: `/dashboard/sites`,
          priority: 'high',
        })
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Vercel deployment failed'
      logs += `✗ Error: ${message}\n`
      await appendLog(deploymentId, logs)

      await prisma.deployment.update({
        where: { id: deploymentId },
        data: {
          status: 'failed',
          error: message,
          buildLogs: logs,
        },
      })

      await prisma.site.update({
        where: { id: site.id },
        data: { deploymentStatus: 'failed' },
      })

      await createNotification({
        userId: site.userId,
        type: 'site',
        title: 'Deployment Failed',
        message: `Deployment failed for ${site.domain}: ${message}. Please try again.`,
        link: `/dashboard/sites`,
        priority: 'high',
      })
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('[Deployment] Error:', error)

    logs += `\n❌ Fatal Error: ${message}\n`
    await appendLog(deploymentId, logs)

    await prisma.deployment.update({
      where: { id: deploymentId },
      data: {
        status: 'failed',
        error: message,
        buildLogs: logs,
      },
    })

    await prisma.site.update({
      where: { id: site.id },
      data: { deploymentStatus: 'failed' },
    })

    await createNotification({
      userId: site.userId,
      type: 'site',
      title: 'Deployment Failed',
      message: `Deployment failed: ${message}`,
      link: `/dashboard/sites`,
      priority: 'high',
    })
  }
}

async function pollDeploymentStatus(
  vercelDeploymentId: string,
  deploymentId: string,
  logs: string
): Promise<{ success: boolean; url: string }> {
  const startTime = Date.now()

  while (Date.now() - startTime < MAX_POLL_TIME) {
    try {
      const status = await getDeployment(vercelDeploymentId)

      if (isDeploymentFinal(status.state)) {
        if (isDeploymentSuccessful(status.state)) {
          return { success: true, url: status.url }
        }

        const errorMsg = status.errorMessage || status.error?.message || 'Build failed on Vercel'
        throw new DeploymentError(errorMsg, 'BUILD_FAILED')
      }

      const elapsed = Math.floor((Date.now() - startTime) / 1000)
      const progressLog = `  Status: ${status.state} (${elapsed}s elapsed)\n`

      await prisma.deployment.update({
        where: { id: deploymentId },
        data: {
          buildLogs: logs + progressLog,
        },
      })

      await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL))
    } catch (error) {
      if (error instanceof DeploymentError) throw error
      await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL))
    }
  }

  throw new DeploymentError('Deployment timed out after 5 minutes', 'BUILD_FAILED')
}

async function updateDeployment(
  deploymentId: string,
  data: Record<string, unknown>
): Promise<void> {
  await prisma.deployment.update({
    where: { id: deploymentId },
    data: data as never,
  })
}

async function appendLog(deploymentId: string, logs: string): Promise<void> {
  await prisma.deployment.update({
    where: { id: deploymentId },
    data: { buildLogs: logs },
  })
}

export async function triggerRedeploy(
  userId: string,
  siteId: string
): Promise<{ deploymentId: string; status: string }> {
  const site = await prisma.site.findFirst({
    where: { id: siteId, userId },
  })

  if (!site) {
    throw new DeploymentError('Site not found', 'NOT_FOUND', 404)
  }

  return startDeployment(userId, siteId, { template: site.template })
}
