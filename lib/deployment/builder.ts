export interface DeploymentPayload {
  name: string
  projectName: string
  environmentVariables: Record<string, string>
  gitSource: {
    type: 'github'
    repoId: string
  }
}

export interface BuildInput {
  siteId: string
  wpSiteUrl: string
  wpApiKey: string
  domain: string
  template: string
  transformedData: Record<string, unknown>
}

export function buildDeploymentPayload(input: BuildInput): DeploymentPayload {
  const { wpSiteUrl, wpApiKey, domain, template } = input

  const sanitized = domain
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')

  const projectName = `wp-headless-${sanitized}-${template}`

  return {
    name: projectName,
    projectName,
    environmentVariables: {
      NEXT_PUBLIC_WORDPRESS_URL: wpSiteUrl,
      NEXT_PUBLIC_WORDPRESS_API_URL: `${wpSiteUrl}/wp-json/headless/v1`,
      WORDPRESS_API_KEY: wpApiKey,
      NEXT_PUBLIC_SITE_NAME: domain,
      NEXT_PUBLIC_SITE_URL: domain,
      NEXT_PUBLIC_TEMPLATE: template,
      NODE_ENV: 'production',
    },
    gitSource: {
      type: 'github',
      repoId: process.env.VERCEL_TEMPLATE_REPO_ID || '',
    },
  }
}

export function buildDeploymentEnvVars(input: BuildInput): Record<string, string> {
  return {
    NEXT_PUBLIC_WORDPRESS_URL: input.wpSiteUrl,
    NEXT_PUBLIC_WORDPRESS_API_URL: `${input.wpSiteUrl}/wp-json/headless/v1`,
    WORDPRESS_API_KEY: input.wpApiKey,
    NEXT_PUBLIC_SITE_NAME: input.domain,
    NEXT_PUBLIC_SITE_URL: input.domain,
    NEXT_PUBLIC_TEMPLATE: input.template,
    NODE_ENV: 'production',
  }
}

export function sanitizeProjectName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 100)
}
