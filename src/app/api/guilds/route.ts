import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { v4 as uuidv4 } from 'uuid';

// GET - Get guilds list
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type') || 'all'; // all, my, public, featured
    const userId = searchParams.get('userId');
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const supabase = createServerClient();

    let query = supabase
      .from('guilds')
      .select(`
        *,
        member_count:guild_members(count),
        owner:profiles!guilds_owner_id_fkey (id, display_name, avatar_url)
      `, { count: 'exact' });

    // Apply filters
    if (type === 'my' && userId) {
      const { data: memberships } = await supabase
        .from('guild_members')
        .select('guild_id')
        .eq('user_id', userId);
      
      if (memberships && memberships.length > 0) {
        const guildIds = memberships.map(m => m.guild_id);
        query = query.in('id', guildIds);
      } else {
        return NextResponse.json({ guilds: [], total: 0 });
      }
    } else if (type === 'public') {
      query = query.eq('is_public', true);
    } else if (type === 'featured') {
      query = query.eq('is_featured', true);
    }

    // Search filter
    if (search) {
      query = query.ilike('name', `%${search}%`);
    }

    // Ordering and pagination
    query = query
      .order('total_xp', { ascending: false })
      .range(offset, offset + limit - 1);

    const { data: guilds, error, count } = await query;

    if (error) {
      throw error;
    }

    // Get user's membership status for each guild
    let userMemberships: Record<string, string> = {};
    if (userId && guilds && guilds.length > 0) {
      const { data: memberships } = await supabase
        .from('guild_members')
        .select('guild_id, role')
        .eq('user_id', userId)
        .in('guild_id', guilds.map(g => g.id));
      
      if (memberships) {
        userMemberships = Object.fromEntries(
          memberships.map(m => [m.guild_id, m.role])
        );
      }
    }

    const formattedGuilds = guilds?.map(guild => ({
      ...guild,
      memberCount: guild.member_count?.[0]?.count || 0,
      userRole: userMemberships[guild.id] || null,
      isMember: !!userMemberships[guild.id],
    })) || [];

    return NextResponse.json({
      guilds: formattedGuilds,
      total: count,
      pagination: {
        limit,
        offset,
        hasMore: (count || 0) > offset + limit,
      },
    });

  } catch (error) {
    console.error('Get guilds error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch guilds' },
      { status: 500 }
    );
  }
}

// POST - Create new guild
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, description, type, isPublic, userId } = body;

    if (!name || !userId) {
      return NextResponse.json(
        { error: 'Name and user ID required' },
        { status: 400 }
      );
    }

    if (name.length < 3 || name.length > 50) {
      return NextResponse.json(
        { error: 'Guild name must be 3-50 characters' },
        { status: 400 }
      );
    }

    const supabase = createServerClient();

    // Check if user already owns a guild
    const { data: existingGuild } = await supabase
      .from('guilds')
      .select('id')
      .eq('owner_id', userId)
      .single();

    if (existingGuild) {
      return NextResponse.json(
        { error: 'You can only own one guild at a time' },
        { status: 400 }
      );
    }

    // Check user's premium status for guild creation
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_premium')
      .eq('id', userId)
      .single();

    if (!profile?.is_premium) {
      return NextResponse.json(
        { error: 'Premium subscription required to create guilds' },
        { status: 403 }
      );
    }

    // Create guild
    const guildId = uuidv4();
    const { data: guild, error: createError } = await supabase
      .from('guilds')
      .insert({
        id: guildId,
        name,
        description: description || '',
        type: type || 'general',
        is_public: isPublic !== false,
        owner_id: userId,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (createError) {
      if (createError.code === '23505') {
        return NextResponse.json(
          { error: 'Guild name already taken' },
          { status: 400 }
        );
      }
      throw createError;
    }

    // Add owner as admin member
    await supabase.from('guild_members').insert({
      guild_id: guildId,
      user_id: userId,
      role: 'admin',
      joined_at: new Date().toISOString(),
    });

    // Award achievement (use upsert to avoid conflicts)
    await supabase.from('user_achievements').upsert({
      user_id: userId,
      achievement_id: 'guild_founder',
      unlocked_at: new Date().toISOString(),
    }, {
      onConflict: 'user_id,achievement_id',
      ignoreDuplicates: true,
    });

    return NextResponse.json({
      success: true,
      guild,
    });

  } catch (error) {
    console.error('Create guild error:', error);
    return NextResponse.json(
      { error: 'Failed to create guild' },
      { status: 500 }
    );
  }
}
