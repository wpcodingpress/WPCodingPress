export function formatPrice(cents: number): string {
  if (!cents) return "$0"
  if (cents > 10000) {
    return `$${(cents / 100).toLocaleString()}`
  }
  return `$${cents}`
}

export function formatPriceSimple(cents: number): string {
  if (!cents) return "$0"
  return `$${cents}`
}