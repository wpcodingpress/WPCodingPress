import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function requireActiveSubscription() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    return { error: 'Unauthorized', status: 401 };
  }

  const subscription = await prisma.subscription.findFirst({
    where: {
      userId: session.user.id,
      status: 'active',
    },
    orderBy: { createdAt: 'desc' },
  });

  if (!subscription) {
    return { error: 'Active subscription required', status: 403 };
  }

  return { userId: session.user.id, subscription };
}

export async function withSubscriptionCheck<T>(
  handler: (userId: string) => Promise<T>,
  errorMessage = 'Active subscription required'
) {
  const auth = await requireActiveSubscription();
  
  if ('error' in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  return handler(auth.userId);
}

export async function getUserSubscription(userId: string) {
  return prisma.subscription.findFirst({
    where: {
      userId,
      status: 'active',
    },
    orderBy: { createdAt: 'desc' },
  });
}

export function isSubscriptionActive(subscription: { status: string } | null): boolean {
  return subscription?.status === 'active';
}