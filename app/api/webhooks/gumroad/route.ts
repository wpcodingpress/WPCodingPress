import { NextResponse } from 'next/server';
import crypto from 'crypto';
import prisma from '@/lib/prisma';

interface GumroadWebhookPayload {
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

async function createNotification(userId: string, type: string, title: string, message: string, link?: string) {
  try {
    await prisma.notification.create({
      data: { userId, type, title, message, link }
    })
  } catch (error) {
    console.error('Error creating notification:', error)
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const signature = request.headers.get('x-gumroad-signature');
    const webhookSecret = process.env.GUMROAD_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error('Gumroad webhook secret not configured');
      return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 });
    }

    const hash = 'sha256=' + crypto.createHmac('sha256', webhookSecret).update(body).digest('hex');
    
    if (signature !== hash) {
      console.error('Invalid Gumroad webhook signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const payload = JSON.parse(body) as GumroadWebhookPayload;
    
    const eventType = payload.product_name?.toLowerCase().includes('enterprise') ? 'enterprise' : 'pro';
    const isSubscription = payload.subscription_id && payload.subscription_unit;
    const planName = eventType === 'enterprise' ? 'Enterprise' : 'Pro';

    let periodEnd = new Date();
    if (isSubscription) {
      if (payload.subscription_unit === 'month') {
        periodEnd.setMonth(periodEnd.getMonth() + 1);
      } else {
        periodEnd.setFullYear(periodEnd.getFullYear() + 1);
      }
    } else {
      periodEnd.setFullYear(periodEnd.getFullYear() + 1);
    }

    let user = await prisma.user.findUnique({
      where: { email: payload.email },
    });

    let isNewUser = false;
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: payload.email,
          name: payload.email.split('@')[0],
          password: '',
        },
      });
      isNewUser = true;
    }

    const existingSub = await prisma.subscription.findFirst({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    });

    let subscriptionUpdated = false;
    if (existingSub) {
      await prisma.subscription.update({
        where: { id: existingSub.id },
        data: {
          status: 'active',
          plan: eventType,
          lemonSubscriptionId: payload.subscription_id || payload.id,
          currentPeriodEnd: periodEnd,
        },
      });
      subscriptionUpdated = true;
    } else {
      await prisma.subscription.create({
        data: {
          userId: user.id,
          status: 'active',
          plan: eventType,
          lemonSubscriptionId: payload.subscription_id || payload.id,
          currentPeriodStart: new Date(payload.created_at),
          currentPeriodEnd: periodEnd,
        },
      });
    }

    await createNotification(
      user.id,
      'subscription',
      isNewUser ? `Welcome to ${planName} Plan!` : `${planName} Plan Activated`,
      isNewUser 
        ? `Thank you for purchasing the ${planName} plan! Your account is now active.`
        : `Your ${planName} plan subscription is now active. Your next billing date is ${periodEnd.toLocaleDateString()}.`,
      '/dashboard/subscription'
    );

    console.log(`Gumroad payment processed for ${payload.email}: ${eventType}`);

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Gumroad webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}