import crypto from 'crypto';

export function verifyLemonSqueezySignature(
  payload: string,
  signature: string | null,
  secret: string
): boolean {
  if (!signature) return false;
  
  const hmac = crypto.createHmac('sha256', secret);
  const digest = hmac.update(payload).digest('hex');
  
  return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(signature));
}

export interface LemonSubscription {
  id: string;
  attributes: {
    store_id: string;
    customer_id: string;
    order_id: string;
    name: string;
    email: string;
    status: string;
    status_formatted: string;
    plan_name: string;
    variant_name: string;
    price: number;
    is_usage_based: boolean;
    billing_anchor: number;
    cancel_at: string | null;
    ends_at: string | null;
    created_at: string;
    updated_at: string;
    test_mode: boolean;
  };
}

export interface LemonWebhookEvent {
  meta: {
    event_name: string;
    custom_data: Record<string, unknown>;
  };
  data: {
    id: string;
    type: string;
    attributes: LemonSubscription['attributes'];
  };
}

export function getSubscriptionStatus(status: string): string {
  const statusMap: Record<string, string> = {
    'active': 'active',
    'trialing': 'active',
    'past_due': 'past_due',
    'unpaid': 'unpaid',
    'cancelled': 'cancelled',
    'expired': 'expired',
    'paused': 'paused',
  };
  return statusMap[status] || 'pending';
}

export function mapPlanName(planName: string): string {
  const planMap: Record<string, string> = {
    'Pro': 'pro',
    'Enterprise': 'enterprise',
    'Free': 'free',
  };
  return planMap[planName] || 'free';
}