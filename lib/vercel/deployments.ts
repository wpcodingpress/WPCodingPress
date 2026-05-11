import { getVercelClient } from './client'

export interface VercelDeployment {
  id: string
  url: string
  name: string
  state: 'BUILDING' | 'READY' | 'ERROR' | 'CANCELED'
  readyState: 'BUILDING' | 'READY' | 'ERROR' | 'CANCELED' | 'INITIALIZING' | 'QUEUED'
  createdAt: number
  buildingAt?: number
  readyAt?: number
  errorMessage?: string
  error?: { message: string }
}

export interface CreateDeploymentInput {
  projectId: string
  name: string
}

export async function createDeployment(input: CreateDeploymentInput): Promise<VercelDeployment> {
  const client = getVercelClient()

  const body: Record<string, unknown> = {
    name: input.name,
    target: 'production',
  }

  return client.post<VercelDeployment>(`/v13/deployments?projectId=${input.projectId}`, body)
}

export async function getDeployment(deploymentId: string): Promise<VercelDeployment> {
  const client = getVercelClient()
  return client.get<VercelDeployment>(`/v13/deployments/${deploymentId}`)
}

export async function cancelDeployment(deploymentId: string): Promise<VercelDeployment> {
  const client = getVercelClient()
  return client.patch<VercelDeployment>(`/v13/deployments/${deploymentId}/cancel`)
}

export async function listDeployments(projectId: string, limit = 10): Promise<VercelDeployment[]> {
  const client = getVercelClient()
  const result = await client.get<{ deployments: VercelDeployment[] }>(
    `/v6/deployments?projectId=${projectId}&limit=${limit}`
  )
  return result.deployments || []
}

export function deploymentStateLabel(state: string): string {
  switch (state) {
    case 'QUEUED':
      return 'Queued'
    case 'INITIALIZING':
      return 'Initializing'
    case 'BUILDING':
      return 'Building'
    case 'READY':
      return 'Deployed'
    case 'ERROR':
      return 'Failed'
    case 'CANCELED':
      return 'Cancelled'
    default:
      return state || 'Unknown'
  }
}

export function isDeploymentFinal(state: string): boolean {
  return state === 'READY' || state === 'ERROR' || state === 'CANCELED'
}

export function isDeploymentSuccessful(state: string): boolean {
  return state === 'READY'
}
