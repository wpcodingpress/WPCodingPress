import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';
import {
  WEB_DEV_PLANS,
  type WebDevPlan,
  type BillingCycle,
  createCheckoutUrl,
} from '@/lib/web-dev-service';

const TESTING_MODE = process.env.TESTING_MODE === 'true';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const body = await request.json();
    const { plan, billingCycle } = body as { plan: WebDevPlan; billingCycle: BillingCycle };

    if (!plan || !WEB_DEV_PLANS[plan]) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
    }

    if (!billingCycle || !['monthly', 'annual'].includes(billingCycle)) {
      return NextResponse.json({ error: 'Invalid billing cycle' }, { status: 400 });
    }

    const existingSub = await prisma.subscription.findFirst({
      where: { userId: user.id, status: 'active', plan: { in: ['STARTER', 'COMPLETE'] } },
    });

    if (existingSub) {
      const isUpgrade = existingSub.plan === 'STARTER' && plan === 'COMPLETE';
      const isSamePlan = existingSub.plan === plan;

      if (isSamePlan) {
        return NextResponse.json({
          message: 'You already have an active subscription on this plan',
          alreadyActive: true,
          subscription: existingSub,
          redirectTo: '/dashboard/web-dev',
        });
      }

      if (!isUpgrade) {
        return NextResponse.json({
          message: 'Subscription change not supported',
          alreadyActive: true,
          subscription: existingSub,
          redirectTo: '/dashboard/web-dev',
        });
      }

      // STARTER → COMPLETE upgrade
      if (TESTING_MODE) {
        const updated = await prisma.subscription.update({
          where: { id: existingSub.id },
          data: {
            plan: 'COMPLETE',
            billingCycle,
            currentPeriodStart: new Date(),
            currentPeriodEnd: new Date(Date.now() + (billingCycle === 'annual' ? 365 : 30) * 24 * 60 * 60 * 1000),
          },
        });

        return NextResponse.json({
          success: true,
          isUpgrade: true,
          subscription: updated,
          redirectTo: '/dashboard/web-dev',
          message: 'Upgraded to Complete Plan!',
        });
      }

      const origin = request.headers.get('origin') || undefined;
      const checkoutUrl = createCheckoutUrl(plan, billingCycle, origin);

      return NextResponse.json({
        success: true,
        isUpgrade: true,
        url: checkoutUrl,
        message: 'Redirecting to Gumroad to complete upgrade...',
      });
    }

    if (TESTING_MODE) {
      const newSub = await prisma.subscription.create({
        data: {
          userId: user.id,
          plan,
          status: 'active',
          billingCycle,
          currentPeriodStart: new Date(),
          currentPeriodEnd: new Date(Date.now() + (billingCycle === 'annual' ? 365 : 30) * 24 * 60 * 60 * 1000),
        },
      });

      return NextResponse.json({
        success: true,
        subscription: newSub,
        redirectTo: '/onboarding?plan=' + plan + '&billing=' + billingCycle,
        message: 'Subscription activated! Redirecting to onboarding...',
      });
    }

    const origin = request.headers.get('origin') || undefined;
    const checkoutUrl = createCheckoutUrl(plan, billingCycle, origin);

    return NextResponse.json({
      success: true,
      url: checkoutUrl,
      plan: {
        name: WEB_DEV_PLANS[plan].name,
        price: billingCycle === 'monthly' ? WEB_DEV_PLANS[plan].monthlyPrice : WEB_DEV_PLANS[plan].annualPrice,
        billingCycle,
      },
      message: 'You will be redirected to Gumroad to complete payment.',
    });
  } catch (error) {
    console.error('Web dev subscription error:', error);
    return NextResponse.json({ error: 'Failed to create subscription' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const subscription = await prisma.subscription.findFirst({
      where: {
        userId: session.user.id,
        plan: { in: ['STARTER', 'COMPLETE'] },
      },
      orderBy: { createdAt: 'desc' },
      include: { onboardingForm: true },
    });

    return NextResponse.json({
      hasSubscription: !!subscription,
      subscription: subscription || null,
    });
  } catch (error) {
    console.error('Get web dev subscription error:', error);
    return NextResponse.json({ error: 'Failed to get subscription' }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const subscription = await prisma.subscription.findFirst({
      where: {
        userId: session.user.id,
        status: 'active',
        plan: { in: ['STARTER', 'COMPLETE'] },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!subscription) {
      return NextResponse.json({ error: 'No active web dev subscription found' }, { status: 400 });
    }

    await prisma.subscription.update({
      where: { id: subscription.id },
      data: { status: 'cancelled', cancelAtPeriodEnd: true, cancelledAt: new Date() },
    });

    return NextResponse.json({ success: true, message: 'Subscription cancelled' });
  } catch (error) {
    console.error('Cancel subscription error:', error);
    return NextResponse.json({ error: 'Failed to cancel subscription' }, { status: 500 });
  }
}
