import type {
  NormalizedSiteData, ContentPost, ContentPage, ContentCategory, ContentAuthor,
  HeroContent, ServiceItem, PortfolioItem, ProductItem, TestimonialItem, TeamMember,
  FAQItem, GalleryItem, StatItem, CTAContent, ContactInfo, NewsletterConfig,
  FooterContent, ContentNavigation, SiteSettings, ContentMedia,
} from '@/types/content-schema'
import type { WPExportRaw } from './types'

export function normalizeWPData(wpRaw: WPExportRaw, wpBaseUrl: string): NormalizedSiteData {
  const siteInfo = (wpRaw.site_info || {}) as Record<string, unknown>

  const settings = buildSiteSettings(siteInfo, wpBaseUrl)
  const authors = extractAuthors(wpRaw.users, wpRaw.posts)
  const categories = extractCategories(wpRaw.categories)
  const tags = extractTags(wpRaw.tags)
  const media = extractMedia(wpRaw.media)
  const navigation = extractNavigation(wpRaw.menus)
  const posts = extractPosts(wpRaw.posts, categories, authors)
  const pages = extractPages(wpRaw.pages, categories)

  return {
    settings,
    navigation,
    posts,
    pages,
    categories,
    tags,
    authors,
    hero: extractHero(siteInfo, posts, media),
    services: extractServices(wpRaw, siteInfo),
    portfolio: extractPortfolio(wpRaw, siteInfo),
    products: extractProducts(wpRaw) as unknown as ProductItem[],
    testimonials: extractTestimonials(wpRaw, siteInfo),
    team: extractTeam(wpRaw, siteInfo),
    faqs: extractFAQs(wpRaw, siteInfo),
    gallery: extractGallery(wpRaw, media),
    stats: extractStats(siteInfo),
    cta: extractCTA(siteInfo),
    contact: extractContact(siteInfo),
    newsletter: extractNewsletter(siteInfo),
    footer: extractFooter(siteInfo),
    media,
  }
}

function buildSiteSettings(siteInfo: Record<string, unknown>, baseUrl: string): SiteSettings {
  return {
    name: (siteInfo.name as string) || 'My Website',
    description: (siteInfo.description as string) || '',
    url: baseUrl,
    language: (siteInfo.language as string) || 'en',
    logo: siteInfo.logo ? { url: siteInfo.logo as string, alt: 'Logo', width: 0, height: 0, mimeType: 'image/png' } : null,
    favicon: null,
    timezone: (siteInfo.timezone as string) || 'UTC',
    dateFormat: (siteInfo.date_format as string) || 'F j, Y',
    socialLinks: extractSocialLinks(siteInfo),
    seo: {
      title: (siteInfo.name as string) || '',
      description: (siteInfo.description as string) || '',
      noIndex: false,
    },
  }
}

function extractPosts(rawPosts: unknown, categories: ContentCategory[], authors: ContentAuthor[]): ContentPost[] {
  if (!Array.isArray(rawPosts)) return []
  return rawPosts.map((p: Record<string, unknown>) => ({
    id: String(p.id || ''),
    title: String(p.title || ''),
    slug: String(p.slug || ''),
    content: String(p.content || ''),
    excerpt: String(p.excerpt || ((p.excerpt as Record<string, string>)?.rendered || '')),
    date: String(p.date || ''),
    modified: String(p.modified || ''),
    status: (p.status as ContentPost['status']) || 'published',
    featuredImage: extractFeaturedImage(p),
    categories: extractPostCategories(p, categories),
    tags: extractPostTags(p),
    author: extractPostAuthor(p, authors),
    seo: {
      title: String(((p.seo as Record<string, unknown>)?.title as string) || p.title || ''),
      description: String(((p.seo as Record<string, unknown>)?.description as string) || p.excerpt || ''),
      noIndex: false,
    },
    readingTime: estimateReadingTime(String(p.content || '')),
    commentCount: Number(p.comment_count || p.commentCount || 0),
  }))
}

function extractPages(rawPages: unknown, categories: ContentCategory[]): ContentPage[] {
  if (!Array.isArray(rawPages)) return []
  return rawPages.map((p: Record<string, unknown>) => ({
    id: String(p.id || ''),
    title: String(p.title || ''),
    slug: String(p.slug || ''),
    content: String(p.content || ''),
    excerpt: String(p.excerpt || ''),
    featuredImage: extractFeaturedImage(p),
    template: String(p.template || 'default'),
    seo: {
      title: String(p.title || ''),
      description: String(p.excerpt || ''),
      noIndex: false,
    },
  }))
}

