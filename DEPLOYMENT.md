# WPCodingPress - Deployment Guide

## Complete Setup Guide for cPanel with Node.js

---

## 📋 Prerequisites

Before starting, ensure you have:
- cPanel access with Node.js 20.x support
- SSH access enabled
- MySQL database created
- Domain `wpcodingpress.com` pointing to your server

---

## 🚀 Phase 1: Local Development & Testing

### 1.1 Install Dependencies

```bash
cd C:\Users\Asus\Documents\GitHub\wpcodingpress

# Install all dependencies
npm install

# Install additional packages
npm install prisma @prisma/client next-auth bcryptjs framer-motion lucide-react class-variance-authority clsx tailwind-merge @radix-ui/react-slot @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-select @radix-ui/react-tabs @radix-ui/react-toast @radix-ui/react-label @radix-ui/react-separator @radix-ui/react-avatar @radix-ui/react-progress
```

### 1.2 Initialize Prisma

```bash
npx prisma generate
```

### 1.3 Test Locally

```bash
npm run dev
```

Visit `http://localhost:3000` to test.

---

## 🗄️ Phase 2: Database Setup in cPanel

### 2.1 Create MySQL Database

1. Log into cPanel
2. Navigate to **MySQL Databases**
3. Create a new database: `wpcodingpress`
4. Create a user: `wppress_db`
5. Assign all privileges
6. Note down credentials

### 2.2 Update .env File

Edit `C:\Users\Asus\Documents\GitHub\wpcodingpress\.env`:

```env
DATABASE_URL="mysql://wppress_db:YOUR_PASSWORD@localhost/wpcodingpress"
NEXTAUTH_SECRET="generate-a-secure-random-string-here"
NEXTAUTH_URL="https://wpcodingpress.com"
NEXT_PUBLIC_APP_URL="https://wpcodingpress.com"
```

---

## 📤 Phase 3: Deploy to cPanel

### Option A: GitHub + SSH (Recommended)

#### Step 1: Push to GitHub

```bash
cd C:\Users\Asus\Documents\GitHub\wpcodingpress

# Initialize git (if not already)
git init
git add .
git commit -m "Initial WPCodingPress deployment"

# Create repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/wpcodingpress.git
git push -u origin main
```

#### Step 2: Connect via SSH

```bash
ssh username@wpcodingpress.com
```

#### Step 3: Clone & Setup on Server

```bash
# Navigate to Node.js app directory
cd ~/nodejs

# Clone repository
git clone https://github.com/YOUR_USERNAME/wpcodingpress.git wpcodingpress

# Enter directory
cd wpcodingpress

# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Push database schema
npx prisma db push
```

### Option B: Direct Upload

1. Zip the project locally
2. Upload via cPanel File Manager
3. Extract to `~/nodejs/wpcodingpress`
4. SSH in and run `npm install`

---

## ⚙️ Phase 4: Configure cPanel Node.js App

### 4.1 Setup Node.js Application

1. In cPanel, find **Setup Node.js App**
2. Click **Create Application**
3. Configure:
   - **Node.js version**: 20.x
   - **Application mode**: Production
   - **Application root**: `/home/username/nodejs/wpcodingpress`
   - **Application URL**: `https://wpcodingpress.com`
   - **Application startup file**: `server.js`

### 4.2 Environment Variables

Add these in the Node.js app configuration:

```
DATABASE_URL = mysql://wppress_db:YOUR_PASSWORD@localhost/wpcodingpress
NEXTAUTH_SECRET = your-secure-random-secret-key
NEXTAUTH_URL = https://wpcodingpress.com
NEXT_PUBLIC_APP_URL = https://wpcodingpress.com
NODE_ENV = production
```

### 4.3 Create Startup Script

Create `server.js` in project root:

```javascript
const { spawn } = require('child_process');

const server = spawn('node', ['node_modules/next/dist/bin/next', 'start'], {
  stdio: 'inherit',
  env: { ...process.env, NODE_ENV: 'production' }
});

server.on('close', (code) => {
  process.exit(code);
});
```

---

## 🔄 Phase 5: Build & Start

### 5.1 SSH into Server

```bash
ssh username@wpcodingpress.com
cd ~/nodejs/wpcodingpress
```

### 5.2 Build the Application

```bash
npm run build
```

### 5.3 Seed Database

Visit in browser:
```
https://wpcodingpress.com/api/seed
```

This creates:
- Admin user
- Default services
- Sample portfolio items

### 5.4 Start the Application

```bash
# Using PM2 (recommended)
npm install -g pm2
pm2 start server.js --name wpcodingpress
pm2 save
pm2 startup
```

Or restart via cPanel Node.js interface.

---

## 🔐 Admin Login

After seeding, access the admin panel:

**URL**: `https://wpcodingpress.com/admin`

**Credentials**:
- **Email**: `rahman.ceo@wpcodingpress.com`
- **Password**: `S0pnahenayf`

---

## 📁 Important Directories

```
~/nodejs/wpcodingpress/
├── app/                    # Next.js app directory
├── components/             # React components
├── lib/                    # Utilities
├── prisma/                 # Database schema
│   └── schema.prisma       # Database schema file
├── public/                 # Static files
│   └── portfolio/          # Portfolio images (upload here)
└── server.js               # Startup script
```

---

## 🖼️ Adding Portfolio Images

1. Upload images to `/public/portfolio/` via cPanel File Manager
2. Name them: `project-1.jpg`, `project-2.jpg`, etc.
3. Update portfolio items in admin panel with URLs like `/portfolio/project-1.jpg`

---

## 🔧 Troubleshooting

### Database Connection Issues
```bash
# Test connection
mysql -u wppress_db -p wpcodingpress
```

### Build Failures
```bash
# Clear cache and rebuild
rm -rf .next
npm run build
```

### Check Logs
```bash
pm2 logs wpcodingpress
```

### Restart Application
```bash
pm2 restart wpcodingpress
```

---

## 📱 Future Upgrades

### Add Stripe Payments

1. Install Stripe SDK:
```bash
npm install stripe @stripe/stripe-js
```

2. Add to `.env`:
```
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

3. Create payment routes in `/app/api/payments/`

### Add Headless WordPress

1. Install WPGraphQL plugin on your WordPress site
2. Create GraphQL client in `/lib/wordpress.ts`
3. Fetch content dynamically

### Add Client Dashboard

1. Create `/app/client/` routes
2. Add client authentication
3. Allow clients to track order status

---

## 📞 Support

For issues, check:
1. cPanel error logs
2. PM2 logs: `pm2 logs wpcodingpress`
3. Next.js console output

---

**Built with ❤️ by WPCodingPress**
