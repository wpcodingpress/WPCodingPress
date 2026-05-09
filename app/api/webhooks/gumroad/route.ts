import { NextResponse } from 'next/server';
import crypto from 'crypto';
import prisma from '@/lib/prisma';
import { createNotification } from '@/lib/notifications';
import { eventDispatcher } from '@/events/dispatcher';
import { EventTypes } from '@/events';

interface GumroadSalePayload {
  id: string;
  product_id: string;
  product_name: string;
  email: string;
  price: number;
  currency: string;
  subscription_id?: string;
  subscription_unit?: 'month' | 'year';
  created_at: string;
}

interface GumroadSubscriptionCancelledPayload {
  id: string;
  product_id: string;
  product_name: string;
  email: string;
  subscription_id: string;
  cancelled_at: string;
  cancelled: boolean;
}

interface GumroadSubscriptionEndedPayload {
  id: string;
  product_id: string;
  product_name: string;
  email: string;
  subscription_id: string;
  ended: boolean;
  ended_at: string;
}

function detectWebDevPlan(productName: string): { plan: string; isWebDev: boolean } {
  const name = productName.toLowerCase();
  if (name.includes('starter')) return { plan: 'STARTER', isWebDev: true };
  if (name.includes('complete')) return { plan: 'COMPLETE', isWebDev: true };
  if (name.includes('enterprise')) return { plan: 'enterprise', isWebDev: false };
  if (name.includes('pro')) return { plan: 'pro', isWebDev: false };
  return { plan: 'free', isWebDev: false };
}

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const signature = request.headers.get('x-gumroad-signature');
    const webhookSecret = process.env.GUMROAD_WEBHOOK_SECRET;

    if (!webhookSecret) {
      return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 });
    }

    const hash = 'sha256=' + crypto.createHmac('sha256', webhookSecret).update(body).digest('hex');
    if (signature !== hash) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const payload = JSON.parse(body);

    const eventType = payload.subscription_ended
      ? 'subscription_ended'
      : payload.cancelled
        ? 'subscription_cancelled'
        : 'sale';

    if (eventType === 'subscription_cancelled') {
      const data = payload as GumroadSubscriptionCancelledPayload;
      const { plan, isWebDev } = detectWebDevPlan(data.product_name);

      const subscription = await prisma.subscription.findFirst({
        where: {
          gumroadSubscriptionId: data.subscription_id,
        },
        include: { user: true },
      });

      if (subscription) {
        await prisma.subscription.update({
          where: { id: subscription.id },
          data: {
            status: 'cancelled',
            cancelAtPeriodEnd: true,
            cancelledAt: new Date(data.cancelled_at),
          },
        });

        const planDisplay = plan === 'STARTER' ? 'Starter' : plan === 'COMPLETE' ? 'Complete' : plan;

        eventDispatcher.dispatch(EventTypes.SUBSCRIPTION_CANCELLED, {
          userId: subscription.userId,
          email: subscription.user.email,
          name: subscription.user.name,
          plan,
          planDisplay,
          subscriptionId: subscription.id,
        }).catch(() => {});

        await createNotification({
          userId: subscription.userId,
          type: 'subscription',
          title: isWebDev ? `${planDisplay} Plan Cancelled` : 'Subscription Cancelled',
          message: isWebDev
            ? `Your ${planDisplay} Plan subscription has been cancelled. You'll have access until the end of the billing period.`
            : 'Your subscription has been cancelled.',
          link: '/dashboard/subscription',
          priority: 'high',
        });
      }

      return NextResponse.json({ received: true });
    }

    if (eventType === 'subscription_ended') {
      const data = payload as GumroadSubscriptionEndedPayload;

      const subscription = await prisma.subscription.findFirst({
        where: {
          gumroadSubscriptionId: data.subscription_id,
        },
      });

      if (subscription) {
        await prisma.subscription.update({
          where: { id: subscription.id },
          data: {
            status: 'expired',
          },
        });
      }

      return NextResponse.json({ received: true });
    }

    const salePayload = payload as GumroadSalePayload;
    const { plan: detectedPlan, isWebDev } = detectWebDevPlan(salePayload.product_name);

    if (!isWebDev) {
      const eventTypeLegacy = salePayload.product_name?.toLowerCase().includes('enterprise') ? 'enterprise' : 'pro';
      const isSubscription = salePayload.subscription_id && salePayload.subscription_unit;
      const planName = eventTypeLegacy === 'enterprise' ? 'Enterprise' : 'Pro';

      let periodEnd = new Date();
      if (isSubscription) {
        if (salePayload.subscription_unit === 'month') {
          periodEnd.setMonth(periodEnd.getMonth() + 1);
        } else {
          periodEnd.setFullYear(periodEnd.getFullYear() + 1);
        }
      } else {
        periodEnd.setFullYear(periodEnd.getFullYear() + 1);
      }

      let user = await prisma.user.findUnique({ where: { email: salePayload.email } });

      let isNewUser = false;
      if (!user) {
        user = await prisma.user.create({
          data: {
            email: salePayload.email,
            name: salePayload.email.split('@')[0],
            password: '',
          },
        });
        isNewUser = true;
      }

      const existingSub = await prisma.subscription.findFirst({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
      });

      if (existingSub) {
        await prisma.subscription.update({
          where: { id: existingSub.id },
          data: {
            status: 'active',
            plan: eventTypeLegacy,
            gumroadSaleId: salePayload.id,
            gumroadSubscriptionId: salePayload.subscription_id || salePayload.id,
            currentPeriodEnd: periodEnd,
          },
        });
      } else {
        await prisma.subscription.create({
          data: {
            userId: user.id,
            status: 'active',
            plan: eventTypeLegacy,
            gumroadSaleId: salePayload.id,
            gumroadSubscriptionId: salePayload.subscription_id || salePayload.id,
            currentPeriodStart: new Date(salePayload.created_at),
            currentPeriodEnd: periodEnd,
          },
        });
      }

      await createNotification({
        userId: user.id,
        type: 'subscription',
        title: isNewUser ? `Welcome to ${planName} Plan!` : `${planName} Plan Activated`,
        message: isNewUser
          ? `Thank you for purchasing the ${planName} plan!`
          : `Your ${planName} plan is now active.`,
        link: '/dashboard/subscription',
      });

      return NextResponse.json({ received: true });
    }

    const billingCycle: 'monthly' | 'annual' = salePayload.subscription_unit === 'year' ? 'annual' : 'monthly';
    const planName = detectedPlan;
    const planDisplay = planName === 'STARTER' ? 'Starter' : 'Complete';

    let periodEnd = new Date();
    if (billingCycle === 'annual') {
      periodEnd.setFullYear(periodEnd.getFullYear() + 1);
    } else {
      periodEnd.setMonth(periodEnd.getMonth() + 1);
    }

    let user = await prisma.user.findUnique({ where: { email: salePayload.email } });

    let isNewUser = false;
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: salePayload.email,
          name: salePayload.email.split('@')[0],
          password: '',
        },
      });
      isNewUser = true;
    }

    const existingSub = await prisma.subscription.findFirst({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    });

    if (existingSub) {
      await prisma.subscription.update({
        where: { id: existingSub.id },
        data: {
          status: 'active',
          plan: planName,
          billingCycle,
          gumroadSaleId: salePayload.id,
          gumroadSubscriptionId: salePayload.subscription_id || salePayload.id,
          currentPeriodEnd: periodEnd,
        },
      });
    } else {
      await prisma.subscription.create({
        data: {
          userId: user.id,
          status: 'active',
          plan: planName,
          billingCycle,
          gumroadSaleId: salePayload.id,
          gumroadSubscriptionId: salePayload.subscription_id || salePayload.id,
          currentPeriodStart: new Date(salePayload.created_at),
          currentPeriodEnd: periodEnd,
        },
      });
    }

    eventDispatcher.dispatch(EventTypes.GUMROAD_PURCHASE_COMPLETED, {
      userId: user.id,
      email: user.email,
      name: user.name,
      plan: planName,
      planDisplay,
      productName: salePayload.product_name,
      billingCycle,
      amount: salePayload.price,
      currency: salePayload.currency,
      subscriptionId: salePayload.subscription_id,
      onboardingUrl: `${process.env.NEXT_PUBLIC_APP_URL || ''}/onboarding`,
    }).catch(() => {});

    await createNotification({
      userId: user.id,
      type: 'subscription',
      title: isNewUser ? `Welcome to ${planDisplay} Plan! 🎉` : `${planDisplay} Plan Activated!`,
      message: isNewUser
        ? `Thank you for subscribing to the ${planDisplay} Plan! Complete your onboarding to get started.`
        : `Your ${planDisplay} Plan is now active. Next billing: ${periodEnd.toLocaleDateString()}.`,
      link: '/onboarding',
      priority: 'high',
    });

    console.log(`[Gumroad Webhook] ${planDisplay} plan activated for ${user.email} (${billingCycle})`);

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Gumroad webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
