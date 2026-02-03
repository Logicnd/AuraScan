// ╔════════════════════════════════════════════════════════════════════════════╗
// ║                    STRIPE PAYMENT CLIENT                                    ║
// ║                     AuraScan Payment Processing                             ║
// ╠════════════════════════════════════════════════════════════════════════════╣
// ║                                                                             ║
// ║  SETUP REQUIREMENTS:                                                        ║
// ║  1. Create Stripe account: https://dashboard.stripe.com/register            ║
// ║  2. Get API keys: https://dashboard.stripe.com/apikeys                      ║
// ║  3. Create products: https://dashboard.stripe.com/products                  ║
// ║  4. Set up webhooks: https://dashboard.stripe.com/webhooks                  ║
// ║                                                                             ║
// ║  REQUIRED ENV VARS:                                                         ║
// ║  • STRIPE_SECRET_KEY - Server-side secret key (sk_test_... or sk_live_...)  ║
// ║  • NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY - Client-side key (pk_test_...)       ║
// ║  • STRIPE_WEBHOOK_SECRET - Webhook signing secret (whsec_...)               ║
// ║  • STRIPE_PRICE_ID_MONTHLY - Price ID for monthly plan (price_...)          ║
// ║  • STRIPE_PRICE_ID_YEARLY - Price ID for yearly plan (price_...)            ║
// ║                                                                             ║
// ║  TESTING:                                                                   ║
// ║  • Use test keys (sk_test_*, pk_test_*) during development                  ║
// ║  • Test card: 4242 4242 4242 4242, any future date, any CVC                 ║
// ║  • Decline card: 4000 0000 0000 0002                                        ║
// ║  • 3D Secure: 4000 0027 6000 3184                                           ║
// ║                                                                             ║
// ╚════════════════════════════════════════════════════════════════════════════╝

import Stripe from 'stripe';

// ═══════════════════════════════════════════════════════════════════════════════
// STRIPE CLIENT INITIALIZATION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Lazy-loaded Stripe client instance
 * Only initializes when first used to avoid build-time errors
 * 
 * @env STRIPE_SECRET_KEY (required)
 * @get https://dashboard.stripe.com/apikeys → Secret key
 * @format sk_test_xxxxx (test) or sk_live_xxxxx (production)
 * @security NEVER expose this key in client-side code!
 */
let stripeInstance: Stripe | null = null;

const getStripe = (): Stripe => {
  if (!stripeInstance) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      throw new Error('STRIPE_SECRET_KEY not configured - add it to .env.local');
    }
    stripeInstance = new Stripe(key, {
      apiVersion: '2025-01-27.acacia' as any,
      typescript: true,
    });
  }
  return stripeInstance;
};

// ═══════════════════════════════════════════════════════════════════════════════
// PRICE ID CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Stripe Price IDs for subscription plans
 * 
 * HOW TO GET THESE:
 * 1. Go to: https://dashboard.stripe.com/products
 * 2. Click "Add product"
 * 3. Create "AuraScan Pro" with:
 *    - Monthly recurring price: $2.99/month
 *    - Yearly recurring price: $29.99/year
 * 4. After creating, click on each price
 * 5. Copy the Price ID (starts with price_)
 * 
 * @env STRIPE_PRICE_ID_MONTHLY - Monthly subscription price ID
 * @env STRIPE_PRICE_ID_YEARLY - Yearly subscription price ID
 * @format price_1Nxxxxxxxxxxxxxxxxxx
 */
const PRICES = {
  monthly: process.env.STRIPE_PRICE_ID_MONTHLY || '',
  yearly: process.env.STRIPE_PRICE_ID_YEARLY || '',
};

// ═══════════════════════════════════════════════════════════════════════════════
// CONFIGURATION HELPERS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Check if Stripe is properly configured
 * Returns false if using placeholder values
 */
export const isStripeConfigured = () => {
  return !!(process.env.STRIPE_SECRET_KEY && 
    process.env.STRIPE_SECRET_KEY !== 'your_stripe_secret_key');
};

// ═══════════════════════════════════════════════════════════════════════════════
// CUSTOMER MANAGEMENT
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Create a new Stripe customer
 * Links the Stripe customer to Supabase user via metadata
 */
export async function createCustomer(email: string, userId: string, name?: string) {
  return getStripe().customers.create({
    email,
    name,
    metadata: {
      // This links Stripe customer to your database
      supabase_user_id: userId,
    },
  });
}

/**
 * Retrieve a customer by Stripe customer ID
 */
export async function getCustomer(customerId: string) {
  return getStripe().customers.retrieve(customerId);
}

/**
 * Find a customer by email address
 * Returns null if no customer found
 */
export async function getCustomerByEmail(email: string) {
  const customers = await getStripe().customers.list({ email, limit: 1 });
  return customers.data[0] || null;
}

// ═══════════════════════════════════════════════════════════════════════════════
// CHECKOUT & SUBSCRIPTION MANAGEMENT
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Create a Stripe Checkout Session for subscription purchase
 * 
 * @param customerId - Stripe customer ID (cus_xxx)
 * @param priceId - Price ID from PRICES constant (price_xxx)
 * @param successUrl - Where to redirect after successful payment
 * @param cancelUrl - Where to redirect if user cancels
 * @param userId - Your database user ID (stored in metadata)
 * @param trial - Whether to include a 7-day free trial
 */
