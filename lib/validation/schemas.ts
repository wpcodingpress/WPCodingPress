import { z } from 'zod'

export const DeploySchema = z.object({
  siteId: z.string().min(1, 'Site ID is required'),
  options: z
    .object({
      template: z.enum(['news', 'business', 'modern', 'advanced', 'adaptive']).optional(),
    })
    .optional(),
})

export const DomainAddSchema = z.object({
  siteId: z.string().min(1, 'Site ID is required'),
  domain: z
    .string()
    .min(1, 'Domain is required')
    .regex(
      /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/,
      'Invalid domain format. Use example.com (no http://)'
    ),
})

export const DomainVerifySchema = z.object({
  domainId: z.string().min(1, 'Domain ID is required'),
})

export const DomainDeleteSchema = z.object({
  domainId: z.string().min(1, 'Domain ID is required'),
})

export const RedeploySchema = z.object({
  siteId: z.string().min(1, 'Site ID is required'),
})

export const WordPressWebhookSchema = z.object({
  action: z.enum([
    'post_updated',
    'post_published',
    'post_deleted',
    'page_updated',
    'media_updated',
  ]),
  post_id: z.number().optional(),
  post_type: z.string().optional(),
  site_id: z.string().optional(),
  api_key: z.string().optional(),
  timestamp: z.string().optional(),
})

export const SiteCreateSchema = z.object({
  domain: z.string().min(1, 'Domain is required'),
  wpSiteUrl: z.string().min(1, 'WordPress URL is required').url('Must be a valid URL'),
  apiKey: z.string().min(1, 'API key is required'),
})

export type DeployInput = z.infer<typeof DeploySchema>
export type DomainAddInput = z.infer<typeof DomainAddSchema>
export type RedeployInput = z.infer<typeof RedeploySchema>
export type WordPressWebhookInput = z.infer<typeof WordPressWebhookSchema>
export type SiteCreateInput = z.infer<typeof SiteCreateSchema>
