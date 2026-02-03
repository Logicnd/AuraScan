import { NextRequest, NextResponse } from 'next/server';
import { analyzePromptEthics, quickScan, estimateCarbonCost } from '@/lib/ai/ethics-analyzer';
import { createServerClient } from '@/lib/supabase/server';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';

// Rate limiting map (in production, use Redis)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(userId: string, isPremium: boolean): boolean {
  const limit = isPremium ? 1000 : 10;
  const window = 24 * 60 * 60 * 1000; // 24 hours
  
  const now = Date.now();
  const userLimit = rateLimitMap.get(userId);
  
  if (!userLimit || now > userLimit.resetTime) {
    rateLimitMap.set(userId, { count: 1, resetTime: now + window });
    return true;
  }
  
  if (userLimit.count >= limit) {
    return false;
  }
  
  userLimit.count++;
  return true;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt, mode = 'full', userId } = body;

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    if (prompt.length > 10000) {
      return NextResponse.json(
        { error: 'Prompt exceeds maximum length of 10,000 characters' },
        { status: 400 }
      );
    }

    // Check user and rate limit
    let isPremium = false;
    let dbUserId = userId;

    if (userId) {
      try {
        const supabase = createServerClient();
        const { data: profile } = await supabase
          .from('profiles')
          .select('is_premium')
          .eq('id', userId)
          .single();
        
        isPremium = profile?.is_premium || false;
      } catch {
        // Continue without premium status
      }
    } else {
      // Anonymous user - use IP for rate limiting
      dbUserId = req.headers.get('x-forwarded-for') || 'anonymous';
    }

    // Check rate limit
    if (!checkRateLimit(dbUserId, isPremium)) {
      return NextResponse.json(
        { 
          error: 'Rate limit exceeded',
          message: isPremium 
            ? 'You have exceeded 1000 scans today. Please try again tomorrow.'
            : 'Free tier limit reached (10/day). Upgrade to Premium for unlimited scans.',
          upgradeUrl: '/pricing',
        },
        { status: 429 }
      );
    }

    const startTime = Date.now();

    // Perform analysis
    let analysis;
    if (mode === 'quick') {
      const quickResult = await quickScan(prompt);
      analysis = {
        overallScore: quickResult.score,
        riskLevel: quickResult.riskLevel,
        topIssues: quickResult.topIssues,
        mode: 'quick',
      };
    } else {
      analysis = await analyzePromptEthics(prompt);
    }

    const processingTime = Date.now() - startTime;
    const tokensEstimate = Math.ceil(prompt.length / 4) + 1000; // Rough estimate
    const carbonCost = estimateCarbonCost(tokensEstimate, 'gpt-4-turbo-preview');

    // Save to database if user is authenticated
    if (userId && mode === 'full') {
      try {
        const supabase = createServerClient();
        const promptHash = crypto.createHash('sha256').update(prompt).digest('hex');
        
        await supabase.from('scans').insert({
          id: uuidv4(),
          user_id: userId,
          prompt: prompt.slice(0, 5000), // Truncate for storage
          prompt_hash: promptHash,
          ethics_score: analysis.overallScore,
          bias_score: analysis.scores?.bias || 0,
          privacy_score: analysis.scores?.privacy || 0,
          toxicity_score: analysis.scores?.toxicity || 0,
          transparency_score: analysis.scores?.transparency || 0,
          fairness_score: analysis.scores?.fairness || 0,
          analysis: analysis,
          carbon_cost: carbonCost,
          model_used: 'gpt-4-turbo-preview',
          tokens_used: tokensEstimate,
          processing_time_ms: processingTime,
          created_at: new Date().toISOString(),
        });

        // Update user stats
        await supabase.rpc('increment_scan_count', { user_id: userId });

        // Award XP
        const xpAwarded = calculateXP(analysis.overallScore);
        await supabase.from('xp_events').insert({
          user_id: userId,
          amount: xpAwarded,
          reason: 'scan_completed',
          metadata: { score: analysis.overallScore },
          created_at: new Date().toISOString(),
        });

        // Update total XP
        await supabase.rpc('add_xp', { user_id: userId, amount: xpAwarded });

      } catch (dbError) {
        console.error('Database save error:', dbError);
        // Continue - don't fail the request
      }
    }

    return NextResponse.json({
      success: true,
      analysis,
      meta: {
        processingTimeMs: processingTime,
        tokensUsed: tokensEstimate,
        carbonCostGrams: carbonCost,
        model: 'gpt-4-turbo-preview',
        timestamp: new Date().toISOString(),
      },
    });

  } catch (error) {
    console.error('Scan API error:', error);
    return NextResponse.json(
      { error: 'Analysis failed', message: 'Please try again later' },
      { status: 500 }
    );
  }
}

function calculateXP(score: number): number {
  // Higher ethics scores = more XP
  const baseXP = 10;
  const bonusXP = Math.floor((score / 100) * 15);
  return baseXP + bonusXP;
}

// GET - Get scan history
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 400 }
      );
    }

    const supabase = createServerClient();
    
    const { data: scans, error, count } = await supabase
      .from('scans')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      throw error;
    }

    return NextResponse.json({
      scans,
      pagination: {
        total: count,
        limit,
        offset,
        hasMore: (count || 0) > offset + limit,
      },
    });

  } catch (error) {
    console.error('Get scans error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch scan history' },
      { status: 500 }
    );
  }
}
