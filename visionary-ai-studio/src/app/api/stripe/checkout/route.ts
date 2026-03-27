import { NextRequest, NextResponse } from 'next/server';
import { stripe, SERVER_PLANS, type PlanId } from '@/lib/stripe';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export async function POST(request: NextRequest) {
  try {
    // Verify Stripe key exists
    const stripeKey = (process.env.STRIPE_SECRET_KEY || '').trim();
    if (!stripeKey || !stripeKey.startsWith('sk_')) {
      console.error('Invalid STRIPE_SECRET_KEY:', stripeKey ? `starts with ${stripeKey.substring(0, 7)}...` : 'EMPTY');
      return NextResponse.json({ error: 'Stripe configuration error', details: 'Invalid Stripe secret key' }, { status: 500 });
    }

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
      console.error('Plan issue:', { planId, priceId: plan?.priceId, envPro: process.env.STRIPE_PRO_PRICE_ID?.substring(0, 10), envEnt: process.env.STRIPE_ENTERPRISE_PRICE_ID?.substring(0, 10) });
      return NextResponse.json({ error: 'Invalid plan or missing price ID', details: `Plan: ${planId}, PriceId: ${plan?.priceId || 'null'}` }, { status: 400 });
    }

    console.log('Creating checkout for:', { planId, priceId: plan.priceId, userId: userId.substring(0, 8) });

    // Check if user already has a Stripe customer ID
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('stripe_customer_id')
      .eq('id', userId)
      .single();

    let customerId = profile?.stripe_customer_id;

    // Create Stripe customer if not exists
    if (!customerId) {
      console.log('Creating new Stripe customer...');
      const customer = await stripe.customers.create({
        email: userEmail,
        metadata: { supabase_user_id: userId },
      });
      customerId = customer.id;
      console.log('Customer created:', customerId);

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
    const origin = request.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL || 'https://mo3inai.com';
    console.log('Creating checkout session with origin:', origin);

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
      success_url: `${origin}?subscription=success`,
      cancel_url: `${origin}?subscription=cancelled`,
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

    console.log('Checkout session created:', session.id);
    return NextResponse.json({ url: session.url });
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : String(error);
    const errType = error instanceof Error ? error.constructor.name : 'Unknown';
    console.error('Checkout error type:', errType, 'message:', errMsg);
    return NextResponse.json(
      { error: 'Failed to create checkout session', details: `[${errType}] ${errMsg}` },
      { status: 500 }
    );
  }
}
