import type { FeatureAdapterResult } from './types'
import type { FeatureMap } from '@/lib/engine'
import type { WPExportRaw } from '@/lib/engine/types'
import { detectAuthConfig } from './auth'
import { detectFormsConfig } from './forms'
import { detectSearchConfig } from './search'
import { detectWooCommerceConfig } from './woocommerce'

export function detectFeaturesForAdapter(wpRaw: WPExportRaw, features: FeatureMap): FeatureAdapterResult {
  const auth = detectAuthConfig(wpRaw, features)
  const forms = detectFormsConfig(wpRaw, features)
  const search = detectSearchConfig(wpRaw, features)
  const woocommerce = detectWooCommerceConfig(wpRaw, features)

  const detectedFeatures: string[] = []
  if (auth.enabled) detectedFeatures.push('auth')
  if (forms.enabled) detectedFeatures.push('forms')
  if (search.enabled) detectedFeatures.push('search')
  if (woocommerce.enabled) detectedFeatures.push('woocommerce')

  return { auth, forms, search, woocommerce, detectedFeatures }
}

export type { FeatureAdapterResult } from './types'
export type { AuthAdapterConfig, FormAdapterConfig, SearchAdapterConfig, WooCommerceAdapterConfig } from './types'
export { detectAuthConfig } from './auth'
export { detectFormsConfig } from './forms'
export { detectSearchConfig } from './search'
export { detectWooCommerceConfig } from './woocommerce'
