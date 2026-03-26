import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-02-25.clover',
  typescript: true,
});

/** Server-side plan config with Stripe price IDs */
export const SERVER_PLANS = {
  free: {
    id: 'free' as const,
    priceId: null,
    monthlyCredits: 5,
  },
  pro: {
    id: 'pro' as const,
    priceId: process.env.STRIPE_PRO_PRICE_ID || null,
    monthlyCredits: 500,
  },
  enterprise: {
    id: 'enterprise' as const,
    priceId: process.env.STRIPE_ENTERPRISE_PRICE_ID || null,
    monthlyCredits: 2000,
  },
} as const;

/** Stripe price ID for credit top-up (one-time payment) */
export const TOPUP_PRICES = {
  pro: process.env.STRIPE_TOPUP_PRO_PRICE_ID || null,       // $5 = 100 credits
  enterprise: process.env.STRIPE_TOPUP_ENT_PRICE_ID || null, // $5 = 150 credits
} as const;

export type PlanId = 'free' | 'pro' | 'enterprise';
