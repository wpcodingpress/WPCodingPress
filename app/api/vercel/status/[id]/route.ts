import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import prisma from '@/lib/prisma'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const deployment = await prisma.deployment.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
      include: {
        site: {
          select: {
            id: true,
            domain: true,
            wpSiteUrl: true,
            vercelProjectUrl: true,
            customDomain: true,
            deploymentStatus: true,
          },
        },
      },
    })

    if (!deployment) {
      return NextResponse.json({ error: 'Deployment not found' }, { status: 404 })
    }

    return NextResponse.json({
      deployment: {
        id: deployment.id,
        siteId: deployment.siteId,
        status: deployment.status,
        deploymentUrl: deployment.deploymentUrl,
        vercelDeploymentId: deployment.vercelDeploymentId,
        buildLogs: deployment.buildLogs,
        error: deployment.error,
        trigger: deployment.trigger,
        template: deployment.template,
        startedAt: deployment.startedAt,
        completedAt: deployment.completedAt,
        createdAt: deployment.createdAt,
      },
      site: deployment.site,
    })
  } catch (error) {
    console.error('[Deployment Status] Error:', error)
    return NextResponse.json({ error: 'Failed to get deployment status' }, { status: 500 })
  }
}
