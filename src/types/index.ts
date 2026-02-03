// ============================================
// AURASCAN TYPE DEFINITIONS
// Your AI's Conscience - Core Types
// ============================================

// ============================================
// USER & AUTHENTICATION
// ============================================

export interface User {
  id: string;
  email: string;
  username: string;
  displayName: string;
  avatarUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  isPremium: boolean;
  premiumExpiresAt?: Date;
  preferences: UserPreferences;
  stats: UserStats;
  gamification: UserGamification;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: SupportedLanguage;
  notifications: NotificationPreferences;
  privacy: PrivacySettings;
  accessibility: AccessibilitySettings;
  ethicsFramework: EthicsFramework;
}

export interface NotificationPreferences {
  pushEnabled: boolean;
  dailyDigest: boolean;
  weeklyReport: boolean;
  achievementAlerts: boolean;
  threatAlerts: boolean;
  socialAlerts: boolean;
  questReminders: boolean;
}

export interface PrivacySettings {
  profileVisibility: 'public' | 'friends' | 'private';
  showOnLeaderboard: boolean;
  shareAchievements: boolean;
  allowMentorship: boolean;
  dataRetentionDays: number;
  localEncryption: boolean;
}

export interface AccessibilitySettings {
  screenReaderOptimized: boolean;
  reduceMotion: boolean;
  highContrast: boolean;
  fontSize: 'small' | 'medium' | 'large' | 'xlarge';
  hapticFeedback: boolean;
  voiceInput: boolean;
  voiceOutput: boolean;
}

export interface UserStats {
  totalScans: number;
  totalAnalyses: number;
  averageEthicsScore: number;
  biasReduced: number;
  carbonSaved: number;
  deepfakesDetected: number;
  templatesUsed: number;
  streakDays: number;
  longestStreak: number;
  joinedAt: Date;
  lastActiveAt: Date;
}

// ============================================
// GAMIFICATION SYSTEM
// ============================================

export interface UserGamification {
  level: number;
  currentXP: number;
  totalXP: number;
  xpToNextLevel: number;
  karma: number;
  karmaHistory: KarmaEvent[];
  achievements: Achievement[];
  badges: Badge[];
  streaks: Streak;
  quests: Quest[];
  guild?: Guild;
  rank: LeaderboardRank;
  seasonPass?: SeasonPass;
}

export interface KarmaEvent {
  id: string;
  type: 'earned' | 'spent' | 'bonus' | 'penalty';
  amount: number;
  reason: string;
  timestamp: Date;
  relatedEntityId?: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  iconUrl: string;
  category: AchievementCategory;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  xpReward: number;
  karmaReward: number;
  unlockedAt?: Date;
  progress: number;
  maxProgress: number;
  isSecret: boolean;
  shareableUrl?: string;
}

export type AchievementCategory =
  | 'scanning'
  | 'bias-detection'
  | 'privacy'
  | 'community'
  | 'learning'
  | 'streaks'
  | 'special'
  | 'seasonal';

export interface Badge {
  id: string;
  name: string;
  description: string;
  iconUrl: string;
  type: BadgeType;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  earnedAt: Date;
  isVerified: boolean;
  verificationHash?: string;
  nftTokenId?: string;
  shareableUrl: string;
}

export type BadgeType =
  | 'achievement'
  | 'certification'
  | 'event'
  | 'milestone'
  | 'community'
  | 'seasonal'
  | 'nft';

export interface Streak {
  currentDays: number;
  longestDays: number;
  lastCheckIn: Date;
  multiplier: number;
  freezesRemaining: number;
  nextMilestone: number;
  milestoneReward: StreakReward;
}

export interface StreakReward {
  xp: number;
  karma: number;
  badge?: Badge;
  specialItem?: string;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  type: QuestType;
  category: QuestCategory;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  requirements: QuestRequirement[];
  rewards: QuestReward;
  startDate: Date;
  endDate: Date;
  progress: number;
  maxProgress: number;
  status: 'available' | 'active' | 'completed' | 'expired' | 'claimed';
  isDaily: boolean;
  isWeekly: boolean;
  isSeasonal: boolean;
}

export type QuestType = 'scan' | 'analyze' | 'social' | 'learn' | 'community' | 'special';
export type QuestCategory = 'bias' | 'privacy' | 'eco' | 'deepfake' | 'general';

export interface QuestRequirement {
  type: string;
  target: number;
  current: number;
  description: string;
}

