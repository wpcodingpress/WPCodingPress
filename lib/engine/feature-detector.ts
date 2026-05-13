import type { FeatureMap } from './types'

const FORM_PLUGINS = ['contact-form-7', 'wpforms', 'elementor-pro', 'gravityforms', 'ninja-forms', 'formidable', 'caldera-forms']
const SEO_PLUGINS = ['yoast', 'rank-math', 'all-in-one-seo', 'seopress', 'the-seo-framework']
const MEMBERSHIP_PLUGINS = ['woocommerce-memberships', 'memberpress', 'paid-memberships-pro', 'restrict-content-pro', 'ultimate-member', 'wp-members']
const BOOKING_PLUGINS = ['woocommerce-bookings', 'bookly', 'easy-appointments', 'booking-calendar', ' Amelia', 'booked']

export function detectFeatures(wpRaw: Record<string, unknown>): FeatureMap {
  const plugins = extractPlugins(wpRaw)
  const pluginSlugs = plugins.map(p => p.slug?.toLowerCase() || '')
  const pluginNames = plugins.map(p => p.name?.toLowerCase() || '')
  const combined = [...pluginSlugs, ...pluginNames]

  const hasWooCommerce = combined.some(s => s.includes('woocommerce'))
  const hasElementor = combined.some(s => s.includes('elementor'))
  const hasMultilingual = combined.some(s => s.includes('wpml') || s.includes('polylang') || s.includes('translatepress'))

  const posts = (wpRaw.posts || []) as Array<Record<string, unknown>>
  const pages = (wpRaw.pages || []) as Array<Record<string, unknown>>
  const menus = wpRaw.menus ? extractMenuData(wpRaw.menus) : []
  const siteInfo = (wpRaw.site_info || {}) as Record<string, unknown>

  return {
    hasAuth: detectAuth(posts, pages, combined),
    hasRegistration: detectRegistration(pages, combined),
    hasForms: detectForms(posts, pages, combined),
    hasWooCommerce,
    hasMemberships: combined.some(s => MEMBERSHIP_PLUGINS.some(p => s.includes(p))),
    hasComments: posts.some(p => ((p.comment_count as number) || (p.commentCount as number) || 0) > 0),
    hasSearch: menus.some(m => hasSearchItem(m)) || combined.some(s => s.includes('search')),
    hasBookings: combined.some(s => BOOKING_PLUGINS.some(p => s.includes(p))),
    hasMultilingual,
    hasGalleries: hasGalleryContent(posts, pages, combined),
    hasCustomPostTypes: !!wpRaw.custom_post_types && Object.keys(wpRaw.custom_post_types as Record<string, unknown>).length > 0,
    hasElementor,
    hasSeoPlugin: combined.some(s => SEO_PLUGINS.some(p => s.includes(p))),
    hasAnalytics: combined.some(s => s.includes('analytics') || s.includes('google-site-kit') || s.includes('monsterinsights')),
    hasNewsletter: combined.some(s => s.includes('newsletter') || s.includes('mailchimp') || s.includes('sendinblue')),
    hasPortfolio: hasPortfolioContent(posts, pages, combined),
    hasTestimonials: hasTestimonialContent(posts, pages, combined),
    hasFAQ: hasFAQContent(posts, pages, combined),
    hasTeam: hasTeamContent(posts, pages, combined),
    hasServices: hasServiceContent(posts, pages, combined),
    hasPricing: hasPricingContent(posts, pages, combined),
    hasVideo: hasVideoContent(posts, combined),
  }
}

function extractPlugins(wpRaw: Record<string, unknown>): Array<{ slug: string; name: string; active: boolean }> {
  const plugins = wpRaw.plugins
  if (Array.isArray(plugins)) return plugins as Array<{ slug: string; name: string; active: boolean }>
  if (plugins && typeof plugins === 'object') return Object.values(plugins) as Array<{ slug: string; name: string; active: boolean }>
  return []
}

function extractMenuData(menus: unknown): Array<Record<string, unknown>> {
  if (Array.isArray(menus)) return menus
  if (menus && typeof menus === 'object') {
    const items = (menus as Record<string, unknown>).items
    if (Array.isArray(items)) return items
    return Object.values(menus).flat().filter(Boolean) as Array<Record<string, unknown>>
  }
  return []
}

function hasSearchItem(menu: Record<string, unknown>): boolean {
  const checkItem = (item: Record<string, unknown>): boolean => {
    if (item.type === 'search') return true
    if (item.title?.toString().toLowerCase().includes('search')) return true
    if (item.children && Array.isArray(item.children)) return item.children.some(c => checkItem(c as Record<string, unknown>))
    return false
  }
  return checkItem(menu)
}

function detectAuth(posts: Array<Record<string, unknown>>, pages: Array<Record<string, unknown>>, plugins: string[]): boolean {
  if (plugins.some(p => p.includes('wp-user') || p.includes('login') || p.includes('members'))) return true
  const allPages = [...posts, ...pages]
  return allPages.some(p => {
    const slug = p.slug?.toString().toLowerCase() || ''
    const title = p.title?.toString().toLowerCase() || ''
    return slug.includes('login') || slug.includes('log-in') || slug.includes('signin') ||
           title.includes('login') || title.includes('sign in') || title.includes('log in')
  })
}

