/**
 * Studio Nexora - Payment API
 * POST /api/payment
 * Handles payment intent creation with Stripe, Lemon Squeezy, and Mercado Pago
 * Supports referral discounts (15%) and affiliate tracking (40% commission)
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { createClient } from '@supabase/supabase-js';
import { createPaymentIntent } from '@/lib/payments/stripe';
import { applyReferralDiscount, recordReferralUse } from '@/lib/referrals/referral-system';
import { calculateCommission, getAffiliateCode } from '@/lib/affiliates/tracking';
import { sendOrderConfirmation } from '@/lib/notifications/email-sender';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Payment packages in MXN
const PACKAGES = {
  basic: { name: 'Paquete Básico', price: 200, photos: 5 },
  standard: { name: 'Paquete Estándar', price: 350, photos: 10 },
  premium: { name: 'Paquete Premium', price: 500, photos: 20 },
};

export async function POST(req: NextRequest) {
  try {
    // Authenticate with Clerk
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await req.json();
    const {
      packageType, // 'basic' | 'standard' | 'premium'
      paymentMethod, // 'stripe' | 'lemon_squeezy' | 'mercado_pago'
      referralCode,
      metadata = {},
    } = body;

    // Validate package
    if (!packageType || !PACKAGES[packageType as keyof typeof PACKAGES]) {
      return NextResponse.json(
        { error: 'Invalid package type' },
        { status: 400 }
      );
    }

    const selectedPackage = PACKAGES[packageType as keyof typeof PACKAGES];
    let amount = selectedPackage.price;
    let discountAmount = 0;
    let finalAmount = amount;

    // Get user data
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('clerk_id', userId)
      .single();

    if (userError || !user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Apply referral discount (15%)
    if (referralCode) {
      const discountResult = await applyReferralDiscount(referralCode, amount);
      if (discountResult.success && discountResult.discountAmount) {
        discountAmount = discountResult.discountAmount;
        finalAmount = discountResult.finalAmount!;
      }
    }

    // Get affiliate code from cookie for commission tracking
    const affiliateCode = getAffiliateCode();

    // Create order in database
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        clerk_user_id: userId,
        package_type: packageType,
        package_name: selectedPackage.name,
        base_amount: amount,
        discount_amount: discountAmount,
        final_amount: finalAmount,
        currency: 'MXN',
        payment_method: paymentMethod,
        referral_code: referralCode || null,
        affiliate_code: affiliateCode || null,
        status: 'pending',
        metadata,
      })
      .select()
      .single();

    if (orderError || !order) {
      console.error('[Payment] Error creating order:', orderError);
      return NextResponse.json(
        { error: 'Failed to create order' },
        { status: 500 }
      );
    }

    console.log(`[Payment] Order created: ${order.id}, Amount: $${finalAmount} MXN`);

    // Handle payment based on method
    let paymentResponse;

    switch (paymentMethod) {
      case 'stripe':
        // Create Stripe Payment Intent
        const stripeResult = await createPaymentIntent({
          amount: finalAmount,
          currency: 'mxn',
          orderId: order.id,
          userId: user.id,
          email: user.email,
          referralCode: referralCode || undefined,
          affiliateCode: affiliateCode || undefined,
        });

        if (!stripeResult.success) {
          await supabase
            .from('orders')
            .update({ status: 'failed', error_message: stripeResult.error })
            .eq('id', order.id);

          return NextResponse.json(
            { error: stripeResult.error },
            { status: 500 }
          );
        }

        paymentResponse = {
          provider: 'stripe',
          clientSecret: stripeResult.clientSecret,
          paymentIntentId: stripeResult.paymentIntentId,
        };
        break;

      case 'lemon_squeezy':
        // Lemon Squeezy integration
        paymentResponse = {
          provider: 'lemon_squeezy',
          checkoutUrl: `${process.env.LEMON_SQUEEZY_CHECKOUT_URL}?orderId=${order.id}&amount=${finalAmount}`,
          message: 'Redirect user to Lemon Squeezy checkout',
        };
        break;

      case 'mercado_pago':
        // Mercado Pago integration
        // Link: https://link.mercadopago.com.mx/studionexora
        // CLABE: 722969020209036818
        // Nombre: Neil Ernesto Ortega Castro
        paymentResponse = {
          provider: 'mercado_pago',
          paymentLink: 'https://link.mercadopago.com.mx/studionexora',
          transferInfo: {
            clabe: '722969020209036818',
            beneficiary: 'Neil Ernesto Ortega Castro',
            amount: finalAmount,
            currency: 'MXN',
            reference: order.id,
          },
          message: 'Transfer to CLABE or use Mercado Pago link with order ID as reference',
        };
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid payment method' },
          { status: 400 }
        );
    }

    // Update order with payment info
    await supabase
      .from('orders')
      .update({
        payment_provider: paymentMethod,
        payment_intent_id: paymentResponse.paymentIntentId || paymentResponse.checkoutUrl || null,
      })
      .eq('id', order.id);

    // Send order confirmation email
    try {
      await sendOrderConfirmation({
        orderId: order.id,
        customerName: user.name || user.email,
        customerEmail: user.email,
        packageName: selectedPackage.name,
        amount: finalAmount,
        currency: 'MXN',
        referralDiscount: discountAmount > 0 ? discountAmount : undefined,
        createdAt: order.created_at,
      });
    } catch (emailError) {
      console.error('[Payment] Failed to send confirmation email:', emailError);
      // Don't fail the request if email fails
    }

    return NextResponse.json({
      success: true,
      orderId: order.id,
      package: selectedPackage,
      pricing: {
        baseAmount: amount,
        discountAmount,
        finalAmount,
        currency: 'MXN',
      },
      payment: paymentResponse,
    });

  } catch (error) {
    console.error('[Payment] Unexpected error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// Webhook handler for payment completion
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId, status, paymentId, referralCode } = body;

    if (!orderId) {
      return NextResponse.json(
        { error: 'Missing orderId' },
        { status: 400 }
      );
    }

    // Get order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (orderError || !order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Update order status
    await supabase
      .from('orders')
      .update({
        status: status === 'succeeded' ? 'paid' : 'failed',
        payment_id: paymentId,
        paid_at: status === 'succeeded' ? new Date().toISOString() : null,
      })
      .eq('id', orderId);

    if (status === 'succeeded') {
      // Record referral use if applicable
      if (referralCode) {
        await recordReferralUse(
          referralCode,
          orderId,
          order.final_amount,
          order.discount_amount,
          order.user_id
        );
      }

      // Calculate affiliate commission if applicable
      if (order.affiliate_code) {
        await calculateCommission(orderId, order.final_amount);
      }
    }

    return NextResponse.json({
      success: true,
      orderId,
      status,
    });

  } catch (error) {
    console.error('[Payment PUT] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
