import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { apiKey, domain } = body;

    if (!apiKey || !domain) {
      return NextResponse.json(
        { error: 'API key and domain are required' },
        { status: 400 }
      );
    }

    const site = await prisma.site.findUnique({
      where: { apiKey },
      include: {
        user: {
          include: {
            subscriptions: {
              where: { status: 'active' },
              orderBy: { createdAt: 'desc' },
              take: 1,
            },
          },
        },
      },
    });

    if (!site) {
      return NextResponse.json(
        { error: 'Invalid API key' },
        { status: 401 }
      );
    }

    if (site.domain !== domain) {
      return NextResponse.json(
        { error: 'Domain mismatch' },
        { status: 400 }
      );
    }

    const hasActiveSubscription = site.user.subscriptions.some(
      (sub) => sub.status === 'active'
    );

    if (!hasActiveSubscription) {
      return NextResponse.json(
        { error: 'No active subscription' },
        { status: 403 }
      );
    }

    await prisma.site.update({
      where: { id: site.id },
      data: {
        status: 'connected',
        lastSyncAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      site: {
        id: site.id,
        domain: site.domain,
        userEmail: site.user.email,
      },
    });
  } catch (error) {
    console.error('Verify site error:', error);
    return NextResponse.json(
      { error: 'Verification failed' },
      { status: 500 }
    );
  }
}