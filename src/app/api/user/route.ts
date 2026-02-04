import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

// GET - Get user profile and stats
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 400 }
      );
    }

    const supabase = createServerClient();

    // Get profile with stats
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select(`
        *,
        user_stats (*),
        subscriptions (*)
      `)
      .eq('id', userId)
      .single();

    if (profileError) {
      throw profileError;
    }

    // Get recent achievements
    const { data: achievements } = await supabase
      .from('user_achievements')
      .select(`
        *,
        achievement:achievements (*)
      `)
      .eq('user_id', userId)
      .order('unlocked_at', { ascending: false })
      .limit(10);

    // Get badges
    const { data: badges } = await supabase
      .from('user_badges')
      .select(`
        *,
        badge:badges (*)
      `)
      .eq('user_id', userId)
      .order('earned_at', { ascending: false });

    // Get guild membership
    const { data: guildMembership } = await supabase
      .from('guild_members')
      .select(`
        *,
        guild:guilds (*)
      `)
      .eq('user_id', userId)
      .single();

    // Calculate level from XP
    const stats = profile?.user_stats?.[0];
    const level = calculateLevel(stats?.xp || 0);

    return NextResponse.json({
      profile: {
        ...profile,
        level,
        levelProgress: calculateLevelProgress(stats?.xp || 0),
      },
      achievements,
      badges,
      guild: guildMembership?.guild || null,
    });

  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user data' },
      { status: 500 }
    );
  }
}

// PUT - Update user profile
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, updates } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 400 }
      );
    }

    // Validate allowed fields
    const allowedFields = ['display_name', 'avatar_url', 'bio', 'settings'];
    const sanitizedUpdates: Record<string, any> = {};
    
    for (const field of allowedFields) {
      if (updates[field] !== undefined) {
        sanitizedUpdates[field] = updates[field];
      }
    }

    if (Object.keys(sanitizedUpdates).length === 0) {
      return NextResponse.json(
        { error: 'No valid fields to update' },
        { status: 400 }
      );
    }

    const supabase = createServerClient();

    const { data, error } = await supabase
      .from('profiles')
      .update({
        ...sanitizedUpdates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      profile: data,
    });

  } catch (error) {
    console.error('Update user error:', error);
    return NextResponse.json(
      { error: 'Failed to update user data' },
      { status: 500 }
    );
  }
}

// Level calculation helpers
function calculateLevel(xp: number): number {
  // XP required per level increases exponentially
  // Level 1: 0 XP, Level 2: 100 XP, Level 3: 300 XP, etc.
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

function calculateLevelProgress(xp: number): { current: number; required: number; percentage: number } {
  let level = 1;
  let xpAtLevelStart = 0;
  let increment = 100;
  
  while (xp >= xpAtLevelStart + increment) {
    xpAtLevelStart += increment;
    level++;
    increment = Math.floor(increment * 1.2);
  }
  
  const xpInCurrentLevel = xp - xpAtLevelStart;
  const xpForNextLevel = increment;
  
  return {
    current: xpInCurrentLevel,
    required: xpForNextLevel,
    percentage: Math.floor((xpInCurrentLevel / xpForNextLevel) * 100),
  };
}
