/**
 * Order Service
 * Handles order creation, management, and payment processing
 */

import { supabase } from '../supabase';
import { createStripeCheckout, createLemonSqueezyCheckout, createMercadoPagoCheckout, getAvailablePaymentProvider } from './paymentService';
import { generatePhotos } from './photoService';
import { validateDiscountCode, useDiscountCode as applyDiscountCode } from './referralService';
import { handleOrderCompleted } from '../webhooks/purchase-webhook';
import { logger } from '../utils/logger';

type PaymentProvider = 'stripe' | 'lemonsqueezy' | 'mercadopago';
type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';

interface OrderData {
  id: string;
  user_id: string;
  package_type: string;
  photo_count: number;
  price_mxn: string | number;
  discount_percent: string | number | null;
  final_price_mxn: string | number;
  payment_provider: string;
  payment_status: string;
  payment_id?: string | null;
  referred_by_code?: string | null;
  created_at: string;
  completed_at?: string | null;
  metadata?: {
    photo_upload_ids?: string[];
    discount_code?: string;
  };
}

export interface Order {
  id: string;
  userId: string;
  packageType: string;
  photoCount: number;
  priceMxn: number;
  discountPercent: number;
  finalPriceMxn: number;
  paymentProvider: 'stripe' | 'lemonsqueezy' | 'mercadopago';
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentId?: string;
  referredByCode?: string;
  createdAt: string;
  completedAt?: string;
}

export interface CreateOrderOptions {
  userId: string;
  packageType: string;
  photoUploadIds: string[];
  discountCode?: string; // Código de descuento de referidos
  paymentProvider?: 'stripe' | 'lemonsqueezy' | 'mercadopago';
}

const PACKAGE_PRICES: Record<string, number> = {
  '1_photo': 200,
  '2_photos': 350,
  '3_photos': 500,
  'pet': 250,
  'family': 1000,
  'christmas': 299,
};

const PACKAGE_PHOTO_COUNTS: Record<string, number> = {
  '1_photo': 1,
  '2_photos': 2,
  '3_photos': 3,
  'pet': 1,
  'family': 3,
  'christmas': 1,
};

/**
 * Create a new order
 */
export async function createOrder(
  options: CreateOrderOptions
): Promise<{ data: Order | null; error: string | null }> {
  try {
    const priceMxn = PACKAGE_PRICES[options.packageType] || 200;
    const photoCount = PACKAGE_PHOTO_COUNTS[options.packageType] || 1;

    // Calculate discount if discount code provided
    let discountPercent = 0;
    let appliedDiscountCode: string | null = null;
    
    if (options.discountCode) {
      const validation = await validateDiscountCode(options.discountCode);
      if (validation.valid) {
        discountPercent = validation.discountPercent;
        appliedDiscountCode = options.discountCode;
      }
    }

    const finalPriceMxn = priceMxn * (1 - discountPercent / 100);
    const availableProvider = getAvailablePaymentProvider();
    const selectedPaymentProvider: PaymentProvider = 
      options.paymentProvider || availableProvider || 'stripe';

    // Create order in database
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: options.userId,
        package_type: options.packageType,
        photo_count: photoCount,
        price_mxn: priceMxn,
        discount_percent: discountPercent,
        final_price_mxn: finalPriceMxn,
        payment_provider: selectedPaymentProvider,
        payment_status: 'pending',
        referred_by_code: appliedDiscountCode,
        metadata: {
          photo_upload_ids: options.photoUploadIds,
          discount_code: appliedDiscountCode,
        },
      })
      .select()
      .single();

    if (orderError) {
      return { data: null, error: orderError.message };
    }

    // Validate payment provider
    const paymentProvider = orderData.payment_provider as PaymentProvider;
    if (!['stripe', 'lemonsqueezy', 'mercadopago'].includes(paymentProvider)) {
      logger.error('Invalid payment provider:', paymentProvider);
      return { data: null, error: 'Invalid payment provider' };
    }

    // Validate payment status
    const paymentStatus = orderData.payment_status as PaymentStatus;
    if (!['pending', 'completed', 'failed', 'refunded'].includes(paymentStatus)) {
      logger.error('Invalid payment status:', paymentStatus);
      return { data: null, error: 'Invalid payment status' };
    }

    const order: Order = {
      id: orderData.id,
      userId: orderData.user_id,
      packageType: orderData.package_type,
      photoCount: orderData.photo_count,
      priceMxn: parseFloat(String(orderData.price_mxn)),
      discountPercent: parseFloat(String(orderData.discount_percent || '0')),
      finalPriceMxn: parseFloat(String(orderData.final_price_mxn)),
      paymentProvider,
      paymentStatus,
      paymentId: orderData.payment_id || undefined,
      referredByCode: orderData.referred_by_code || orderData.metadata?.discount_code || undefined,
      createdAt: orderData.created_at,
      completedAt: orderData.completed_at || undefined,
    };

    return { data: order, error: null };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to create order';
    logger.error('Error creating order:', error);
    return { data: null, error: errorMessage };
  }
}

