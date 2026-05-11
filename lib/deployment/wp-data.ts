export async function fetchWordPressData(wpSiteUrl: string, apiKey: string) {
  const headers = {
    'X-API-Key': apiKey,
    'Content-Type': 'application/json',
  }

  const baseUrl = wpSiteUrl.replace(/\/$/, '')

  try {
    const [exportRes, categoriesRes] = await Promise.all([
      fetch(`${baseUrl}/wp-json/headless/v1/export`, { headers }),
      fetch(`${baseUrl}/wp-json/headless/v1/categories`, { headers }),
    ])

    if (!exportRes.ok) {
      const errorText = await exportRes.text()
      throw new Error(`WordPress API error: ${exportRes.status} - ${errorText}`)
    }

    const exportData = await exportRes.json()
    const categoriesData = categoriesRes.ok ? await categoriesRes.json() : []

    return {
      ...exportData,
      categories: categoriesData,
    }
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error(
        'Cannot connect to WordPress site. Please verify the site URL is correct.'
      )
    }
    throw error
  }
}

export function transformWPData(wpData: Record<string, unknown>, wpBaseUrl: string) {
  const posts = ((wpData.posts as Array<Record<string, unknown>>) || []).map((post) => ({
    id: post.id,
    title: post.title,
    slug: post.slug,
    content: post.content,
    excerpt: post.excerpt,
    date: post.date,
    modified: post.modified,
    featuredImage:
      ((post.featuredImage as Record<string, unknown>)?.node as Record<string, unknown>)
        ?.sourceUrl || null,
    categories:
      ((post.categories as Record<string, unknown>)?.nodes as Array<Record<string, unknown>>)?.map(
        (c) => c.name
      ) || [],
    author:
      ((post.author as Record<string, unknown>)?.node as Record<string, unknown>)?.name ||
      'Unknown',
    seo: post.seo || {},
  }))

  const categories = ((wpData.categories as Array<Record<string, unknown>>) || []).map((cat) => ({
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
    description: cat.description,
    count: cat.count,
  }))

  const pages = ((wpData.pages as Array<Record<string, unknown>>) || []).map((page) => ({
    id: page.id,
    title: page.title,
    slug: page.slug,
    content: page.content,
    template: page.template,
  }))

  const menus = wpData.menus || {}
  const siteInfo = (wpData.site_info as Record<string, unknown>) || {}

  return {
    posts,
    categories,
    pages,
    menus,
    site_info: {
      name: (siteInfo.name as string) || 'WordPress Site',
      description: (siteInfo.description as string) || '',
      url: wpBaseUrl,
      language: (siteInfo.language as string) || 'en',
    },
    api_config: {
      base_url: wpBaseUrl,
    },
  }
}

export async function verifyWordPressConnection(
  wpSiteUrl: string,
  apiKey: string
): Promise<boolean> {
  try {
    const cleanUrl = wpSiteUrl.replace(/\/$/, '')
    const response = await fetch(
      `${cleanUrl}/wp-json/headless/v1/verify?api_key=${apiKey}`,
      { signal: AbortSignal.timeout(10000) }
    )
    return response.ok
  } catch {
    return false
  }
}
