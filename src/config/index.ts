// ╔════════════════════════════════════════════════════════════════════════════╗
// ║                    AURASCAN CONFIGURATION CENTER                            ║
// ║                     Your AI's Conscience - App Config                       ║
// ╠════════════════════════════════════════════════════════════════════════════╣
// ║  This file contains ALL configurable constants for AuraScan.                ║
// ║  Modify these values to customize the app's behavior.                       ║
// ║                                                                             ║
// ║  CONFIGURATION TYPES:                                                       ║
// ║  • APP_CONFIG - Branding, URLs, social links                                ║
// ║  • FEATURE_FLAGS - Enable/disable features                                  ║
// ║  • GAMIFICATION_CONFIG - XP, karma, levels, rewards                         ║
// ║  • ETHICS_CONFIG - Analysis thresholds and weights                          ║
// ║  • SUBSCRIPTION_CONFIG - Pricing tiers and limits                           ║
// ║  • AR_CONFIG - Augmented reality settings                                   ║
// ║  • RATE_LIMITS - API usage limits per tier                                  ║
// ╚════════════════════════════════════════════════════════════════════════════╝

// ═══════════════════════════════════════════════════════════════════════════════
// 🏢 APP CONFIGURATION
// Basic app settings, branding, and external links
// ═══════════════════════════════════════════════════════════════════════════════
export const APP_CONFIG = {
  // ─────────────────────────────────────────────────────────────────────────────
  // BRANDING
  // ─────────────────────────────────────────────────────────────────────────────
  
  /** 
   * App display name - shown in header, PWA install, emails
   * @configurable Change to rebrand the app
   */
  name: 'AuraScan',
  
  /**
   * Tagline - shown below logo in marketing materials
   * @configurable Update for different messaging
   */
  tagline: "Your AI's Conscience",
  
  /**
   * Full description - used in meta tags, app stores, SEO
   * @configurable Modify for different positioning
   */
  description: 'Mobile-first PWA for ethical AI analysis with gamification',
  
  /**
   * Semantic version - update on each release
   * @configurable Increment on releases: MAJOR.MINOR.PATCH
   */
  version: '1.0.0',
  
  /**
   * Marketing slogan - used in campaigns
   * @configurable Change for different campaigns
   */
  launchSlogan: 'Be the change in your AI.',
  
  // ─────────────────────────────────────────────────────────────────────────────
  // URLs
  // Configure these when deploying to different environments
  // ─────────────────────────────────────────────────────────────────────────────
  urls: {
    /**
     * Production URL - your main domain
     * @configurable Set to your registered domain (no trailing slash)
     * @example 'https://aurascan.ai' or 'https://ethics.yourcompany.com'
     */
    production: 'https://aurascan.ai',
    
    /**
     * Staging URL - for testing before production
     * @configurable Set to your staging subdomain
     */
    staging: 'https://staging.aurascan.ai',
    
    /**
     * API base URL - for external API calls
     * @configurable Falls back to env var NEXT_PUBLIC_API_URL
     */
    api: process.env.NEXT_PUBLIC_API_URL || 'https://api.aurascan.ai',
  },
  
  // ─────────────────────────────────────────────────────────────────────────────
  // SOCIAL MEDIA
  // Update these with your actual social handles
  // ─────────────────────────────────────────────────────────────────────────────
  social: {
    /**
     * Twitter/X handle - for social sharing and mentions
     * @configurable Your Twitter username with @
     */
    twitter: '@AuraScanAI',
    
    /**
     * Discord server invite - for community
     * @configurable Create at: https://discord.com/developers/applications
     */
    discord: 'https://discord.gg/aurascan',
    
    /**
     * GitHub organization - for open source code
     * @configurable Your GitHub org/user URL
     */
    github: 'https://github.com/aurascan',
  },
  
  // ─────────────────────────────────────────────────────────────────────────────
  // SUPPORT
  // Customer support contact information
  // ─────────────────────────────────────────────────────────────────────────────
  support: {
    /**
     * Support email - for customer inquiries
     * @configurable Your support email address
     */
    email: 'support@aurascan.ai',
    
    /**
     * Documentation URL - help docs and guides
     * @configurable Link to your docs (GitBook, Notion, custom)
     */
    docs: 'https://docs.aurascan.ai',
  },
} as const;


