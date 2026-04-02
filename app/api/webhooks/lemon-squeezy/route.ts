import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyLemonSqueezySignature, getSubscriptionStatus, mapPlanName, LemonWebhookEvent } from '@/lib/lemon-squeezy';

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const signature = request.headers.get('x-signature');

    const webhookSecret = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error('Lemon Squeezy webhook secret not configured');
      return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 });
    }

    if (!verifyLemonSqueezySignature(body, signature, webhookSecret)) {
      console.error('Invalid webhook signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const event = JSON.parse(body) as LemonWebhookEvent;
    const eventName = event.meta.event_name;
    const data = event.data;
    const attributes = data.attributes;

    console.log(`Processing Lemon Squeezy event: ${eventName}`);

    switch (eventName) {
      case 'subscription_created': {
        const userEmail = attributes.email;
        const customerId = attributes.customer_id.toString();
        const subscriptionId = data.id;
        const planName = mapPlanName(attributes.plan_name);
        const status = getSubscriptionStatus(attributes.status);

        let user = await prisma.user.findUnique({
          where: { email: userEmail },
        });

        if (!user) {
          user = await prisma.user.create({
            data: {
              email: userEmail,
              name: attributes.name || userEmail.split('@')[0],
              password: '',
            },
          });
        }

        const periodEnd = new Date(attributes.ends_at || Date.now() + 30 * 24 * 60 * 60 * 1000);
        
        await prisma.subscription.upsert({
          where: { lemonSubscriptionId: subscriptionId },
          update: {
            status,
            plan: planName,
            lemonCustomerId: customerId,
            currentPeriodEnd: periodEnd,
          },
          create: {
            userId: user.id,
            lemonCustomerId: customerId,
            lemonSubscriptionId: subscriptionId,
            status,
            plan: planName,
            currentPeriodStart: new Date(attributes.created_at),
            currentPeriodEnd: periodEnd,
          },
        });

        console.log(`Subscription created for user ${userEmail}: ${subscriptionId}`);
        break;
      }

      case 'subscription_updated': {
        const subscriptionId = data.id;
        const status = getSubscriptionStatus(attributes.status);
        const planName = mapPlanName(attributes.plan_name);
        const cancelAtPeriodEnd = attributes.cancel_at !== null;

        const updateData: Record<string, unknown> = {
          status,
          plan: planName,
          cancelAtPeriodEnd,
        };

        if (attributes.ends_at) {
          updateData.currentPeriodEnd = new Date(attributes.ends_at);
        }

        await prisma.subscription.updateMany({
          where: { lemonSubscriptionId: subscriptionId },
          data: updateData,
        });

        console.log(`Subscription updated: ${subscriptionId}`);
        break;
      }

      case 'subscription_cancelled': {
        const subscriptionId = data.id;

        const updateData: Record<string, unknown> = {
          status: 'cancelled',
          cancelAtPeriodEnd: true,
        };

        if (attributes.ends_at) {
          updateData.currentPeriodEnd = new Date(attributes.ends_at);
        }

        await prisma.subscription.updateMany({
          where: { lemonSubscriptionId: subscriptionId },
          data: updateData,
        });

        console.log(`Subscription cancelled: ${subscriptionId}`);
        break;
      }

      case 'subscription_expired': {
        const subscriptionId = data.id;

        await prisma.subscription.updateMany({
          where: { lemonSubscriptionId: subscriptionId },
          data: {
            status: 'expired',
          },
        });

        console.log(`Subscription expired: ${subscriptionId}`);
        break;
      }

      case 'subscription_resumed': {
        const subscriptionId = data.id;

        await prisma.subscription.updateMany({
          where: { lemonSubscriptionId: subscriptionId },
          data: {
            status: 'active',
            cancelAtPeriodEnd: false,
          },
        });

        console.log(`Subscription resumed: ${subscriptionId}`);
        break;
      }

      case 'subscription_payment_failed': {
        const subscriptionId = data.id;

        await prisma.subscription.updateMany({
          where: { lemonSubscriptionId: subscriptionId },
          data: {
            status: 'past_due',
          },
        });

        console.log(`Subscription payment failed: ${subscriptionId}`);
        break;
      }

      default:
        console.log(`Unhandled event: ${eventName}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Lemon Squeezy webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}