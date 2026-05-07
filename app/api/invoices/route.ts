import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';
import { WEB_DEV_PLANS } from '@/lib/web-dev-service';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, name: true, email: true, phone: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const subscription = await prisma.subscription.findFirst({
      where: {
        userId: user.id,
        plan: { in: ['STARTER', 'COMPLETE'] },
      },
      orderBy: { createdAt: 'desc' },
    });

    const invoices: Array<{
      id: string;
      invoiceNumber: string;
      planName: string;
      billingCycle: string;
      amount: number;
      amountFormatted: string;
      status: string;
      date: string;
      periodStart: string;
      periodEnd: string;
      gumroadSaleId: string | null;
    }> = [];

    if (subscription) {
      const planConfig = WEB_DEV_PLANS[subscription.plan as keyof typeof WEB_DEV_PLANS];
      const price = subscription.billingCycle === 'annual' ? planConfig.annualPrice : planConfig.monthlyPrice;

      const planDisplay = subscription.plan === 'STARTER' ? 'Starter' : 'Complete';

      invoices.push({
        id: subscription.id,
        invoiceNumber: subscription.gumroadSaleId
          ? `SUB-${subscription.gumroadSaleId.slice(0, 8).toUpperCase()}`
          : `SUB-${subscription.id.slice(0, 8).toUpperCase()}`,
        planName: `${planDisplay} Plan`,
        billingCycle: subscription.billingCycle === 'annual' ? 'Annual' : 'Monthly',
        amount: price,
        amountFormatted: `$${price}`,
        status: subscription.status === 'active' ? 'paid' : subscription.status === 'cancelled' ? 'refunded' : 'unpaid',
        date: subscription.currentPeriodStart.toISOString(),
        periodStart: subscription.currentPeriodStart.toISOString(),
        periodEnd: subscription.currentPeriodEnd.toISOString(),
        gumroadSaleId: subscription.gumroadSaleId,
      });
    }

    return NextResponse.json({ invoices });
  } catch (error) {
    console.error('Invoices API error:', error);
    return NextResponse.json({ error: 'Failed to fetch invoices' }, { status: 500 });
  }
}
