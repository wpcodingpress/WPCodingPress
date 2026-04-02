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

    const accessToken = process.env.GUMROAD_ACCESS_TOKEN;

    if (!accessToken) {
      return NextResponse.json({ error: 'Gumroad not configured' }, { status: 500 });
    }

    const response = await fetch('https://api.gumroad.com/v2/users/me', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gumroad API test failed:', errorText);
    }

    const productLink = process.env.GUMROAD_PRODUCT_LINK;
    const productId = productLink ? productLink.split('/l/')[1] : 'wpcodingpress';

    const verifyResponse = await fetch('https://api.gumroad.com/v2/sales', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    let subscriptionData = null;
    
    if (verifyResponse.ok) {
      const salesData = await verifyResponse.json();
      const sale = salesData.sales?.find((s: { purchaser_email: string; product_id: string }) => 
        s.purchaser_email.toLowerCase() === gumroadEmail.toLowerCase() && 
        s.product_id === productId
      );
      
      if (sale && sale.subscription) {
        subscriptionData = sale;
      }
    }

    const checkSubResponse = await fetch(`https://api.gumroad.com/v2/subscriptions?access_token=${accessToken}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    let plan = 'pro';
    let isActive = false;

    if (checkSubResponse.ok) {
      const subData = await checkSubResponse.json();
      const activeSub = subData.subscriptions?.find((s: { buyer_email: string; status: string }) => 
        s.buyer_email?.toLowerCase() === gumroadEmail.toLowerCase() && 
        s.status === 'active'
      );
      
      if (activeSub) {
        isActive = true;
        if (activeSub.tier_name?.toLowerCase().includes('enterprise')) {
          plan = 'enterprise';
        }
      }
    }

    if (!isActive && !subscriptionData) {
      return NextResponse.json({ 
        error: 'No active subscription found for this email. Please make sure you have purchased the product.' 
      }, { status: 400 });
    }

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