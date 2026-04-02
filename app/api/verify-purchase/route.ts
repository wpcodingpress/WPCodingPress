import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

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
    const { gumroadEmail } = body;

    if (!gumroadEmail) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const appId = process.env.GUMROAD_APP_ID;
    const appSecret = process.env.GUMROAD_APP_SECRET;

    if (!appId || !appSecret) {
      return NextResponse.json({ error: 'Gumroad not configured' }, { status: 500 });
    }

    const response = await fetch('https://api.gumroad.com/v2/resource/verification', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        app_id: appId,
        app_secret: appSecret,
        product_id: 'wpcodingpress',
        purchaser_email: gumroadEmail,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gumroad verification failed:', errorText);
      return NextResponse.json({ 
        error: 'Verification failed. Please check your Gumroad email and try again.' 
      }, { status: 400 });
    }

    const data = await response.json();
    
    if (!data.success || !data.owned) {
      return NextResponse.json({ 
        error: 'No active subscription found for this email. Please make sure you have purchased the product.' 
      }, { status: 400 });
    }

    const isEnterprise = data.tier_name?.toLowerCase().includes('enterprise');
    const plan = isEnterprise ? 'enterprise' : 'pro';

    const periodEnd = new Date();
    periodEnd.setMonth(periodEnd.getMonth() + 1);

    const existingSub = await prisma.subscription.findFirst({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    });

    if (existingSub) {
      await prisma.subscription.update({
        where: { id: existingSub.id },
        data: {
          status: 'active',
          plan,
          currentPeriodEnd: periodEnd,
        },
      });
    } else {
      await prisma.subscription.create({
        data: {
          userId: user.id,
          status: 'active',
          plan,
          currentPeriodStart: new Date(),
          currentPeriodEnd: periodEnd,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: `Subscription activated! You are on the ${plan} plan.`,
      plan,
    });
  } catch (error) {
    console.error('Gumroad verification error:', error);
    return NextResponse.json(
      { error: 'Verification failed. Please try again later.' },
      { status: 500 }
    );
  }
}