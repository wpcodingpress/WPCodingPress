import type { QueueAdapter, QueueJobType, QueueHandler, QueueJob } from './types'
import { DatabaseQueue } from './db-queue'

let adapter: QueueAdapter | null = null
const queueName = 'wpcodingpress'

export function getQueueAdapter(): QueueAdapter {
  if (!adapter) {
    const driver = process.env.QUEUE_DRIVER || 'database'
    switch (driver) {
      case 'database':
        adapter = new DatabaseQueue()
        break
      default:
        adapter = new DatabaseQueue()
    }
  }
  return adapter
}

export async function enqueue<T>(
  type: QueueJobType,
  data: T,
  options?: { maxAttempts?: number }
): Promise<string> {
  const queue = getQueueAdapter()
  return queue.add(type, data, options)
}

const handlers = new Map<string, QueueHandler>()

export function registerHandler<T>(type: QueueJobType, handler: QueueHandler<T>): void {
  handlers.set(type, handler as QueueHandler)
  getQueueAdapter().process(type, handler as QueueHandler)
}

export function getHandler(type: string): QueueHandler | undefined {
  return handlers.get(type)
}
