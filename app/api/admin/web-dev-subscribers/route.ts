import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';
import { PROJECT_STATUS_ORDER, type ProjectStatus } from '@/lib/web-dev-service';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const subscriptions = await prisma.subscription.findMany({
      where: {
        plan: { in: ['STARTER', 'COMPLETE'] },
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            createdAt: true,
            phone: true,
          },
        },
        onboardingForm: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
            businessName: true,
            projectStatus: true,
            websiteTypes: true,
            websiteGoal: true,
            createdAt: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const data = subscriptions.map((sub) => ({
      id: sub.id,
      plan: sub.plan,
      status: sub.status,
      billingCycle: sub.billingCycle,
      currentPeriodEnd: sub.currentPeriodEnd,
      currentPeriodStart: sub.currentPeriodStart,
      cancelAtPeriodEnd: sub.cancelAtPeriodEnd,
      createdAt: sub.createdAt,
      user: sub.user,
      onboardingForm: sub.onboardingForm
        ? {
            ...sub.onboardingForm,
            websiteTypes: JSON.parse(sub.onboardingForm.websiteTypes),
          }
        : null,
    }));

    const starterCount = subscriptions.filter((s) => s.plan === 'STARTER').length;
    const completeCount = subscriptions.filter((s) => s.plan === 'COMPLETE').length;
    const activeCount = subscriptions.filter((s) => s.status === 'active').length;
    const mrr = starterCount * 29 + completeCount * 59;
    const arr = mrr * 12;

    return NextResponse.json({
      subscribers: data,
      stats: {
        total: data.length,
        active: activeCount,
        starter: starterCount,
        complete: completeCount,
        mrr,
        arr,
      },
    });
  } catch (error) {
    console.error('Admin web dev subscribers API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
