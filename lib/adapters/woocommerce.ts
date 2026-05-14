import type { WooCommerceAdapterConfig } from './types'
import type { FeatureMap } from '@/lib/engine'
import type { WPExportRaw } from '@/lib/engine/types'

export function detectWooCommerceConfig(wpRaw: WPExportRaw, features: FeatureMap): WooCommerceAdapterConfig {
  const woocommerce = wpRaw.woocommerce as Record<string, unknown> | undefined
  const rawPlugins = (wpRaw.plugins as string[]) || []
  const activePlugins = rawPlugins.filter(p => !p.startsWith('inactive:'))
  const isActive = features.hasWooCommerce || activePlugins.some(p =>
    p.toLowerCase().includes('woocommerce')
  )

  const rawProducts = (wpRaw.products as Array<Record<string, unknown>>) || []
  const hasVariations = rawProducts.some(p =>
    p.type === 'variable' || (p.variations as unknown[])?.length > 0
  )

  return {
    enabled: isActive,
    features: {
      products: isActive,
      cart: isActive,
      checkout: isActive,
      myAccount: isActive && (woocommerce?.has_account_page as boolean || false),
      reviews: isActive && (woocommerce?.has_reviews as boolean || true),
      categories: isActive,
      tags: isActive,
      relatedProducts: isActive,
      wishlist: isActive && activePlugins.some(p =>
        p.toLowerCase().includes('yith-woocommerce-wishlist') ||
        p.toLowerCase().includes('ti-woocommerce-wishlist')
      ),
    },
    currency: String(woocommerce?.currency || 'USD'),
    productCount: rawProducts.length,
    hasVariations,
    productPage: '/products/[slug]',
    cartPage: '/cart',
    checkoutPage: '/checkout',
  }
}
