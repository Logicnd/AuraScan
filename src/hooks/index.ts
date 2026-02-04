import { useState, useEffect, useCallback } from 'react';
import { useUserStore } from '@/store';
import { supabase } from '@/lib/supabase/client';
import type { AuthChangeEvent, Session } from '@supabase/supabase-js';

// Types
interface ScanResult {
  success: boolean;
  analysis: any;
  meta: {
    processingTimeMs: number;
    tokensUsed: number;
    carbonCostGrams: number;
    model: string;
    timestamp: string;
  };
  error?: string;
}

interface UseAuthReturn {
  user: any | null;
  profile: any | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithApple: () => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

// Authentication hook
export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data }) => {
      const session = data.session;
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, session: Session | null) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          await fetchProfile(session.user.id);
        } else {
          setProfile(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const response = await fetch(`/api/user?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        setProfile(data.profile);
      }
    } catch (err) {
      console.error('Failed to fetch profile:', err);
    }
  };

  const signIn = async (email: string, password: string) => {
    setError(null);
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, displayName: string) => {
    setError(null);
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { display_name: displayName },
        },
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/api/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const signInWithApple = async () => {
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'apple',
        options: {
          redirectTo: `${window.location.origin}/api/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setProfile(null);
  };

  const resetPassword = async (email: string) => {
    setError(null);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  return {
    user,
    profile,
    loading,
    error,
    signIn,
    signUp,
    signInWithGoogle,
    signInWithApple,
    signOut,
    resetPassword,
  };
}

// Scan hook
export function useScan() {
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { user } = useUserStore();

  const scan = useCallback(async (prompt: string, mode: 'full' | 'quick' = 'full') => {
    setScanning(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          mode,
          userId: user?.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Scan failed');
      }

      setResult(data);
      return data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setScanning(false);
    }
  }, [user?.id]);

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return { scan, scanning, result, error, reset };
}

// Leaderboard hook
export function useLeaderboard(type: 'xp' | 'karma' | 'scans' | 'streaks' = 'xp', period: 'all' | 'week' | 'month' = 'all') {
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLeaderboard();
  }, [type, period]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/leaderboard?type=${type}&period=${period}&limit=100`);
      if (!response.ok) throw new Error('Failed to fetch leaderboard');
      
      const data = await response.json();
      setLeaderboard(data.leaderboard);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { leaderboard, loading, error, refetch: fetchLeaderboard };
}

// Feed hook
export function useFeed(type: 'all' | 'following' | 'guild' | 'trending' = 'all') {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const { user } = useUserStore();

  useEffect(() => {
    fetchPosts(true);
  }, [type]);

  const fetchPosts = async (reset = false) => {
    setLoading(true);
    try {
      const offset = reset ? 0 : posts.length;
      const response = await fetch(
        `/api/feed?type=${type}&userId=${user?.id || ''}&limit=20&offset=${offset}`
      );
      
      if (!response.ok) throw new Error('Failed to fetch feed');
      
      const data = await response.json();
      
      if (reset) {
        setPosts(data.posts);
      } else {
        setPosts(prev => [...prev, ...data.posts]);
      }
      
      setHasMore(data.pagination.hasMore);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createPost = async (content: string, scanId?: string) => {
    if (!user?.id) throw new Error('Must be logged in to post');

    const response = await fetch('/api/feed', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content,
        scanId,
        userId: user.id,
      }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Failed to create post');
    }

    const data = await response.json();
    setPosts(prev => [data.post, ...prev]);
    return data.post;
  };

  return {
    posts,
    loading,
    error,
    hasMore,
    fetchMore: () => fetchPosts(false),
    refetch: () => fetchPosts(true),
    createPost,
  };
}

// Guilds hook
export function useGuilds(type: 'all' | 'my' | 'public' | 'featured' = 'all') {
  const [guilds, setGuilds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { user } = useUserStore();

  useEffect(() => {
    fetchGuilds();
  }, [type, user?.id]);

  const fetchGuilds = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/guilds?type=${type}&userId=${user?.id || ''}`
      );
      
      if (!response.ok) throw new Error('Failed to fetch guilds');
      
      const data = await response.json();
      setGuilds(data.guilds);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createGuild = async (name: string, description: string, isPublic = true) => {
    if (!user?.id) throw new Error('Must be logged in to create a guild');

    const response = await fetch('/api/guilds', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        description,
        isPublic,
        userId: user.id,
      }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Failed to create guild');
    }

    const data = await response.json();
    setGuilds(prev => [data.guild, ...prev]);
    return data.guild;
  };

  return { guilds, loading, error, refetch: fetchGuilds, createGuild };
}

// Scan history hook
export function useScanHistory() {
  const [scans, setScans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const { user } = useUserStore();

  useEffect(() => {
    if (user?.id) {
      fetchScans(true);
    }
  }, [user?.id]);

  const fetchScans = async (reset = false) => {
    if (!user?.id) return;

    setLoading(true);
    try {
      const offset = reset ? 0 : scans.length;
      const response = await fetch(
        `/api/scan?userId=${user.id}&limit=20&offset=${offset}`
      );
      
      if (!response.ok) throw new Error('Failed to fetch scan history');
      
      const data = await response.json();
      
      if (reset) {
        setScans(data.scans);
      } else {
        setScans(prev => [...prev, ...data.scans]);
      }
      
      setHasMore(data.pagination.hasMore);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    scans,
    loading,
    error,
    hasMore,
    fetchMore: () => fetchScans(false),
    refetch: () => fetchScans(true),
  };
}

// User stats hook
export function useUserStats() {
  const [stats, setStats] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { user } = useUserStore();

  useEffect(() => {
    if (user?.id) {
      fetchStats();
    }
  }, [user?.id]);

  const fetchStats = async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/user?userId=${user.id}`);
      
      if (!response.ok) throw new Error('Failed to fetch user stats');
      
      const data = await response.json();
      setStats(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { stats, loading, error, refetch: fetchStats };
}
