const VERCEL_BASE_URL = 'https://api.vercel.com'

interface VercelRequestOptions {
  method?: string
  body?: unknown
  params?: Record<string, string>
}

export class VercelClient {
  private token: string
  private teamId: string | null

  constructor(token: string, teamId?: string) {
    this.token = token
    this.teamId = teamId ?? null
  }

  private async request<T>(path: string, options: VercelRequestOptions = {}): Promise<T> {
    const { method = 'GET', body, params } = options

    const url = new URL(`${VERCEL_BASE_URL}${path}`)
    if (this.teamId) url.searchParams.set('teamId', this.teamId)
    if (params) {
      for (const [key, value] of Object.entries(params)) {
        url.searchParams.set(key, value)
      }
    }

    const response = await fetch(url.toString(), {
      method,
      headers: {
        Authorization: `Bearer ${this.token}`,
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    })

    if (!response.ok) {
      const errorBody = await response.text().catch(() => '')
      throw new VercelApiError(response.status, response.statusText, errorBody, path)
    }

    if (response.status === 204) return undefined as T
    return response.json()
  }

  async get<T>(path: string, params?: Record<string, string>): Promise<T> {
    return this.request<T>(path, { params })
  }

  async post<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>(path, { method: 'POST', body })
  }

  async delete<T>(path: string): Promise<T> {
    return this.request<T>(path, { method: 'DELETE' })
  }

  async patch<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>(path, { method: 'PATCH', body })
  }
}

export class VercelApiError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    public body: string,
    public path: string
  ) {
    super(`Vercel API ${status} (${statusText}) on ${path}: ${body.slice(0, 200)}`)
    this.name = 'VercelApiError'
  }
}

let vercelClientInstance: VercelClient | null = null

export function getVercelClient(): VercelClient {
  if (!vercelClientInstance) {
    const token = process.env.VERCEL_TOKEN
    if (!token) {
      throw new Error('VERCEL_TOKEN environment variable is not set')
    }
    vercelClientInstance = new VercelClient(token, process.env.VERCEL_TEAM_ID)
  }
  return vercelClientInstance
}