function extractCategories(rawCategories: unknown): ContentCategory[] {
  if (!Array.isArray(rawCategories)) return []
  return rawCategories.map((c: Record<string, unknown>) => ({
    id: String(c.id || ''),
    name: String(c.name || ''),
    slug: String(c.slug || ''),
    description: String(c.description || ''),
    count: Number(c.count || 0),
  }))
}

function extractTags(rawTags: unknown): ContentCategory[] {
  if (!Array.isArray(rawTags)) return []
  return rawTags.map((t: Record<string, unknown>) => ({
    id: String(t.id || ''),
    name: String(t.name || ''),
    slug: String(t.slug || ''),
    description: String(t.description || ''),
    count: Number(t.count || 0),
  }))
}

function extractAuthors(rawUsers: unknown, rawPosts: unknown): ContentAuthor[] {
  const authorMap = new Map<string, ContentAuthor>()

  if (Array.isArray(rawUsers)) {
    rawUsers.forEach((u: Record<string, unknown>) => {
      authorMap.set(String(u.id), {
        id: String(u.id),
        name: String(u.display_name || u.name || ''),
        avatar: (u.avatar_urls as Record<string, string>)?.['96'] || u.avatar as string,
        bio: String(u.description || ''),
        email: String(u.email || ''),
      })
    })
  }

  if (Array.isArray(rawPosts)) {
    rawPosts.forEach((p: Record<string, unknown>) => {
      const authorData = p.author as Record<string, unknown>
      if (authorData?.node) {
        const node = authorData.node as Record<string, unknown>
        const id = String(node.id || node.databaseId || '')
        if (!authorMap.has(id)) {
          authorMap.set(id, {
            id,
            name: String(node.name || ''),
            avatar: node.avatar as string,
            bio: String(node.description || ''),
          })
        }
      }
    })
  }

  return Array.from(authorMap.values())
}

function extractMedia(rawMedia: unknown): ContentMedia[] {
  if (!Array.isArray(rawMedia)) return []
  return rawMedia.map((m: Record<string, unknown>) => ({
    url: String((m.source_url || m.url || m.guid || '') as string),
    alt: String(m.alt_text || m.alt || ''),
    width: Number((m.media_details as Record<string, unknown>)?.width || m.width || 0),
    height: Number((m.media_details as Record<string, unknown>)?.height || m.height || 0),
    mimeType: String(m.mime_type || m.mimeType || 'image/jpeg'),
    caption: String((m.caption as Record<string, string>)?.rendered || m.caption || ''),
  }))
}

function extractNavigation(rawMenus: unknown): ContentNavigation[] {
  if (!rawMenus) return []
  const menuData = Array.isArray(rawMenus) ? rawMenus : [rawMenus]
  return menuData.map((m: Record<string, unknown>) => ({
    id: String(m.id || m.slug || 'main'),
    name: String(m.name || m.title || 'Main Menu'),
    location: (m.location as ContentNavigation['location']) || 'primary',
    items: extractMenuItems(m.items || m),
  }))
}

function extractMenuItems(items: unknown): ContentNavigation['items'] {
  if (!Array.isArray(items)) return []
  return items.map((item: Record<string, unknown>) => ({
    id: String(item.id || ''),
    label: String(item.title || item.label || ''),
    url: String(item.url || `/${item.slug || ''}`),
    target: item.target === '_blank' ? '_blank' : '_self',
    children: extractMenuItems(item.children || []),
    order: Number(item.order || item.menu_order || 0),
  }))
}

function extractFeaturedImage(post: Record<string, unknown>): ContentMedia | null {
  const fi = post.featuredImage as Record<string, unknown>
  if (fi?.node) {
    const node = fi.node as Record<string, unknown>
    return {
      url: String(node.sourceUrl || node.url || ''),
      alt: String(node.altText || node.alt || ''),
      width: Number((node.mediaDetails as Record<string, unknown>)?.width || node.width || 0),
      height: Number((node.mediaDetails as Record<string, unknown>)?.height || node.height || 0),
      mimeType: String(node.mimeType || 'image/jpeg'),
    }
  }
  if (typeof fi === 'string' && fi) {
    return { url: fi, alt: '', width: 0, height: 0, mimeType: 'image/jpeg' }
  }
  return null
}

