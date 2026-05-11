import type { QueueAdapter, QueueJobType, QueueHandler, QueueJob } from './types'
import { DEFAULT_MAX_ATTEMPTS } from './types'

/**
 * BullMQ adapter stub for future Redis-backed queue.
 *
 * To activate:
 * 1. Set QUEUE_DRIVER=bullmq in .env
 * 2. Add REDIS_URL to .env
 * 3. Install: npm install bullmq ioredis
 * 4. Uncomment the import and implementation below
 *
 * import { Queue, Worker } from 'bullmq'
 * import IORedis from 'ioredis'
 */
export class BullMQQueue implements QueueAdapter {
  async add<T>(
    type: QueueJobType,
    data: T,
    options?: { maxAttempts?: number }
  ): Promise<string> {
    throw new Error(
      'BullMQ is not configured. Set QUEUE_DRIVER=database in .env or install bullmq + ioredis and configure REDIS_URL.'
    )
  }

  process<T>(type: QueueJobType, handler: QueueHandler<T>): void {
    throw new Error(
      'BullMQ is not configured. Set QUEUE_DRIVER=database in .env or install bullmq + ioredis and configure REDIS_URL.'
    )
  }
}