// ═══════════════════════════════════════════════════════════════════════════════
// 🚀 FEATURE FLAGS
// Toggle features on/off without code changes
// Set to 'false' to disable a feature, 'true' to enable
// ═══════════════════════════════════════════════════════════════════════════════
export const FEATURE_FLAGS = {
  /**
   * AR Ethics Lens - Real-time camera-based ethics scanning
   * @configurable Set false if you don't want AR features
   * @requires Camera permissions from user
   */
  enableAR: true,
  
  /**
   * VR Mode - Immersive virtual reality ethics experience
   * @configurable Set false to hide VR options
   * @requires WebXR compatible browser/device
   */
  enableVR: true,
  
  /**
   * Voice Input - Speak prompts instead of typing
   * @configurable Set false to hide microphone button
   * @requires Web Speech API (Chrome, Edge, Safari)
   */
  enableVoiceInput: true,
  
  /**
   * Deepfake Detection - Analyze images/videos for AI manipulation
   * @configurable Set false to disable deepfake features
   * @requires Additional ML model loading
   */
  enableDeepfakeDetection: true,
  
  /**
   * Biofeedback Integration - Connect to heart rate monitors, etc.
   * @configurable COMING SOON - Not yet implemented
   * @status Planned for v2.0
   */
  enableBiofeedback: false,
  
  /**
   * Neural Interface - Brain-computer interface support
   * @configurable FUTURE FEATURE - Not yet implemented
   * @status Experimental roadmap item
   */
  enableNeuralInterface: false,
  
  /**
   * Blockchain Verification - NFT certificates for ethics scores
   * @configurable Set false to disable blockchain features
   * @requires Web3 wallet connection
   */
  enableBlockchainVerification: true,
  
  /**
   * Quantum Encryption - Post-quantum cryptography
   * @configurable FUTURE FEATURE - Not yet implemented
   * @status Research phase
   */
  enableQuantumEncryption: false,
  
  /**
   * Metaverse Integration - 3D social spaces
   * @configurable Set false to disable metaverse features
   */
  enableMetaverse: true,
  
  /**
   * Dark Web Monitor - Check if AI outputs leak to dark web
   * @configurable Premium feature - requires subscription
   */
  enableDarkWebMonitor: true,
  
  /**
   * Custom AI Models - Let users bring their own models
   * @configurable Premium feature - requires API infrastructure
   */
  enableCustomAIModels: true,
} as const;


