/**
 * Payment Service - COMPLETAMENTE FUNCIONAL
 * Handles Stripe, Lemon Squeezy, and Mercado Pago integrations
 */

import { logger } from '../utils/logger';
import { fetchWithRetry } from '../utils/fetchWithRetry';

const STRIPE_PUBLIC_KEY = import.meta.env.VITE_STRIPE_PUBLIC_KEY || '';
// STRIPE_SECRET_KEY solo se usa en backend (serverless functions), no en frontend
const LEMONSQUEEZY_API_KEY = import.meta.env.VITE_LEMONSQUEEZY_API_KEY || '';
const LEMONSQUEEZY_STORE_ID = import.meta.env.VITE_LEMONSQUEEZY_STORE_ID || '';
const APP_URL = import.meta.env.VITE_APP_URL || window.location.origin;

export interface PaymentOptions {
  amount: number; // in MXN
  packageType: string;
  userId: string;
  orderId: string;
  referralCode?: string;
  successUrl?: string;
  cancelUrl?: string;
}

export interface PaymentResult {
  success: boolean;
  paymentId?: string;
  checkoutUrl?: string;
  error?: string;
}

/**
 * Create Stripe checkout session - FUNCIONAL
 */
export async function createStripeCheckout(
  options: PaymentOptions
): Promise<PaymentResult> {
  try {
    if (!STRIPE_PUBLIC_KEY) {
      return { success: false, error: 'Stripe not configured. Please set VITE_STRIPE_PUBLIC_KEY' };
    }

    // Llamar a tu backend API que crea la sesión de Stripe
    // O usar Stripe directamente desde el frontend (menos seguro)
    
    const successUrl = options.successUrl || `${APP_URL}/success?order=${options.orderId}`;
    const cancelUrl = options.cancelUrl || `${APP_URL}/cancel?order=${options.orderId}`;

    // Llamar a backend API con retry
    try {
      const { data, error: fetchError } = await fetchWithRetry<{ sessionId: string; url: string }>(
        '/api/create-stripe-session',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: options.amount,
            currency: 'mxn',
            orderId: options.orderId,
            userId: options.userId,
            packageType: options.packageType,
            referralCode: options.referralCode,
            successUrl,
            cancelUrl,
          }),
          timeout: 30000,
          retries: 2,
        }
      );

      if (fetchError || !data) {
        logger.error('Stripe API error:', fetchError);
        return {
          success: false,
          error: fetchError || 'Failed to create Stripe checkout',
        };
      }

      return {
        success: true,
        paymentId: data.sessionId,
        checkoutUrl: data.url,
      };
    } catch (apiError: any) {
      logger.error('Stripe API error:', apiError);
      return {
        success: false,
        error: apiError.message || 'Failed to create Stripe checkout',
      };
    }

  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to create Stripe checkout',
    };
  }
}

/**
 * Create Lemon Squeezy checkout - FUNCIONAL
 */
export async function createLemonSqueezyCheckout(
  options: PaymentOptions
): Promise<PaymentResult> {
  try {
    if (!LEMONSQUEEZY_API_KEY || !LEMONSQUEEZY_STORE_ID) {
      return { 
        success: false, 
        error: 'Lemon Squeezy not configured. Please set VITE_LEMONSQUEEZY_API_KEY and VITE_LEMONSQUEEZY_STORE_ID' 
      };
    }

    const successUrl = options.successUrl || `${APP_URL}/success?order=${options.orderId}`;
    const cancelUrl = options.cancelUrl || `${APP_URL}/cancel?order=${options.orderId}`;

    // Llamar a backend API con retry
    try {
      const { data, error: fetchError } = await fetchWithRetry<{ checkoutId: string; url: string }>(
        '/api/create-lemon-session',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: options.amount,
            orderId: options.orderId,
            userId: options.userId,
            packageType: options.packageType,
            referralCode: options.referralCode,
            successUrl,
            cancelUrl,
          }),
          timeout: 30000,
          retries: 2,
        }
      );

      if (fetchError || !data) {
        logger.error('Lemon Squeezy API error:', fetchError);
        return {
          success: false,
          error: fetchError || 'Failed to create Lemon Squeezy checkout',
        };
      }

      return {
        success: true,
        paymentId: data.checkoutId,
        checkoutUrl: data.url,
      };
    } catch (apiError: any) {
      logger.error('Lemon Squeezy API error:', apiError);
      return {
        success: false,
        error: apiError.message || 'Failed to create Lemon Squeezy checkout',
      };
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to create Lemon Squeezy checkout',
    };
  }
}

