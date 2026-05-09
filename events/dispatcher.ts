import { EventType, EventPayload, EventHandler } from './index'

class EventDispatcher {
  private handlers: Map<EventType, Set<EventHandler>> = new Map()
  private initialized = false

  on(event: EventType, handler: EventHandler): void {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, new Set())
    }
    this.handlers.get(event)!.add(handler)
  }

  off(event: EventType, handler: EventHandler): void {
    this.handlers.get(event)?.delete(handler)
  }

  async dispatch(event: EventType, payload: EventPayload): Promise<void> {
    if (!this.initialized) {
      const { ensureEventHandlersRegistered } = await import('@/lib/register-events')
      ensureEventHandlersRegistered()
      this.initialized = true
    }

    const handlers = this.handlers.get(event)
    if (!handlers || handlers.size === 0) {
      console.warn(`[EventDispatcher] No handlers registered for ${event}`)
      return
    }

    const results = await Promise.allSettled(
      Array.from(handlers).map((handler) => handler(payload))
    )

    for (const result of results) {
      if (result.status === 'rejected') {
        console.error(`[EventDispatcher] Handler failed for ${event}:`, result.reason)
      }
    }
  }

  getListeners(event: EventType): number {
    return this.handlers.get(event)?.size ?? 0
  }
}

export const eventDispatcher = new EventDispatcher()
