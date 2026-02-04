import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createServerClient } from '@/lib/supabase/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function GET(req: NextRequest) {
  const { searchParams, origin } = new URL(req.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/';
  const error = searchParams.get('error');
  const error_description = searchParams.get('error_description');

  if (error) {
    console.error('OAuth error:', error, error_description);
    return NextResponse.redirect(
      `${origin}/auth/error?error=${encodeURIComponent(error_description || error)}`
    );
  }

  if (code) {
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        flowType: 'pkce',
      },
    });

    const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

    if (exchangeError) {
      console.error('Session exchange error:', exchangeError);
      return NextResponse.redirect(
        `${origin}/auth/error?error=${encodeURIComponent(exchangeError.message)}`
      );
    }

    if (data.session?.user) {
      // Check if profile exists, create if not
      const serverClient = createServerClient();
      const { data: existingProfile } = await serverClient
        .from('profiles')
        .select('id')
        .eq('id', data.session.user.id)
        .single();

      if (!existingProfile) {
        // Create new profile
        await serverClient.from('profiles').insert({
          id: data.session.user.id,
          email: data.session.user.email,
          display_name: data.session.user.user_metadata?.full_name ||
                       data.session.user.user_metadata?.name ||
                       data.session.user.email?.split('@')[0] ||
                       'User',
          avatar_url: data.session.user.user_metadata?.avatar_url ||
                     data.session.user.user_metadata?.picture ||
                     null,
          auth_provider: data.session.user.app_metadata?.provider || 'oauth',
          created_at: new Date().toISOString(),
        });

        // Create initial stats
        await serverClient.from('user_stats').insert({
          user_id: data.session.user.id,
          xp: 0,
          karma: 0,
          level: 1,
          total_scans: 0,
          current_streak: 0,
          longest_streak: 0,
          average_ethics_score: 0,
          created_at: new Date().toISOString(),
        });

        // Award welcome achievement
        await serverClient.from('user_achievements').insert({
          user_id: data.session.user.id,
          achievement_id: 'welcome',
          unlocked_at: new Date().toISOString(),
        });
      }

      // Record login event for audit trail
      await serverClient.from('login_events').insert({
        user_id: data.session.user.id,
        provider: data.session.user.app_metadata?.provider || 'email',
        ip_address: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || null,
        user_agent: req.headers.get('user-agent') || null,
        created_at: new Date().toISOString(),
      });
    }

    // Create response with redirect
    const response = NextResponse.redirect(`${origin}${next}`);

    // Set auth cookie for SSR
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    };

    // Store session info in cookie
    response.cookies.set('sb-access-token', data.session!.access_token, cookieOptions);
    response.cookies.set('sb-refresh-token', data.session!.refresh_token, cookieOptions);

    return response;
  }

  // No code provided, redirect to home
  return NextResponse.redirect(`${origin}/`);
}
