/**
 * Studio Nexora - Stripe Webhook Handler
 * POST /api/webhooks/stripe
 * Handles all Stripe events for payments, refunds, and subscriptions
 */

import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { calculateCommission } from '@/lib/affiliates/tracking';
import { recordReferralUse } from '@/lib/referrals/referral-system';
import { sendOrderConfirmation, sendGenerationComplete, sendAffiliateCommissionNotification } from '@/lib/notifications/email-sender';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = headers().get('stripe-signature');

    if (!signature) {
      console.error('[Stripe Webhook] No signature found');
      return NextResponse.json(
        { error: 'No signature' },
        { status: 400 }
      );
    }

    // Verify webhook signature
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        webhookSecret
      );
    } catch (err) {
      console.error('[Stripe Webhook] Signature verification failed:', err);
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    console.log(`[Stripe Webhook] Received event: ${event.type}`);

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentSuccess(event.data.object as Stripe.PaymentIntent);
        break;

      case 'payment_intent.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.PaymentIntent);
        break;

      case 'payment_intent.canceled':
        await handlePaymentCanceled(event.data.object as Stripe.PaymentIntent);
        break;

      case 'charge.refunded':
        await handleChargeRefunded(event.data.object as Stripe.Charge);
        break;

      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      case 'customer.created':
        console.log('[Stripe Webhook] Customer created:', event.data.object.id);
        break;

      default:
        console.log(`[Stripe Webhook] Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('[Stripe Webhook] Error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

/**
 * Handle successful payment
 */
async function handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
  try {
    console.log(`[Stripe Webhook] Payment succeeded: ${paymentIntent.id}`);

    const orderId = paymentIntent.metadata.orderId;
    const referralCode = paymentIntent.metadata.referralCode;
    const affiliateCode = paymentIntent.metadata.affiliateCode;

    if (!orderId) {
      console.error('[Stripe Webhook] No orderId in metadata');
      return;
    }

    // Update order status
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .update({
        status: 'paid',
        payment_id: paymentIntent.id,
        paid_at: new Date().toISOString(),
      })
      .eq('id', orderId)
      .select('*, users(*)')
      .single();

    if (orderError || !order) {
      console.error('[Stripe Webhook] Order not found:', orderId);
      return;
    }

    console.log(`[Stripe Webhook] Order ${orderId} marked as paid`);

    // Record referral use if applicable
    if (referralCode && order.discount_amount > 0) {
      await recordReferralUse(
        referralCode,
        orderId,
        order.final_amount,
        order.discount_amount,
        order.user_id
      );
      console.log(`[Stripe Webhook] Referral recorded: ${referralCode}`);
    }

    // Calculate affiliate commission if applicable
    if (affiliateCode) {
      const commissionResult = await calculateCommission(orderId, order.final_amount);
      
      if (commissionResult.success && commissionResult.commission) {
        console.log(`[Stripe Webhook] Affiliate commission: $${commissionResult.commission.commission_amount} MXN`);
        
        // Get affiliate user for email
        const { data: affiliateUser } = await supabase
          .from('users')
          .select('email, name')
          .eq('affiliate_code', affiliateCode)
          .single();

        if (affiliateUser) {
          await sendAffiliateCommissionNotification(
            affiliateUser.email,
            affiliateUser.name || affiliateUser.email,
            commissionResult.commission.commission_amount,
            order.final_amount,
            orderId
          );
        }
      }
    }

    // Trigger AI generation (async - don't wait)
    fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderId,
        // Additional generation params from order metadata
      }),
    }).catch(err => console.error('[Stripe Webhook] Generation trigger failed:', err));

    console.log(`[Stripe Webhook] Payment processing complete for order ${orderId}`);

  } catch (error) {
    console.error('[Stripe Webhook] Error in handlePaymentSuccess:', error);
  }
}

/**
 * Handle failed payment
 */
async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
  try {
    console.log(`[Stripe Webhook] Payment failed: ${paymentIntent.id}`);

    const orderId = paymentIntent.metadata.orderId;
    if (!orderId) return;

    await supabase
      .from('orders')
      .update({
        status: 'failed',
        error_message: paymentIntent.last_payment_error?.message || 'Payment failed',
      })
      .eq('id', orderId);

    console.log(`[Stripe Webhook] Order ${orderId} marked as failed`);

  } catch (error) {
    console.error('[Stripe Webhook] Error in handlePaymentFailed:', error);
  }
}

/**
 * Handle canceled payment
 */
async function handlePaymentCanceled(paymentIntent: Stripe.PaymentIntent) {
  try {
    console.log(`[Stripe Webhook] Payment canceled: ${paymentIntent.id}`);

    const orderId = paymentIntent.metadata.orderId;
    if (!orderId) return;

    await supabase
      .from('orders')
      .update({
        status: 'canceled',
      })
      .eq('id', orderId);

    console.log(`[Stripe Webhook] Order ${orderId} marked as canceled`);

  } catch (error) {
    console.error('[Stripe Webhook] Error in handlePaymentCanceled:', error);
  }
}

/**
 * Handle charge refunded
 */
async function handleChargeRefunded(charge: Stripe.Charge) {
  try {
    console.log(`[Stripe Webhook] Charge refunded: ${charge.id}`);

    const paymentIntentId = charge.payment_intent as string;

    // Find order by payment_id
    const { data: order } = await supabase
      .from('orders')
      .select('id')
      .eq('payment_id', paymentIntentId)
      .single();

    if (!order) {
      console.error('[Stripe Webhook] Order not found for payment:', paymentIntentId);
      return;
    }

    await supabase
      .from('orders')
      .update({
        status: 'refunded',
        refunded_at: new Date().toISOString(),
      })
      .eq('id', order.id);

    console.log(`[Stripe Webhook] Order ${order.id} marked as refunded`);

  } catch (error) {
    console.error('[Stripe Webhook] Error in handleChargeRefunded:', error);
  }
}

/**
 * Handle checkout session completed
 */
async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  try {
    console.log(`[Stripe Webhook] Checkout completed: ${session.id}`);

    const orderId = session.metadata?.orderId;
    if (!orderId) return;

    await supabase
      .from('orders')
      .update({
        stripe_session_id: session.id,
        customer_email: session.customer_email,
      })
      .eq('id', orderId);

    console.log(`[Stripe Webhook] Order ${orderId} checkout completed`);

  } catch (error) {
    console.error('[Stripe Webhook] Error in handleCheckoutCompleted:', error);
  }
}