function extractPostCategories(post: Record<string, unknown>, categories: ContentCategory[]): ContentCategory[] {
  const cats = post.categories as Record<string, unknown>
  if (cats?.nodes && Array.isArray(cats.nodes)) {
    return cats.nodes.map((n: Record<string, unknown>) => ({
      id: String(n.id || n.databaseId || ''),
      name: String(n.name || ''),
      slug: String(n.slug || ''),
      description: String(n.description || ''),
      count: Number(n.count || 0),
    }))
  }
  const catIds = post.categories as number[] | string[]
  if (Array.isArray(catIds)) {
    return catIds.map(id => categories.find(c => c.id === String(id))).filter(Boolean) as ContentCategory[]
  }
  return []
}

function extractPostTags(post: Record<string, unknown>): ContentCategory[] {
  const tags = post.tags as Record<string, unknown>
  if (tags?.nodes && Array.isArray(tags.nodes)) {
    return tags.nodes.map((n: Record<string, unknown>) => ({
      id: String(n.id || ''),
      name: String(n.name || ''),
      slug: String(n.slug || ''),
      description: String(n.description || ''),
      count: Number(n.count || 0),
    }))
  }
  return []
}

function extractPostAuthor(post: Record<string, unknown>, authors: ContentAuthor[]): ContentAuthor {
  const authorData = post.author as Record<string, unknown>
  if (authorData?.node) {
    const node = authorData.node as Record<string, unknown>
    const id = String(node.id || node.databaseId || '')
    const found = authors.find(a => a.id === id)
    if (found) return found
    return { id, name: String(node.name || ''), avatar: node.avatar as string }
  }
  const authorId = String(post.author || '')
  const found = authors.find(a => a.id === authorId)
  if (found) return found
  if (typeof post.author === 'string') return { id: '1', name: post.author }
  return { id: '0', name: 'Unknown' }
}

function extractHero(siteInfo: Record<string, unknown>, posts: ContentPost[], media: ContentMedia[]): HeroContent | null {
  const heroTitle = (siteInfo.hero_title as string) || (siteInfo.name as string) || ''
  if (!heroTitle && posts.length === 0) return null

  const firstPost = posts[0]
  return {
    title: heroTitle,
    subtitle: (siteInfo.hero_subtitle as string) || '',
    description: (siteInfo.description as string) || (firstPost?.excerpt || ''),
    backgroundImage: firstPost?.featuredImage || media[0] || null,
    backgroundVideo: (siteInfo.hero_video as string) || null,
    ctaPrimary: (siteInfo.cta_label && siteInfo.cta_url)
      ? { label: siteInfo.cta_label as string, url: siteInfo.cta_url as string }
      : null,
    ctaSecondary: null,
    layout: (siteInfo.hero_layout as HeroContent['layout']) || 'centered',
  }
}

function extractServices(wpRaw: WPExportRaw, siteInfo: Record<string, unknown>): ServiceItem[] {
  const services = wpRaw.services as Array<Record<string, unknown>>
  if (Array.isArray(services) && services.length > 0) {
    return services.map((s: Record<string, unknown>) => ({
      id: String(s.id || ''),
      title: String(s.title || s.name || ''),
      description: String(s.description || s.content || ''),
      icon: String(s.icon || ''),
      image: null,
      features: Array.isArray(s.features) ? s.features.map(String) : [],
      price: String(s.price || ''),
      url: String(s.url || s.slug || ''),
    }))
  }
  const customServices = siteInfo.services as Array<Record<string, unknown>>
  if (Array.isArray(customServices)) {
    return customServices.map((s, i) => ({
      id: String(i),
      title: String(s.title || ''),
      description: String(s.description || ''),
      icon: String(s.icon || ''),
      image: null,
      features: Array.isArray(s.features) ? s.features.map(String) : [],
      price: String(s.price || ''),
      url: String(s.url || ''),
    }))
  }
  return []
}

function extractPortfolio(wpRaw: WPExportRaw, siteInfo: Record<string, unknown>): PortfolioItem[] {
  const portfolios = wpRaw.portfolio as Array<Record<string, unknown>>
  if (Array.isArray(portfolios)) {
    return portfolios.map((p: Record<string, unknown>) => ({
      id: String(p.id || ''),
      title: String(p.title || ''),
      description: String(p.description || p.content || ''),
      category: String(p.category || ''),
      image: p.image ? { url: String(p.image as string || (p.image as Record<string, unknown>)?.url || ''), alt: String(p.title || ''), width: 0, height: 0, mimeType: 'image/jpeg' } : { url: '', alt: '', width: 0, height: 0, mimeType: 'image/jpeg' },
      images: [],
      url: String(p.url || p.link || ''),
      date: String(p.date || ''),
      client: String(p.client || ''),
      tags: Array.isArray(p.tags) ? p.tags.map(String) : [],
    }))
  }
  return []
}