export async function createCheckoutSession(params: {
  customerId: string;
  priceId: string;
  successUrl: string;
  cancelUrl: string;
  userId: string;
  trial?: boolean;
}) {
  const session = await getStripe().checkout.sessions.create({
    customer: params.customerId,
    payment_method_types: ['card'],
    line_items: [
      {
        price: params.priceId,
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
    subscription_data: params.trial ? {
      // 7-day free trial - users aren't charged until trial ends
      // @configurable Change trial_period_days for longer/shorter trials
      trial_period_days: 7,
      metadata: {
        supabase_user_id: params.userId,
      },
    } : {
      metadata: {
        supabase_user_id: params.userId,
      },
    },
    metadata: {
      supabase_user_id: params.userId,
    },
    // Allow users to enter promo/coupon codes
    // Create coupons at: https://dashboard.stripe.com/coupons
    allow_promotion_codes: true,
  });

  return session;
}

/**
 * Create a billing portal session for subscription management
 * Allows users to:
 * - Update payment method
 * - Download invoices
 * - Cancel subscription
 * 
 * Configure portal at: https://dashboard.stripe.com/settings/billing/portal
 */
export async function createBillingPortalSession(customerId: string, returnUrl: string) {
  return getStripe().billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });
}

/**
 * Get subscription details
 */
export async function getSubscription(subscriptionId: string) {
  return getStripe().subscriptions.retrieve(subscriptionId);
}

/**
 * Cancel a subscription
 * @param immediately - If true, cancels now. If false, cancels at period end.
 */
export async function cancelSubscription(subscriptionId: string, immediately = false) {
  if (immediately) {
    return getStripe().subscriptions.cancel(subscriptionId);
  }
  // Cancel at period end = user keeps access until billing period ends
  return getStripe().subscriptions.update(subscriptionId, {
    cancel_at_period_end: true,
  });
}

/**
 * Resume a subscription that was set to cancel at period end
 */
export async function resumeSubscription(subscriptionId: string) {
  return getStripe().subscriptions.update(subscriptionId, {
    cancel_at_period_end: false,
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// INVOICE MANAGEMENT
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Get customer's invoice history
 */
export async function getInvoices(customerId: string, limit = 10) {
  return getStripe().invoices.list({
    customer: customerId,
    limit,
  });
}

/**
 * Get upcoming/draft invoice (for showing what they'll be charged next)
 */
export async function getUpcomingInvoice(customerId: string) {
  try {
    return await getStripe().invoices.list({ customer: customerId, limit: 1, status: 'draft' });
  } catch {
    return null;
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// WEBHOOK HANDLING
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Verify and construct a webhook event from Stripe
 * 
 * WEBHOOK SETUP:
 * 1. Go to: https://dashboard.stripe.com/webhooks
 * 2. Click "Add endpoint"
 * 3. Endpoint URL: https://yourdomain.com/api/webhooks/stripe
 * 4. Select these events:
 *    - checkout.session.completed
 *    - customer.subscription.created
 *    - customer.subscription.updated
 *    - customer.subscription.deleted
 *    - invoice.payment_succeeded
 *    - invoice.payment_failed
 * 5. Copy the "Signing secret" → STRIPE_WEBHOOK_SECRET env var
 * 
 * LOCAL TESTING:
 * 1. Install Stripe CLI: https://stripe.com/docs/stripe-cli
 * 2. Run: stripe listen --forward-to localhost:3000/api/webhooks/stripe
 * 3. Use the temporary webhook secret shown in terminal
 * 
 * @env STRIPE_WEBHOOK_SECRET
 * @format whsec_xxxxxxxxxxxxxxxxxxxxxxxx
 */
export function constructWebhookEvent(payload: Buffer, signature: string) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    throw new Error('Stripe webhook secret not configured');
  }
  
  return getStripe().webhooks.constructEvent(payload, signature, webhookSecret);
}

// ═══════════════════════════════════════════════════════════════════════════════
// PRICE HELPERS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Get price ID for a plan type
 */
export function getPriceId(plan: 'monthly' | 'yearly') {
  return PRICES[plan];
}

/**
 * Get all active subscription prices
 * Returns price objects with product details expanded
 */
export async function getPrices() {
  const prices = await getStripe().prices.list({
    active: true,
    type: 'recurring',
    expand: ['data.product'],
  });
  
  return prices.data.filter(price => 
    price.id === PRICES.monthly || price.id === PRICES.yearly
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// USAGE-BASED BILLING (For API Access Feature)
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Report API usage for metered billing
 * 
 * SETUP FOR USAGE BILLING:
 * 1. Create a metered price: https://dashboard.stripe.com/products
 *    - Set billing scheme to "Usage-based"
 *    - Set usage type to "Metered"
 * 2. Create a meter: https://dashboard.stripe.com/billing/meters
 *    - Name it "api_usage"
 * 3. Link the meter to your price
 */
export async function reportUsage(subscriptionItemId: string, quantity: number) {
  return getStripe().billing.meterEvents.create({
    event_name: 'api_usage',
    payload: {
      value: String(quantity),
      stripe_customer_id: subscriptionItemId,
    },
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// REFUNDS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Create a refund for a charge
 * @param chargeId - The charge ID to refund (ch_xxx)
 * @param amount - Amount in cents, or undefined for full refund
 */
export async function createRefund(chargeId: string, amount?: number) {
  return getStripe().refunds.create({
    charge: chargeId,
    amount, // If undefined, refunds full amount
  });
}

export { getStripe, PRICES };
export default getStripe;
