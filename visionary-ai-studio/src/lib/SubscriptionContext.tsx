'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { PLANS, type PlanId, type CreditCost } from './stripe-client';

export interface SubscriptionState {
  plan: PlanId;
  status: 'active' | 'past_due' | 'cancelled' | 'none';
  credits: number;
  loading: boolean;
  stripeCustomerId: string | null;
}

interface SubscriptionContextType extends SubscriptionState {
  /** Open Stripe Checkout for a given plan */
  checkout: (planId: PlanId) => Promise<void>;
  /** Open Stripe Customer Portal to manage subscription */
  openPortal: () => Promise<void>;
  /** Buy extra credits (top-up) */
  buyCredits: () => Promise<void>;
  /** Check if user can afford an action */
  canAfford: (action: keyof CreditCost) => boolean;
  /** Get cost for an action based on current plan */
  getCost: (action: keyof CreditCost) => number;
  /** Spend credits for an action (optimistic, server confirms) */
  spendCredits: (action: keyof CreditCost, count?: number) => Promise<boolean>;
  /** Refresh subscription + credits data */
  refresh: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const { user, session } = useAuth();
  const [state, setState] = useState<SubscriptionState>({
    plan: 'free',
    status: 'none',
    credits: 0,
    loading: true,
    stripeCustomerId: null,
  });

  const fetchSubscription = useCallback(async () => {
    if (!user) {
      setState({ plan: 'free', status: 'none', credits: 5, loading: false, stripeCustomerId: null });
      return;
    }

    try {
      const res = await fetch('/api/subscription', {
        headers: { 'Authorization': `Bearer ${session?.access_token || ''}` },
      });

      if (res.ok) {
        const data = await res.json();
        setState({
          plan: data.plan || 'free',
          status: data.status || 'none',
          credits: data.credits ?? PLANS[(data.plan || 'free') as PlanId].monthlyCredits,
          loading: false,
          stripeCustomerId: data.stripeCustomerId || null,
        });
      } else {
        setState({ plan: 'free', status: 'none', credits: 5, loading: false, stripeCustomerId: null });
      }
    } catch {
      setState({ plan: 'free', status: 'none', credits: 5, loading: false, stripeCustomerId: null });
    }
  }, [user, session]);

  useEffect(() => {
    fetchSubscription();
  }, [fetchSubscription]);

  // Listen for subscription success from URL params
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    if (params.get('subscription') === 'success' || params.get('topup') === 'success') {
      window.history.replaceState({}, '', window.location.pathname);
      setTimeout(() => fetchSubscription(), 2000);
    }
  }, [fetchSubscription]);

  const checkout = async (planId: PlanId) => {
    if (!user) return;
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId, userId: user.id, userEmail: user.email }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch (error) {
      console.error('Checkout error:', error);
    }
  };

  const openPortal = async () => {
    if (!user) return;
    try {
      const res = await fetch('/api/stripe/portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch (error) {
      console.error('Portal error:', error);
    }
  };

  const buyCredits = async () => {
    if (!user || state.plan === 'free') return;
    try {
      const res = await fetch('/api/stripe/topup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, userEmail: user.email }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch (error) {
      console.error('Top-up error:', error);
    }
  };

  const getCost = (action: keyof CreditCost): number => {
    return PLANS[state.plan].costs[action];
  };

  const canAfford = (action: keyof CreditCost): boolean => {
    const cost = getCost(action);
    if (cost === 0) return false; // action not available on this plan
    return state.credits >= cost;
  };

  const spendCredits = async (action: keyof CreditCost, count = 1): Promise<boolean> => {
    const cost = getCost(action) * count;
    if (cost === 0 || state.credits < cost) return false;

    // Optimistic update
    setState(prev => ({ ...prev, credits: prev.credits - cost }));

    try {
      const res = await fetch('/api/credits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token || ''}`,
        },
        body: JSON.stringify({ action, count }),
      });

      if (!res.ok) {
        // Revert optimistic update
        setState(prev => ({ ...prev, credits: prev.credits + cost }));
        return false;
      }

      const data = await res.json();
      setState(prev => ({ ...prev, credits: data.remainingCredits }));
      return true;
    } catch {
      // Revert on error
      setState(prev => ({ ...prev, credits: prev.credits + cost }));
      return false;
    }
  };

  return (
    <SubscriptionContext.Provider
      value={{
        ...state,
        checkout,
        openPortal,
        buyCredits,
        canAfford,
        getCost,
        spendCredits,
        refresh: fetchSubscription,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (!context) throw new Error('useSubscription must be used within SubscriptionProvider');
  return context;
}
