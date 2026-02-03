import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

// GET - Get leaderboard
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type') || 'xp'; // xp, karma, scans, streaks
    const period = searchParams.get('period') || 'all'; // all, week, month
    const limit = parseInt(searchParams.get('limit') || '100');
    const guildId = searchParams.get('guildId');

    const supabase = createServerClient();

    let query = supabase
      .from('user_stats')
      .select(`
        *,
        profile:profiles (id, display_name, avatar_url, is_premium, subscription_tier)
      `);

    // Filter by guild if specified
    if (guildId) {
      const { data: guildMembers } = await supabase
        .from('guild_members')
        .select('user_id')
        .eq('guild_id', guildId);
      
      if (guildMembers && guildMembers.length > 0) {
        const userIds = guildMembers.map(m => m.user_id);
        query = query.in('user_id', userIds);
      }
    }

    // Order by selected metric
    switch (type) {
      case 'karma':
        query = query.order('karma', { ascending: false });
        break;
      case 'scans':
        query = query.order('total_scans', { ascending: false });
        break;
      case 'streaks':
        query = query.order('current_streak', { ascending: false });
        break;
      default:
        query = query.order('xp', { ascending: false });
    }

    query = query.limit(limit);

    const { data: leaderboard, error } = await query;

    if (error) {
      throw error;
    }

    // Format response with rankings
    const rankedLeaderboard = leaderboard?.map((entry, index) => ({
      rank: index + 1,
      userId: entry.user_id,
      displayName: entry.profile?.display_name || 'Anonymous',
      avatarUrl: entry.profile?.avatar_url,
      isPremium: entry.profile?.is_premium || false,
      tier: entry.profile?.subscription_tier,
      xp: entry.xp,
      level: calculateLevel(entry.xp),
      karma: entry.karma,
      totalScans: entry.total_scans,
      currentStreak: entry.current_streak,
      longestStreak: entry.longest_streak,
      averageScore: entry.average_ethics_score,
    })) || [];

    // Get time-based stats if period specified
    let periodStats = null;
    if (period !== 'all') {
      const startDate = period === 'week'
        ? new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

      const { data: xpEvents } = await supabase
        .from('xp_events')
        .select('user_id, amount')
        .gte('created_at', startDate.toISOString())
        .order('amount', { ascending: false });

      if (xpEvents) {
        // Aggregate XP by user for the period
        const userXP = new Map<string, number>();
        xpEvents.forEach(event => {
          userXP.set(event.user_id, (userXP.get(event.user_id) || 0) + event.amount);
        });

        periodStats = Array.from(userXP.entries())
          .map(([userId, xp]) => ({ userId, xp }))
          .sort((a, b) => b.xp - a.xp)
          .slice(0, limit);
      }
    }

    return NextResponse.json({
      leaderboard: rankedLeaderboard,
      periodStats,
      meta: {
        type,
        period,
        totalEntries: rankedLeaderboard.length,
      },
    });

  } catch (error) {
    console.error('Get leaderboard error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard' },
      { status: 500 }
    );
  }
}

function calculateLevel(xp: number): number {
  let level = 1;
  let xpRequired = 0;
  let increment = 100;
  
  while (xp >= xpRequired + increment) {
    xpRequired += increment;
    level++;
    increment = Math.floor(increment * 1.2);
  }
  
  return level;
}
