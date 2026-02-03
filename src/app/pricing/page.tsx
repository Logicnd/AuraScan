'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MainLayout } from '@/components/layout/main-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useUserStore } from '@/store';
import { cn } from '@/lib/utils';

const CheckIcon = () => (
  <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const StarIcon = () => (
  <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

interface PricingTier {
  id: string;
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  features: string[];
  highlighted?: boolean;
  badge?: string;
  priceId: {
    monthly: string;
    yearly: string;
  };
}

const pricingTiers: PricingTier[] = [
  {
    id: 'free',
    name: 'Free',
    description: 'Perfect for trying out AuraScan',
    monthlyPrice: 0,
    yearlyPrice: 0,
    features: [
      '10 scans per day',
      'Basic ethics analysis',
      'Community access',
      'Public templates',
      'Basic badges & achievements',
    ],
    priceId: { monthly: '', yearly: '' },
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'For power users and professionals',
    monthlyPrice: 9.99,
    yearlyPrice: 99,
    highlighted: true,
    badge: 'Most Popular',
    features: [
      'Unlimited scans',
      'Advanced ethics analysis',
      'Priority support',
      'Private templates',
      'API access (1000 calls/month)',
      'Detailed compliance reports',
      'All badges & achievements',
      'Custom profile themes',
      'Export scan history',
    ],
    priceId: {
      monthly: process.env.NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PRICE_ID || '',
      yearly: process.env.NEXT_PUBLIC_STRIPE_PRO_YEARLY_PRICE_ID || '',
    },
  },
  {
    id: 'team',
    name: 'Team',
    description: 'For teams and organizations',
    monthlyPrice: 29.99,
    yearlyPrice: 299,
    features: [
      'Everything in Pro',
      'Up to 10 team members',
      'Team analytics dashboard',
      'Shared template library',
      'API access (10000 calls/month)',
      'Custom branding',
      'Guild creation & management',
      'Team leaderboards',
      'Admin controls',
    ],
    priceId: {
      monthly: process.env.NEXT_PUBLIC_STRIPE_TEAM_MONTHLY_PRICE_ID || '',
      yearly: process.env.NEXT_PUBLIC_STRIPE_TEAM_YEARLY_PRICE_ID || '',
    },
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'Custom solutions for large organizations',
    monthlyPrice: -1, // Custom pricing
    yearlyPrice: -1,
    features: [
      'Everything in Team',
      'Unlimited team members',
      'Dedicated account manager',
      'Custom AI model training',
      'On-premise deployment option',
      'SLA guarantees',
      'Advanced security features',
      'Custom integrations',
      'White-label options',
    ],
    priceId: { monthly: '', yearly: '' },
  },
];

export default function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('yearly');
  const [loading, setLoading] = useState<string | null>(null);
  const { user } = useUserStore();

  const handleSubscribe = async (tier: PricingTier) => {
    if (tier.id === 'free') return;
    if (tier.id === 'enterprise') {
      window.location.href = 'mailto:enterprise@aurascan.ai?subject=Enterprise%20Inquiry';
      return;
    }

    setLoading(tier.id);

    try {
      const priceId = billingPeriod === 'monthly' ? tier.priceId.monthly : tier.priceId.yearly;
      
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId,
          userId: user?.id,
          successUrl: `${window.location.origin}/profile?subscription=success`,
          cancelUrl: `${window.location.origin}/pricing?canceled=true`,
        }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('Failed to create checkout session');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Failed to start checkout. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  const savings = (tier: PricingTier) => {
    if (tier.monthlyPrice <= 0) return 0;
    const yearlyMonthly = tier.yearlyPrice / 12;
    return Math.round((1 - yearlyMonthly / tier.monthlyPrice) * 100);
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Choose Your Plan
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Unlock the full power of ethical AI analysis with AuraScan Pro
            </p>

            {/* Billing toggle */}
            <div className="flex items-center justify-center gap-4 mt-8">
              <span className={cn(
                'text-sm font-medium transition-colors',
                billingPeriod === 'monthly' ? 'text-white' : 'text-slate-400'
              )}>
                Monthly
              </span>
              <button
                onClick={() => setBillingPeriod(p => p === 'monthly' ? 'yearly' : 'monthly')}
                className={cn(
                  'relative w-14 h-7 rounded-full transition-colors',
                  billingPeriod === 'yearly' ? 'bg-violet-600' : 'bg-slate-600'
                )}
              >
                <motion.div
                  className="absolute top-1 w-5 h-5 rounded-full bg-white"
                  animate={{ left: billingPeriod === 'yearly' ? 32 : 4 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              </button>
              <span className={cn(
                'text-sm font-medium transition-colors',
                billingPeriod === 'yearly' ? 'text-white' : 'text-slate-400'
              )}>
                Yearly
              </span>
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                Save up to 17%
              </Badge>
            </div>
          </motion.div>

          {/* Pricing cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pricingTiers.map((tier, index) => (
              <motion.div
                key={tier.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={cn(
                  'relative h-full transition-all duration-300',
                  tier.highlighted
                    ? 'border-violet-500 bg-gradient-to-b from-violet-500/10 to-slate-800/50 scale-105 shadow-xl shadow-violet-500/20'
                    : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
                )}>
                  {tier.badge && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="bg-violet-600 text-white px-4 py-1 flex items-center gap-1">
                        <StarIcon />
                        {tier.badge}
                      </Badge>
                    </div>
                  )}

                  <CardContent className="p-6 flex flex-col h-full">
                    <div className="mb-6">
                      <h3 className="text-xl font-bold text-white mb-2">{tier.name}</h3>
                      <p className="text-sm text-slate-400">{tier.description}</p>
                    </div>

                    <div className="mb-6">
                      {tier.monthlyPrice === -1 ? (
                        <div className="text-3xl font-bold text-white">Custom</div>
                      ) : tier.monthlyPrice === 0 ? (
                        <div className="text-4xl font-bold text-white">Free</div>
                      ) : (
                        <>
                          <div className="flex items-baseline gap-1">
                            <span className="text-4xl font-bold text-white">
                              ${billingPeriod === 'monthly' ? tier.monthlyPrice : (tier.yearlyPrice / 12).toFixed(2)}
                            </span>
                            <span className="text-slate-400">/month</span>
                          </div>
                          {billingPeriod === 'yearly' && savings(tier) > 0 && (
                            <div className="text-sm text-green-400 mt-1">
                              Save {savings(tier)}% with yearly billing
                            </div>
                          )}
                          {billingPeriod === 'yearly' && (
                            <div className="text-sm text-slate-500 mt-1">
                              Billed ${tier.yearlyPrice}/year
                            </div>
                          )}
                        </>
                      )}
                    </div>

                    <ul className="space-y-3 mb-8 flex-grow">
                      {tier.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckIcon />
                          <span className="text-sm text-slate-300">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Button
                      onClick={() => handleSubscribe(tier)}
                      disabled={loading === tier.id || (tier.id === 'free')}
                      className={cn(
                        'w-full',
                        tier.highlighted
                          ? 'bg-violet-600 hover:bg-violet-700 text-white'
                          : tier.id === 'free'
                          ? 'bg-slate-700 text-slate-400 cursor-default'
                          : 'bg-slate-700 hover:bg-slate-600 text-white'
                      )}
                    >
                      {loading === tier.id ? (
                        <span className="flex items-center gap-2">
                          <motion.div
                            className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          />
                          Processing...
                        </span>
                      ) : tier.id === 'free' ? (
                        'Current Plan'
                      ) : tier.id === 'enterprise' ? (
                        'Contact Sales'
                      ) : (
                        `Get ${tier.name}`
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* FAQ Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-20"
          >
            <h2 className="text-2xl font-bold text-white text-center mb-8">
              Frequently Asked Questions
            </h2>
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {[
                {
                  q: 'Can I cancel anytime?',
                  a: 'Yes! You can cancel your subscription at any time. You\'ll continue to have access until the end of your billing period.',
                },
                {
                  q: 'What payment methods do you accept?',
                  a: 'We accept all major credit cards, including Visa, Mastercard, and American Express. We also support Apple Pay and Google Pay.',
                },
                {
                  q: 'Is there a free trial?',
                  a: 'The free tier lets you try AuraScan with 10 scans per day. No credit card required to get started!',
                },
                {
                  q: 'Can I switch plans later?',
                  a: 'Absolutely! You can upgrade or downgrade your plan at any time. Changes take effect immediately.',
                },
              ].map((faq, i) => (
                <Card key={i} className="border-slate-700 bg-slate-800/50">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-white mb-2">{faq.q}</h3>
                    <p className="text-sm text-slate-400">{faq.a}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-12 text-center"
          >
            <div className="flex items-center justify-center gap-8 text-slate-500">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span className="text-sm">Secure payments via Stripe</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span className="text-sm">30-day money back guarantee</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </MainLayout>
  );
}
