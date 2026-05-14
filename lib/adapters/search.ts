import type { SearchAdapterConfig } from './types'
import type { FeatureMap } from '@/lib/engine'
import type { WPExportRaw } from '@/lib/engine/types'

const SEARCH_PLUGINS = [
  'algolia', 'searchwp', 'relevanssi', 'elasticpress', 'wp-search-with-algolia',
  'ivory-search', 'better-search', 'ajax-search-lite', 'ajax-search-pro',
  'woocommerce-product-search', 'yith-woocommerce-ajax-search',
]

export function detectSearchConfig(wpRaw: WPExportRaw, features: FeatureMap): SearchAdapterConfig {
  const plugins = (wpRaw.plugins as string[]) || []
  const activePlugins = plugins.filter(p => !p.startsWith('inactive:'))

  const hasAdvancedSearch = activePlugins.some(p => SEARCH_PLUGINS.some(sp => p.toLowerCase().includes(sp)))
  const hasSearchPage = features.hasSearch

  let searchType: SearchAdapterConfig['type'] = null
  if (hasAdvancedSearch) {
    if (activePlugins.some(p => p.toLowerCase().includes('algolia'))) searchType = 'algolia'
    else if (activePlugins.some(p => p.toLowerCase().includes('elastic'))) searchType = 'elastic'
    else searchType = 'custom'
  } else if (hasSearchPage) {
    searchType = 'wordpress'
  }

  return {
    enabled: hasSearchPage || hasAdvancedSearch,
    type: searchType,
    liveSearch: hasAdvancedSearch,
    filtersEnabled: hasAdvancedSearch,
    searchPage: hasSearchPage ? '/search' : null,
  }
}
