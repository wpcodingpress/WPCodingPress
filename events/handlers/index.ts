import { registerUserHandlers } from './user-handlers'
import { registerSubscriptionHandlers } from './subscription-handlers'
import { registerAdminAlertHandlers } from './admin-alert-handlers'

export function registerAllHandlers(): void {
  registerUserHandlers()
  registerSubscriptionHandlers()
  registerAdminAlertHandlers()
}
