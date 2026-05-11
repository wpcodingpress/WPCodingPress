export type QueueJobType = 'deployment' | 'rebuild' | 'domain_verify'

export type QueueJobStatus = 'pending' | 'processing' | 'completed' | 'failed'

export interface QueueJob<T = unknown> {
  id: string
  type: QueueJobType
  data: T
  status: QueueJobStatus
  attempts: number
  maxAttempts: number
  error?: string
  createdAt: Date
  updatedAt: Date
}

export type QueueHandler<T = unknown> = (job: QueueJob<T>) => Promise<void>

export interface QueueAdapter {
  add<T>(type: QueueJobType, data: T, options?: { maxAttempts?: number }): Promise<string>
  process<T>(type: QueueJobType, handler: QueueHandler<T>): void
}

export const DEFAULT_MAX_ATTEMPTS = 3