function extractProducts(wpRaw: WPExportRaw): PortfolioItem[] {
  const products = wpRaw.products as Array<Record<string, unknown>> || []
  if (Array.isArray(products)) {
    return products.map((p: Record<string, unknown>) => ({
      id: String(p.id || ''),
      title: String(p.name || p.title || ''),
      description: String(p.description || p.content || ''),
      category: String(p.category || ''),
      image: { url: String((p.source_url as string) || ((p.images as Array<Record<string, unknown>>)?.[0]?.source_url as string) || ''), alt: String(p.name || ''), width: 0, height: 0, mimeType: 'image/jpeg' },
      images: [],
      url: String(p.permalink || p.url || ''),
      date: String(p.date_created || p.date || ''),
      client: '',
      tags: [],
    }))
  }
  return []
}

function extractTestimonials(wpRaw: WPExportRaw, siteInfo: Record<string, unknown>): TestimonialItem[] {
  const testimonials = wpRaw.testimonials as Array<Record<string, unknown>>
  if (Array.isArray(testimonials)) {
    return testimonials.map((t: Record<string, unknown>) => ({
      id: String(t.id || ''),
      name: String(t.name || t.title || ''),
      title: String(t.title || t.position || ''),
      company: String(t.company || ''),
      avatar: t.avatar ? { url: String(t.avatar as string || (t.avatar as Record<string, unknown>)?.url || ''), alt: String(t.name || ''), width: 0, height: 0, mimeType: 'image/jpeg' } : null,
      content: String(t.content || t.testimonial || ''),
      rating: Number(t.rating || 5),
    }))
  }
  return []
}

function extractTeam(wpRaw: WPExportRaw, siteInfo: Record<string, unknown>): TeamMember[] {
  const team = wpRaw.team as Array<Record<string, unknown>>
  if (Array.isArray(team)) {
    return team.map((m: Record<string, unknown>) => ({
      id: String(m.id || ''),
      name: String(m.name || m.title || ''),
      title: String(m.title || m.position || ''),
      bio: String(m.bio || m.description || ''),
      avatar: m.avatar ? { url: String(m.avatar as string || (m.image as Record<string, unknown>)?.url || ''), alt: String(m.name || ''), width: 0, height: 0, mimeType: 'image/jpeg' } : null,
      socialLinks: Array.isArray(m.social_links) ? m.social_links as Array<{ platform: string; url: string }> : [],
    }))
  }
  return []
}

function extractFAQs(wpRaw: WPExportRaw, siteInfo: Record<string, unknown>): FAQItem[] {
  const faqs = wpRaw.faq as Array<Record<string, unknown>>
  if (Array.isArray(faqs)) {
    return faqs.map((f: Record<string, unknown>, i) => ({
      id: String(f.id || i),
      question: String(f.question || f.title || ''),
      answer: String(f.answer || f.content || ''),
      category: String(f.category || 'general'),
      order: Number(f.order || i),
    }))
  }
  return []
}

function extractGallery(wpRaw: WPExportRaw, media: ContentMedia[]): GalleryItem[] {
  const galleries = wpRaw.gallery as Array<Record<string, unknown>>
  if (Array.isArray(galleries)) {
    return galleries.map((g: Record<string, unknown>) => ({
      id: String(g.id || ''),
      title: String(g.title || ''),
      description: String(g.description || g.caption || ''),
      image: { url: String(g.url || g.source_url || ''), alt: String(g.alt || g.title || ''), width: 0, height: 0, mimeType: 'image/jpeg' },
      category: String(g.category || ''),
    }))
  }
  return media.slice(0, 20).map((m, i) => ({
    id: String(i),
    title: m.alt || `Image ${i + 1}`,
    description: m.caption || '',
    image: m,
    category: '',
  }))
}

function extractStats(siteInfo: Record<string, unknown>): StatItem[] {
  const stats = siteInfo.stats as Array<Record<string, unknown>>
  if (Array.isArray(stats)) {
    return stats.map((s: Record<string, unknown>, i) => ({
      id: String(s.id || i),
      label: String(s.label || ''),
      value: Number(s.value || 0),
      suffix: String(s.suffix || ''),
      prefix: String(s.prefix || ''),
      icon: String(s.icon || ''),
    }))
  }
  return [
    { id: 'posts', label: 'Posts', value: 0, suffix: '+', prefix: '', icon: 'file-text' },
    { id: 'authors', label: 'Authors', value: 0, suffix: '+', prefix: '', icon: 'users' },
    { id: 'categories', label: 'Categories', value: 0, suffix: '', prefix: '', icon: 'folder' },
  ]
}

