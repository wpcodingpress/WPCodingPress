import { NextResponse } from 'next/server'
import { requireActiveSubscription } from '@/lib/subscription'
import { startDeployment, triggerRedeploy, DeploymentError } from '@/lib/deployment/service'
import { canDeploy } from '@/lib/quotas/service'
import { DeploySchema, RedeploySchema } from '@/lib/validation/schemas'

export async function POST(request: Request) {
  try {
    const auth = await requireActiveSubscription()
    if ('error' in auth) {
      return NextResponse.json({ error: auth.error }, { status: auth.status })
    }

    const { userId, subscription } = auth
    const body = await request.json()

    const isRedeploy = body.action === 'redeploy'
    const schema = isRedeploy ? RedeploySchema : DeploySchema
    const parsed = schema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || 'Invalid request' },
        { status: 400 }
      )
    }

    const quotaCheck = await canDeploy(userId)
    if (!quotaCheck.allowed) {
      return NextResponse.json({ error: quotaCheck.error }, { status: 403 })
    }

    let result: { deploymentId: string; status: string }

    if (isRedeploy) {
      result = await triggerRedeploy(userId, parsed.data.siteId)
    } else {
      const deployData = parsed.data as { siteId: string; options?: { template?: string } }
      result = await startDeployment(userId, deployData.siteId, deployData.options)
    }

    return NextResponse.json({
      deploymentId: result.deploymentId,
      status: result.status,
      message: 'Deployment started. This may take a few minutes.',
    })
  } catch (error) {
    if (error instanceof DeploymentError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode })
    }
    console.error('[Deploy API] Error:', error)
    return NextResponse.json({ error: 'Failed to start deployment' }, { status: 500 })
  }
}
