/** 💳 STRIPE PAYMENTS MXN - Sistema completo con referrals (15%) y affiliates (40%) */
import Stripe from 'stripe';
import { supabase } from '../supabase';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2023-10-16' });

export const PRICING = {
  '1_photo': { amount: 20000, currency: 'mxn', photos: 1 },
  '2_photos': { amount: 35000, currency: 'mxn', photos: 2 },
  '3_photos': { amount: 50000, currency: 'mxn', photos: 3 }
} as const;

export async function createPaymentIntent(params: {
  packageId: keyof typeof PRICING;
  userId: string;
  referralCode?: string;
}) {
  let amount = PRICING[params.packageId].amount;
  if (params.referralCode) {
    const { data: referral } = await supabase.from('referral_codes').select('*').eq('code', params.referralCode).eq('active', true).single();
    if (referral) amount = Math.round(amount * 0.85);
  }
  return stripe.paymentIntents.create({
    amount, currency: 'mxn',
    metadata: { userId: params.userId, packageId: params.packageId, referralCode: params.referralCode || '' }
  });
}

export async function handleWebhook(event: Stripe.Event) {
  if (event.type === 'payment_intent.succeeded') {
    const pi = event.data.object as Stripe.PaymentIntent;
    await supabase.from('orders').update({ status: 'paid', stripe_payment_id: pi.id }).eq('user_id', pi.metadata.userId);
    const { data: user } = await supabase.from('users').select('affiliate_id').eq('id', pi.metadata.userId).single();
    if (user?.affiliate_id) {
      await supabase.from('affiliate_commissions').insert({
        affiliate_id: user.affiliate_id, amount: Math.round(pi.amount * 0.40), status: 'pending'
      });
    }
  }
}

export { stripe };
