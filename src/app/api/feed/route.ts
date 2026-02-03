import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { v4 as uuidv4 } from 'uuid';

// GET - Get feed posts
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type') || 'all'; // all, following, guild, trending
    const userId = searchParams.get('userId');
    const guildId = searchParams.get('guildId');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    const supabase = createServerClient();

    let query = supabase
      .from('feed_posts')
      .select(`
        *,
        author:profiles!feed_posts_user_id_fkey (id, display_name, avatar_url, is_premium),
        scan:scans (id, prompt, ethics_score, analysis),
        likes:post_likes (user_id),
        comments:post_comments (count)
      `, { count: 'exact' })
      .eq('is_public', true);

    // Apply filters
    if (type === 'guild' && guildId) {
      query = query.eq('guild_id', guildId);
    } else if (type === 'following' && userId) {
      const { data: following } = await supabase
        .from('user_follows')
        .select('following_id')
        .eq('follower_id', userId);
      
      if (following && following.length > 0) {
        const followingIds = following.map(f => f.following_id);
        query = query.in('user_id', followingIds);
      }
    } else if (type === 'trending') {
      // Trending = most likes in last 24 hours
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      query = query
        .gte('created_at', yesterday)
        .order('like_count', { ascending: false });
    }

    // Default ordering by created_at if not trending
    if (type !== 'trending') {
      query = query.order('created_at', { ascending: false });
    }

    query = query.range(offset, offset + limit - 1);

    const { data: posts, error, count } = await query;

    if (error) {
      throw error;
    }

    // Format posts with like status
    const formattedPosts = posts?.map(post => ({
      id: post.id,
      content: post.content,
      type: post.type,
      author: post.author,
      scan: post.scan ? {
        id: post.scan.id,
        prompt: post.scan.prompt?.slice(0, 200) + '...',
        score: post.scan.ethics_score,
        topIssues: post.scan.analysis?.topIssues?.slice(0, 3) || [],
      } : null,
      likeCount: post.like_count,
      commentCount: post.comments?.[0]?.count || 0,
      isLiked: userId ? post.likes?.some((l: any) => l.user_id === userId) : false,
      createdAt: post.created_at,
    })) || [];

    return NextResponse.json({
      posts: formattedPosts,
      total: count,
      pagination: {
        limit,
        offset,
        hasMore: (count || 0) > offset + limit,
      },
    });

  } catch (error) {
    console.error('Get feed error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch feed' },
      { status: 500 }
    );
  }
}

// POST - Create new post
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { content, type, scanId, guildId, isPublic, userId } = body;

    if (!content || !userId) {
      return NextResponse.json(
        { error: 'Content and user ID required' },
        { status: 400 }
      );
    }

    if (content.length > 2000) {
      return NextResponse.json(
        { error: 'Post content exceeds 2000 characters' },
        { status: 400 }
      );
    }

    const supabase = createServerClient();

    // Verify scan belongs to user if attaching
    if (scanId) {
      const { data: scan } = await supabase
        .from('scans')
        .select('user_id')
        .eq('id', scanId)
        .single();
      
      if (!scan || scan.user_id !== userId) {
        return NextResponse.json(
          { error: 'Invalid scan ID' },
          { status: 400 }
        );
      }
    }

    // Verify guild membership if posting to guild
    if (guildId) {
      const { data: membership } = await supabase
        .from('guild_members')
        .select('id')
        .eq('guild_id', guildId)
        .eq('user_id', userId)
        .single();
      
      if (!membership) {
        return NextResponse.json(
          { error: 'You must be a guild member to post' },
          { status: 403 }
        );
      }
    }

    const postId = uuidv4();
    const { data: post, error } = await supabase
      .from('feed_posts')
      .insert({
        id: postId,
        user_id: userId,
        content,
        type: type || 'text',
        scan_id: scanId || null,
        guild_id: guildId || null,
        is_public: isPublic !== false,
        like_count: 0,
        created_at: new Date().toISOString(),
      })
      .select(`
        *,
        author:profiles!feed_posts_user_id_fkey (id, display_name, avatar_url)
      `)
      .single();

    if (error) {
      throw error;
    }

    // Award XP for posting
    await supabase.from('xp_events').insert({
      user_id: userId,
      amount: 5,
      reason: 'post_created',
      created_at: new Date().toISOString(),
    });

    await supabase.rpc('add_xp', { user_id: userId, amount: 5 });

    return NextResponse.json({
      success: true,
      post,
    });

  } catch (error) {
    console.error('Create post error:', error);
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    );
  }
}
