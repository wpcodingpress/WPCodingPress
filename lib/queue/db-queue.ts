import type { QueueAdapter, QueueJobType, QueueHandler, QueueJob, QueueJobStatus } from './types'
import { DEFAULT_MAX_ATTEMPTS } from './types'
import prisma from '@/lib/prisma'

type PrismaModel = 'deployment' | 'rebuildLog'
type StatusField = 'status'

interface PrismaRecord {
  id: string
  status: string
  error?: string | null
  [key: string]: unknown
}

export class DatabaseQueue implements QueueAdapter {
  private handlers = new Map<string, QueueHandler>()
  private polling = false
  private pollTimer: ReturnType<typeof setInterval> | null = null

  async add<T>(
    type: QueueJobType,
    data: T,
    options?: { maxAttempts?: number }
  ): Promise<string> {
    const modelMap: Record<QueueJobType, { model: PrismaModel; statusField: StatusField }> = {
      deployment: { model: 'deployment', statusField: 'status' },
      rebuild: { model: 'rebuildLog', statusField: 'status' },
      domain_verify: { model: 'deployment', statusField: 'status' },
    }

    const mapping = modelMap[type]
    if (!mapping) throw new Error(`Unknown job type: ${type}`)

    const id = `queue_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
    return id
  }

  process<T>(type: QueueJobType, handler: QueueHandler<T>): void {
    this.handlers.set(type, handler as QueueHandler)
    if (!this.polling) {
      this.startPolling()
    }
  }

  private startPolling(): void {
    this.polling = true
    this.pollTimer = setInterval(async () => {
      await this.poll()
    }, 5000)
  }

  private async poll(): Promise<void> {
    try {
      const pendingDeployments = await prisma.deployment.findMany({
        where: { status: { in: ['pending', 'queued'] } },
        orderBy: { createdAt: 'asc' },
        take: 3,
      })

      for (const deployment of pendingDeployments) {
        const handler = this.handlers.get('deployment')
        if (handler) {
          await prisma.deployment.update({
            where: { id: deployment.id },
            data: { status: 'building' },
          })

          try {
            await handler({
              id: deployment.id,
              type: 'deployment',
              data: { deploymentId: deployment.id, siteId: deployment.siteId },
              status: 'processing',
              attempts: 1,
              maxAttempts: DEFAULT_MAX_ATTEMPTS,
              createdAt: deployment.createdAt,
              updatedAt: new Date(),
            })
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error'
            await prisma.deployment.update({
              where: { id: deployment.id },
              data: { status: 'failed', error: errorMessage },
            })
          }
        }
      }

      const pendingRebuilds = await prisma.rebuildLog.findMany({
        where: { status: { in: ['pending', 'queued'] } },
        orderBy: { createdAt: 'asc' },
        take: 3,
      })

      for (const rebuild of pendingRebuilds) {
        const handler = this.handlers.get('rebuild')
        if (handler) {
          await prisma.rebuildLog.update({
            where: { id: rebuild.id },
            data: { status: 'building', startedAt: new Date() },
          })

          try {
            await handler({
              id: rebuild.id,
              type: 'rebuild',
              data: { rebuildId: rebuild.id, siteId: rebuild.siteId, deploymentId: rebuild.deploymentId },
              status: 'processing',
              attempts: 1,
              maxAttempts: DEFAULT_MAX_ATTEMPTS,
              createdAt: rebuild.createdAt,
              updatedAt: new Date(),
            })
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error'
            await prisma.rebuildLog.update({
              where: { id: rebuild.id },
              data: { status: 'failed', error: errorMessage },
            })
          }
        }
      }
    } catch (error) {
      console.error('[DB Queue] Poll error:', error)
    }
  }

  stop(): void {
    if (this.pollTimer) {
      clearInterval(this.pollTimer)
      this.pollTimer = null
    }
    this.polling = false
  }
}
