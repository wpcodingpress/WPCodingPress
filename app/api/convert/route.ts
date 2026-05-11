import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';
import { requireActiveSubscription } from '@/lib/subscription';
import { startDeployment, DeploymentError } from '@/lib/deployment/service';

export async function POST(request: Request) {
  try {
    const auth = await requireActiveSubscription();
    if ('error' in auth) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { userId } = auth;
    const body = await request.json();
    const { siteId, options = {} } = body;
    const template = options.template || 'news';

    if (!siteId) {
      return NextResponse.json({ error: 'Site ID is required' }, { status: 400 });
    }

    const site = await prisma.site.findFirst({
      where: {
        id: siteId,
        userId,
        status: 'connected',
      },
    });

    if (!site) {
      return NextResponse.json(
        { error: 'Site not found or not connected' },
        { status: 404 }
      );
    }

    if (!site.wpApiKey) {
      return NextResponse.json(
        { error: 'WordPress API key not found. Please reconnect your site.' },
        { status: 400 }
      );
    }

    const result = await startDeployment(userId, siteId, { template });

    return NextResponse.json({
      deploymentId: result.deploymentId,
      status: result.status,
      message: 'Conversion started. This may take a few minutes.',
    });
  } catch (error) {
    if (error instanceof DeploymentError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    console.error('Convert error:', error);
    return NextResponse.json(
      { error: 'Failed to start conversion' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const siteId = searchParams.get('siteId');

    const where = siteId
      ? { siteId, userId: session.user.id }
      : { userId: session.user.id };

    const deployments = await prisma.deployment.findMany({
      where,
      include: { site: true },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ jobs: deployments });
  } catch (error) {
    console.error('Get jobs error:', error);
    return NextResponse.json(
      { error: 'Failed to get jobs' },
      { status: 500 }
    );
  }
}
