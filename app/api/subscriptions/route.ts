import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

const PLANS = {
  pro: {
    name: 'Pro Plan',
    price: 49,
    gumroadLink: process.env.GUMROAD_PRO_LINK || 'https://gumroad.com/l/YOUR_PRO_LINK',
    features: 'Convert 1 WordPress site to headless Next.js, Priority support, Basic features',
  },
  enterprise: {
    name: 'Enterprise Plan',
    price: 199,
    gumroadLink: process.env.GUMROAD_ENTERPRISE_LINK || 'https://gumroad.com/l/YOUR_ENTERPRISE_LINK',
    features: 'Unlimited conversions, Dedicated support, White-label, All features',
  },
};

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const body = await request.json();
    const { plan } = body;

    if (!plan || !PLANS[plan as keyof typeof PLANS]) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
    }

    const selectedPlan = PLANS[plan as keyof typeof PLANS];
    
    const successUrl = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/subscription?success=true&plan=${plan}`;
    const cancelUrl = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/subscription?cancelled=true`;
    
    let checkoutUrl = selectedPlan.gumroadLink;
    if (checkoutUrl.includes('gumroad.com/l/')) {
      checkoutUrl += `?success=${encodeURIComponent(successUrl)}&cancel=${encodeURIComponent(cancelUrl)}`;
    }

    return NextResponse.json({ 
      url: checkoutUrl,
      plan: selectedPlan,
      message: 'You will be redirected to Gumroad to complete payment'
    });
  } catch (error) {
    console.error('Subscription error:', error);
    return NextResponse.json(
      { error: 'Failed to create subscription checkout' },
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