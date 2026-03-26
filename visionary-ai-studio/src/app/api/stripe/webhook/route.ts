import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

// Monthly credits per plan
const PLAN_CREDITS: Record<string, number> = {
  free: 5,
  pro: 500,
  enterprise: 2000,
};

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.supabase_user_id;
        const type = session.metadata?.type;

        // Handle credit top-up (one-time payment)
        if (type === 'credit_topup' && userId) {
          const creditsToAdd = parseInt(session.metadata?.credits || '0', 10);
          if (creditsToAdd > 0) {
            // Get current credits
            const { data: profile } = await supabaseAdmin
              .from('profiles')
              .select('credits')
              .eq('id', userId)
              .single();

            const currentCredits = profile?.credits ?? 0;
            const newCredits = currentCredits + creditsToAdd;

            await supabaseAdmin
              .from('profiles')
              .update({ credits: newCredits })
              .eq('id', userId);

            // Log transaction
            await supabaseAdmin.from('credit_transactions').insert({
              user_id: userId,
              action: 'topup',
              amount: creditsToAdd,
              balance_after: newCredits,
              description: `شحن ${creditsToAdd} كريدت`,
            });
          }
          break;
        }

        // Handle subscription checkout
        const planId = session.metadata?.plan_id;
        if (userId && planId) {
          const monthlyCredits = PLAN_CREDITS[planId] || 5;

          await supabaseAdmin.from('subscriptions').upsert({
            user_id: userId,
            plan_id: planId,
            stripe_subscription_id: session.subscription as string,
            stripe_customer_id: session.customer as string,
            status: 'active',
            current_period_start: new Date().toISOString(),
            current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          });

          // Update profile plan + reset credits to plan's monthly allocation
          await supabaseAdmin.from('profiles').upsert({
            id: userId,
            plan: planId,
            credits: monthlyCredits,
            stripe_customer_id: session.customer as string,
          });

          // Log credit allocation
          await supabaseAdmin.from('credit_transactions').insert({
            user_id: userId,
            action: 'subscription',
            amount: monthlyCredits,
            balance_after: monthlyCredits,
            description: `اشتراك ${planId} — ${monthlyCredits} كريدت شهري`,
          });
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const subAny = event.data.object as unknown as Record<string, unknown>;
        const userId = subscription.metadata?.supabase_user_id;

        if (userId) {
          const periodStart = subAny.current_period_start as number | undefined;
          const periodEnd = subAny.current_period_end as number | undefined;

          const updateData: Record<string, string> = { status: subscription.status };
          if (periodStart) updateData.current_period_start = new Date(periodStart * 1000).toISOString();
          if (periodEnd) updateData.current_period_end = new Date(periodEnd * 1000).toISOString();

          await supabaseAdmin
            .from('subscriptions')
            .update(updateData)
            .eq('stripe_subscription_id', subscription.id);
        }
        break;
      }

      case 'invoice.paid': {
        // Monthly renewal: reset credits
        const invoiceAny = event.data.object as unknown as Record<string, unknown>;
        const subscriptionId = invoiceAny.subscription as string;
        const billingReason = invoiceAny.billing_reason as string;

        // Only reset on recurring payments, not on first subscription
        if (subscriptionId && billingReason === 'subscription_cycle') {
          const { data: sub } = await supabaseAdmin
            .from('subscriptions')
            .select('user_id, plan_id')
            .eq('stripe_subscription_id', subscriptionId)
            .single();

          if (sub) {
            const monthlyCredits = PLAN_CREDITS[sub.plan_id] || 5;

            await supabaseAdmin
              .from('profiles')
              .update({ credits: monthlyCredits })
              .eq('id', sub.user_id);

            await supabaseAdmin.from('credit_transactions').insert({
              user_id: sub.user_id,
              action: 'renewal',
              amount: monthlyCredits,
              balance_after: monthlyCredits,
              description: `تجديد شهري — ${monthlyCredits} كريدت`,
            });
          }
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.supabase_user_id;

        if (userId) {
          await supabaseAdmin
            .from('subscriptions')
            .update({ status: 'cancelled', plan_id: 'free' })
            .eq('stripe_subscription_id', subscription.id);

          // Downgrade to free plan with free credits
          await supabaseAdmin
            .from('profiles')
            .update({ plan: 'free', credits: PLAN_CREDITS.free })
            .eq('id', userId);

          await supabaseAdmin.from('credit_transactions').insert({
            user_id: userId,
            action: 'downgrade',
            amount: PLAN_CREDITS.free,
            balance_after: PLAN_CREDITS.free,
            description: 'إلغاء الاشتراك — تحويل للخطة المجانية',
          });
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoiceAny = event.data.object as unknown as Record<string, unknown>;
        const subscriptionId = invoiceAny.subscription as string;

        if (subscriptionId) {
          await supabaseAdmin
            .from('subscriptions')
            .update({ status: 'past_due' })
            .eq('stripe_subscription_id', subscriptionId);
        }
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}