export interface QuestReward {
  xp: number;
  karma: number;
  badge?: Badge;
  items?: string[];
  premiumDays?: number;
}

export interface Guild {
  id: string;
  name: string;
  description: string;
  iconUrl: string;
  bannerUrl: string;
  createdAt: Date;
  memberCount: number;
  maxMembers: number;
  level: number;
  totalKarma: number;
  rank: number;
  tags: string[];
  requirements: GuildRequirement;
  members: GuildMember[];
  challenges: GuildChallenge[];
  isPublic: boolean;
}

export interface GuildRequirement {
  minLevel: number;
  minKarma: number;
  applicationRequired: boolean;
}

export interface GuildMember {
  userId: string;
  role: 'owner' | 'admin' | 'moderator' | 'member';
  joinedAt: Date;
  contribution: number;
}

export interface GuildChallenge {
  id: string;
  title: string;
  description: string;
  goal: number;
  progress: number;
  reward: QuestReward;
  startDate: Date;
  endDate: Date;
  participants: string[];
}

export interface LeaderboardRank {
  global: number;
  regional: number;
  friends: number;
  guild?: number;
  percentile: number;
  trend: 'up' | 'down' | 'stable';
  previousRank: number;
}

export interface SeasonPass {
  id: string;
  name: string;
  theme: string;
  startDate: Date;
  endDate: Date;
  currentTier: number;
  maxTier: number;
  xpProgress: number;
  xpRequired: number;
  isPremiumTrack: boolean;
  rewards: SeasonReward[];
}

export interface SeasonReward {
  tier: number;
  isPremium: boolean;
  item: Badge | Achievement | string;
  claimed: boolean;
}

// ============================================
// ETHICS SCANNING & ANALYSIS
// ============================================

export interface ScanResult {
  id: string;
  userId: string;
  timestamp: Date;
  input: ScanInput;
  analysis: EthicsAnalysis;
  metadata: ScanMetadata;
  sharing: ScanSharing;
}

export interface ScanInput {
  type: 'prompt' | 'response' | 'conversation' | 'image' | 'voice' | 'multimodal';
  content: string;
  context?: string;
  sourceAI?: string;
  language: string;
  attachments?: Attachment[];
}

export interface Attachment {
  id: string;
  type: 'image' | 'audio' | 'document';
  url: string;
  mimeType: string;
  size: number;
  analysis?: AttachmentAnalysis;
}

export interface AttachmentAnalysis {
  deepfakeScore?: number;
  aiGeneratedScore?: number;
  manipulationScore?: number;
  contentFlags?: string[];
}

export interface EthicsAnalysis {
  overallScore: number;
  scoreBreakdown: ScoreBreakdown;
  biasAnalysis: BiasAnalysis;
  toxicityAnalysis: ToxicityAnalysis;
  privacyAnalysis: PrivacyAnalysis;
  complianceAnalysis: ComplianceAnalysis;
  misinformationAnalysis: MisinformationAnalysis;
  sentimentAnalysis: SentimentAnalysis;
  recommendations: Recommendation[];
  improvedVersion?: string;
  traeAIResponse?: TraeAIResponse;
}

export interface ScoreBreakdown {
  bias: number;
  toxicity: number;
  privacy: number;
  accuracy: number;
  transparency: number;
  fairness: number;
  harmfulness: number;
  manipulation: number;
}

export interface BiasAnalysis {
  overallBiasScore: number;
  categories: BiasCategory[];
  protectedGroups: ProtectedGroupAnalysis[];
  suggestions: string[];
  examples: BiasExample[];
}

export interface BiasCategory {
  name: string;
  score: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  instances: number;
  examples: string[];
}

export interface ProtectedGroupAnalysis {
  group: string;
  representation: 'positive' | 'neutral' | 'negative' | 'absent';
  score: number;
  concerns: string[];
}

export interface BiasExample {
  text: string;
  type: string;
  severity: string;
  suggestion: string;
  startIndex: number;
  endIndex: number;
}

export interface ToxicityAnalysis {
  overallScore: number;
  categories: {
    identity_attack: number;
    insult: number;
    obscene: number;
    severe_toxicity: number;
    sexual_explicit: number;
    threat: number;
  };
  flaggedContent: FlaggedContent[];
}

export interface FlaggedContent {
  text: string;
  category: string;
  confidence: number;
  startIndex: number;
  endIndex: number;
}

