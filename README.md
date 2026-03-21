# ONEWAY Parts LLC — eCommerce Platform

A modern, full-stack auto parts eCommerce platform built with Next.js 14, PostgreSQL, Prisma, and Tailwind CSS. Designed for performance, scalability, and easy deployment.

## Features

### Customer Storefront
- **Vehicle Fitment Finder** — Search parts by year, make, and model
- **Advanced Filtering** — Category, price range, brand, and vehicle compatibility
- **Smart Search** — Real-time autocomplete with product suggestions
- **Shopping Cart** — Add, update, remove items with persistent storage
- **Guest Checkout** — Place orders without creating an account
- **Responsive Design** — Mobile-first, optimized for all devices
- **SEO Optimized** — Auto-generated meta tags, schema markup, sitemap

### Admin Dashboard
- **Product Management** — Add, edit, bulk update products with image upload
- **CSV Import/Export** — Bulk product upload via CSV
- **Order Management** — View, update status, export orders
- **Vehicle Fitment** — Assign products to specific year/make/model
- **Auto SEO** — One-click meta tag generation
- **Low Stock Alerts** — Automatic notifications when inventory is low
- **Feature Flags** — Toggle payments, reviews, wishlist from settings
- **Analytics Dashboard** — Revenue, orders, and product performance

### Payment Integration (Future-Ready)
- **Payment Abstraction Layer** — Unified interface for Stripe and PayPal
- **Feature Flag** — Toggle payments ON/OFF from admin settings
- **Webhook Support** — Ready for payment confirmation webhooks
- **Secure Architecture** — No card data stored locally

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router), React 18, Tailwind CSS |
| Backend | Next.js API Routes, NextAuth.js |
| Database | PostgreSQL, Prisma ORM |
| State | Zustand (cart, wishlist, recently viewed) |
| Email | Nodemailer (SMTP) |
| Payments | Stripe + PayPal (disabled by default) |
| Deployment | Vercel, Docker, GitHub Actions CI/CD |

## Quick Start

### Prerequisites
- Node.js 20+
- PostgreSQL 14+ (or use Docker)
- npm or yarn

### 1. Clone and Install

```bash
git clone https://github.com/your-org/oneway-parts.git
cd oneway-parts
npm install
```

### 2. Set Up Environment

```bash
cp .env.example .env
# Edit .env with your database URL and other settings
```

### 3. Set Up Database

```bash
# Option A: Use Docker
docker compose up -d db

# Option B: Use existing PostgreSQL
# Update DATABASE_URL in .env

# Run migrations and seed
npx prisma db push
npm run db:seed
```

### 4. Run Development Server

```bash
npm run dev
# Open http://localhost:3000
```

### Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@onewayparts.com | admin123 |
| Customer | customer@example.com | customer123 |

## Project Structure

```
oneway-parts/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.ts                # Seed script
├── public/
│   └── images/                # Static assets
├── src/
│   ├── app/
│   │   ├── (storefront)/      # Customer-facing pages
│   │   │   ├── page.tsx       # Homepage
│   │   │   ├── products/      # Catalog + detail
│   │   │   ├── cart/          # Cart page
│   │   │   ├── checkout/      # Checkout flow
│   │   │   └── contact/       # Contact form
│   │   ├── admin/             # Admin dashboard
│   │   │   ├── page.tsx       # Dashboard
│   │   │   ├── products/      # Product management
│   │   │   ├── orders/        # Order management
│   │   │   └── settings/      # Store settings
│   │   ├── api/               # API routes
│   │   │   ├── auth/          # Authentication
│   │   │   ├── products/      # Product CRUD
│   │   │   ├── orders/        # Order CRUD
│   │   │   ├── search/        # Search endpoint
│   │   │   ├── contact/       # Contact form
│   │   │   └── webhooks/      # Payment webhooks
│   │   └── auth/              # Auth pages
│   ├── components/
│   │   ├── storefront/        # Customer UI components
│   │   └── admin/             # Admin UI components
│   └── lib/
│       ├── auth.ts            # NextAuth config
│       ├── db.ts              # Prisma client
│       ├── email.ts           # Email templates
│       ├── payment.ts         # Payment abstraction
│       ├── seo.ts             # SEO utilities
│       ├── store.ts           # Zustand stores
│       ├── utils.ts           # Helper functions
│       └── validations.ts     # Zod schemas
├── .env.example
├── .github/workflows/ci.yml   # CI/CD pipeline
├── docker-compose.yml
├── Dockerfile
└── README.md
```

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Vercel auto-detects Next.js and deploys

### Docker

```bash
docker compose up -d
```

### CI/CD

GitHub Actions pipeline runs on every push:
1. Install dependencies
2. Generate Prisma client
3. Lint code
4. Build application
5. Deploy to Vercel (main branch only)

## Enabling Payments

1. Go to Admin → Settings → Payments
2. Enter Stripe/PayPal credentials
3. Set `ENABLE_PAYMENTS=true` in environment
4. Toggle payments ON in admin settings
5. Stripe webhook: `/api/webhooks/stripe`

## Environment Variables

See `.env.example` for all required variables.

## License

Proprietary — ONEWAY Parts LLC. All rights reserved.
