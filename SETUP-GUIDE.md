# WPCodingPress Headless SaaS Setup Guide

## System Overview

This is a subscription-based SaaS platform that allows users to convert their WordPress sites to headless Next.js applications with one click.

### How It Works

1. **User subscribes** via Lemon Squeezy (Pro/Enterprise plans)
2. **User adds their WordPress site** in the dashboard with domain and URL
3. **User installs the WordPress plugin** on their site and enters the API key
4. **User clicks "Convert to Headless"** - the system:
   - Fetches all content from WordPress
   - Transforms it to Next.js format
   - Deploys to Render
   - Returns a live URL

---

## Step 1: Lemon Squeezy Setup

### 1.1 Create Products
1. Go to [Lemon Squeezy Dashboard](https:// lemonsqueezy.com)
2. Create two variants:
   - **Pro** - $49/month
   - **Enterprise** - $199/month

### 1.2 Get API Credentials
1. Go to Settings → API
2. Copy your API key

### 1.3 Configure Webhook
1. Go to Settings → Webhooks
2. Add new webhook:
   - **URL**: `https://your-domain.com/api/webhooks/lemon-squeezy`
   - **Events**: Select all subscription events
3. Copy the webhook signing secret

---

## Step 2: Environment Variables

Update your `.env` file:

```env
# Lemon Squeezy (REQUIRED)
LEMON_SQUEEZY_API_KEY="your_api_key"
LEMON_SQUEEZY_WEBHOOK_SECRET="your_webhook_secret"
LEMON_SQUEEZY_STORE_ID="your_store_id"
LEMON_PRO_VARIANT_ID="pro_variant_id"
LEMON_ENTERPRISE_VARIANT_ID="enterprise_variant_id"

# Render Deployment (OPTIONAL - for auto-deployment)
RENDER_API_KEY="your_render_api_key"
RENDER_GITHUB_TOKEN="your_github_token"
GITHUB_REPO_OWNER="your_username"
GITHUB_REPO_NAME="headless-wp-template"
```

---

## Step 3: Database Migration

Run Prisma migration:

```bash
npx prisma migrate dev --name add_lemon_squeezy_sites_jobs
```

---

## Step 4: WordPress Plugin Installation

### 4.1 Install the Plugin
1. Copy `wordpress-plugin/headless-wp-connector.php` to your WordPress site's `wp-content/plugins/` folder
2. Or zip it and upload via WordPress admin

### 4.2 Configure the Plugin
1. Go to Settings → Headless Connector
2. Click "Generate New API Key"
3. Copy the API key

### 4.3 Connect to SaaS
1. Go to your WPCodingPress Dashboard → Sites
2. Add your WordPress site domain and URL
3. Copy the API key from the plugin
4. The site will be marked as "Connected" once verified

---

## Step 5: Deployment on Render

### Option A: Automatic (with Render API)

Deploy your Next.js app and configure the webhook to trigger conversion jobs.

### Option B: Manual

1. Deploy the main app to Render:
   - Build Command: `npm run build`
   - Start Command: `npm start`

---

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/webhooks/lemon-squeezy` | POST | Handle subscription events |
| `/api/subscriptions` | GET/POST | Get or create subscription checkout |
| `/api/sites` | GET/POST/DELETE | Manage WordPress sites |
| `/api/verify-site` | POST | Verify site connection |
| `/api/convert` | POST/GET | Start conversion job |

---

## User Flow

```
1. User visits wpcodingpress.com
2. Registers/Login
3. Goes to Dashboard → Subscription
4. Selects Pro plan ($49/mo)
5. Redirected to Lemon Squeezy checkout
6. Pays and returns
7. Subscription webhook updates database
8. User goes to Dashboard → Sites
9. Adds WordPress site (domain + URL)
10. Gets API key
11. Installs plugin on their WP site
12. Enters API key in plugin
13. Site shows as "Connected"
14. User clicks "Convert to Headless"
15. Job processes and returns live URL
```

---

## Troubleshooting

### Webhook Not Receiving Events
- Check Lemon Squeezy webhook URL is correct
- Verify webhook secret matches

### Site Not Connecting
- Ensure WordPress plugin is installed
- Verify API key matches exactly
- Check site domain matches exactly

### Conversion Failing
- Check WordPress REST API is accessible
- Verify plugin export endpoint works: `https://your-site.com/wp-json/headless/v1/export`

---

## Architecture Summary

```
┌─────────────────────────────────────────────────────────────┐
│                     WPCodingPress SaaS                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐  │
│  │   Frontend   │    │   Backend    │    │   Database   │  │
│  │   (Next.js)  │◄──►│   (API)      │◄──►│   (MySQL)     │  │
│  └──────────────┘    └──────────────┘    └──────────────┘  │
│         │                   │                    │            │
│         ▼                   ▼                    ▼            │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐  │
│  │   Dashboard  │    │  Webhooks    │    │   Sites      │  │
│  │   - Sites    │    │  - Lemon S.  │    │   Jobs       │  │
│  │   - Convert  │    │              │    │   Subs       │  │
│  └──────────────┘    └──────────────┘    └──────────────┘  │
│                                                              │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              External Integrations                    │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐   │  │
│  │  │ Lemon Squeezy│  │   Render    │  │   WordPress │   │  │
│  │  │ (Payments)  │  │ (Deployment)│  │  (Client)   │   │  │
│  │  └─────────────┘  └─────────────┘  └─────────────┘   │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## Next Steps

1. **Set up your Lemon Squeezy store** with products
2. **Configure environment variables** in `.env`
3. **Deploy to Render** with all services
4. **Install WordPress plugin** on test site
5. **Test the full flow** from subscription to conversion