export interface PrivacyAnalysis {
  overallScore: number;
  piiDetected: PIIDetection[];
  dataRetentionRisk: 'low' | 'medium' | 'high';
  thirdPartyExposure: string[];
  recommendations: string[];
}

export interface PIIDetection {
  type: PIIType;
  value: string;
  masked: string;
  confidence: number;
  startIndex: number;
  endIndex: number;
}

export type PIIType =
  | 'name'
  | 'email'
  | 'phone'
  | 'address'
  | 'ssn'
  | 'credit_card'
  | 'ip_address'
  | 'medical'
  | 'financial'
  | 'biometric';

export interface ComplianceAnalysis {
  gdpr: ComplianceCheck;
  hipaa: ComplianceCheck;
  ccpa: ComplianceCheck;
  coppa: ComplianceCheck;
  aiAct: ComplianceCheck;
  overall: ComplianceStatus;
}

export interface ComplianceCheck {
  compliant: boolean;
  score: number;
  violations: string[];
  recommendations: string[];
}

export type ComplianceStatus = 'compliant' | 'needs_review' | 'non_compliant';

export interface MisinformationAnalysis {
  overallScore: number;
  factCheckResults: FactCheck[];
  sourceCredibility: number;
  claimAnalysis: ClaimAnalysis[];
  aiGeneratedLikelihood: number;
}

export interface FactCheck {
  claim: string;
  verdict: 'true' | 'mostly_true' | 'mixed' | 'mostly_false' | 'false' | 'unverifiable';
  confidence: number;
  sources: string[];
  explanation: string;
}

export interface ClaimAnalysis {
  claim: string;
  type: 'factual' | 'opinion' | 'prediction' | 'exaggeration';
  verifiability: number;
  potentialHarm: number;
}

export interface SentimentAnalysis {
  overall: 'positive' | 'neutral' | 'negative';
  score: number;
  emotions: EmotionAnalysis;
  manipulationScore: number;
  persuasionTechniques: string[];
}

export interface EmotionAnalysis {
  joy: number;
  sadness: number;
  anger: number;
  fear: number;
  surprise: number;
  disgust: number;
  trust: number;
  anticipation: number;
}

export interface Recommendation {
  id: string;
  type: 'rewrite' | 'remove' | 'add_context' | 'fact_check' | 'privacy' | 'tone';
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  originalText?: string;
  suggestedText?: string;
  impact: string;
}

export interface TraeAIResponse {
  requestId: string;
  processingTime: number;
  modelVersion: string;
  confidence: number;
  rawAnalysis: Record<string, unknown>;
}

export interface ScanMetadata {
  processingTime: number;
  modelVersions: Record<string, string>;
  carbonFootprint: CarbonFootprint;
  deviceInfo: DeviceInfo;
  location?: GeoLocation;
}

export interface CarbonFootprint {
  grams: number;
  equivalent: string;
  offsetSuggestion: string;
  cumulativeTotal: number;
}

export interface DeviceInfo {
  platform: string;
  browser: string;
  isOffline: boolean;
  isPWA: boolean;
}

export interface GeoLocation {
  country: string;
  region: string;
  timezone: string;
}

export interface ScanSharing {
  isPublic: boolean;
  anonymized: boolean;
  shareUrl?: string;
  sharedWith: string[];
  comments: Comment[];
  reactions: Reaction[];
}

export interface Comment {
  id: string;
  userId: string;
  content: string;
  timestamp: Date;
  likes: number;
  replies: Comment[];
}

export interface Reaction {
  type: '👍' | '💡' | '🎯' | '⚠️' | '🔥';
  userId: string;
  timestamp: Date;
}

// ============================================
// ETHICS FRAMEWORKS
// ============================================

export interface EthicsFramework {
  id: string;
  name: string;
  description: string;
  isCustom: boolean;
  isDefault: boolean;
  rules: EthicsRule[];
  weights: ScoreWeights;
  thresholds: ScoreThresholds;
}

export interface EthicsRule {
  id: string;
  name: string;
  description: string;
  category: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
  enabled: boolean;
  customLogic?: string;
}

export interface ScoreWeights {
  bias: number;
  toxicity: number;
  privacy: number;
  accuracy: number;
  transparency: number;
  fairness: number;
  harmfulness: number;
  manipulation: number;
}

