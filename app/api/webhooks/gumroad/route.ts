import { NextResponse } from 'next/server';
import crypto from 'crypto';
import prisma from '@/lib/prisma';
import { sendEmail } from '@/lib/email';
import { createNotification } from '@/lib/notifications';

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

async function sendWelcomeEmailForPlan(email: string, name: string, plan: string) {
  const planDisplay = plan === 'STARTER' ? 'Starter' : plan === 'COMPLETE' ? 'Complete' : plan;
  return sendEmail({
    to: email,
    subject: `Welcome to WPCodingPress ${planDisplay} Plan!`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #7c3aed, #a855f7); color: #fff; padding: 30px; text-align: center; border-radius: 12px 12px 0 0; }
            .content { padding: 30px; background: #f9f9f9; }
            .footer { padding: 20px; text-align: center; color: #888; font-size: 12px; }
            .button { display: inline-block; padding: 14px 28px; background: linear-gradient(135deg, #7c3aed, #a855f7); color: #fff; text-decoration: none; border-radius: 8px; font-weight: bold; }
            .badge { display: inline-block; padding: 6px 16px; background: #7c3aed; color: #fff; border-radius: 20px; font-size: 12px; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to ${planDisplay}! 🎉</h1>
            </div>
            <div class="content">
              <p>Hi ${name},</p>
              <p>Thank you for subscribing to the <strong>${planDisplay} Plan</strong>! We're excited to start building your website.</p>
              <p><strong>Here's what happens next:</strong></p>
              <ol>
                <li><strong>Complete Your Onboarding</strong> — Fill out the onboarding form to tell us about your project</li>
                <li><strong>Project Discussion</strong> — Your dedicated project manager will reach out within 24 hours</li>
                <li><strong>Design & Development</strong> — Our team gets to work on your website</li>
                <li><strong>Launch</strong> — Your site goes live within 3 business days</li>
              </ol>
              <p style="text-align: center; margin-top: 24px;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/onboarding" class="button">Complete Onboarding</a>
              </p>
            </div>
            <div class="footer">
              <p>WPCodingPress — AI-Powered Web Development</p>
              <p>Need help? Contact us at support@wpcodingpress.com</p>
            </div>
          </div>
        </body>
      </html>
    `,
  });
}

async function sendCancellationEmail(email: string, name: string, plan: string) {
  return sendEmail({
    to: email,
    subject: `Subscription Cancelled — WPCodingPress ${plan} Plan`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #ef4444; color: #fff; padding: 30px; text-align: center; border-radius: 12px 12px 0 0; }
            .content { padding: 30px; background: #f9f9f9; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Subscription Cancelled</h1>
            </div>
            <div class="content">
              <p>Hi ${name},</p>
              <p>Your <strong>${plan} Plan</strong> subscription has been cancelled.</p>
              <p>You will continue to have access until the end of your current billing period.</p>
              <p>We're sorry to see you go! If you change your mind, you can resubscribe anytime.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  });
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

        if (isWebDev) {
          await sendCancellationEmail(subscription.user.email, subscription.user.name, plan);
        }

        await createNotification({
          userId: subscription.userId,
          type: 'subscription',
          title: isWebDev ? `${plan} Plan Cancelled` : 'Subscription Cancelled',
          message: isWebDev
            ? `Your ${plan} Plan subscription has been cancelled. You'll have access until the end of the billing period.`
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

    await sendWelcomeEmailForPlan(user.email, user.name, planName);

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
