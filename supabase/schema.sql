-- =====================================================
-- AuraScan Database Schema
-- Run this in your Supabase SQL Editor
-- =====================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- CORE TABLES
-- =====================================================

-- User Profiles (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE,
  display_name TEXT NOT NULL DEFAULT 'Anonymous',
  avatar_url TEXT,
  bio TEXT,
  auth_provider TEXT DEFAULT 'email',
  is_premium BOOLEAN DEFAULT FALSE,
  subscription_tier TEXT CHECK (subscription_tier IN ('pro', 'team', 'enterprise')),
  stripe_customer_id TEXT,
  settings JSONB DEFAULT '{"notifications": true, "theme": "dark", "language": "en"}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Login Events (audit trail for account access)
CREATE TABLE IF NOT EXISTS login_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  provider TEXT,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_login_events_user_created ON login_events(user_id, created_at DESC);

-- User Stats (gamification)
CREATE TABLE IF NOT EXISTS user_stats (
  user_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  xp INTEGER DEFAULT 0,
  karma INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  total_scans INTEGER DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_scan_date DATE,
  average_ethics_score DECIMAL(5,2) DEFAULT 0,
  total_carbon_saved DECIMAL(10,4) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Scans
CREATE TABLE IF NOT EXISTS scans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  prompt TEXT NOT NULL,
  prompt_hash TEXT NOT NULL,
  ethics_score INTEGER CHECK (ethics_score >= 0 AND ethics_score <= 100),
  bias_score INTEGER CHECK (bias_score >= 0 AND bias_score <= 100),
  privacy_score INTEGER CHECK (privacy_score >= 0 AND privacy_score <= 100),
  toxicity_score INTEGER CHECK (toxicity_score >= 0 AND toxicity_score <= 100),
  transparency_score INTEGER CHECK (transparency_score >= 0 AND transparency_score <= 100),
  fairness_score INTEGER CHECK (fairness_score >= 0 AND fairness_score <= 100),
  analysis JSONB NOT NULL,
  carbon_cost DECIMAL(10,6),
  model_used TEXT DEFAULT 'gpt-4-turbo',
  tokens_used INTEGER,
  processing_time_ms INTEGER,
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on user_id and created_at for efficient querying
CREATE INDEX IF NOT EXISTS idx_scans_user_created ON scans(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_scans_prompt_hash ON scans(prompt_hash);

-- =====================================================
-- ACHIEVEMENTS & BADGES
-- =====================================================

-- Achievements definitions
CREATE TABLE IF NOT EXISTS achievements (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  rarity TEXT CHECK (rarity IN ('common', 'uncommon', 'rare', 'epic', 'legendary')),
  xp_reward INTEGER DEFAULT 0,
  category TEXT CHECK (category IN ('scanning', 'social', 'streak', 'milestone', 'special')),
  requirements JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User achievements
CREATE TABLE IF NOT EXISTS user_achievements (
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  achievement_id TEXT REFERENCES achievements(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, achievement_id)
);

-- Badges definitions
CREATE TABLE IF NOT EXISTS badges (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  tier TEXT CHECK (tier IN ('bronze', 'silver', 'gold', 'platinum', 'diamond')),
  category TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User badges
CREATE TABLE IF NOT EXISTS user_badges (
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  badge_id TEXT REFERENCES badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, badge_id)
);

-- =====================================================
-- GUILDS
-- =====================================================

-- Guilds
CREATE TABLE IF NOT EXISTS guilds (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  avatar_url TEXT,
  banner_url TEXT,
  type TEXT DEFAULT 'general' CHECK (type IN ('general', 'professional', 'educational', 'research')),
  owner_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  is_public BOOLEAN DEFAULT TRUE,
  is_featured BOOLEAN DEFAULT FALSE,
  total_xp INTEGER DEFAULT 0,
  total_scans INTEGER DEFAULT 0,
  settings JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Guild members
CREATE TABLE IF NOT EXISTS guild_members (
  guild_id UUID REFERENCES guilds(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member' CHECK (role IN ('member', 'moderator', 'admin')),
  contribution_xp INTEGER DEFAULT 0,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (guild_id, user_id)
);

-- Guild quests
CREATE TABLE IF NOT EXISTS quests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  guild_id UUID REFERENCES guilds(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  type TEXT CHECK (type IN ('daily', 'weekly', 'monthly', 'special')),
  requirements JSONB NOT NULL,
  xp_reward INTEGER DEFAULT 0,
  karma_reward INTEGER DEFAULT 0,
  badge_reward TEXT REFERENCES badges(id),
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Quest progress
CREATE TABLE IF NOT EXISTS quest_progress (
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  quest_id UUID REFERENCES quests(id) ON DELETE CASCADE,
  progress INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  PRIMARY KEY (user_id, quest_id)
);

-- =====================================================
-- SOCIAL FEATURES
-- =====================================================

-- Feed posts
CREATE TABLE IF NOT EXISTS feed_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  type TEXT DEFAULT 'text' CHECK (type IN ('text', 'scan_share', 'achievement', 'level_up')),
  scan_id UUID REFERENCES scans(id) ON DELETE SET NULL,
  guild_id UUID REFERENCES guilds(id) ON DELETE SET NULL,
  like_count INTEGER DEFAULT 0,
  is_public BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_feed_posts_created ON feed_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_feed_posts_guild ON feed_posts(guild_id, created_at DESC);

-- Post likes
CREATE TABLE IF NOT EXISTS post_likes (
  post_id UUID REFERENCES feed_posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (post_id, user_id)
);

-- Post comments
CREATE TABLE IF NOT EXISTS post_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID REFERENCES feed_posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User follows
CREATE TABLE IF NOT EXISTS user_follows (
  follower_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  following_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (follower_id, following_id)
);

-- =====================================================
-- XP & KARMA EVENTS
-- =====================================================

-- XP events (for tracking XP history)
CREATE TABLE IF NOT EXISTS xp_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  reason TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_xp_events_user ON xp_events(user_id, created_at DESC);

-- Karma events
CREATE TABLE IF NOT EXISTS karma_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  reason TEXT NOT NULL,
  from_user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- SUBSCRIPTIONS
-- =====================================================

-- Subscriptions
CREATE TABLE IF NOT EXISTS subscriptions (
  user_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  stripe_subscription_id TEXT UNIQUE,
  stripe_customer_id TEXT,
  stripe_price_id TEXT,
  tier TEXT CHECK (tier IN ('pro', 'team', 'enterprise')),
  status TEXT CHECK (status IN ('active', 'canceled', 'past_due', 'trialing', 'unpaid')),
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  canceled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- TEMPLATES
-- =====================================================

-- Prompt templates
CREATE TABLE IF NOT EXISTS templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  prompt_template TEXT NOT NULL,
  category TEXT,
  ethics_score INTEGER,
  use_count INTEGER DEFAULT 0,
  is_public BOOLEAN DEFAULT FALSE,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_templates_public ON templates(is_public, created_at DESC);

-- =====================================================
-- FUNCTIONS & TRIGGERS
-- =====================================================

-- Function to update user stats after scan
CREATE OR REPLACE FUNCTION update_user_stats_after_scan()
RETURNS TRIGGER AS $$
DECLARE
  today_date DATE := CURRENT_DATE;
  last_date DATE;
  new_streak INTEGER;
BEGIN
  -- Get current stats
  SELECT last_scan_date, current_streak INTO last_date, new_streak
  FROM user_stats WHERE user_id = NEW.user_id;

  -- Update streak
  IF last_date IS NULL OR last_date < today_date - INTERVAL '1 day' THEN
    new_streak := 1;
  ELSIF last_date = today_date - INTERVAL '1 day' THEN
    new_streak := new_streak + 1;
  END IF;

  -- Update stats
  UPDATE user_stats
  SET 
    total_scans = total_scans + 1,
    current_streak = new_streak,
    longest_streak = GREATEST(longest_streak, new_streak),
    last_scan_date = today_date,
    average_ethics_score = (
      SELECT AVG(ethics_score)::DECIMAL(5,2)
      FROM scans WHERE user_id = NEW.user_id
    ),
    updated_at = NOW()
  WHERE user_id = NEW.user_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for scan stats update
DROP TRIGGER IF EXISTS trigger_update_stats_after_scan ON scans;
CREATE TRIGGER trigger_update_stats_after_scan
AFTER INSERT ON scans
FOR EACH ROW
WHEN (NEW.user_id IS NOT NULL)
EXECUTE FUNCTION update_user_stats_after_scan();

-- Function to add XP
CREATE OR REPLACE FUNCTION add_xp(user_id UUID, amount INTEGER)
RETURNS void AS $$
BEGIN
  UPDATE user_stats
  SET 
    xp = xp + amount,
    level = calculate_level(xp + amount),
    updated_at = NOW()
  WHERE user_stats.user_id = add_xp.user_id;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate level from XP
CREATE OR REPLACE FUNCTION calculate_level(xp INTEGER)
RETURNS INTEGER AS $$
DECLARE
  level INTEGER := 1;
  xp_required INTEGER := 0;
  increment INTEGER := 100;
BEGIN
  WHILE xp >= xp_required + increment LOOP
    xp_required := xp_required + increment;
    level := level + 1;
    increment := FLOOR(increment * 1.2);
  END LOOP;
  RETURN level;
END;
$$ LANGUAGE plpgsql;

-- Function to increment scan count
CREATE OR REPLACE FUNCTION increment_scan_count(user_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE user_stats
  SET total_scans = total_scans + 1, updated_at = NOW()
  WHERE user_stats.user_id = increment_scan_count.user_id;
END;
$$ LANGUAGE plpgsql;

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, display_name, created_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)),
    NOW()
  );
  
  INSERT INTO user_stats (user_id, created_at)
  VALUES (NEW.id, NOW());
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for new user
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION handle_new_user();

-- Function to update like count
CREATE OR REPLACE FUNCTION update_like_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE feed_posts SET like_count = like_count + 1 WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE feed_posts SET like_count = like_count - 1 WHERE id = OLD.post_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for like count
DROP TRIGGER IF EXISTS trigger_update_like_count ON post_likes;
CREATE TRIGGER trigger_update_like_count
AFTER INSERT OR DELETE ON post_likes
FOR EACH ROW
EXECUTE FUNCTION update_like_count();

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE guilds ENABLE ROW LEVEL SECURITY;
ALTER TABLE guild_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE quests ENABLE ROW LEVEL SECURITY;
ALTER TABLE quest_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE feed_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE xp_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE karma_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone" ON profiles
  FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- User stats policies
CREATE POLICY "Public stats are viewable by everyone" ON user_stats
  FOR SELECT USING (true);
CREATE POLICY "Users can update own stats" ON user_stats
  FOR UPDATE USING (auth.uid() = user_id);

-- Scans policies
CREATE POLICY "Users can view own scans" ON scans
  FOR SELECT USING (auth.uid() = user_id OR is_public = true);
CREATE POLICY "Users can insert own scans" ON scans
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own scans" ON scans
  FOR UPDATE USING (auth.uid() = user_id);

-- Achievements policies
CREATE POLICY "Achievements are viewable by everyone" ON achievements
  FOR SELECT USING (true);

-- User achievements policies
CREATE POLICY "User achievements are viewable by everyone" ON user_achievements
  FOR SELECT USING (true);
CREATE POLICY "Users can insert own achievements" ON user_achievements
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Badges policies
CREATE POLICY "Badges are viewable by everyone" ON badges
  FOR SELECT USING (true);

-- User badges policies
CREATE POLICY "User badges are viewable by everyone" ON user_badges
  FOR SELECT USING (true);
CREATE POLICY "Users can insert own badges" ON user_badges
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Guilds policies
CREATE POLICY "Public guilds are viewable by everyone" ON guilds
  FOR SELECT USING (is_public = true OR EXISTS (
    SELECT 1 FROM guild_members WHERE guild_id = id AND user_id = auth.uid()
  ));
CREATE POLICY "Guild owners can update their guild" ON guilds
  FOR UPDATE USING (owner_id = auth.uid());

-- Guild members policies
CREATE POLICY "Guild members are viewable by guild members" ON guild_members
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM guild_members gm WHERE gm.guild_id = guild_id AND gm.user_id = auth.uid()
  ) OR EXISTS (
    SELECT 1 FROM guilds g WHERE g.id = guild_id AND g.is_public = true
  ));

-- Feed posts policies
CREATE POLICY "Public posts are viewable by everyone" ON feed_posts
  FOR SELECT USING (is_public = true);
CREATE POLICY "Users can insert own posts" ON feed_posts
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own posts" ON feed_posts
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own posts" ON feed_posts
  FOR DELETE USING (auth.uid() = user_id);

-- Post likes policies
CREATE POLICY "Post likes are viewable by everyone" ON post_likes
  FOR SELECT USING (true);
CREATE POLICY "Users can insert own likes" ON post_likes
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own likes" ON post_likes
  FOR DELETE USING (auth.uid() = user_id);

-- Templates policies
CREATE POLICY "Public templates are viewable by everyone" ON templates
  FOR SELECT USING (is_public = true OR auth.uid() = user_id);
CREATE POLICY "Users can insert own templates" ON templates
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own templates" ON templates
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own templates" ON templates
  FOR DELETE USING (auth.uid() = user_id);

-- =====================================================
-- SEED DATA
-- =====================================================

-- Insert default achievements
INSERT INTO achievements (id, name, description, icon, rarity, xp_reward, category, requirements) VALUES
  ('welcome', 'Welcome to AuraScan', 'Created your account', '👋', 'common', 10, 'milestone', '{"type": "signup"}'),
  ('first_scan', 'First Analysis', 'Completed your first prompt scan', '🔍', 'common', 25, 'scanning', '{"type": "scan_count", "count": 1}'),
  ('scan_10', 'Ethical Explorer', 'Analyzed 10 prompts', '🎯', 'uncommon', 50, 'scanning', '{"type": "scan_count", "count": 10}'),
  ('scan_50', 'Ethics Enthusiast', 'Analyzed 50 prompts', '⭐', 'rare', 100, 'scanning', '{"type": "scan_count", "count": 50}'),
  ('scan_100', 'Ethics Expert', 'Analyzed 100 prompts', '🏆', 'epic', 200, 'scanning', '{"type": "scan_count", "count": 100}'),
  ('scan_500', 'Ethics Master', 'Analyzed 500 prompts', '👑', 'legendary', 500, 'scanning', '{"type": "scan_count", "count": 500}'),
  ('streak_7', 'Week Warrior', '7-day scanning streak', '🔥', 'uncommon', 75, 'streak', '{"type": "streak", "days": 7}'),
  ('streak_30', 'Monthly Master', '30-day scanning streak', '💪', 'rare', 150, 'streak', '{"type": "streak", "days": 30}'),
  ('streak_100', 'Centurion', '100-day scanning streak', '🎖️', 'legendary', 500, 'streak', '{"type": "streak", "days": 100}'),
  ('perfect_score', 'Perfect Ethics', 'Achieved a 100% ethics score', '✨', 'rare', 100, 'special', '{"type": "score", "score": 100}'),
  ('first_post', 'Community Voice', 'Created your first post', '📝', 'common', 15, 'social', '{"type": "post_count", "count": 1}'),
  ('guild_founder', 'Guild Founder', 'Created a guild', '🏰', 'rare', 100, 'social', '{"type": "guild_create"}'),
  ('first_subscription', 'Premium Pioneer', 'Subscribed to premium', '💎', 'uncommon', 50, 'milestone', '{"type": "subscribe"}')
ON CONFLICT (id) DO NOTHING;

-- Insert default badges
INSERT INTO badges (id, name, description, icon, tier, category) VALUES
  ('ethics_novice', 'Ethics Novice', 'Beginning your ethics journey', '🌱', 'bronze', 'scanning'),
  ('ethics_student', 'Ethics Student', 'Learning the ways of ethical AI', '📚', 'silver', 'scanning'),
  ('ethics_guardian', 'Ethics Guardian', 'Protecting AI ethics', '🛡️', 'gold', 'scanning'),
  ('ethics_champion', 'Ethics Champion', 'Champion of ethical AI', '🏆', 'platinum', 'scanning'),
  ('ethics_legend', 'Ethics Legend', 'Legendary ethics advocate', '⚡', 'diamond', 'scanning'),
  ('community_helper', 'Community Helper', 'Helping others in the community', '🤝', 'bronze', 'social'),
  ('top_contributor', 'Top Contributor', 'Top community contributor', '🌟', 'gold', 'social'),
  ('streak_holder', 'Streak Holder', 'Maintaining consistent streaks', '🔥', 'silver', 'streak'),
  ('eco_warrior', 'Eco Warrior', 'Committed to low-carbon AI', '🌍', 'gold', 'special')
ON CONFLICT (id) DO NOTHING;

-- Create a featured guild
INSERT INTO guilds (id, name, description, type, is_public, is_featured) VALUES
  (uuid_generate_v4(), 'Ethics Pioneers', 'The official AuraScan community guild. Welcome all!', 'general', true, true)
ON CONFLICT DO NOTHING;

-- =====================================================
-- DONE!
-- =====================================================
-- Run this entire script in your Supabase SQL Editor
-- Make sure to enable the required extensions first
