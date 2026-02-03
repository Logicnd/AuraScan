# 🚀 AuraScan Setup Guide

> **Your AI's Conscience** - Complete Production Setup

This guide walks you through setting up ALL the APIs, services, and configurations needed to run AuraScan in production.

---

## 📋 Table of Contents

1. [Quick Start (Development)](#quick-start-development)
2. [Required Services](#required-services)
   - [Supabase (Database & Auth)](#1-supabase-database--auth)
   - [OpenAI (Ethics Analysis)](#2-openai-ethics-analysis)
   - [Stripe (Payments)](#3-stripe-payments)
3. [Optional Services](#optional-services)
   - [Anthropic Claude](#4-anthropic-claude-optional)
   - [Perspective API](#5-perspective-api-optional)
   - [Push Notifications](#6-push-notifications-optional)
   - [Email Service](#7-email-service-optional)
   - [Rate Limiting](#8-rate-limiting-optional)
4. [Configuration Files](#configuration-files)
5. [Deployment Checklist](#deployment-checklist)

---

## Quick Start (Development)

```bash
# 1. Install dependencies
npm install

# 2. Copy environment template
cp .env.example .env.local

# 3. Run in demo mode (no API keys needed)
npm run dev
```

The app runs in **Demo Mode** without API keys, using mock data. Configure the services below for real functionality.

---

## Required Services

### 1. Supabase (Database & Auth)

**What it does:** PostgreSQL database, user authentication, real-time subscriptions.

#### Setup Steps:

1. **Create Project**
   - Go to: https://supabase.com/dashboard
   - Click "New Project"
   - Fill in project name, password, region
   - Wait ~2 minutes for provisioning

2. **Get API Keys**
   - Go to: Settings → API (left sidebar)
   - Copy the following:
   
   | Key | Location | Format | Env Variable |
   |-----|----------|--------|--------------|
   | Project URL | Project URL | `https://xxx.supabase.co` | `NEXT_PUBLIC_SUPABASE_URL` |
   | Anon Key | Project API Keys → `anon public` | `eyJ...` | `NEXT_PUBLIC_SUPABASE_ANON_KEY` |
   | Service Role | Project API Keys → `service_role secret` | `eyJ...` | `SUPABASE_SERVICE_ROLE_KEY` |

3. **Run Database Schema**
   - Go to: SQL Editor (left sidebar)
   - Click "New Query"
   - Copy/paste contents of `supabase/schema.sql`
   - Click "Run" (or Ctrl+Enter)

4. **Configure Authentication (Optional but Recommended)**
   
   For OAuth (Google, GitHub, Discord):
   - Go to: Authentication → Providers
   - Enable desired providers
   - Follow provider-specific setup:
     - **Google:** https://supabase.com/docs/guides/auth/social-login/auth-google
     - **GitHub:** https://supabase.com/docs/guides/auth/social-login/auth-github
     - **Discord:** https://supabase.com/docs/guides/auth/social-login/auth-discord

```env
# Add to .env.local
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

### 2. OpenAI (Ethics Analysis)

**What it does:** Powers the core ethics analysis using GPT-4 Turbo.

#### Pricing Estimate:
- GPT-4 Turbo: ~$0.01-0.02 per scan
- 1000 scans ≈ $10-20

#### Setup Steps:

1. **Create Account**
   - Go to: https://platform.openai.com/signup

2. **Add Payment Method**
   - Go to: https://platform.openai.com/account/billing/overview
   - Add credit card (required for API access)
   - Start with $5-10 for testing

3. **Create API Key**
   - Go to: https://platform.openai.com/api-keys
   - Click "Create new secret key"
   - Name it "AuraScan"
   - **Copy immediately** (shown only once!)

4. **Set Usage Limits (Important!)**
   - Go to: https://platform.openai.com/account/limits
   - Set a monthly budget limit to prevent surprises

```env
# Add to .env.local
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

---

### 3. Stripe (Payments)

**What it does:** Subscription billing, payment processing, webhooks.

#### Setup Steps:

1. **Create Account**
   - Go to: https://dashboard.stripe.com/register
   - Complete email verification

2. **Get API Keys**
   - Go to: https://dashboard.stripe.com/apikeys
   - Toggle "Test Mode" ON for development
   - Copy:
     - Publishable key: `pk_test_...`
     - Secret key: `sk_test_...`

3. **Create Products & Prices**
   - Go to: https://dashboard.stripe.com/products
   - Click "Add Product"
   - Create **AuraScan Pro**:
     - Add Monthly Price: $2.99/month → Copy Price ID (`price_...`)
     - Add Yearly Price: $29.99/year → Copy Price ID (`price_...`)

4. **Set Up Webhooks**
   - Go to: https://dashboard.stripe.com/webhooks
   - Click "Add endpoint"
   - Endpoint URL: `https://yourdomain.com/api/webhooks/stripe`
   - Select events:
     - `checkout.session.completed`
     - `customer.subscription.created`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `invoice.payment_succeeded`
     - `invoice.payment_failed`
   - Copy Signing Secret: `whsec_...`

5. **Local Testing with Stripe CLI**
   ```bash
   # Install Stripe CLI
   # Windows: scoop install stripe
   # Mac: brew install stripe/stripe-cli/stripe
   
   # Login
   stripe login
   
   # Forward webhooks to localhost
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   
   # Use the webhook secret shown in terminal
   ```

```env
# Add to .env.local
STRIPE_SECRET_KEY=sk_test_51xxx...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51xxx...
STRIPE_WEBHOOK_SECRET=whsec_xxx...
STRIPE_PRICE_ID_MONTHLY=price_xxx
STRIPE_PRICE_ID_YEARLY=price_xxx
```

#### Test Cards:
| Scenario | Card Number |
|----------|-------------|
| Success | 4242 4242 4242 4242 |
| Decline | 4000 0000 0000 0002 |
| 3D Secure | 4000 0027 6000 3184 |
| Insufficient Funds | 4000 0000 0000 9995 |

---

## Optional Services

### 4. Anthropic Claude (Optional)

**What it does:** Alternative AI for ethics analysis (backup/comparison).

1. Go to: https://console.anthropic.com/
2. Sign up → API Keys → Create Key
3. Add to `.env.local`:

```env
ANTHROPIC_API_KEY=sk-ant-xxxxxxxx
```

---

### 5. Perspective API (Optional)

**What it does:** Enhanced toxicity detection from Google/Jigsaw.

1. Go to: https://perspectiveapi.com/
2. Click "Get Started" → Request API Access
3. Wait for approval (1-3 days)
4. Create API key in Google Cloud Console
5. Add to `.env.local`:

```env
PERSPECTIVE_API_KEY=AIzaSyxxxxxxxxxx
```

---

### 6. Push Notifications (Optional)

**What it does:** Browser push notifications for alerts.

1. Generate VAPID keys:
   ```bash
   npx web-push generate-vapid-keys
   ```
2. Add to `.env.local`:

```env
NEXT_PUBLIC_VAPID_PUBLIC_KEY=BLxxxxxx...
VAPID_PRIVATE_KEY=xxxxxx...
```

---

### 7. Email Service (Optional)

**What it does:** Transactional emails (welcome, password reset, reports).

Using **Resend** (recommended):
1. Go to: https://resend.com/signup
2. Verify domain: Domains → Add Domain
3. Create API key: API Keys → Create
4. Add to `.env.local`:

```env
RESEND_API_KEY=re_xxxxxxxxxx
```

---

### 8. Rate Limiting (Optional)

**What it does:** Prevents API abuse with Redis-based rate limiting.

Using **Upstash Redis**:
1. Go to: https://console.upstash.com/
2. Create Database
3. Copy REST URL and Token
4. Add to `.env.local`:

```env
UPSTASH_REDIS_REST_URL=https://xxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=AYxxxxxx
```

---

## Configuration Files

### Core Configuration: `src/config/index.ts`

All app behavior is controlled by these constants:

| Config | Purpose | File Section |
|--------|---------|--------------|
| `APP_CONFIG` | Branding, URLs, social links | App identity |
| `FEATURE_FLAGS` | Enable/disable features | Feature toggles |
| `GAMIFICATION_CONFIG` | XP, karma, levels, rewards | Game mechanics |
| `ETHICS_CONFIG` | Analysis thresholds, weights | AI settings |
| `SUBSCRIPTION_CONFIG` | Pricing, tier limits, features | Business model |
| `RATE_LIMITS` | API usage limits | Abuse prevention |

### PWA Configuration: `public/manifest.json`

Controls the Progressive Web App install experience:
- App name and icons
- Theme colors
- Shortcuts

### Tailwind Configuration: `tailwind.config.ts`

Customize design system:
- Colors (green theme by default)
- Fonts
- Animations

---

## Deployment Checklist

### Before Going Live:

- [ ] **Environment Variables**
  - [ ] All required env vars are set
  - [ ] Using LIVE Stripe keys (not test)
  - [ ] Webhook endpoints configured for production domain

- [ ] **Supabase**
  - [ ] Schema deployed
  - [ ] RLS policies enabled
  - [ ] OAuth redirect URLs updated for production

- [ ] **Stripe**
  - [ ] Switch from test to live mode
  - [ ] Create live products/prices
  - [ ] Update webhook endpoint to production URL
  - [ ] Configure billing portal: https://dashboard.stripe.com/settings/billing/portal

- [ ] **OpenAI**
  - [ ] Set appropriate usage limits
  - [ ] Set up usage alerts
  - [ ] Consider adding org ID if using team account

- [ ] **Security**
  - [ ] Generate new encryption key for production
  - [ ] Verify service_role key is only used server-side
  - [ ] Enable Supabase RLS on all tables

- [ ] **Domain & SSL**
  - [ ] Update `NEXT_PUBLIC_APP_URL` to production domain
  - [ ] Update all redirect URLs (OAuth, Stripe)

---

## Troubleshooting

### "Supabase not configured" warnings
- Check that `NEXT_PUBLIC_SUPABASE_URL` is set correctly
- Ensure values aren't still placeholders

### Stripe webhooks not working
- Verify webhook secret matches your endpoint
- Check that all required events are selected
- For local: Use `stripe listen` CLI

### OpenAI rate limits
- Check your tier at https://platform.openai.com/account/limits
- Consider upgrading to higher tier for production

### OAuth not redirecting
- Verify callback URL matches: `https://yourdomain.com/auth/callback`
- Check provider settings in Supabase dashboard

---

## Support

- Documentation: https://docs.aurascan.ai
- Email: support@aurascan.ai
- Discord: https://discord.gg/aurascan

---

*Last updated: 2024*