// ═══════════════════════════════════════════════════════════════════════════════
// 🎮 GAMIFICATION CONFIGURATION
// All settings for XP, karma, levels, and rewards
// Tune these to balance engagement and progression
// ═══════════════════════════════════════════════════════════════════════════════
export const GAMIFICATION_CONFIG = {
  // ─────────────────────────────────────────────────────────────────────────────
  // LEVEL SYSTEM
  // ─────────────────────────────────────────────────────────────────────────────
  
  /**
   * Maximum achievable level
   * @configurable Increase for longer progression (50-200 typical)
   * @balance Higher = longer engagement, but may feel grindy
   */
  maxLevel: 100,
  
  /**
   * XP needed for level 1→2
   * @configurable Lower = faster early progression
   * @formula Level N requires: baseXPPerLevel * (xpMultiplier ^ (N-1))
   */
  baseXPPerLevel: 100,
  
  /**
   * XP multiplier per level (exponential growth)
   * @configurable 1.0 = linear, 1.1-1.2 = moderate curve, 1.3+ = steep
   * @example 1.15 means each level needs 15% more XP than previous
   */
  xpMultiplier: 1.15,
  
  /**
   * Maximum karma points achievable
   * @configurable Karma = reputation, separate from XP
   */
  maxKarma: 10000,
  
  /**
   * Free streak freezes per user
   * @configurable Higher = more forgiving for missed days
   */
  streakFreezes: 3,
  
  /**
   * Number of daily quests available
   * @configurable 3-5 is typical for engagement without overwhelm
   */
  dailyQuestCount: 3,
  
  /**
   * Number of weekly quests available
   * @configurable Larger rewards, harder objectives
   */
  weeklyQuestCount: 5,
  
  // ─────────────────────────────────────────────────────────────────────────────
  // XP REWARDS
  // Points awarded for different actions
  // @configurable Adjust to balance progression speed
  // ─────────────────────────────────────────────────────────────────────────────
  xpRewards: {
    /** XP for completing a basic scan */
    scan: 10,
    
    /** XP for completing deep analysis */
    analyze: 25,
    
    /** XP for sharing results socially */
    shareResult: 15,
    
    /** XP for helping another user */
    helpUser: 50,
    
    /** XP for completing any quest */
    completeQuest: 100,
    
    /** XP for unlocking an achievement */
    achievementUnlock: 200,
    
    /** XP for daily login bonus */
    dailyLogin: 25,
    
    /** XP bonus per day of streak */
    streakBonus: 50,
    
    /** XP for contributing to guild */
    guildContribution: 30,
    
    /** XP for completing a learning course */
    courseComplete: 150,
    
    /** XP for submitting approved template */
    templateSubmit: 75,
  },
  
  // ─────────────────────────────────────────────────────────────────────────────
  // KARMA REWARDS
  // Reputation points for community actions
  // @configurable Karma affects leaderboard ranking
  // ─────────────────────────────────────────────────────────────────────────────
  karmaRewards: {
    /** Karma for leaving a helpful comment */
    helpfulComment: 5,
    
    /** Karma for accurate issue reports */
    reportAccurate: 10,
    
    /** Karma for mentoring new users */
    mentoring: 25,
    
    /** Karma for hosting guild events */
    guildEvent: 15,
    
    /** Karma for winning challenges */
    challengeWin: 50,
    
    /** Karma for making ethical choices */
    ethicalChoice: 20,
  },
  
  // ─────────────────────────────────────────────────────────────────────────────
  // LEVEL TIERS
  // Visual rankings based on level ranges
  // @configurable Adjust ranges for different progression feel
  // ─────────────────────────────────────────────────────────────────────────────
  levelTiers: {
    /** Beginner tier - levels 1-10 */
    novice: { min: 1, max: 10, color: 'bronze' },
    
    /** Early progression - levels 11-25 */
    apprentice: { min: 11, max: 25, color: 'silver' },
    
    /** Mid-level - levels 26-50 */
    practitioner: { min: 26, max: 50, color: 'gold' },
    
    /** Advanced - levels 51-75 */
    expert: { min: 51, max: 75, color: 'platinum' },
    
    /** Top tier - levels 76-100 */
    master: { min: 76, max: 100, color: 'diamond' },
  },
} as const;


