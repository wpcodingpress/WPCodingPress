import { getVercelClient, VercelApiError } from './client'

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

interface VercelEnvVar {
  id: string
  key: string
  value: string
  target: string[]
  type: string
  createdAt: number
  updatedAt: number
}

export async function setProjectEnvironmentVariables(
  projectId: string,
  envVars: Record<string, string>
): Promise<void> {
  const client = getVercelClient()

  const existingVars: VercelEnvVar[] = []

  try {
    const response = await client.get<{ envs: VercelEnvVar[] }>(
      `/v10/projects/${projectId}/env?decrypt=true`
    )
    existingVars.push(...(response.envs || []))
  } catch {
    // If we can't list, we'll just try to create — may get 409 conflicts
  }

  for (const [key, value] of Object.entries(envVars)) {
    const existing = existingVars.find((v) => v.key === key)

    if (existing) {
      try {
        await client.patch(`/v10/projects/${projectId}/env/${existing.id}`, {
          key,
          value,
          target: ['production', 'preview', 'development'],
          type: 'encrypted',
        })
      } catch {
        await client.delete(`/v10/projects/${projectId}/env/${existing.id}`)
        await client.post(`/v10/projects/${projectId}/env`, {
          key,
          value,
          target: ['production', 'preview', 'development'],
          type: 'encrypted',
        })
      }
    } else {
      try {
        await client.post(`/v10/projects/${projectId}/env`, {
          key,
          value,
          target: ['production', 'preview', 'development'],
          type: 'encrypted',
        })
      } catch (err) {
        if (err instanceof VercelApiError && err.status === 409) {
          await client.delete(`/v10/projects/${projectId}/env/${key}`)
          await client.post(`/v10/projects/${projectId}/env`, {
            key,
            value,
            target: ['production', 'preview', 'development'],
            type: 'encrypted',
          })
        } else {
          throw err
        }
      }
    }
  }
}
