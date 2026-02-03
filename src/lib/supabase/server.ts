// ╔════════════════════════════════════════════════════════════════════════════╗
// ║                    SUPABASE SERVER CLIENT (Admin)                           ║
// ║                     AuraScan Server-Side Database Operations                ║
// ╠════════════════════════════════════════════════════════════════════════════╣
// ║                                                                             ║
// ║  ⚠️ WARNING: This client uses the SERVICE ROLE KEY                          ║
// ║  This key BYPASSES Row Level Security (RLS) policies!                       ║
// ║  Only use this in:                                                          ║
// ║  • API routes (server-side only)                                            ║
// ║  • Webhooks                                                                  ║
// ║  • Admin operations                                                         ║
// ║                                                                             ║
// ║  NEVER use this client in:                                                  ║
// ║  • React components                                                          ║
// ║  • Client-side code                                                          ║
// ║  • Anywhere the key could be exposed to the browser                          ║
// ║                                                                             ║
// ║  REQUIRED ENV VARS:                                                          ║
// ║  • NEXT_PUBLIC_SUPABASE_URL - Project URL                                    ║
// ║  • SUPABASE_SERVICE_ROLE_KEY - Service role secret key                       ║
// ║                                                                             ║
// ╚════════════════════════════════════════════════════════════════════════════╝

import { createClient } from '@supabase/supabase-js';

// ═══════════════════════════════════════════════════════════════════════════════
// SERVER CLIENT FACTORY
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Create a server-side Supabase client with admin privileges
 * 
 * This client uses the service_role key which:
 * - Bypasses ALL Row Level Security policies
 * - Can read/write any data in any table
 * - Should only be used server-side
 * 
 * @env NEXT_PUBLIC_SUPABASE_URL
 * @get https://supabase.com/dashboard → Select Project → Settings → API → Project URL
 * 
 * @env SUPABASE_SERVICE_ROLE_KEY
 * @get https://supabase.com/dashboard → Select Project → Settings → API → service_role secret
 * @format eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxxxx
 * @security NEVER expose this key in client-side code!
 */
export const createServerClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    // Return a mock client for development without Supabase
    console.warn('⚠️ Supabase service role key not found, using mock client');
    console.warn('   Set SUPABASE_SERVICE_ROLE_KEY for server-side operations');
    return createClient(
      'https://placeholder.supabase.co',
      'placeholder-key',
      { auth: { autoRefreshToken: false, persistSession: false } }
    );
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      // Server-side doesn't need token refresh
      autoRefreshToken: false,
      // Server-side shouldn't persist sessions
      persistSession: false,
    },
  });
};

// ═══════════════════════════════════════════════════════════════════════════════
// ADMIN DATABASE OPERATIONS
// These functions perform privileged operations that bypass RLS
// ═══════════════════════════════════════════════════════════════════════════════

export const adminDb = {
  // ─────────────────────────────────────────────────────────────────────────────
  // USER MANAGEMENT
  // ─────────────────────────────────────────────────────────────────────────────
  
  /**
   * Create a new user profile
   * Called automatically on signup via auth trigger (see schema.sql)
   */
  async createUserProfile(userId: string, data: {
    username: string;
    display_name: string;
    email: string;
  }) {
    const supabase = createServerClient();
    return supabase.from('profiles').insert({
      id: userId,
      ...data,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
  },

  /**
   * Update user's subscription status
   * Called from Stripe webhook when subscription changes
   */
  async updateUserSubscription(userId: string, data: {
    is_premium: boolean;
    stripe_customer_id?: string;
    stripe_subscription_id?: string;
    premium_expires_at?: string;
  }) {
    const supabase = createServerClient();
    return supabase.from('profiles').update({
      ...data,
      updated_at: new Date().toISOString(),
    }).eq('id', userId);
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // GAMIFICATION
  // XP and level calculations
  // ─────────────────────────────────────────────────────────────────────────────
  
  /**
   * Add XP to a user and recalculate their level
   * 
   * @param userId - Supabase auth user ID
   * @param amount - XP amount to add (see GAMIFICATION_CONFIG.xpRewards)
   * @param reason - Description for XP history
   */
  async addXP(userId: string, amount: number, reason: string) {
    const supabase = createServerClient();
    
    // Get current stats
    const { data: stats } = await supabase
      .from('user_stats')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (!stats) {
      // Create initial stats for new user
      return supabase.from('user_stats').insert({
        user_id: userId,
        total_xp: amount,
        level: 1,
        karma: 0,
        streak_days: 0,
      });
    }

    const newTotalXP = stats.total_xp + amount;
    const newLevel = calculateLevel(newTotalXP);

    // Update stats
    await supabase.from('user_stats').update({
      total_xp: newTotalXP,
      level: newLevel,
      updated_at: new Date().toISOString(),
    }).eq('user_id', userId);

    // Log XP event for history/debugging
    return supabase.from('xp_events').insert({
      user_id: userId,
      amount,
      reason,
      created_at: new Date().toISOString(),
    });
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // SCAN STORAGE
  // ─────────────────────────────────────────────────────────────────────────────
  
  /**
   * Save an ethics scan result to the database
   * Called after OpenAI analysis completes
   */
  async saveScan(userId: string, scanData: {
    prompt: string;
    ethics_score: number;
    bias_score: number;
    privacy_score: number;
    toxicity_score: number;
    analysis: Record<string, unknown>;
  }) {
    const supabase = createServerClient();
    return supabase.from('scans').insert({
      user_id: userId,
      ...scanData,
      created_at: new Date().toISOString(),
    });
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // LEADERBOARD
  // ─────────────────────────────────────────────────────────────────────────────
  
  /**
   * Get top users by XP for leaderboard display
   * 
   * @param limit - Max users to return (default 100)
   */
  async getLeaderboard(limit = 100) {
    const supabase = createServerClient();
    return supabase
      .from('user_stats')
      .select(`
        user_id,
        total_xp,
        level,
        karma,
        streak_days,
        profiles (
          username,
          display_name,
          avatar_url
        )
      `)
      .order('total_xp', { ascending: false })
      .limit(limit);
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Calculate user level from total XP
 * Uses exponential curve defined in GAMIFICATION_CONFIG
 * 
 * @configurable Adjust baseXP and multiplier in src/config/index.ts
 * 
 * Formula: Each level requires baseXP * (multiplier ^ (level - 1)) more XP
 * Level 1: 0 XP
 * Level 2: 100 XP
 * Level 3: 215 XP (100 + 115)
 * Level 4: 347 XP (215 + 132)
 * etc.
 */
function calculateLevel(totalXP: number): number {
  // @configurable These should match GAMIFICATION_CONFIG values
  const baseXP = 100;      // Base XP for level 2
  const multiplier = 1.15; // XP increase per level (15%)
  const maxLevel = 100;    // Maximum achievable level
  
  let level = 1;
  let xpForNextLevel = baseXP;
  
  while (totalXP >= xpForNextLevel && level < maxLevel) {
    level++;
    xpForNextLevel = Math.floor(xpForNextLevel + baseXP * Math.pow(multiplier, level - 1));
  }
  
  return level;
}

export default createServerClient;