// ═══════════════════════════════════════════════════════════════════════════════
// ⚖️ ETHICS ANALYSIS CONFIGURATION
// Settings for the AI ethics scoring engine
// ═══════════════════════════════════════════════════════════════════════════════
export const ETHICS_CONFIG = {
  // ─────────────────────────────────────────────────────────────────────────────
  // SCORE THRESHOLDS
  // Determines risk level based on overall ethics score (0-100)
  // @configurable Lower thresholds = stricter, higher = more lenient
  // ─────────────────────────────────────────────────────────────────────────────
  defaultThresholds: {
    /** Score >= 80: Safe - No significant concerns */
    safe: 80,
    
    /** Score >= 60: Warning - Minor issues to review */
    warning: 60,
    
    /** Score >= 40: Danger - Significant ethical concerns */
    danger: 40,
    
    /** Score < 40: Critical - Serious issues requiring attention */
    critical: 20,
  },
  
  // ─────────────────────────────────────────────────────────────────────────────
  // CATEGORY WEIGHTS
  // How much each category affects the overall score (must sum to 1.0)
  // @configurable Adjust based on your priorities
  // @validation Ensure all weights add up to exactly 1.0
  // ─────────────────────────────────────────────────────────────────────────────
  defaultWeights: {
    /** Bias detection weight - discrimination, stereotypes */
    bias: 0.20,
    
    /** Toxicity weight - harmful language, hate speech */
    toxicity: 0.15,
    
    /** Privacy weight - PII exposure, data risks */
    privacy: 0.15,
    
    /** Accuracy weight - factual correctness, misinformation */
    accuracy: 0.15,
    
    /** Transparency weight - deception, hidden agendas */
    transparency: 0.10,
    
    /** Fairness weight - equal treatment across groups */
    fairness: 0.10,
    
    /** Harmfulness weight - potential for real-world harm */
    harmfulness: 0.10,
    
    /** Manipulation weight - dark patterns, coercion */
    manipulation: 0.05,
  },
  
  // ─────────────────────────────────────────────────────────────────────────────
  // BIAS CATEGORIES
  // Types of bias the system detects
  // @configurable Add/remove categories based on your needs
  // ─────────────────────────────────────────────────────────────────────────────
  biasCategories: [
    'gender',           // Male/female/non-binary bias
    'race_ethnicity',   // Racial and ethnic discrimination
    'religion',         // Religious bias
    'age',              // Ageism (young/old)
    'disability',       // Ableism
    'sexual_orientation', // LGBTQ+ bias
    'nationality',      // Country/origin bias
    'socioeconomic',    // Class/wealth bias
    'political',        // Political leaning bias
    'appearance',       // Lookism, body shaming
  ],
  
  // ─────────────────────────────────────────────────────────────────────────────
  // PROTECTED GROUPS
  // Groups the system specifically monitors for unfair treatment
  // @configurable Add groups relevant to your user base
  // ─────────────────────────────────────────────────────────────────────────────
  protectedGroups: [
    'women',
    'men',
    'non-binary',
    'LGBTQ+',
    'racial_minorities',
    'religious_minorities',
    'elderly',
    'youth',
    'disabled',
    'immigrants',
    'refugees',
    'indigenous',
    'veterans',
    'homeless',
    'neurodivergent',
  ],
  
  // ─────────────────────────────────────────────────────────────────────────────
  // COMPLIANCE FRAMEWORKS
  // Regulatory standards the system checks against
  // @configurable Add frameworks relevant to your industry/region
  // ─────────────────────────────────────────────────────────────────────────────
  complianceFrameworks: [
    'GDPR',   // EU General Data Protection Regulation
    'HIPAA',  // US Health Insurance Portability Act
    'CCPA',   // California Consumer Privacy Act
    'COPPA',  // Children's Online Privacy Protection Act
    'AI_ACT', // EU AI Act (upcoming)
  ],
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// 💳 SUBSCRIPTION CONFIGURATION
// Pricing tiers, features, and usage limits
// ═══════════════════════════════════════════════════════════════════════════════
export const SUBSCRIPTION_CONFIG = {
  // ─────────────────────────────────────────────────────────────────────────────
  // FREE TIER LIMITS
  // What users get without paying
  // @configurable Balance value vs conversion to paid
  // ─────────────────────────────────────────────────────────────────────────────
  freeTier: {
    /** Max scans per day for free users */
    dailyScans: 10,
    
    /** Prompts per batch (free = single scan only) */
    batchSize: 1,
    
    /** Team members allowed (free = solo only) */
    teamMembers: 1,
    
    /** API calls per month (free = no API access) */
    apiCalls: 0,
    
    /** Cloud storage in GB for scan history */
    storageGB: 0.5,
    
    /** Days of history retention */
    historyDays: 7,
  },
  
  // ─────────────────────────────────────────────────────────────────────────────
  // PREMIUM TIER
  // Paid subscription benefits and pricing
  // @configurable Adjust pricing based on market research
  // @note Create corresponding Stripe prices for these amounts
  // ─────────────────────────────────────────────────────────────────────────────
  premiumTier: {
    /**
     * Monthly price in currency units
     * @configurable Match with Stripe price ID
     * @setup Create price at: https://dashboard.stripe.com/products
     */
    price: 2.99,
    
    /** Currency code (ISO 4217) */
    currency: 'USD',
    
    /** Billing interval */
    interval: 'month',
    
    /** Max scans per day for premium */
    dailyScans: 1000,
    
    /** Prompts per batch upload */
    batchSize: 50,
    
    /** Team members per account */
    teamMembers: 10,
    
    /** API calls per month */
    apiCalls: 10000,
    
    /** Cloud storage in GB */
    storageGB: 10,
    
    /** Days of history retention */
    historyDays: 365,
  },
  
  // ─────────────────────────────────────────────────────────────────────────────
  // FEATURE LISTS
  // Marketing copy for pricing pages
  // @configurable Update as you add/remove features
  // ─────────────────────────────────────────────────────────────────────────────
  features: {
    free: [
      'Prompt Scanner',
      'Output Autopsy',
      'Bias Visualizer',
      'Basic AR Lens',
      'Karma System',
      'Daily Quests',
      'Privacy Shield',
      'Eco-Meter',
      'Template Vault (100+)',
      'Community Challenges',
      'Real-time Alerts',
      'Basic Deepfake Detection',
      'Ethical Journal',
      'Badge System',
      'Widget',
      'Learning Hub',
      'Weekly Report',
      'Voice Input',
      'Multi-language (20+)',
      'Accessibility',
    ],
    premium: [
      'Unlimited Scans (1000+/day)',
      'Batch Processor',
      'Deep Ethics Mode',
      'Custom Frameworks',
      'Team Dashboard (10 members)',
      'API Access',
      'Historical Analytics (1 year)',
      'Priority Support',
      'Certification Badges',
      'Advanced AR (3D)',
      'Voice Cloning Detection',
      'Real-time Collaboration',
      'Export All Data',
      'Dark Web Monitor',
      'Custom AI Models',
    ],
  },
  
  // ─────────────────────────────────────────────────────────────────────────────
  // ETHICS COMMITMENT
  // Company values displayed on pricing page
  // @configurable These are promises to users
  // ─────────────────────────────────────────────────────────────────────────────
  ethicsCommitment: {
    /** Percentage of revenue donated to AI ethics grants */
    revenueToGrants: 0.20,
    
    /** No advertisements in the app */
    noAds: true,
    
    /** Never sell user data */
    noDataSelling: true,
    
    /** Clear, upfront pricing */
    transparentPricing: true,
    
    /** Free tier is genuinely useful */
    freeTierFunctional: true,
    
    /** Easy cancellation, no dark patterns */
    oneClickCancel: true,
  },
} as const;


// ═══════════════════════════════════════════════════════════════════════════════
// 📸 AR (AUGMENTED REALITY) CONFIGURATION
// Settings for the AR Ethics Lens feature
// ═══════════════════════════════════════════════════════════════════════════════
export const AR_CONFIG = {
  /**
   * Camera frame rate for AR processing
   * @configurable Lower = better battery, higher = smoother
   * @range 15-60 FPS
   */
  frameRate: 30,
  
  /**
   * How often to run ethics analysis on detected text (ms)
   * @configurable Lower = more responsive, but more API calls
   */
  analysisInterval: 500,
  
  /**
   * Colors for AR bounding boxes based on ethics score
   * @configurable Match your brand colors if desired
   * @format Hex color codes
   */
  boundingBoxColors: {
    safe: '#22c55e',     // Green - score >= 80
    warning: '#eab308',  // Yellow - score >= 60
    danger: '#ef4444',   // Red - score >= 40
    critical: '#dc2626', // Dark red - score < 40
  },
  
  /**
   * Transparency of AR overlays (0-1)
   * @configurable Higher = more visible, may obscure content
   */
  overlayOpacity: 0.8,
  
  /**
   * Border width for detection boxes (pixels)
   */
  scannerBorderWidth: 2,
  
  /**
   * Haptic feedback duration when issue detected (ms)
   * @configurable 0 to disable vibration
   */
  vibrationDuration: 50,
} as const;


// ═══════════════════════════════════════════════════════════════════════════════
// 🌱 CARBON FOOTPRINT CONFIGURATION
// Environmental impact calculations for the Eco-Meter
// ═══════════════════════════════════════════════════════════════════════════════
export const CARBON_CONFIG = {
  /**
   * Estimated CO2 per basic scan (grams)
   * @source Based on OpenAI GPT-4 estimates
   * @configurable Adjust based on actual measurements
   */
  gramsCO2PerScan: 0.2,
  
  /**
   * Estimated CO2 per deep analysis (grams)
   * @configurable Higher due to more compute
   */
  gramsCO2PerDeepAnalysis: 0.5,
  
  /**
   * Estimated CO2 per AR frame processed (grams)
   */
  gramsCO2PerARFrame: 0.01,
  
  /**
   * Grams of CO2 one tree absorbs per year
   * @source EPA estimates
   * @used For "trees planted" equivalency display
   */
  treePlantedEquivalent: 21000,
  
  /**
   * Grams of CO2 per car mile driven
   * @source EPA average passenger vehicle
   * @used For "car miles saved" equivalency
   */
  carMilesEquivalent: 404,
} as const;


// ═══════════════════════════════════════════════════════════════════════════════
// 📱 PWA (Progressive Web App) CONFIGURATION
// Settings for the app manifest and install experience
// ═══════════════════════════════════════════════════════════════════════════════
export const PWA_CONFIG = {
  /** Full app name for install prompts */
  name: 'AuraScan',
  
  /** Short name for home screen icons */
  shortName: 'AuraScan',
  
  /** Description for app stores */
  description: "Your AI's Conscience - Ethical AI Analysis",
  
  /**
   * Theme color for browser chrome
   * @configurable Brand color shown in address bar
   * @format Hex color code
   */
  themeColor: '#22c55e',
  
  /**
   * Background color for splash screen
   * @configurable Usually dark or matches your background
   */
  backgroundColor: '#0a0a0a',
  
  /** Display mode: standalone, fullscreen, minimal-ui, browser */
  display: 'standalone',
  
  /** Orientation lock: portrait, landscape, any */
  orientation: 'portrait',
  
  /** Navigation scope */
  scope: '/',
  
  /** Start URL when launched */
  startUrl: '/',
  
  /**
   * App icons in various sizes
   * @configurable Add your own icons at these paths
   * @setup Generate icons at: https://realfavicongenerator.net/
   */
  icons: [
    { src: '/icons/icon-72x72.png', sizes: '72x72', type: 'image/png' },
    { src: '/icons/icon-96x96.png', sizes: '96x96', type: 'image/png' },
    { src: '/icons/icon-128x128.png', sizes: '128x128', type: 'image/png' },
    { src: '/icons/icon-144x144.png', sizes: '144x144', type: 'image/png' },
    { src: '/icons/icon-152x152.png', sizes: '152x152', type: 'image/png' },
    { src: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
    { src: '/icons/icon-384x384.png', sizes: '384x384', type: 'image/png' },
    { src: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
  ],
} as const;


// ═══════════════════════════════════════════════════════════════════════════════
// 🔌 API ENDPOINTS CONFIGURATION
// External service URLs and endpoints
// ═══════════════════════════════════════════════════════════════════════════════
export const API_ENDPOINTS = {
  // ─────────────────────────────────────────────────────────────────────────────
  // TRAE.AI INTEGRATION (Future/Optional)
  // Third-party ethics API for enhanced analysis
  // @configurable Set TRAE_AI_API_URL env var if using
  // ─────────────────────────────────────────────────────────────────────────────
  traeAI: {
    base: process.env.TRAE_AI_API_URL || 'https://api.trae.ai/v1',
    ethicsScore: '/ethics/score',
    biasDetect: '/bias/detect',
    compliance: '/compliance/check',
    transparency: '/transparency/report',
    contentModeration: '/content/moderate',
    plagiarism: '/plagiarism/detect',
    sentiment: '/sentiment/analyze',
    multimodal: '/multimodal/analyze',
  },
  
  // ─────────────────────────────────────────────────────────────────────────────
  // SUPABASE (reads from environment)
  // ─────────────────────────────────────────────────────────────────────────────
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
  
  // ─────────────────────────────────────────────────────────────────────────────
  // STRIPE (reads from environment)
  // ─────────────────────────────────────────────────────────────────────────────
  stripe: {
    publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    priceId: process.env.STRIPE_PRICE_ID,
  },
} as const;


// ═══════════════════════════════════════════════════════════════════════════════
// 🚦 RATE LIMITS
// API usage limits by subscription tier
// @configurable Adjust based on infrastructure capacity
// ═══════════════════════════════════════════════════════════════════════════════
export const RATE_LIMITS = {
  free: {
    /** Max scans per day */
    scansPerDay: 10,
    
    /** Max scans per hour (burst protection) */
    scansPerHour: 5,
    
    /** API calls per day (0 = no API access) */
    apiCallsPerDay: 0,
  },
  premium: {
    scansPerDay: 1000,
    scansPerHour: 100,
    apiCallsPerDay: 10000,
  },
} as const;


// ═══════════════════════════════════════════════════════════════════════════════
// 💾 LOCAL STORAGE KEYS
// Keys used for browser localStorage
// @configurable Change if you need to reset user data
// ═══════════════════════════════════════════════════════════════════════════════
export const STORAGE_KEYS = {
  user: 'aurascan_user',
  preferences: 'aurascan_preferences',
  gamification: 'aurascan_gamification',
  scans: 'aurascan_scans',
  templates: 'aurascan_templates',
  offline: 'aurascan_offline_queue',
  theme: 'aurascan_theme',
  locale: 'aurascan_locale',
  installPrompt: 'aurascan_install_dismissed',
  onboarding: 'aurascan_onboarding_complete',
} as const;


// ═══════════════════════════════════════════════════════════════════════════════
// ⏱️ CACHE DURATIONS
// How long to cache different data types (milliseconds)
// @configurable Balance freshness vs performance
// ═══════════════════════════════════════════════════════════════════════════════
export const CACHE_DURATIONS = {
  /** User profile data */
  user: 5 * 60 * 1000,          // 5 minutes
  
  /** Template vault */
  templates: 60 * 60 * 1000,    // 1 hour
  
  /** Leaderboard rankings */
  leaderboard: 5 * 60 * 1000,   // 5 minutes
  
  /** Learning courses */
  courses: 24 * 60 * 60 * 1000, // 24 hours
  
  /** Static assets (icons, sounds) */
  staticAssets: 7 * 24 * 60 * 60 * 1000, // 7 days
} as const;


// ═══════════════════════════════════════════════════════════════════════════════
// ✨ ANIMATION DURATIONS
// Timing for UI animations (milliseconds)
// @configurable Adjust for different feel
// ═══════════════════════════════════════════════════════════════════════════════
export const ANIMATION_DURATIONS = {
  /** Quick micro-interactions */
  fast: 150,
  
  /** Standard transitions */
  normal: 300,
  
  /** Deliberate, noticeable animations */
  slow: 500,
  
  /** Level up celebration */
  levelUp: 600,
  
  /** Badge unlock fanfare */
  badgeUnlock: 800,
  
  /** Scan progress animation */
  scan: 2000,
} as const;


// ═══════════════════════════════════════════════════════════════════════════════
// 🔊 SOUND EFFECTS
// Audio file paths for gamification feedback
// @configurable Add your own sounds at these paths
// @setup Place MP3 files in /public/sounds/
// ═══════════════════════════════════════════════════════════════════════════════
export const SOUND_EFFECTS = {
  /** Scan initiated sound */
  scan: '/sounds/scan.mp3',
  
  /** Successful action */
  success: '/sounds/success.mp3',
  
  /** Level up celebration */
  levelUp: '/sounds/level-up.mp3',
  
  /** Achievement unlocked */
  achievement: '/sounds/achievement.mp3',
  
  /** Push notification */
  notification: '/sounds/notification.mp3',
  
  /** Error occurred */
  error: '/sounds/error.mp3',
  
  /** Karma gained */
  karma: '/sounds/karma.mp3',
} as const;
