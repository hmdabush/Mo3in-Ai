import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

// Credits per plan for top-up
const TOPUP_CREDITS: Record<string, number> = {
  pro: 100,
  enterprise: 150,
};

const TOPUP_PRICE = 500; // $5.00 in cents

/**
 * POST /api/stripe/topup — Create a one-time payment session for extra credits
 */
export async function POST(request: NextRequest) {
  try {
    const { userId, userEmail } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
    }

    // Get user's current plan
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('plan, stripe_customer_id')
      .eq('id', userId)
      .single();

    if (!profile || profile.plan === 'free') {
      return NextResponse.json({
        error: 'شحن الكريدت متاح فقط للمشتركين في الخطة الاحترافية أو المؤسسات',
      }, { status: 403 });
    }

    const creditsToAdd = TOPUP_CREDITS[profile.plan] || 100;

    // Get or create Stripe customer
    let customerId = profile.stripe_customer_id;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: userEmail,
        metadata: { supabase_user_id: userId },
      });
      customerId = customer.id;

      await supabaseAdmin
        .from('profiles')
        .update({ stripe_customer_id: customerId })
        .eq('id', userId);
    }

    // Create one-time checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            unit_amount: TOPUP_PRICE,
            product_data: {
              name: `شحن ${creditsToAdd} كريدت — Mo3in AI`,
              description: `إضافة ${creditsToAdd} كريدت إلى رصيدك`,
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        supabase_user_id: userId,
        type: 'credit_topup',
        credits: creditsToAdd.toString(),
      },
      success_url: `${request.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}?topup=success`,
      cancel_url: `${request.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}?topup=cancelled`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Top-up checkout error:', error);
    return NextResponse.json({ error: 'Failed to create top-up session' }, { status: 500 });
  }
}
