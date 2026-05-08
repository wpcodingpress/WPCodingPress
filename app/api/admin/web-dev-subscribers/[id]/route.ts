import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';
import { PROJECT_STATUS_ORDER } from '@/lib/web-dev-service';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const subscription = await prisma.subscription.findUnique({
      where: { id },
      include: {
        user: {
          select: { id: true, name: true, email: true, phone: true, company: true },
        },
        onboardingForm: true,
        projectBoard: {
          select: { id: true, projectManagerName: true },
        },
      },
    });

    if (!subscription) {
      return NextResponse.json({ error: 'Subscription not found' }, { status: 404 });
    }

    return NextResponse.json({
      id: subscription.id,
      plan: subscription.plan,
      status: subscription.status,
      billingCycle: subscription.billingCycle,
      currentPeriodEnd: subscription.currentPeriodEnd.toISOString(),
      createdAt: subscription.createdAt.toISOString(),
      user: subscription.user,
      onboardingForm: subscription.onboardingForm,
      projectManagerName: subscription.projectBoard?.projectManagerName || null,
    });
  } catch (error) {
    console.error('Get web dev subscriber error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { projectStatus, status, plan } = body;

    if (projectStatus) {
      if (!PROJECT_STATUS_ORDER.includes(projectStatus)) {
        return NextResponse.json({ error: 'Invalid project status' }, { status: 400 });
      }

      const subscription = await prisma.subscription.findUnique({
        where: { id },
        include: { onboardingForm: true },
      });

      if (!subscription) {
        return NextResponse.json({ error: 'Subscription not found' }, { status: 404 });
      }

      if (subscription.onboardingForm) {
        await prisma.onboardingForm.update({
          where: { id: subscription.onboardingForm.id },
          data: { projectStatus },
        });
      } else {
        return NextResponse.json({ error: 'No onboarding form found' }, { status: 400 });
      }
    }

    if (status) {
      await prisma.subscription.update({
        where: { id },
        data: { status },
      });
    }

    if (plan) {
      await prisma.subscription.update({
        where: { id },
        data: { plan },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update web dev subscriber error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    await prisma.onboardingForm.deleteMany({ where: { subscriptionId: id } });
    await prisma.subscription.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete web dev subscriber error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
