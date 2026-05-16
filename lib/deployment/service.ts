import prisma from '@/lib/prisma'
import { getProject, setProjectEnvironmentVariables } from '@/lib/vercel/projects'
import { createDeployment, getDeployment, isDeploymentFinal, isDeploymentSuccessful } from '@/lib/vercel/deployments'
import { buildDeploymentEnvVars, sanitizeProjectName } from './builder'
import { createNotification } from '@/lib/notifications'
import { fetchWordPressData, transformWPData } from './wp-data'
import { analyzeWordPressSite } from '@/lib/engine/site-analyzer'

const POLL_INTERVAL = 5000
const MAX_POLL_TIME = 900000

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

async function getTemplateGitSource(): Promise<{ type: 'github'; repoId: number | string; ref: string }> {
  const projectId = getTemplateProjectId()
  const project = await getProject(projectId)

  if (!project?.link?.repoId) {
    throw new DeploymentError(
      `The Vercel project "${projectId}" is not connected to a Git repository. Go to Vercel Dashboard → Project → Git → "Connect Git Repository" to link it.`,
      'VERCEL_API'
    )
  }

  return {
    type: 'github',
    repoId: project.link.repoId,
    ref: 'main',
  }
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

function domainToSlug(domain: string): string {
  return domain.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')
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

  const template = options.template || site.template || 'adaptive'
  const validTemplates = ['news', 'business', 'modern', 'advanced', 'adaptive']
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

    logs += `\nStep 2: Running AI content analysis...\n`
    await appendLog(deploymentId, logs)
    const analysis = analyzeWordPressSite(wpData, site.wpSiteUrl)
    logs += `✓ Industry detected: ${analysis.industry.category} (${analysis.industry.confidence}% confidence)\n`
    logs += `✓ ${analysis.site.posts.length} posts, ${analysis.site.categories.length} categories, ${analysis.site.services.length} services\n`
    logs += `✓ Features detected: ${Object.entries(analysis.features).filter(([, v]) => v).length} active features\n`

    await prisma.site.update({
      where: { id: site.id },
      data: {
        siteCategory: analysis.industry.category,
        detectedFeatures: JSON.stringify(analysis.features),
        industryConfidence: analysis.industry.confidence,
        sectionCount: analysis.industryLayout.sections.length,
        heroLayout: analysis.layout.heroLayout,
        primaryColor: analysis.colors.primary,
      },
    })

    logs += `\nStep 3: Transforming data for Next.js format...\n`
    await appendLog(deploymentId, logs)
    const transformedData = transformWPData(wpData, site.wpSiteUrl)
    logs += `✓ Data transformed (${transformedData.posts.length} posts, ${transformedData.categories.length} categories)\n`

    logs += `\nStep 4: Building deployment env vars with intelligence data...\n`
    await appendLog(deploymentId, logs)
    const intelligencePayload = {
      siteCategory: analysis.industry.category,
      detectedFeatures: JSON.stringify(analysis.features),
      intelligenceData: JSON.stringify({
        industry: analysis.industry,
        layout: analysis.layout,
        industryLayout: analysis.industryLayout,
        colors: analysis.colors,
        typography: analysis.typography,
        spacing: analysis.spacing,
        animations: analysis.animations,
        site: {
          settings: analysis.site.settings,
          hero: analysis.site.hero,
          services: analysis.site.services.slice(0, 20),
          portfolio: analysis.site.portfolio.slice(0, 20),
          testimonials: analysis.site.testimonials.slice(0, 20),
          team: analysis.site.team.slice(0, 20),
          faqs: analysis.site.faqs.slice(0, 20),
          posts: analysis.site.posts.slice(0, 12),
          products: analysis.site.products.slice(0, 12),
          footer: analysis.site.footer,
        },
      }),
    }
    await prisma.deployment.update({
      where: { id: deploymentId },
      data: intelligencePayload,
    })
    const envVars = buildDeploymentEnvVars({
      siteId: site.id,
      wpSiteUrl: site.wpSiteUrl,
      wpApiKey: site.wpApiKey || '',
      domain: site.domain,
      template: site.template,
      transformedData: transformedData as unknown as Record<string, unknown>,
    })

    const intelligenceVars = {
      NEXT_PUBLIC_SITE_CATEGORY: analysis.industry.category,
      NEXT_PUBLIC_SITE_CONFIDENCE: String(analysis.industry.confidence),
      NEXT_PUBLIC_HAS_AUTH: String(analysis.features.hasAuth),
      NEXT_PUBLIC_HAS_FORMS: String(analysis.features.hasForms),
      NEXT_PUBLIC_HAS_WOOCOMMERCE: String(analysis.features.hasWooCommerce),
      NEXT_PUBLIC_HAS_SEARCH: String(analysis.features.hasSearch),
      NEXT_PUBLIC_HAS_COMMENTS: String(analysis.features.hasComments),
      NEXT_PUBLIC_HAS_PORTFOLIO: String(analysis.features.hasPortfolio),
      NEXT_PUBLIC_HAS_SERVICES: String(analysis.features.hasServices),
      NEXT_PUBLIC_HAS_TESTIMONIALS: String(analysis.features.hasTestimonials),
      NEXT_PUBLIC_HAS_TEAM: String(analysis.features.hasTeam),
      NEXT_PUBLIC_HAS_FAQ: String(analysis.features.hasFAQ),
      NEXT_PUBLIC_PRIMARY_COLOR: analysis.colors.primary,
      NEXT_PUBLIC_SECTION_COUNT: String(analysis.industryLayout.sections.length),
      NEXT_PUBLIC_HERO_LAYOUT: analysis.layout.heroLayout,
      NEXT_PUBLIC_SITE_DATA_URL: `${process.env.NEXT_PUBLIC_APP_URL || ''}/api/sites/${domainToSlug(site.domain)}/data`,
      NEXT_PUBLIC_SITE_DATA: JSON.stringify({
        settings: analysis.site.settings,
        navigation: analysis.site.navigation,
        hero: analysis.site.hero,
        services: analysis.site.services,
        portfolio: analysis.site.portfolio,
        products: analysis.site.products,
        testimonials: analysis.site.testimonials,
        team: analysis.site.team,
        faqs: analysis.site.faqs,
        gallery: analysis.site.gallery,
        stats: analysis.site.stats,
        cta: analysis.site.cta,
        contact: analysis.site.contact,
        newsletter: analysis.site.newsletter,
        footer: analysis.site.footer,
        posts: analysis.site.posts.slice(0, 12),
      }),
    }

    const allEnvVars = { ...envVars, ...intelligenceVars }
    logs += `✓ ${Object.keys(allEnvVars).length} environment variables configured\n`

    logs += `\nStep 5: Setting project environment variables on Vercel...\n`
    await appendLog(deploymentId, logs)

    try {
      await setProjectEnvironmentVariables(projectId, allEnvVars)
      logs += `✓ Environment variables set (${Object.keys(allEnvVars).length} vars)\n`
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to set env vars'
      logs += `⚠ Warning: ${message}\n`
    }
    await appendLog(deploymentId, logs)

    logs += `\nStep 6: Triggering Vercel deployment...\n`
    await appendLog(deploymentId, logs)

    try {
      const deployment = await createDeployment({
        projectId,
        name: sanitizeProjectName(site.domain),
        gitSource: await getTemplateGitSource(),
      })

      const vercelUrl = `https://${deployment.url}`

      await updateDeployment(deploymentId, {
        vercelDeploymentId: deployment.id,
        deploymentUrl: vercelUrl,
      })

      await prisma.site.update({
        where: { id: site.id },
        data: { vercelProjectId: projectId },
      })

      logs += `✓ Deployment triggered: ${deployment.url}\n`
      logs += `Deployment ID: ${deployment.id}\n`
      await appendLog(deploymentId, logs)

      logs += `\nStep 7: Waiting for build to complete...\n`
      await appendLog(deploymentId, logs)

      const result = await pollDeploymentStatus(deployment.id, deploymentId, logs)

      if (result.success) {
        logs += `\n✅ Deployment successful!\n`
        logs += `Live URL: https://${result.url}\n`
        logs += `Template: ${site.template} (Intelligent Mode: ${site.template === 'adaptive' ? 'Yes' : 'No'})\n`
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
      const currentState = status.readyState

      if (isDeploymentFinal(currentState)) {
        if (isDeploymentSuccessful(currentState)) {
          return { success: true, url: status.url }
        }

        const errorMsg = status.errorMessage || status.error?.message || 'Build failed on Vercel'
        throw new DeploymentError(errorMsg, 'BUILD_FAILED')
      }

      const elapsed = Math.floor((Date.now() - startTime) / 1000)
      const progressLog = `  Status: ${currentState} (${elapsed}s elapsed)\n`

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

  throw new DeploymentError('Deployment timed out after 15 minutes. The build may still be running on Vercel — check your Vercel dashboard for the latest status.', 'BUILD_FAILED')
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
