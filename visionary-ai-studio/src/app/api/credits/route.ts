import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

// Credit costs per plan (must match stripe-client.ts)
const PLAN_COSTS: Record<string, Record<string, number>> = {
  free: { text: 1, image: 3, video: 0, voice: 2, website: 0, marketing: 2 },
  pro: { text: 1, image: 2, video: 10, voice: 1, website: 5, marketing: 2 },
  enterprise: { text: 1, image: 2, video: 8, voice: 1, website: 3, marketing: 1 },
};

/**
 * POST /api/credits — Spend credits for an action
 * Body: { action: string, count?: number }
 */
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { action, count = 1 } = await request.json();

    if (!action || !PLAN_COSTS.free[action]) {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    // Get user profile
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('plan, credits')
      .eq('id', user.id)
      .single();

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const plan = profile.plan || 'free';
    const costs = PLAN_COSTS[plan] || PLAN_COSTS.free;
    const cost = costs[action] * count;

    // Check if action is available on this plan
    if (costs[action] === 0) {
      return NextResponse.json({
        error: 'هذه الميزة غير متاحة في خطتك الحالية. قم بالترقية للوصول إليها.',
        code: 'FEATURE_LOCKED',
      }, { status: 403 });
    }

    // Check if user has enough credits
    const currentCredits = profile.credits ?? 0;
    if (currentCredits < cost) {
      return NextResponse.json({
        error: 'رصيد الكريدت غير كافٍ. قم بشحن رصيدك أو ترقية خطتك.',
        code: 'INSUFFICIENT_CREDITS',
        required: cost,
        available: currentCredits,
      }, { status: 402 });
    }

    // Deduct credits
    const newCredits = currentCredits - cost;
    const { error: updateError } = await supabaseAdmin
      .from('profiles')
      .update({ credits: newCredits })
      .eq('id', user.id);

    if (updateError) {
      return NextResponse.json({ error: 'Failed to deduct credits' }, { status: 500 });
    }

    // Log the usage
    await supabaseAdmin.from('credit_transactions').insert({
      user_id: user.id,
      action,
      amount: -cost,
      balance_after: newCredits,
      description: `استخدام ${action} × ${count}`,
    });

    return NextResponse.json({
      success: true,
      spent: cost,
      remainingCredits: newCredits,
    });
  } catch (error) {
    console.error('Credits error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