export interface ScoreThresholds {
  safe: number;
  warning: number;
  danger: number;
  critical: number;
}

// ============================================
// TEMPLATES
// ============================================

export interface PromptTemplate {
  id: string;
  title: string;
  description: string;
  category: TemplateCategory;
  prompt: string;
  variables: TemplateVariable[];
  ethicsScore: number;
  usageCount: number;
  rating: number;
  author: TemplateAuthor;
  tags: string[];
  isOfficial: boolean;
  isCommunity: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type TemplateCategory =
  | 'general'
  | 'business'
  | 'creative'
  | 'education'
  | 'healthcare'
  | 'legal'
  | 'research'
  | 'coding'
  | 'customer_service';

export interface TemplateVariable {
  name: string;
  description: string;
  type: 'text' | 'number' | 'select' | 'multiselect';
  required: boolean;
  defaultValue?: string;
  options?: string[];
}

export interface TemplateAuthor {
  id: string;
  name: string;
  avatarUrl?: string;
  isVerified: boolean;
}

// ============================================
// SOCIAL FEATURES
// ============================================

export interface EthicsFeedPost {
  id: string;
  type: 'scan' | 'achievement' | 'milestone' | 'discussion' | 'challenge';
  author: FeedAuthor;
  content: FeedContent;
  timestamp: Date;
  visibility: 'public' | 'friends' | 'guild';
  engagement: PostEngagement;
  tags: string[];
  isAnonymous: boolean;
}

export interface FeedAuthor {
  id: string;
  username: string;
  displayName: string;
  avatarUrl?: string;
  level: number;
  badges: Badge[];
  isVerified: boolean;
}

export interface FeedContent {
  text?: string;
  scanResult?: Partial<ScanResult>;
  achievement?: Achievement;
  challenge?: Challenge;
  image?: string;
  link?: string;
}

export interface PostEngagement {
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  userReaction?: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'personal' | 'friend' | 'guild' | 'global';
  creator: FeedAuthor;
  participants: ChallengeParticipant[];
  goal: ChallengeGoal;
  startDate: Date;
  endDate: Date;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  rewards: QuestReward;
}

export interface ChallengeParticipant {
  userId: string;
  progress: number;
  rank: number;
  joinedAt: Date;
}

export interface ChallengeGoal {
  type: 'score' | 'count' | 'streak' | 'improvement';
  target: number;
  metric: string;
}

// ============================================
// AR/VR FEATURES
// ============================================

export interface ARSession {
  id: string;
  userId: string;
  startTime: Date;
  endTime?: Date;
  scans: ARScan[];
  deviceCapabilities: ARCapabilities;
}

export interface ARScan {
  id: string;
  timestamp: Date;
  capturedImage: string;
  extractedText: string;
  analysis: EthicsAnalysis;
  boundingBoxes: BoundingBox[];
}

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  score: number;
  color: string;
}

export interface ARCapabilities {
  hasCamera: boolean;
  hasWebXR: boolean;
  hasARCore: boolean;
  hasARKit: boolean;
  supportsDepth: boolean;
  supportsLightEstimation: boolean;
}

export interface XRSession {
  id: string;
  type: 'ar' | 'vr' | 'mr';
  environment: XREnvironment;
  objects: XRObject[];
  collaborators: XRCollaborator[];
}

export interface XREnvironment {
  id: string;
  name: string;
  theme: 'ethics-lab' | 'data-visualization' | 'collaboration-space' | 'learning-center';
  settings: Record<string, unknown>;
}

export interface XRObject {
  id: string;
  type: 'chart' | 'scan-result' | 'badge' | 'text' | 'model';
  position: Vector3;
  rotation: Vector3;
  scale: Vector3;
  data: unknown;
  interactive: boolean;
}

export interface Vector3 {
  x: number;
  y: number;
  z: number;
}

export interface XRCollaborator {
  userId: string;
  avatarUrl: string;
  position: Vector3;
  isActive: boolean;
}

// ============================================
// PREMIUM & PAYMENTS
// ============================================

export interface Subscription {
  id: string;
  userId: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  stripeCustomerId: string;
  stripeSubscriptionId: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  interval: 'month' | 'year';
  features: PlanFeature[];
  limits: PlanLimits;
}

export interface PlanFeature {
  name: string;
  description: string;
  included: boolean;
}

export interface PlanLimits {
  dailyScans: number;
  batchSize: number;
  teamMembers: number;
  apiCalls: number;
  storageGB: number;
  historyDays: number;
}

