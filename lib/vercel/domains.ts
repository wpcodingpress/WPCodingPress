import { getVercelClient } from './client'

export interface VercelDomain {
  id: string
  name: string
  verified: boolean
  verification: Array<{
    type: string
    domain: string
    value: string
    reason: string
  }>
}

export interface VercelDomainConfig {
  verified: boolean
  verification: Array<{
    type: string
    domain: string
    value: string
    reason: string
  }>
  serviceType: string
  nameservers: string[]
}

export interface AddDomainResult {
  domain: VercelDomain
  records: Array<{
    type: string
    name: string
    value: string
    ttl?: number
  }>
}

export async function addDomain(projectId: string, domain: string): Promise<AddDomainResult> {
  const client = getVercelClient()
  const result = await client.post<AddDomainResult>(`/v9/projects/${projectId}/domains`, {
    name: domain,
  })
  return result
}

export async function removeDomain(projectId: string, domain: string): Promise<void> {
  const client = getVercelClient()
  await client.delete(`/v9/projects/${projectId}/domains/${encodeURIComponent(domain)}`)
}

export async function getDomainConfig(projectId: string, domain: string): Promise<VercelDomainConfig> {
  const client = getVercelClient()
  return client.get<VercelDomainConfig>(
    `/v9/projects/${projectId}/domains/${encodeURIComponent(domain)}/config`
  )
}

export async function verifyDomain(projectId: string, domain: string): Promise<VercelDomainConfig> {
  const client = getVercelClient()
  return client.post<VercelDomainConfig>(
    `/v9/projects/${projectId}/domains/${encodeURIComponent(domain)}/verify`
  )
}

export function generateDnsInstructions(verification: Array<{ type: string; domain: string; value: string }>) {
  return verification.map((record) => ({
    type: record.type,
    name: record.domain,
    value: record.value,
    description:
      record.type === 'TXT'
        ? 'Add this TXT record to your DNS settings to verify domain ownership'
        : record.type === 'CNAME'
          ? 'Add this CNAME record pointing to your Vercel deployment'
          : `Add this ${record.type} record`,
  }))
}
