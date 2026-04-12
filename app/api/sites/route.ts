import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';
import { requireActiveSubscription } from '@/lib/subscription';
import { createNotification } from '@/lib/notifications';
import crypto from 'crypto';

function generateApiKey(): string {
  return `wpc_${crypto.randomBytes(32).toString('hex')}`;
}

export async function POST(request: Request) {
  try {
    const auth = await requireActiveSubscription();
    if ('error' in auth) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { userId } = auth;
    const body = await request.json();
    const { domain, wpSiteUrl, apiKey: wpApiKey } = body;

    if (!domain || !wpSiteUrl) {
      return NextResponse.json(
        { error: 'Domain and WordPress site URL are required' },
        { status: 400 }
      );
    }

    if (!wpApiKey) {
      return NextResponse.json(
        { error: 'API key is required from WordPress plugin' },
        { status: 400 }
      );
    }

    const cleanWpUrl = wpSiteUrl.startsWith('http') ? wpSiteUrl : `https://${wpSiteUrl}`;
    
    let verifyResult;
    try {
      const verifyResponse = await fetch(`${cleanWpUrl}/wp-json/headless/v1/verify?api_key=${wpApiKey}`);
      if (!verifyResponse.ok) {
        return NextResponse.json(
          { error: 'Invalid API key. Please check your WordPress plugin settings and generate a new key.' },
          { status: 400 }
        );
      }
      verifyResult = await verifyResponse.json();
    } catch (error) {
      return NextResponse.json(
        { error: 'Cannot connect to WordPress site. Please verify your WordPress URL is correct and the plugin is installed.' },
        { status: 400 }
      );
    }

    const existingSite = await prisma.site.findFirst({
      where: {
        wpSiteUrl: cleanWpUrl,
        userId,
      },
    });

    if (existingSite) {
      return NextResponse.json(
        { error: 'This WordPress site is already connected to your account' },
        { status: 400 }
      );
    }

    const saasApiKey = generateApiKey();

    const site = await prisma.site.create({
      data: {
        userId,
        domain,
        wpSiteUrl: cleanWpUrl,
        apiKey: saasApiKey,
        wpApiKey: wpApiKey,
        status: 'connected',
        lastSyncAt: new Date(),
      },
    });

    await createNotification({
      userId,
      type: 'site',
      title: 'Site Connected Successfully!',
      message: `Your WordPress site at ${domain} has been connected. You can now start converting.`,
      link: '/dashboard/sites',
      priority: 'medium'
    })

    return NextResponse.json({
      site: {
        id: site.id,
        domain: site.domain,
        wpSiteUrl: site.wpSiteUrl,
        apiKey: site.apiKey,
        wpApiKey: site.wpApiKey,
        status: site.status,
      },
    });
  } catch (error) {
    console.error('Create site error:', error);
    return NextResponse.json(
      { error: 'Failed to create site' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const sites = await prisma.site.findMany({
      where: { userId: session.user.id },
      include: {
        jobs: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ sites });
  } catch (error) {
    console.error('Get sites error:', error);
    return NextResponse.json(
      { error: 'Failed to get sites' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const auth = await requireActiveSubscription();
    if ('error' in auth) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { searchParams } = new URL(request.url);
    const siteId = searchParams.get('id');

    if (!siteId) {
      return NextResponse.json({ error: 'Site ID required' }, { status: 400 });
    }

    const site = await prisma.site.findFirst({
      where: {
        id: siteId,
        userId: auth.userId,
      },
    });

    if (!site) {
      return NextResponse.json({ error: 'Site not found' }, { status: 404 });
    }

    await prisma.site.delete({
      where: { id: siteId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete site error:', error);
    return NextResponse.json(
      { error: 'Failed to delete site' },
      { status: 500 }
    );
  }
}