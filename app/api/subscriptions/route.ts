import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

const GUMROAD_PRODUCT_LINK = process.env.GUMROAD_PRODUCT_LINK || 'https://rahmanbld.gumroad.com/l/wpcodingpress';
const TESTING_MODE = process.env.TESTING_MODE === 'true';

const PLANS = {
  pro: {
    name: 'Pro Plan',
    price: 19,
    tierName: 'Pro',
    features: 'Convert up to 5 WordPress sites to headless Next.js, Priority support, Custom domain, Analytics',
  },
  enterprise: {
    name: 'Enterprise Plan',
    price: 99,
    tierName: 'Enterprise',
    features: 'Unlimited conversions, Dedicated support, White-label, Custom integrations',
  },
};

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('Session user:', session.user);

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      console.log('User not found for id:', session.user.id);
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const body = await request.json();
    const { plan } = body;

    console.log('Plan:', plan, 'TESTING_MODE:', TESTING_MODE);

    if (!plan || !PLANS[plan as keyof typeof PLANS]) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
    }

    if (TESTING_MODE) {
      console.log('Entering TESTING_MODE block');
      const existingSub = await prisma.subscription.findFirst({
        where: { userId: user.id, status: 'active' },
      });

      if (existingSub) {
        return NextResponse.json({ 
          message: 'You already have an active subscription in TESTING_MODE',
          subscription: existingSub 
        });
      }

      const newSub = await prisma.subscription.create({
        data: {
          userId: user.id,
          plan: plan,
          status: 'active',
          currentPeriodStart: new Date(),
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
      }).catch(err => {
        console.error('Prisma create error:', err);
        throw err;
      });

      return NextResponse.json({ 
        message: 'Subscription activated (TESTING_MODE - no payment required)',
        subscription: newSub 
      });
    }

    const selectedPlan = PLANS[plan as keyof typeof PLANS];
    
    const successUrl = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/subscription?success=true&plan=${plan}`;
    const cancelUrl = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/subscription?cancelled=true`;
    
    const checkoutUrl = `${GUMROAD_PRODUCT_LINK}?wanted_tier=${encodeURIComponent(selectedPlan.tierName)}&success=${encodeURIComponent(successUrl)}&cancel=${encodeURIComponent(cancelUrl)}`;

    return NextResponse.json({ 
      url: checkoutUrl,
      plan: selectedPlan,
      message: 'You will be redirected to Gumroad to complete payment. After payment, enter your Gumroad email to verify and activate your subscription.'
    });
  } catch (error: any) {
    console.error('Subscription error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create subscription', details: error.stack },
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

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        subscriptions: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });

    const activeSubscription = user?.subscriptions?.find(
      (sub) => sub.status === 'active'
    );

    return NextResponse.json({
      hasSubscription: !!activeSubscription,
      subscription: activeSubscription || null,
    });
  } catch (error) {
    console.error('Get subscription error:', error);
    return NextResponse.json(
      { error: 'Failed to get subscription' },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        subscriptions: {
          where: { status: 'active' },
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });

    const activeSubscription = user?.subscriptions?.[0];

    if (!activeSubscription) {
      return NextResponse.json({ error: 'No active subscription found' }, { status: 400 });
    }

    if (TESTING_MODE) {
      await prisma.subscription.update({
        where: { id: activeSubscription.id },
        data: {
          status: 'cancelled',
          cancelAtPeriodEnd: true,
        },
      });

      return NextResponse.json({ 
        success: true, 
        message: 'Subscription cancelled (TESTING_MODE)' 
      });
    }

    await prisma.subscription.update({
      where: { id: activeSubscription.id },
      data: {
        status: 'cancelled',
        cancelAtPeriodEnd: true,
      },
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Subscription will be cancelled at the end of billing period' 
    });
  } catch (error) {
    console.error('Cancel subscription error:', error);
    return NextResponse.json(
      { error: 'Failed to cancel subscription' },
      { status: 500 }
    );
  }
}