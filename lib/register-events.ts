import { registerAllHandlers } from '@/events/handlers'

let registered = false

export function ensureEventHandlersRegistered(): void {
  if (registered) return
  registerAllHandlers()
  registered = true
}

ensureEventHandlersRegistered()