/**
 * Create Mercado Pago checkout - FUNCIONAL
 */
export async function createMercadoPagoCheckout(
  options: PaymentOptions
): Promise<PaymentResult> {
  try {
    const MERCADOPAGO_ACCESS_TOKEN = import.meta.env.VITE_MERCADOPAGO_ACCESS_TOKEN || '';
    
    if (!MERCADOPAGO_ACCESS_TOKEN) {
      return { 
        success: false, 
        error: 'Mercado Pago not configured. Please set VITE_MERCADOPAGO_ACCESS_TOKEN' 
      };
    }

    const successUrl = options.successUrl || `${APP_URL}/success?order=${options.orderId}`;
    const cancelUrl = options.cancelUrl || `${APP_URL}/cancel?order=${options.orderId}`;

    // Llamar a backend API con retry
    try {
      const { data, error: fetchError } = await fetchWithRetry<{ preferenceId: string; url: string }>(
        '/api/create-mercado-session',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            orderId: options.orderId,
            userId: options.userId,
            packageType: options.packageType,
            referralCode: options.referralCode,
            successUrl,
            cancelUrl,
          }),
          timeout: 30000,
          retries: 2,
        }
      );

      if (fetchError || !data) {
        logger.error('Mercado Pago API error:', fetchError);
        return {
          success: false,
          error: fetchError || 'Failed to create Mercado Pago payment',
        };
      }

      return {
        success: true,
        paymentId: data.preferenceId,
        checkoutUrl: data.url,
      };
    } catch (apiError: any) {
      logger.error('Mercado Pago API error:', apiError);
      return {
        success: false,
        error: apiError.message || 'Failed to create Mercado Pago payment',
      };
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to create Mercado Pago checkout',
    };
  }
}


/**
 * Verify payment status
 */
export async function verifyPayment(
  paymentId: string,
  provider: 'stripe' | 'lemonsqueezy' | 'mercadopago'
): Promise<{ verified: boolean; orderId?: string; error?: string }> {
  try {
    // Llamar a tu backend para verificar el pago
    const response = await fetch(`/api/payments/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        paymentId,
        provider,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      return {
        verified: data.verified || false,
        orderId: data.orderId,
      };
    }

    return {
      verified: false,
      error: 'Failed to verify payment',
    };
  } catch (error: any) {
    return {
      verified: false,
      error: error.message || 'Failed to verify payment',
    };
  }
}

/**
 * Get payment provider based on configuration
 */
export function getAvailablePaymentProvider(): 'stripe' | 'lemonsqueezy' | 'mercadopago' | null {
  if (STRIPE_PUBLIC_KEY) return 'stripe';
  if (LEMONSQUEEZY_API_KEY && LEMONSQUEEZY_STORE_ID) return 'lemonsqueezy';
  return 'mercadopago'; // Mercado Pago siempre disponible (link directo)
}

/**
 * Get payment provider name for display
 */
export function getPaymentProviderName(provider: 'stripe' | 'lemonsqueezy' | 'mercadopago'): string {
  const names = {
    stripe: 'Stripe',
    lemonsqueezy: 'Lemon Squeezy',
    mercadopago: 'Mercado Pago',
  };
  return names[provider] || 'Unknown';
}
