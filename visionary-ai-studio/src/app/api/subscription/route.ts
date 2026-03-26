import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

/**
 * GET /api/subscription — Get current user's subscription + credit balance
 */
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json({ plan: 'free', status: 'none', credits: 5 });
    }

    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    if (authError || !user) {
      return NextResponse.json({ plan: 'free', status: 'none', credits: 5 });
    }

    // Get profile with credits
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('plan, credits, stripe_customer_id')
      .eq('id', user.id)
      .single();

    if (!profile) {
      // Auto-create profile if missing
      const defaultCredits = 5;
      await supabaseAdmin.from('profiles').insert({
        id: user.id,
        email: user.email,
        full_name: user.user_metadata?.full_name || '',
        plan: 'free',
        credits: defaultCredits,
      });
      return NextResponse.json({ plan: 'free', status: 'none', credits: defaultCredits, stripeCustomerId: null });
    }

    // Get active subscription
    const { data: subscription } = await supabaseAdmin
      .from('subscriptions')
      .select('status, plan_id, current_period_end')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single();

    return NextResponse.json({
      plan: subscription?.plan_id || profile.plan || 'free',
      status: subscription?.status || 'none',
      credits: profile.credits ?? 5,
      stripeCustomerId: profile.stripe_customer_id || null,
      currentPeriodEnd: subscription?.current_period_end || null,
    });
  } catch (error) {
    console.error('Subscription fetch error:', error);
    return NextResponse.json({ plan: 'free', status: 'none', credits: 5 });
  }
}
