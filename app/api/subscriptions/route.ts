import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

const LEMON_VARIANT_IDS: Record<string, string> = {
  pro: process.env.LEMON_PRO_VARIANT_ID || 'pro_variant_id',
  enterprise: process.env.LEMON_ENTERPRISE_VARIANT_ID || 'enterprise_variant_id',
};

interface LemonCheckoutResponse {
  data: {
    attributes: {
      url: string;
    };
  };
}

async function createLemonCheckout(
  variantId: string,
  userEmail: string,
  userName: string,
  userId: string,
  plan: string
): Promise<string> {
  const storeId = process.env.LEMON_SQUEEZY_STORE_ID;
  const apiKey = process.env.LEMON_SQUEEZY_API_KEY;
  
  if (!storeId || !apiKey) {
    throw new Error('Lemon Squeezy not configured');
  }

  const response = await fetch(`https://api.lemonsqueezy.com/v1/checkouts`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/vnd.api+json',
      'Accept': 'application/vnd.api+json',
    },
    body: JSON.stringify({
      data: {
        type: 'checkouts',
        attributes: {
          checkout_data: {
            email: userEmail,
            name: userName,
            custom: {
              userId,
              plan,
            },
          },
        },
        relationships: {
          store: {
            data: {
              type: 'stores',
              id: storeId,
            },
          },
          variant: {
            data: {
              type: 'variants',
              id: variantId,
            },
          },
        },
      },
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Lemon Squeezy checkout failed: ${error}`);
  }

  const data = (await response.json()) as LemonCheckoutResponse;
  return data.data.attributes.url;
}

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

    if (!plan || !LEMON_VARIANT_IDS[plan]) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
    }

    const variantId = LEMON_VARIANT_IDS[plan];
    const checkoutUrl = await createLemonCheckout(
      variantId,
      user.email,
      user.name || user.email.split('@')[0],
      user.id,
      plan
    );

    return NextResponse.json({ url: checkoutUrl });
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