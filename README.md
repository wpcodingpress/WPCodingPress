# WPCodingPress - AI-Powered Web Development Agency

A modern, high-performance web agency platform built with Next.js 14, featuring a stunning dark futuristic UI design.

## 🚀 Features

- **Public Website**
  - Home page with hero, services, portfolio, pricing, and CTA sections
  - Services listing with detailed pricing packages
  - Portfolio showcase with category filtering
  - About page with company story and skills
  - Contact form with validation
  - Multi-step order form

- **Admin Dashboard**
  - Secure authentication with NextAuth.js
  - Dashboard with statistics overview
  - Order management with status updates
  - Contact messages management
  - Services CRUD operations
  - Portfolio items management

- **Design System**
  - Dark futuristic theme
  - Glassmorphism effects
  - Gradient accents (indigo, purple, cyan)
  - Smooth Framer Motion animations
  - Fully responsive design

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: ShadCN UI + Radix UI
- **Database**: MySQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Animations**: Framer Motion
- **Icons**: Lucide React

## 📦 Installation

### Prerequisites

- Node.js 18+
- MySQL Database
- npm or yarn

### Setup

1. **Clone and Install**

```bash
cd wpcodingpress
npm install
```

2. **Configure Environment**

Create `.env` file:

```env
DATABASE_URL="mysql://USER:PASSWORD@localhost:3306/wpcodingpress"
NEXTAUTH_SECRET="your-secure-random-string"
NEXTAUTH_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

3. **Initialize Database**

```bash
npx prisma generate
npx prisma db push
```

4. **Seed Initial Data**

Visit: `http://localhost:3000/api/seed`

5. **Run Development Server**

```bash
npm run dev
```

6. **Access the Site**

- **Website**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin
- **Admin Login**: `rahman.ceo@wpcodingpress.com` / `S0pnahenayf`

## 📁 Project Structure

```
wpcodingpress/
├── app/
│   ├── (public)/           # Public website pages
│   │   ├── page.tsx       # Home
│   │   ├── services/       # Services pages
│   │   ├── pricing/        # Pricing page
│   │   ├── portfolio/      # Portfolio page
│   │   ├── about/          # About page
│   │   ├── contact/        # Contact page
│   │   └── order/          # Order form
│   ├── admin/              # Admin dashboard
│   │   ├── login/          # Admin login
│   │   ├── orders/         # Orders management
│   │   ├── contacts/       # Contact messages
│   │   ├── services/       # Services CRUD
│   │   └── portfolio/      # Portfolio management
│   └── api/                # API routes
│       ├── auth/           # NextAuth routes
│       ├── orders/         # Orders API
│       ├── contacts/       # Contacts API
│       ├── services/       # Services API
│       ├── portfolio/      # Portfolio API
│       └── seed/           # Database seeding
├── components/
│   ├── ui/                 # ShadCN components
│   └── layout/             # Navbar, Footer
├── lib/
│   ├── prisma.ts          # Prisma client
│   └── utils.ts           # Utilities
├── prisma/
│   └── schema.prisma     # Database schema
├── public/
│   └── portfolio/         # Portfolio images
└── types/                 # TypeScript types
```

## 🎨 Design System

### Colors

- Background: `#0a0a0a`
- Primary: `#6366f1` (Indigo)
- Secondary: `#8b5cf6` (Purple)
- Accent: `#22d3ee` (Cyan)

### Typography

- Font: Inter (Google Fonts)
- Weights: 300-900

## 🔐 Admin Credentials

```
Email: rahman.ceo@wpcodingpress.com
Password: S0pnahenayf
```

## 🌐 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete deployment instructions for cPanel with Node.js.

## 📱 Responsive Design

The platform is fully responsive and optimized for:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (320px - 767px)

## 🔧 API Endpoints

| Endpoint | Methods | Description |
|----------|---------|-------------|
| `/api/auth/*` | POST, GET | Authentication |
| `/api/orders` | GET, POST | List/Create orders |
| `/api/orders/[id]` | GET, PATCH, DELETE | Order operations |
| `/api/contacts` | GET, POST | List/Create contacts |
| `/api/services` | GET, POST | List/Create services |
| `/api/portfolio` | GET, POST | List/Create portfolio |
| `/api/seed` | GET | Seed database |

## 📈 Future Upgrades

- Stripe/PayPal payment integration
- Headless WordPress CMS integration
- Client dashboard for order tracking
- Subscription system
- Email marketing integration

## 📄 License

Copyright © 2024 WPCodingPress. All rights reserved.

---

Built with ❤️ using Next.js, Tailwind CSS, and ShadCN UI
