# WPCodingPress Web Development Subscription — Setup Guide

## Overview

This implements a complete web development subscription service with two tiers (Starter $29/mo, Complete $59/mo), integrated with Gumroad for payment processing.

## Environment Variables

Add these to your `.env.local` file:

```env
# Gumroad Webhook Secret (set in Gumroad dashboard)
GUMROAD_WEBHOOK_SECRET=your_webhook_secret_here

# Gumroad Product Links for Web Dev Service
GUMROAD_STARTER_MONTHLY_LINK=https://your-gumroad.gumroad.com/l/starter-monthly
GUMROAD_STARTER_ANNUAL_LINK=https://your-gumroad.gumroad.com/l/starter-annual
GUMROAD_COMPLETE_MONTHLY_LINK=https://your-gumroad.gumroad.com/l/complete-monthly
GUMROAD_COMPLETE_ANNUAL_LINK=https://your-gumroad.gumroad.com/l/complete-annual

# Encryption key for hosting credentials (32-byte hex)
ENCRYPTION_KEY=your-32-byte-hex-encryption-key

# Admin notification email
NEXT_PUBLIC_ADMIN_EMAIL=admin@wpcodingpress.com
```

## Gumroad Product Setup

### Create Products on Gumroad

1. Log into your Gumroad dashboard
2. Create 4 products (or 2 with variants):

| Product | Permalink | Price | Type |
|---------|-----------|-------|------|
| Starter Monthly | starter-monthly | $29/mo | Subscription (monthly) |
| Starter Annual | starter-annual | $290 | Subscription (yearly) |
| Complete Monthly | complete-monthly | $59/mo | Subscription (monthly) |
| Complete Annual | complete-annual | $590 | Subscription (yearly) |

3. For each subscription product:
   - Enable "Subscription" in the product settings
   - Set the appropriate billing period (monthly or yearly)
   - Disable "Free Trials" unless desired

### Configure Webhook

1. In Gumroad dashboard: Settings → Advanced → Webhooks
2. Add webhook URL: `https://your-domain.com/api/webhooks/gumroad`
3. Generate a webhook secret and set it as `GUMROAD_WEBHOOK_SECRET`

### Important: Product Name Convention

The webhook handler detects the plan by parsing the `product_name` field:
- Products containing "Starter" → STARTER plan
- Products containing "Complete" → COMPLETE plan
- Products containing "Pro" or "Enterprise" → legacy conversion service plans

## Database Migration

The schema changes are applied via Prisma:

```bash
npx prisma db push
```

Or create a migration:

```bash
npx prisma migrate dev --name add_web_dev_subscription
```

## New Routes

| Route | Description | Auth Required |
|-------|-------------|---------------|
| `/web-dev-plans` | Pricing page with monthly/annual toggle | No |
| `/onboarding` | Multi-step project onboarding form | Yes (active web dev sub) |
| `/dashboard/web-dev` | Project status tracker & subscription mgmt | Yes (active web dev sub) |
| `/admin/web-dev-subscribers` | Admin management for web dev clients | Yes (admin role) |

## API Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/api/web-dev-subscriptions` | POST | Create checkout URL or TESTING_MODE sub |
| `/api/web-dev-subscriptions` | GET | Get active web dev subscription |
| `/api/web-dev-subscriptions` | DELETE | Cancel web dev subscription |
| `/api/onboarding` | POST | Submit onboarding form |
| `/api/onboarding` | GET | Get submitted onboarding form |
| `/api/admin/web-dev-subscribers` | GET | List all web dev subscribers (admin) |
| `/api/admin/web-dev-subscribers/[id]` | PUT | Update project status/plan (admin) |
| `/api/admin/web-dev-subscribers/[id]` | DELETE | Delete subscriber (admin) |

## Testing Locally

1. Set `TESTING_MODE=true` in `.env.local`
2. Visit `/web-dev-plans` to see the pricing page
3. Click "Get Started" — this will create a subscription directly (no payment)
4. You'll be redirected to `/onboarding` to fill out the project form
5. Visit `/dashboard/web-dev` to see the project tracker
6. Visit `/admin/web-dev-subscribers` to manage clients

For Gumroad webhook testing, use a tool like ngrok to expose your local server:

```bash
npx ngrok http 3000
```

Then set the ngrok URL as your Gumroad webhook endpoint.

## Testing the Full Flow

1. User visits `/web-dev-plans` and selects a plan
2. If `TESTING_MODE=true`: subscription is created immediately
3. If live: user is redirected to Gumroad checkout
4. After payment, Gumroad sends a webhook to `/api/webhooks/gumroad`
5. The webhook creates/updates the subscription and sends welcome email
6. User is redirected to `/onboarding` (or visits manually)
7. User fills out the multi-step onboarding form
8. On submit: confirmation email sent to client, notification sent to admin
9. Admin manages the project via `/admin/web-dev-subscribers`
10. Client tracks progress at `/dashboard/web-dev`

## Files Created/Modified

### New Files
- `app/web-dev-plans/page.tsx` — Pricing page
- `app/web-dev-plans/layout.tsx` — SEO metadata
- `app/onboarding/page.tsx` — Multi-step onboarding form
- `app/onboarding/layout.tsx` — SEO metadata
- `app/dashboard/web-dev/page.tsx` — Project status dashboard
- `app/dashboard/web-dev/layout.tsx` — SEO metadata
- `app/admin/web-dev-subscribers/page.tsx` — Admin client management
- `app/admin/web-dev-subscribers/layout.tsx` — SEO metadata
- `app/api/web-dev-subscriptions/route.ts` — Subscription API
- `app/api/onboarding/route.ts` — Onboarding form API
- `app/api/admin/web-dev-subscribers/route.ts` — Admin list API
- `app/api/admin/web-dev-subscribers/[id]/route.ts` — Admin detail API
- `lib/web-dev-service.ts` — Shared constants and utilities

### Modified Files
- `prisma/schema.prisma` — Extended Subscription, added OnboardingForm
- `app/api/webhooks/gumroad/route.ts` — Enhanced for Starter/Complete + cancellations
- `middleware.ts` — Added onboarding route protection
- `app/dashboard/layout.tsx` — Added Web Dev sidebar link
- `app/admin/layout.tsx` — Added Web Dev Clients sidebar link
- `components/layout/navbar.tsx` — Added Web Dev Plans nav link
- `.env.example` — Added new environment variables
