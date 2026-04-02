# WPCodingPress Headless SaaS Setup Guide

## System Overview

This is a subscription-based SaaS platform that allows users to convert their WordPress sites to headless Next.js applications with one click.

### How It Works

1. **User subscribes** via Gumroad (Pro/Enterprise plans)
2. **User adds their WordPress site** in the dashboard with domain and URL
3. **User installs the WordPress plugin** on their site and enters the API key
4. **User clicks "Convert to Headless"** - the system:
   - Fetches all content from WordPress
   - Transforms it to Next.js format
   - Deploys to Render
   - Returns a live URL

---

## Step 1: Gumroad Setup (Primary Payment)

### 1.1 Create Gumroad Account
1. Go to [Gumroad](https://gumroad.com)
2. Sign up with your email
3. Complete profile setup

### 1.2 Create Pro Product ($49/month)
1. Click **Products** → **New Product**
2. Fill in:
   - **Name:** Pro Plan - WordPress to Headless
   - **Description:** Convert 1 WordPress site to headless Next.js with all features
   - **Price:** $49.00
   - **Type:** Subscription (Monthly)
3. Click **Save**
4. Copy the product link (like `https://gumroad.com/l/abc123`)

### 1.3 Create Enterprise Product ($199/month)
1. Create another product
2. Name: Enterprise Plan - Unlimited
3. Price: $199/month
4. Copy link

### 1.4 Get Webhook Secret
1. Go to **Settings** → **Webhooks**
2. Click **Add webhook**
3. URL: `https://wpcodingpress.onrender.com/api/webhooks/gumroad`
4. Click **Save**
5. Copy the **signing secret**

---

## Step 2: Environment Variables

Update your `.env` file:

```env
# Gumroad (Primary Payment - Works Globally!)
GUMROAD_PRO_LINK="https://gumroad.com/l/YOUR_PRO_LINK"
GUMROAD_ENTERPRISE_LINK="https://gumroad.com/l/YOUR_ENTERPRISE_LINK"
GUMROAD_WEBHOOK_SECRET="your_webhook_secret_from_gumroad"

# Render Deployment (OPTIONAL - for auto-deployment)
RENDER_API_KEY="your_render_api_key"
RENDER_GITHUB_TOKEN="your_github_token"
GITHUB_REPO_OWNER="your_username"
GITHUB_REPO_NAME="headless-wp-template"
```

---

## Step 3: Database Migration

Run locally or on Render:

```bash
npx prisma migrate dev --name add_sites_jobs
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
1. Go to WPCodingPress Dashboard → Sites
2. Add WordPress site domain and URL
3. Paste the API key from plugin
4. Site will show as "Connected"

---

## Step 5: User Flow

```
1. User visits wpcodingpress.com
2. Registers/Login
3. Goes to Dashboard → Subscription
4. Clicks "Subscribe" on Pro Plan ($49)
5. Redirected to Gumroad checkout
6. Pays with card/PayPal
7. Gumroad webhook updates subscription to "active"
8. User goes to Dashboard → Sites
9. Adds WordPress site + installs plugin
10. Clicks "Convert to Headless"
11. Gets live Next.js site URL!
```

---

## Alternative Payment Options (For Later)

When Lemon Squeezy verification completes, you can add:

```env
# Lemon Squeezy (Backup)
LEMON_SQUEEZY_API_KEY="your_api_key"
LEMON_SQUEEZY_WEBHOOK_SECRET="your_webhook_secret"
LEMON_SQUEEZY_STORE_ID="your_store_id"

# Bangladeshi Payments (Future)
# AamarPay, SSLCommerz - can be added later
```

---

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/webhooks/gumroad` | POST | Handle Gumroad payments |
| `/api/webhooks/lemon-squeezy` | POST | Handle Lemon Squeezy (backup) |
| `/api/subscriptions` | GET/POST | Get or create subscription |
| `/api/sites` | GET/POST/DELETE | Manage WordPress sites |
| `/api/verify-site` | POST | Verify site connection |
| `/api/convert` | POST/GET | Start conversion job |

---

## Troubleshooting

### Gumroad Payment Not Working
- Verify webhook URL is correct
- Check webhook secret matches
- Test with Gumroad's "Send test webhook" feature

### Site Not Connecting
- Ensure WordPress plugin is installed
- Verify API key matches exactly

### Build Failed on Render
- Check all environment variables are set
- Ensure Prisma migration ran

---

## About Your nsave Account

**Yes! You can receive international payments!**

Your nsave account gives you:
- **USD/GBP bank accounts** - receive wire transfers from international clients
- Works on **Twine**, **Upwork**, **Fiverr**, etc.
- Money converts to BDT automatically

For your SaaS:
- Customers pay via Gumroad (international cards/PayPal)
- Gumroad sends money to your bank account (via payout)
- Or use Gumroad's direct deposit to your nsave USD account

**Flow:** Customer → Gumroad → Your Bank Account (nsave) → Withdraw to BDT!

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     WPCodingPress SaaS                      │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐  │
│  │   Frontend   │    │   Backend    │    │   Database   │  │
│  │   (Next.js)  │◄──►│   (API)      │◄──►│   (MySQL)     │  │
│  └──────────────┘    └──────────────┘    └──────────────┘  │
│         │                   │                    │            │
│         ▼                   ▼                    ▼            │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐  │
│  │   Dashboard  │    │  Webhooks    │    │   Sites      │  │
│  │   - Sites    │    │  - Gumroad   │    │   Jobs       │  │
│  │   - Convert  │    │  - Lemon*   │    │   Subs       │  │
│  └──────────────┘    └──────────────┘    └──────────────┘  │
│                                                              │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              External Integrations                    │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐   │  │
│  │  │   Gumroad   │  │   Render    │  │   WordPress │   │  │
│  │  │ (Payments)  │  │ (Deployment)│  │  (Client)   │   │  │
│  │  └─────────────┘  └─────────────┘  └─────────────┘   │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
* Lemon Squeezy backup (when verification completes)
```

---

## Next Steps

1. **Create Gumroad account** and products
2. **Get your product links** and webhook secret
3. **Configure .env** with Gumroad links
4. **Deploy to Render**
5. **Test the full flow**

Need help? Let me know!