/**
 * Create payment checkout for order
 */
export async function createOrderCheckout(
  orderId: string
): Promise<{ checkoutUrl: string | null; error: string | null }> {
  try {
    // Get order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (orderError || !order) {
      return { checkoutUrl: null, error: 'Order not found' };
    }

    let result;
    if (order.payment_provider === 'stripe') {
      result = await createStripeCheckout({
        amount: parseFloat(order.final_price_mxn),
        packageType: order.package_type,
        userId: order.user_id,
        orderId: order.id,
        referralCode: order.referred_by_code,
      });
    } else if (order.payment_provider === 'mercadopago') {
      result = await createMercadoPagoCheckout({
        amount: parseFloat(order.final_price_mxn),
        packageType: order.package_type,
        userId: order.user_id,
        orderId: order.id,
        referralCode: order.referred_by_code,
      });
    } else {
      result = await createLemonSqueezyCheckout({
        amount: parseFloat(order.final_price_mxn),
        packageType: order.package_type,
        userId: order.user_id,
        orderId: order.id,
        referralCode: order.referred_by_code,
      });
    }

    if (!result.success || !result.checkoutUrl) {
      return { checkoutUrl: null, error: result.error || 'Failed to create checkout' };
    }

    // Update order with payment ID
    await supabase
      .from('orders')
      .update({ payment_id: result.paymentId })
      .eq('id', orderId);

    return { checkoutUrl: result.checkoutUrl, error: null };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to create checkout';
    logger.error('Error creating checkout:', error);
    return { checkoutUrl: null, error: errorMessage };
  }
}

/**
 * Process order after payment (generate photos)
 */
export async function processOrder(orderId: string): Promise<{
  success: boolean;
  error: string | null;
}> {
  try {
    // Get order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (orderError || !order) {
      return { success: false, error: 'Order not found' };
    }

    if (order.payment_status !== 'completed') {
      return { success: false, error: 'Order payment not completed' };
    }

    // Get photo upload IDs from metadata
    const photoUploadIds = (order.metadata?.photo_upload_ids || []) as string[];

    // Generate photos for each upload
    for (const uploadId of photoUploadIds) {
      // Get prompt template based on category
      const { data: upload } = await supabase
        .from('photo_uploads')
        .select('category')
        .eq('id', uploadId)
        .single();

      const prompt = `Professional ${upload?.category || 'portrait'} photography, studio quality, 4K resolution`;

      await generatePhotos(uploadId, orderId, order.user_id, prompt);
    }

    // Aplicar código de descuento si existe (applyDiscountCode es una función async, no un hook de React)
    const discountCode = order.metadata?.discount_code;
    if (discountCode && typeof discountCode === 'string') {
      try {
        await applyDiscountCode(discountCode, orderId);
      } catch (discountError) {
        logger.error('Error applying discount code:', discountError);
        // No fallar la orden si el descuento falla
      }
    }

    // Enviar notificaciones de referidos (el trigger en DB ya maneja la lógica)
    // Aquí podemos enviar emails adicionales si es necesario

    // Update order as completed
    await supabase
      .from('orders')
      .update({
        completed_at: new Date().toISOString(),
      })
      .eq('id', orderId);

    // Procesar webhook de compra (detecta códigos AFF-XXXXX o REF-XXXXX)
    // Esto procesa automáticamente comisiones y descuentos
    await handleOrderCompleted(orderId);

    return { success: true, error: null };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to process order';
    logger.error('Error processing order:', error);
    return { success: false, error: errorMessage };
  }
}

/**
 * Get user orders
 */
export async function getUserOrders(userId: string): Promise<{
  data: Order[] | null;
  error: string | null;
}> {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      return { data: null, error: error.message };
    }

    const orders: Order[] = (data || []).map((item: OrderData) => {
      // Validate payment provider
      const paymentProvider = item.payment_provider as PaymentProvider;
      const validProvider = ['stripe', 'lemonsqueezy', 'mercadopago'].includes(paymentProvider) 
        ? paymentProvider 
        : 'stripe';

      // Validate payment status
      const paymentStatus = item.payment_status as PaymentStatus;
      const validStatus = ['pending', 'completed', 'failed', 'refunded'].includes(paymentStatus)
        ? paymentStatus
        : 'pending';

      return {
        id: item.id,
        userId: item.user_id,
        packageType: item.package_type,
        photoCount: item.photo_count,
        priceMxn: parseFloat(String(item.price_mxn)),
        discountPercent: parseFloat(String(item.discount_percent || '0')),
        finalPriceMxn: parseFloat(String(item.final_price_mxn)),
        paymentProvider: validProvider,
        paymentStatus: validStatus,
        paymentId: item.payment_id || undefined,
        referredByCode: item.referred_by_code || undefined,
        createdAt: item.created_at,
        completedAt: item.completed_at || undefined,
      };
    });

    return { data: orders, error: null };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to get orders';
    logger.error('Error getting user orders:', error);
    return { data: null, error: errorMessage };
  }
}

