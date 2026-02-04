# AuraScan - Your AI's Conscience

<p align="center">
  <img src="public/icons/icon-512x512.png" alt="AuraScan Logo" width="120" />
</p>

<p align="center">
  <strong>Mobile-first PWA that makes ethical AI addictive via gamification</strong>
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#architecture">Architecture</a> •
  <a href="#contributing">Contributing</a>
</p>

---

## 🎯 Overview

AuraScan is a cutting-edge Progressive Web App designed to promote ethical AI practices through gamification, real-time analysis, and social features. Think "Duolingo for AI Ethics" - making responsible AI development engaging and rewarding.

### Why AuraScan?

- **90% Free**: Most features are completely free
- **Gamified Learning**: XP, karma, levels, streaks, quests, and achievements
- **Real-time Analysis**: Instant ethics scoring for AI prompts
- **AR Integration**: Analyze UI ethics through your camera
- **Community-Driven**: Guilds, leaderboards, and social features
- **Privacy-First**: Your data stays yours

## ✨ Features

### 🔍 Ethics Scanner
- Real-time prompt analysis with detailed scoring
- Categories: Bias, Privacy, Transparency, Safety, Consent
- Actionable recommendations
- Voice input support
- Carbon footprint tracking

### 🎮 Gamification Engine
- **XP System**: Earn XP for every ethical action
- **Levels**: Progress from Bronze to Diamond tier
- **Karma**: Build reputation through community contributions
- **Streaks**: Maintain daily engagement for bonuses
- **Quests**: Daily, weekly, and special challenges
- **Achievements**: 50+ badges to unlock

### 📚 Learning Hub
- Interactive courses on AI ethics
- Expert-led modules
- Progress tracking
- XP rewards for completion

### 🤝 Social Features
- Community feed
- Guilds/Teams
- Global leaderboards
- Template sharing
- Karma system

### 📱 AR Ethics Lens
- Point camera at any UI
- Real-time ethics overlay
- Issue highlighting
- Export analysis reports

### 👑 Premium Features ($2.99/month)
- Batch prompt processing
- API access
- Advanced analytics
- Priority support
- Team dashboard
- Custom templates

## 🛠 Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Animation | Framer Motion |
| State | Zustand |
| Data Fetching | TanStack Query |
| Database | Supabase |
| Auth | Supabase Auth |
| Payments | Stripe |
| PWA | next-pwa + Workbox |
| AR | WebXR API |
| AI/ML | TensorFlow.js |
| 3D | Three.js |
| Charts | Recharts |
| Icons | Lucide React |
| Components | Radix UI |

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn or pnpm
- Supabase account
- Stripe account (for payments)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/aurascan.git
   cd aurascan
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your environment variables:
   ```env
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

   # Stripe
   STRIPE_SECRET_KEY=your_stripe_secret_key
   STRIPE_WEBHOOK_SECRET=your_webhook_secret
   STRIPE_PRO_PRICE_ID=your_pro_price_id
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_publishable_key

   # App
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open [http://localhost:3000](http://localhost:3000)**

### Build for Production

```bash
npm run build
npm start
```

## 📁 Architecture

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   │   ├── scan/          # Ethics scanning endpoint
│   │   ├── stripe/        # Payment endpoints
│   │   └── webhooks/      # Webhook handlers
│   ├── ar/                # AR Lens page
│   ├── feed/              # Community feed
│   ├── guilds/            # Guilds/Teams
│   ├── leaderboard/       # Global rankings
│   ├── learn/             # Learning hub
│   ├── profile/           # User profile
│   ├── templates/         # Template library
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── providers.tsx      # Context providers
├── components/            # React components
│   ├── ar/               # AR-related components
│   ├── gamification/     # XP, achievements, etc.
│   ├── layout/           # Header, nav, sidebar
│   ├── scanner/          # Ethics scanner
│   └── ui/               # Base UI components
├── config/               # App configuration
├── lib/                  # Utilities & helpers
├── store/                # Zustand stores
├── styles/               # Global styles
└── types/                # TypeScript definitions
```

## 🎨 Design System

### Colors

| Category | Colors |
|----------|--------|
| Ethics | Safe (green), Warning (yellow), Danger (orange), Critical (red) |
| XP Tiers | Bronze, Silver, Gold, Platinum, Diamond |
| Karma | Positive, Neutral, Negative |
| UI | Primary (green), Neon effects, Glass morphism |

### Components

- **Glass Cards**: Frosted glass effect with blur
- **Neon Buttons**: Glowing accent buttons
- **Progress Rings**: Circular progress indicators
- **Score Badges**: Ethics score with color coding
- **Level Badges**: XP tier visualization

## 🔐 Security

- All API routes are protected
- Rate limiting on scan endpoints
- Stripe webhook signature verification
- Row-level security in Supabase
- Environment variables for secrets

## 📊 Database Schema

Key tables in Supabase:
- `users` - User profiles and settings
- `user_stats` - XP, karma, streaks
- `scans` - Scan history and results
- `achievements` - Unlocked badges
- `quests` - Quest progress
- `guilds` - Team/guild data
- `templates` - Shared prompt templates

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# E2E tests
npm run test:e2e
```

## 📱 PWA Features

- Installable on mobile and desktop
- Offline support with Workbox
- Push notifications
- Share target support
- File handling
- Custom protocol handler

## 🚢 Deployment

### Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/aurascan)

### Docker

```bash
docker build -t aurascan .
docker run -p 3000:3000 aurascan
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Trae.AI for ethics analysis inspiration
- The open-source community
- All our contributors and users

---

<p align="center">
  Made with 💚 for ethical AI
</p>

<p align="center">
  <a href="https://aurascan.lol">Website</a> •
  <a href="https://twitter.com/aurascanapp">Twitter</a> •
  <a href="https://discord.gg/aurascan">Discord</a>
</p>
