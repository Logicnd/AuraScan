import { NextRequest, NextResponse } from 'next/server';
import { createCheckoutSession, createCustomer, getCustomerByEmail } from '@/lib/stripe/client';
import { createServerClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { priceId, userId, successUrl, cancelUrl, email } = body;

    if (!priceId) {
      return NextResponse.json(
        { error: 'Price ID is required' },
        { status: 400 }
      );
    }

    // Get or create Stripe customer
    let customerId: string;
    
    if (userId) {
      const supabase = createServerClient();
      const { data: profile } = await supabase
        .from('profiles')
        .select('stripe_customer_id, email')
        .eq('id', userId)
        .single();
      
      if (profile?.stripe_customer_id) {
        customerId = profile.stripe_customer_id;
      } else {
        // Create new customer
        const userEmail = profile?.email || email || `user-${userId}@aurascan.ai`;
        let customer = await getCustomerByEmail(userEmail);
        if (!customer) {
          customer = await createCustomer(userEmail, userId);
        }
        customerId = customer.id;
        
        // Save customer ID to profile
        await supabase
          .from('profiles')
          .update({ stripe_customer_id: customerId })
          .eq('id', userId);
      }
    } else {
      // Anonymous checkout
      const tempEmail = email || `anon-${Date.now()}@aurascan.ai`;
      const customer = await createCustomer(tempEmail, 'anonymous');
      customerId = customer.id;
    }

    const session = await createCheckoutSession({
      customerId,
      priceId,
      userId: userId || 'anonymous',
      successUrl: successUrl || `${process.env.NEXT_PUBLIC_APP_URL}/profile?subscription=success`,
      cancelUrl: cancelUrl || `${process.env.NEXT_PUBLIC_APP_URL}/pricing?canceled=true`,
    });

    return NextResponse.json({ url: session.url });

  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
