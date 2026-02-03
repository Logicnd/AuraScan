import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import Stripe from 'stripe';

// Lazy initialize Stripe only when API key is available
const getStripe = () => {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key, {
    apiVersion: '2025-01-27.acacia' as any,
  });
};

export async function POST(req: NextRequest) {
  const stripe = getStripe();
  
  // If Stripe isn't configured, return a helpful message
  if (!stripe) {
    return NextResponse.json(
      { error: 'Stripe not configured - add STRIPE_SECRET_KEY to .env.local' },
      { status: 503 }
    );
  }

  try {
    const body = await req.text();
    const signature = req.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing signature' },
        { status: 400 }
      );
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    const supabase = createServerClient();

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as any;
        const userId = session.metadata?.userId;
        const customerId = session.customer as string;
        const subscriptionId = session.subscription as string;

        if (userId && subscriptionId) {
          // Get subscription details
          const subscription = await stripe.subscriptions.retrieve(subscriptionId) as any;
          const priceId = subscription.items?.data?.[0]?.price?.id;
          
          // Determine tier from price ID
          let tier: 'pro' | 'team' | 'enterprise' = 'pro';
          if (priceId === process.env.STRIPE_TEAM_PRICE_ID) tier = 'team';
          if (priceId === process.env.STRIPE_ENTERPRISE_PRICE_ID) tier = 'enterprise';

          // Update user profile
          await supabase
            .from('profiles')
            .update({
              is_premium: true,
              subscription_tier: tier,
              stripe_customer_id: customerId,
            })
            .eq('id', userId);

          // Create subscription record
          const periodStart = subscription.current_period_start 
            ? new Date(subscription.current_period_start * 1000).toISOString()
            : new Date().toISOString();
          const periodEnd = subscription.current_period_end
            ? new Date(subscription.current_period_end * 1000).toISOString()
            : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

          await supabase.from('subscriptions').upsert({
            user_id: userId,
            stripe_subscription_id: subscriptionId,
            stripe_customer_id: customerId,
            stripe_price_id: priceId,
            status: subscription.status,
            tier,
            current_period_start: periodStart,
            current_period_end: periodEnd,
            cancel_at_period_end: subscription.cancel_at_period_end || false,
          });

          // Award achievement for first subscription (use upsert to avoid conflicts)
          const { error: achievementError } = await supabase
            .from('user_achievements')
            .upsert({
              user_id: userId,
              achievement_id: 'first_subscription',
              unlocked_at: new Date().toISOString(),
            }, {
              onConflict: 'user_id,achievement_id',
              ignoreDuplicates: true,
            });

          if (achievementError) {
            console.warn('Could not add achievement:', achievementError);
          }

          console.log(`✅ Subscription created for user ${userId}`);
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as any;
        const customerId = subscription.customer as string;

        // Get user by stripe customer ID
        const { data: profile } = await supabase
          .from('profiles')
          .select('id')
          .eq('stripe_customer_id', customerId)
          .single();

        if (profile) {
          const priceId = subscription.items?.data?.[0]?.price?.id;
          let tier: 'pro' | 'team' | 'enterprise' = 'pro';
          if (priceId === process.env.STRIPE_TEAM_PRICE_ID) tier = 'team';
          if (priceId === process.env.STRIPE_ENTERPRISE_PRICE_ID) tier = 'enterprise';

          const periodStart = subscription.current_period_start 
            ? new Date(subscription.current_period_start * 1000).toISOString()
            : new Date().toISOString();
          const periodEnd = subscription.current_period_end
            ? new Date(subscription.current_period_end * 1000).toISOString()
            : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

          await supabase
            .from('subscriptions')
            .update({
              status: subscription.status,
              tier,
              stripe_price_id: priceId,
              current_period_start: periodStart,
              current_period_end: periodEnd,
              cancel_at_period_end: subscription.cancel_at_period_end || false,
            })
            .eq('user_id', profile.id);

          // Update premium status based on subscription status
          const isActive = ['active', 'trialing'].includes(subscription.status);
          await supabase
            .from('profiles')
            .update({
              is_premium: isActive,
              subscription_tier: isActive ? tier : null,
            })
            .eq('id', profile.id);
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as any;
        const customerId = subscription.customer as string;

        // Get user by stripe customer ID
        const { data: profile } = await supabase
          .from('profiles')
          .select('id')
          .eq('stripe_customer_id', customerId)
          .single();

        if (profile) {
          await supabase
            .from('subscriptions')
            .update({
              status: 'canceled',
              canceled_at: new Date().toISOString(),
            })
            .eq('user_id', profile.id);

          await supabase
            .from('profiles')
            .update({
              is_premium: false,
              subscription_tier: null,
            })
            .eq('id', profile.id);

          console.log(`❌ Subscription canceled for user ${profile.id}`);
        }
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as any;
        const customerId = invoice.customer as string;
        const subscriptionId = invoice.subscription as string;

        if (subscriptionId) {
          // Get user by stripe customer ID
          const { data: profile } = await supabase
            .from('profiles')
            .select('id')
            .eq('stripe_customer_id', customerId)
            .single();

          if (profile) {
            // Update subscription period
            const subscription = await stripe.subscriptions.retrieve(subscriptionId) as any;

            const periodStart = subscription.current_period_start 
              ? new Date(subscription.current_period_start * 1000).toISOString()
              : new Date().toISOString();
            const periodEnd = subscription.current_period_end
              ? new Date(subscription.current_period_end * 1000).toISOString()
              : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

            await supabase
              .from('subscriptions')
              .update({
                current_period_start: periodStart,
                current_period_end: periodEnd,
              })
              .eq('user_id', profile.id);
          }
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as any;
        const customerId = invoice.customer as string;

        // Get user by stripe customer ID
        const { data: profile } = await supabase
          .from('profiles')
          .select('id, email')
          .eq('stripe_customer_id', customerId)
          .single();

        if (profile) {
          // Log the failed payment (in production, send email notification)
          console.warn(`⚠️ Payment failed for user ${profile.id} (${profile.email})`);
        }
        break;
      }
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}