export type SubscriptionStatus =
  | 'active'
  | 'past_due'
  | 'canceled'
  | 'incomplete'
  | 'trialing';

// ============================================
// API & INTEGRATIONS
// ============================================

export interface APIKey {
  id: string;
  userId: string;
  name: string;
  key: string;
  permissions: APIPermission[];
  rateLimit: number;
  usageCount: number;
  lastUsed?: Date;
  createdAt: Date;
  expiresAt?: Date;
  isActive: boolean;
}

export type APIPermission = 'scan' | 'analyze' | 'templates' | 'export' | 'webhook';

export interface Webhook {
  id: string;
  userId: string;
  url: string;
  events: WebhookEvent[];
  secret: string;
  isActive: boolean;
  lastTriggered?: Date;
  failureCount: number;
}

export type WebhookEvent =
  | 'scan.completed'
  | 'analysis.completed'
  | 'threat.detected'
  | 'achievement.unlocked'
  | 'subscription.changed';

// ============================================
// REPORTS & EXPORTS
// ============================================

export interface EthicsReport {
  id: string;
  userId: string;
  type: 'weekly' | 'monthly' | 'custom';
  period: {
    start: Date;
    end: Date;
  };
  summary: ReportSummary;
  trends: ReportTrends;
  recommendations: Recommendation[];
  generatedAt: Date;
  format: 'pdf' | 'html' | 'json';
  downloadUrl: string;
}

export interface ReportSummary {
  totalScans: number;
  averageScore: number;
  scoreChange: number;
  topIssues: string[];
  achievements: number;
  karmaEarned: number;
  carbonSaved: number;
}

export interface ReportTrends {
  scoreHistory: DataPoint[];
  biasHistory: DataPoint[];
  categoryBreakdown: Record<string, number>;
  comparisonToAverage: number;
}

export interface DataPoint {
  date: Date;
  value: number;
}

// ============================================
// NOTIFICATIONS
// ============================================

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, unknown>;
  isRead: boolean;
  timestamp: Date;
  expiresAt?: Date;
  action?: NotificationAction;
}

export type NotificationType =
  | 'achievement'
  | 'level_up'
  | 'quest_complete'
  | 'threat_alert'
  | 'social'
  | 'system'
  | 'reminder'
  | 'promotion';

export interface NotificationAction {
  type: 'link' | 'action' | 'dismiss';
  label: string;
  url?: string;
  actionId?: string;
}

// ============================================
// LEARNING HUB
// ============================================

export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  author: TemplateAuthor;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number;
  modules: CourseModule[];
  xpReward: number;
  badge?: Badge;
  enrolledCount: number;
  rating: number;
  tags: string[];
}

export interface CourseModule {
  id: string;
  title: string;
  description: string;
  type: 'video' | 'article' | 'quiz' | 'interactive';
  content: string;
  duration: number;
  quiz?: Quiz;
  completed: boolean;
}

export interface Quiz {
  id: string;
  questions: QuizQuestion[];
  passingScore: number;
  attempts: number;
  bestScore: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  type: 'multiple_choice' | 'true_false' | 'fill_blank';
  options?: string[];
  correctAnswer: string | string[];
  explanation: string;
}

// ============================================
// SUPPORTED LANGUAGES
// ============================================

export type SupportedLanguage =
  | 'en' // English
  | 'es' // Spanish
  | 'fr' // French
  | 'de' // German
  | 'it' // Italian
  | 'pt' // Portuguese
  | 'zh' // Chinese
  | 'ja' // Japanese
  | 'ko' // Korean
  | 'ar' // Arabic
  | 'hi' // Hindi
  | 'ru' // Russian
  | 'nl' // Dutch
  | 'pl' // Polish
  | 'tr' // Turkish
  | 'vi' // Vietnamese
  | 'th' // Thai
  | 'id' // Indonesian
  | 'sv' // Swedish
  | 'no'; // Norwegian

// ============================================
// UTILITY TYPES
// ============================================

export type AsyncState<T> = {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
};

export type PaginatedResponse<T> = {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
};

export type SortOrder = 'asc' | 'desc';

export type FilterOperator = 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'contains' | 'in';

export interface Filter {
  field: string;
  operator: FilterOperator;
  value: unknown;
}

export interface SortOption {
  field: string;
  order: SortOrder;
}
