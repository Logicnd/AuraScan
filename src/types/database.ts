// Database types generated from Supabase schema
// Run `npx supabase gen types typescript` to regenerate

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string;
          display_name: string;
          email: string;
          avatar_url: string | null;
          bio: string | null;
          is_premium: boolean;
          stripe_customer_id: string | null;
          stripe_subscription_id: string | null;
          premium_expires_at: string | null;
          preferences: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username: string;
          display_name: string;
          email: string;
          avatar_url?: string | null;
          bio?: string | null;
          is_premium?: boolean;
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          premium_expires_at?: string | null;
          preferences?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          username?: string;
          display_name?: string;
          email?: string;
          avatar_url?: string | null;
          bio?: string | null;
          is_premium?: boolean;
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          premium_expires_at?: string | null;
          preferences?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      user_stats: {
        Row: {
          id: string;
          user_id: string;
          total_xp: number;
          level: number;
          karma: number;
          streak_days: number;
          longest_streak: number;
          total_scans: number;
          total_analyses: number;
          average_ethics_score: number;
          bias_reduced: number;
          carbon_saved: number;
          deepfakes_detected: number;
          templates_used: number;
          last_check_in: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          total_xp?: number;
          level?: number;
          karma?: number;
          streak_days?: number;
          longest_streak?: number;
          total_scans?: number;
          total_analyses?: number;
          average_ethics_score?: number;
          bias_reduced?: number;
          carbon_saved?: number;
          deepfakes_detected?: number;
          templates_used?: number;
          last_check_in?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          total_xp?: number;
          level?: number;
          karma?: number;
          streak_days?: number;
          longest_streak?: number;
          total_scans?: number;
          total_analyses?: number;
          average_ethics_score?: number;
          bias_reduced?: number;
          carbon_saved?: number;
          deepfakes_detected?: number;
          templates_used?: number;
          last_check_in?: string | null;
          updated_at?: string;
        };
      };
      scans: {
        Row: {
          id: string;
          user_id: string;
          prompt: string;
          prompt_hash: string;
          ethics_score: number;
          bias_score: number;
          privacy_score: number;
          toxicity_score: number;
          transparency_score: number;
          fairness_score: number;
          analysis: Json;
          suggestions: Json | null;
          carbon_cost: number | null;
          model_used: string | null;
          tokens_used: number | null;
          processing_time_ms: number | null;
          is_public: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          prompt: string;
          prompt_hash?: string;
          ethics_score: number;
          bias_score: number;
          privacy_score: number;
          toxicity_score: number;
          transparency_score?: number;
          fairness_score?: number;
          analysis: Json;
          suggestions?: Json | null;
          carbon_cost?: number | null;
          model_used?: string | null;
          tokens_used?: number | null;
          processing_time_ms?: number | null;
          is_public?: boolean;
          created_at?: string;
        };
        Update: {
          is_public?: boolean;
        };
      };
      achievements: {
        Row: {
          id: string;
          user_id: string;
          achievement_id: string;
          unlocked_at: string;
          progress: number;
          metadata: Json | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          achievement_id: string;
          unlocked_at?: string;
          progress?: number;
          metadata?: Json | null;
        };
        Update: {
          progress?: number;
          metadata?: Json | null;
        };
      };
      badges: {
        Row: {
          id: string;
          user_id: string;
          badge_id: string;
          earned_at: string;
          is_verified: boolean;
          verification_hash: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          badge_id: string;
          earned_at?: string;
          is_verified?: boolean;
          verification_hash?: string | null;
        };
        Update: {
          is_verified?: boolean;
          verification_hash?: string | null;
        };
      };
      guilds: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          avatar_url: string | null;
          banner_url: string | null;
          owner_id: string;
          level: number;
          total_xp: number;
          member_count: number;
          is_public: boolean;
          tags: string[] | null;
          settings: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          avatar_url?: string | null;
          banner_url?: string | null;
          owner_id: string;
          level?: number;
          total_xp?: number;
          member_count?: number;
          is_public?: boolean;
          tags?: string[] | null;
          settings?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string;
          description?: string | null;
          avatar_url?: string | null;
          banner_url?: string | null;
          level?: number;
          total_xp?: number;
          member_count?: number;
          is_public?: boolean;
          tags?: string[] | null;
          settings?: Json | null;
          updated_at?: string;
        };
      };
      guild_members: {
        Row: {
          id: string;
          guild_id: string;
          user_id: string;
          role: 'owner' | 'admin' | 'moderator' | 'member';
          xp_contributed: number;
          joined_at: string;
        };
        Insert: {
          id?: string;
          guild_id: string;
          user_id: string;
          role?: 'owner' | 'admin' | 'moderator' | 'member';
          xp_contributed?: number;
          joined_at?: string;
        };
        Update: {
          role?: 'owner' | 'admin' | 'moderator' | 'member';
          xp_contributed?: number;
        };
      };
      quests: {
        Row: {
          id: string;
          user_id: string;
          quest_type: 'daily' | 'weekly' | 'special' | 'seasonal';
          quest_id: string;
          progress: number;
          target: number;
          is_completed: boolean;
          is_claimed: boolean;
          xp_reward: number;
          karma_reward: number;
          expires_at: string | null;
          completed_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          quest_type: 'daily' | 'weekly' | 'special' | 'seasonal';
          quest_id: string;
          progress?: number;
          target: number;
          is_completed?: boolean;
          is_claimed?: boolean;
          xp_reward: number;
          karma_reward?: number;
          expires_at?: string | null;
          completed_at?: string | null;
          created_at?: string;
        };
        Update: {
          progress?: number;
          is_completed?: boolean;
          is_claimed?: boolean;
          completed_at?: string | null;
        };
      };
      xp_events: {
        Row: {
          id: string;
          user_id: string;
          amount: number;
          reason: string;
          metadata: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          amount: number;
          reason: string;
          metadata?: Json | null;
          created_at?: string;
        };
        Update: never;
      };
      karma_events: {
        Row: {
          id: string;
          user_id: string;
          amount: number;
          type: 'earned' | 'spent' | 'bonus' | 'penalty';
          reason: string;
          related_user_id: string | null;
          metadata: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          amount: number;
          type: 'earned' | 'spent' | 'bonus' | 'penalty';
          reason: string;
          related_user_id?: string | null;
          metadata?: Json | null;
          created_at?: string;
        };
        Update: never;
      };
      feed_posts: {
        Row: {
          id: string;
          user_id: string;
          type: 'scan_result' | 'achievement' | 'template' | 'discussion' | 'tip';
          content: string;
          scan_id: string | null;
          achievement_id: string | null;
          template_id: string | null;
          likes_count: number;
          comments_count: number;
          shares_count: number;
          is_public: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: 'scan_result' | 'achievement' | 'template' | 'discussion' | 'tip';
          content: string;
          scan_id?: string | null;
          achievement_id?: string | null;
          template_id?: string | null;
          likes_count?: number;
          comments_count?: number;
          shares_count?: number;
          is_public?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          content?: string;
          likes_count?: number;
          comments_count?: number;
          shares_count?: number;
          is_public?: boolean;
          updated_at?: string;
        };
      };
      templates: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string;
          prompt_template: string;
          category: string;
          tags: string[];
          ethics_score: number;
          uses_count: number;
          likes_count: number;
          is_verified: boolean;
          is_public: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          description: string;
          prompt_template: string;
          category: string;
          tags?: string[];
          ethics_score?: number;
          uses_count?: number;
          likes_count?: number;
          is_verified?: boolean;
          is_public?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          title?: string;
          description?: string;
          prompt_template?: string;
          category?: string;
          tags?: string[];
          ethics_score?: number;
          uses_count?: number;
          likes_count?: number;
          is_verified?: boolean;
          is_public?: boolean;
          updated_at?: string;
        };
      };
      subscriptions: {
        Row: {
          id: string;
          user_id: string;
          stripe_subscription_id: string;
          stripe_customer_id: string;
          status: 'active' | 'canceled' | 'past_due' | 'trialing' | 'unpaid';
          plan: 'monthly' | 'yearly';
          current_period_start: string;
          current_period_end: string;
          cancel_at_period_end: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          stripe_subscription_id: string;
          stripe_customer_id: string;
          status: 'active' | 'canceled' | 'past_due' | 'trialing' | 'unpaid';
          plan: 'monthly' | 'yearly';
          current_period_start: string;
          current_period_end: string;
          cancel_at_period_end?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          status?: 'active' | 'canceled' | 'past_due' | 'trialing' | 'unpaid';
          current_period_start?: string;
          current_period_end?: string;
          cancel_at_period_end?: boolean;
          updated_at?: string;
        };
      };
    };
    Views: {
      leaderboard_view: {
        Row: {
          user_id: string;
          username: string;
          display_name: string;
          avatar_url: string | null;
          total_xp: number;
          level: number;
          karma: number;
          streak_days: number;
          total_scans: number;
          rank: number;
        };
      };
    };
    Functions: {
      increment_scan_count: {
        Args: { user_id: string };
        Returns: void;
      };
      update_streak: {
        Args: { user_id: string };
        Returns: { streak_continued: boolean; new_streak: number };
      };
      calculate_rank: {
        Args: { user_id: string };
        Returns: number;
      };
    };
  };
}

// Helper types
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type UserStats = Database['public']['Tables']['user_stats']['Row'];
export type Scan = Database['public']['Tables']['scans']['Row'];
export type Achievement = Database['public']['Tables']['achievements']['Row'];
export type Badge = Database['public']['Tables']['badges']['Row'];
export type Guild = Database['public']['Tables']['guilds']['Row'];
export type GuildMember = Database['public']['Tables']['guild_members']['Row'];
export type Quest = Database['public']['Tables']['quests']['Row'];
export type FeedPost = Database['public']['Tables']['feed_posts']['Row'];
export type Template = Database['public']['Tables']['templates']['Row'];
export type Subscription = Database['public']['Tables']['subscriptions']['Row'];
