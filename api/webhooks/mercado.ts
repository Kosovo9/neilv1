/**
 * Vercel Serverless Function - Mercado Pago Webhook Handler
 * POST /api/webhooks/mercado
 * 
 * Handles Mercado Pago payment notifications and marks orders as paid in Supabase
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabase = supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null;

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { type, data } = req.body;

    // Handle payment notification
    if (type === 'payment') {
      const paymentId = data?.id;
      
      if (!paymentId) {
        return res.status(400).json({ error: 'Payment ID missing' });
      }

      // Get payment details from Mercado Pago
      const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
      if (!accessToken) {
        return res.status(500).json({ error: 'Mercado Pago not configured' });
      }

      const paymentResponse = await fetch(
        `https://api.mercadopago.com/v1/payments/${paymentId}`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );

      if (!paymentResponse.ok) {
        return res.status(500).json({ error: 'Failed to fetch payment details' });
      }

      const payment = await paymentResponse.json();
      const orderId = payment.external_reference || payment.metadata?.order_id;

      if (!orderId) {
        return res.status(400).json({ error: 'Order ID not found in payment' });
      }

      // Update order status in Supabase
      if (supabase && payment.status === 'approved') {
        const { error: updateError } = await supabase
          .from('orders')
          .update({
            payment_status: 'completed',
            payment_id: paymentId.toString(),
            completed_at: new Date().toISOString(),
          })
          .eq('id', orderId);

        if (updateError) {
          console.error('Error updating order:', updateError);
          return res.status(500).json({ error: 'Failed to update order' });
        }

        console.log(`Order ${orderId} marked as paid via Mercado Pago`);
      }

      return res.status(200).json({ received: true });
    }

    // Handle other notification types
    return res.status(200).json({ received: true });
  } catch (error: any) {
    console.error('Mercado Pago webhook error:', error);
    return res.status(500).json({
      error: error.message || 'Failed to process webhook',
    });
  }
}

