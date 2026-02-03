// ╔════════════════════════════════════════════════════════════════════════════╗
// ║                    SUPABASE CLIENT (Browser-Side)                           ║
// ║                     AuraScan Database & Authentication                      ║
// ╠════════════════════════════════════════════════════════════════════════════╣
// ║                                                                             ║
// ║  SETUP REQUIREMENTS:                                                        ║
// ║  1. Create Supabase project: https://supabase.com/dashboard                 ║
// ║  2. Wait for provisioning (~2 minutes)                                      ║
// ║  3. Get API keys: Settings → API                                            ║
// ║  4. Run database schema: SQL Editor → paste supabase/schema.sql             ║
// ║                                                                             ║
// ║  REQUIRED ENV VARS:                                                         ║
// ║  • NEXT_PUBLIC_SUPABASE_URL - Project URL (https://xxx.supabase.co)         ║
// ║  • NEXT_PUBLIC_SUPABASE_ANON_KEY - Anonymous/public key                     ║
// ║                                                                             ║
// ║  OPTIONAL - For server-side operations:                                     ║
// ║  • SUPABASE_SERVICE_ROLE_KEY - Admin key (bypasses RLS)                     ║
// ║                                                                             ║
// ║  OAUTH SETUP (for social login):                                            ║
// ║  • Google: https://supabase.com/docs/guides/auth/social-login/auth-google   ║
// ║  • GitHub: https://supabase.com/docs/guides/auth/social-login/auth-github   ║
// ║  • Discord: https://supabase.com/docs/guides/auth/social-login/auth-discord ║
// ║                                                                             ║
// ╚════════════════════════════════════════════════════════════════════════════╝

import { createClient } from '@supabase/supabase-js';

// ═══════════════════════════════════════════════════════════════════════════════
// ENVIRONMENT CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Supabase Project URL
 * 
 * @env NEXT_PUBLIC_SUPABASE_URL
 * @get https://supabase.com/dashboard → Select Project → Settings → API → Project URL
 * @format https://[PROJECT_REF].supabase.co
 * @example https://abcdefghijklmnop.supabase.co
 */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

/**
 * Supabase Anonymous Key (Public)
 * 
 * @env NEXT_PUBLIC_SUPABASE_ANON_KEY
 * @get https://supabase.com/dashboard → Select Project → Settings → API → Project API Keys → anon public
 * @format eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxxxx
 * @security This key is SAFE to expose in browser - it respects Row Level Security (RLS)
 * @note Used for: User authentication, accessing public data, authenticated user data
 */
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Warn if credentials are missing
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Supabase credentials not configured. Running in demo mode.');
  console.warn('   Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

// ═══════════════════════════════════════════════════════════════════════════════
// SUPABASE CLIENT INITIALIZATION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Client-side Supabase client
 * 
 * This client uses the anonymous key and respects Row Level Security.
 * Use this in React components and client-side code.
 * 
 * For server-side operations with elevated privileges, use:
 * @see ./server.ts - createServerClient() with service_role key
 */
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key',
  {
    auth: {
      // Automatically refresh JWT tokens before they expire
      autoRefreshToken: true,
      
      // Persist auth session in localStorage
      // @configurable Set to false for heightened security (user must re-login)
      persistSession: true,
      
      // Detect OAuth callback parameters in URL
      // Required for OAuth providers (Google, GitHub, Discord)
      detectSessionInUrl: true,
    },
  }
);

// ═══════════════════════════════════════════════════════════════════════════════
// CONFIGURATION HELPERS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Check if Supabase is properly configured
 * Returns false if using placeholder values
 */
export const isSupabaseConfigured = () => {
  return !!(supabaseUrl && supabaseAnonKey && 
    supabaseUrl !== 'your_supabase_project_url' &&
    supabaseAnonKey !== 'your_supabase_anon_key');
};

// ═══════════════════════════════════════════════════════════════════════════════
// AUTHENTICATION HELPERS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Authentication helper functions
 * Wraps Supabase auth methods with simpler interface
 */
export const auth = {
  /**
   * Sign up a new user with email/password
   * 
   * @param email - User's email address
   * @param password - Password (min 6 characters by default)
   * @param metadata - Optional user metadata (display_name, avatar_url, etc.)
   * 
   * @note Supabase sends a confirmation email by default
   * @config Disable email confirmation: Authentication → Providers → Email → Confirm email = OFF
   */
  signUp: async (email: string, password: string, metadata?: Record<string, unknown>) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
      },
    });
    return { data, error };
  },

  /**
   * Sign in with email/password
   */
  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  },

  /**
   * Sign in with OAuth provider
   * 
   * SETUP FOR EACH PROVIDER:
   * 
   * GOOGLE:
   * 1. Go to: https://console.cloud.google.com/
   * 2. Create OAuth credentials: APIs & Services → Credentials → Create OAuth Client ID
   * 3. Add redirect URI: https://[PROJECT_REF].supabase.co/auth/v1/callback
   * 4. In Supabase: Authentication → Providers → Google → Enable, paste Client ID & Secret
   * 
   * GITHUB:
   * 1. Go to: https://github.com/settings/developers
   * 2. New OAuth App → Set callback: https://[PROJECT_REF].supabase.co/auth/v1/callback
   * 3. In Supabase: Authentication → Providers → GitHub → Enable, paste Client ID & Secret
   * 
   * DISCORD:
   * 1. Go to: https://discord.com/developers/applications
   * 2. New Application → OAuth2 → Add redirect: https://[PROJECT_REF].supabase.co/auth/v1/callback
   * 3. In Supabase: Authentication → Providers → Discord → Enable, paste Client ID & Secret
   */
  signInWithOAuth: async (provider: 'google' | 'github' | 'discord') => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        // Where to redirect after OAuth completes
        // This should match NEXT_PUBLIC_APP_URL + /auth/callback
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
      },
    });
    return { data, error };
  },

  /**
   * Sign out current user
   */
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  /**
   * Get current session (includes JWT tokens)
   */
  getSession: async () => {
    const { data: { session }, error } = await supabase.auth.getSession();
    return { session, error };
  },

  /**
   * Get current user (decoded from JWT)
   */
  getUser: async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    return { user, error };
  },

  /**
   * Send password reset email
   * 
   * @note Configure email templates: Authentication → Email Templates
   */
  resetPassword: async (email: string) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      // Where user is redirected after clicking reset link
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password`,
    });
    return { data, error };
  },

  /**
   * Update user's password (must be logged in)
   */
  updatePassword: async (newPassword: string) => {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    return { data, error };
  },
};

export default supabase;
