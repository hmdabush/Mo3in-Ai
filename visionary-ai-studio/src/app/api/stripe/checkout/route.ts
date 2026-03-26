import { NextRequest, NextResponse } from 'next/server';
import { stripe, SERVER_PLANS, type PlanId } from '@/lib/stripe';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { planId, userId, userEmail } = body as {
      planId: PlanId;
      userId: string;
      userEmail: string;
    };

    if (!planId || !userId || !userEmail) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const plan = SERVER_PLANS[planId];
    if (!plan || !plan.priceId) {
      return NextResponse.json({ error: 'Invalid plan or free plan selected' }, { status: 400 });
    }

    // Check if user already has a Stripe customer ID
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('stripe_customer_id')
      .eq('id', userId)
      .single();

    let customerId = profile?.stripe_customer_id;

    // Create Stripe customer if not exists
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: userEmail,
        metadata: { supabase_user_id: userId },
      });
      customerId = customer.id;

      // Save customer ID to Supabase
      await supabaseAdmin
        .from('profiles')
        .upsert({
          id: userId,
          stripe_customer_id: customerId,
          email: userEmail,
        });
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: plan.priceId,
          quantity: 1,
        },
      ],
      success_url: `${request.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL}?subscription=success`,
      cancel_url: `${request.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL}?subscription=cancelled`,
      metadata: {
        supabase_user_id: userId,
        plan_id: planId,
      },
      subscription_data: {
        metadata: {
          supabase_user_id: userId,
          plan_id: planId,
        },
      },
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
