import { getVercelClient } from './client'

export interface VercelProject {
  id: string
  name: string
  framework: string | null
  createdAt: number
  updatedAt: number
  link?: {
    type: string
    repoId: string
    repo?: string
  }
}

export interface CreateProjectInput {
  name: string
  framework?: string
  environmentVariables?: Array<{ key: string; value: string; target?: string[] }>
}

export async function createProject(input: CreateProjectInput): Promise<VercelProject> {
  const client = getVercelClient()
  return client.post<VercelProject>('/v9/projects', {
    name: input.name,
    framework: input.framework || 'nextjs',
    environmentVariables: input.environmentVariables?.map((env) => ({
      key: env.key,
      value: env.value,
      target: env.target || ['production', 'preview', 'development'],
    })),
  })
}

export async function getProject(projectId: string): Promise<VercelProject | null> {
  const client = getVercelClient()
  try {
    return await client.get<VercelProject>(`/v9/projects/${projectId}`)
  } catch (error) {
    if (error instanceof Error && error.message.includes('404')) {
      return null
    }
    throw error
  }
}

export async function deleteProject(projectId: string): Promise<void> {
  const client = getVercelClient()
  await client.delete(`/v9/projects/${projectId}`)
}

export async function upsertEnvironmentVariables(
  projectId: string,
  envVars: Array<{ key: string; value: string; target?: string[] }>
): Promise<void> {
  const client = getVercelClient()
  for (const env of envVars) {
    await client.post(`/v10/projects/${projectId}/env`, {
      key: env.key,
      value: env.value,
      target: env.target || ['production', 'preview', 'development'],
      type: 'encrypted',
    })
  }
}