function detectRegistration(pages: Array<Record<string, unknown>>, plugins: string[]): boolean {
  if (plugins.some(p => p.includes('registration') || p.includes('register') || p.includes('user-registration'))) return true
  return pages.some(p => {
    const slug = p.slug?.toString().toLowerCase() || ''
    const title = p.title?.toString().toLowerCase() || ''
    return slug.includes('register') || slug.includes('signup') || slug.includes('create-account') ||
           title.includes('register') || title.includes('sign up') || title.includes('create account')
  })
}

function detectForms(posts: Array<Record<string, unknown>>, pages: Array<Record<string, unknown>>, plugins: string[]): boolean {
  if (plugins.some(p => FORM_PLUGINS.some(fp => p.includes(fp)))) return true
  const allContent = [...posts, ...pages]
  return allContent.some(p => {
    const content = (p.content || '').toString().toLowerCase()
    const slug = p.slug?.toString().toLowerCase() || ''
    return slug.includes('contact') || slug.includes('form') || content.includes('[contact-form') ||
           content.includes('[wpforms') || content.includes('wpcf7') || content.includes('type="submit"')
  })
}

function hasGalleryContent(posts: Array<Record<string, unknown>>, pages: Array<Record<string, unknown>>, plugins: string[]): boolean {
  if (plugins.some(p => p.includes('gallery') || p.includes('nextgen') || p.includes('envira'))) return true
  const allContent = [...posts, ...pages]
  return allContent.some(p => {
    const content = (p.content || '').toString().toLowerCase()
    return content.includes('[gallery') || content.includes('gallery') || (Array.isArray(p.gallery) && p.gallery.length > 0)
  })
}

function hasPortfolioContent(posts: Array<Record<string, unknown>>, pages: Array<Record<string, unknown>>, plugins: string[]): boolean {
  if (plugins.some(p => p.includes('portfolio'))) return true
  const hasPortfolioPage = [...posts, ...pages].some(p => {
    const slug = p.slug?.toString().toLowerCase() || ''
    const title = p.title?.toString().toLowerCase() || ''
    return slug.includes('portfolio') || title.includes('portfolio')
  })
  if (hasPortfolioPage) return true
  const customTypes = posts.filter(p => (p.type || '').toString() === 'portfolio')
  return customTypes.length > 2
}

function hasTestimonialContent(posts: Array<Record<string, unknown>>, pages: Array<Record<string, unknown>>, plugins: string[]): boolean {
  if (plugins.some(p => p.includes('testimonial'))) return true
  const allContent = [...posts, ...pages]
  return allContent.some(p => {
    const slug = p.slug?.toString().toLowerCase() || ''
    const title = p.title?.toString().toLowerCase() || ''
    return slug.includes('testimonial') || title.includes('testimonial') || title.includes('review')
  })
}

function hasFAQContent(posts: Array<Record<string, unknown>>, pages: Array<Record<string, unknown>>, plugins: string[]): boolean {
  if (plugins.some(p => p.includes('faq') || p.includes('accordion'))) return true
  const allContent = [...posts, ...pages]
  return allContent.some(p => {
    const slug = p.slug?.toString().toLowerCase() || ''
    const title = p.title?.toString().toLowerCase() || ''
    return slug.includes('faq') || slug.includes('faqs') || title.includes('faq') || title.includes('frequently asked')
  })
}

function hasTeamContent(posts: Array<Record<string, unknown>>, pages: Array<Record<string, unknown>>, plugins: string[]): boolean {
  if (plugins.some(p => p.includes('team') || p.includes('member'))) return true
  const allContent = [...posts, ...pages]
  return allContent.some(p => {
    const slug = p.slug?.toString().toLowerCase() || ''
    const title = p.title?.toString().toLowerCase() || ''
    return slug.includes('team') || title.includes('team') || slug.includes('our-people') || slug.includes('about')
  })
}

function hasServiceContent(posts: Array<Record<string, unknown>>, pages: Array<Record<string, unknown>>, plugins: string[]): boolean {
  if (plugins.some(p => p.includes('service'))) return true
  const allContent = [...posts, ...pages]
  return allContent.some(p => {
    const slug = p.slug?.toString().toLowerCase() || ''
    const title = p.title?.toString().toLowerCase() || ''
    return slug === 'services' || title === 'Services' || slug.includes('service') || title.includes('Service')
  })
}

function hasPricingContent(posts: Array<Record<string, unknown>>, pages: Array<Record<string, unknown>>, plugins: string[]): boolean {
  const allContent = [...posts, ...pages]
  return allContent.some(p => {
    const slug = p.slug?.toString().toLowerCase() || ''
    const title = p.title?.toString().toLowerCase() || ''
    return slug.includes('pricing') || title.includes('pricing') || slug.includes('plans') || title.includes('plans') || slug.includes('price')
  })
}

function hasVideoContent(posts: Array<Record<string, unknown>>, plugins: string[]): boolean {
  if (plugins.some(p => p.includes('video') || p.includes('youtube') || p.includes('vimeo'))) return true
  return posts.some(p => {
    const content = (p.content || '').toString().toLowerCase()
    return content.includes('youtube') || content.includes('vimeo') || content.includes('<video') || content.includes('[video')
  })
}