function extractCTA(siteInfo: Record<string, unknown>): CTAContent | null {
  if (!siteInfo.cta_label) return null
  return {
    title: String(siteInfo.cta_label || 'Get Started'),
    description: String(siteInfo.cta_description || ''),
    buttonLabel: String(siteInfo.cta_button || 'Get Started'),
    buttonUrl: String(siteInfo.cta_url || '/contact'),
    backgroundType: (siteInfo.cta_bg_type as CTAContent['backgroundType']) || 'gradient',
    backgroundValue: String(siteInfo.cta_bg || ''),
  }
}

function extractContact(siteInfo: Record<string, unknown>): ContactInfo | null {
  const email = (siteInfo.admin_email || siteInfo.email || '') as string
  if (!email && !siteInfo.phone && !siteInfo.address) return null
  return {
    email: String(email),
    phone: String(siteInfo.phone || ''),
    address: String(siteInfo.address || ''),
    latitude: Number(siteInfo.latitude || 0),
    longitude: Number(siteInfo.longitude || 0),
    formFields: [
      { type: 'text', label: 'Name', required: true, placeholder: 'Your name' },
      { type: 'email', label: 'Email', required: true, placeholder: 'your@email.com' },
      { type: 'textarea', label: 'Message', required: true, placeholder: 'Your message' },
    ],
  }
}

function extractNewsletter(siteInfo: Record<string, unknown>): NewsletterConfig | null {
  if (!siteInfo.newsletter_title && !siteInfo.has_newsletter) return null
  return {
    title: String(siteInfo.newsletter_title || 'Stay Updated'),
    description: String(siteInfo.newsletter_description || 'Get the latest updates delivered to your inbox.'),
    buttonLabel: String(siteInfo.newsletter_button || 'Subscribe'),
    placeholder: String(siteInfo.newsletter_placeholder || 'Enter your email'),
  }
}

function extractFooter(siteInfo: Record<string, unknown>): FooterContent | null {
  if (!siteInfo.footer_copyright && !siteInfo.footer_description) return null
  return {
    copyright: String(siteInfo.footer_copyright || `© ${new Date().getFullYear()} ${siteInfo.name || ''}`),
    description: String(siteInfo.footer_description || ''),
    socialLinks: extractSocialLinks(siteInfo).map(l => ({ ...l, icon: getIconForPlatform(l.platform) })),
    columns: extractFooterColumns(siteInfo),
    branding: {
      logo: siteInfo.logo ? { url: siteInfo.logo as string, alt: 'Logo', width: 0, height: 0, mimeType: 'image/png' } : null,
      name: String(siteInfo.name || ''),
      tagline: String(siteInfo.description || ''),
    },
  }
}

function extractSocialLinks(siteInfo: Record<string, unknown>): Array<{ platform: string; url: string }> {
  if (siteInfo.social_links && Array.isArray(siteInfo.social_links)) {
    return siteInfo.social_links as Array<{ platform: string; url: string }>
  }
  const links: Array<{ platform: string; url: string }> = []
  const socialFields = ['facebook', 'twitter', 'instagram', 'linkedin', 'youtube', 'tiktok', 'github', 'dribbble', 'behance']
  socialFields.forEach(p => {
    if (siteInfo[`social_${p}`]) links.push({ platform: p, url: siteInfo[`social_${p}`] as string })
  })
  return links
}

function extractFooterColumns(siteInfo: Record<string, unknown>): FooterContent['columns'] {
  const columns = siteInfo.footer_columns as Array<Record<string, unknown>>
  if (Array.isArray(columns)) {
    return columns.map((c: Record<string, unknown>) => ({
      title: String(c.title || ''),
      links: Array.isArray(c.links) ? c.links as Array<{ label: string; url: string }> : [],
    }))
  }
  return []
}

function getIconForPlatform(platform: string): string {
  const iconMap: Record<string, string> = {
    facebook: 'facebook', twitter: 'twitter', instagram: 'instagram',
    linkedin: 'linkedin', youtube: 'youtube', tiktok: 'music',
    github: 'github', dribbble: 'dribbble', behance: 'behance',
  }
  return iconMap[platform.toLowerCase()] || 'link'
}

function estimateReadingTime(content: string): number {
  const words = content.replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(words / 200))
}
