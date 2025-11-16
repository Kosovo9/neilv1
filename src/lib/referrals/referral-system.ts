/**
 * Studio Nexora - Referral System
 * Handles referral code generation, validation, and 15% discount application
 */

import { createClient } from '@supabase/supabase-js';
import { nanoid } from 'nanoid';
import { logger } from '../utils/logger';

const REFERRAL_DISCOUNT_RATE = 0.15; // 15%
const REFERRAL_CODE_LENGTH = 8;

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export interface ReferralCode {
  id: string;
  user_id: string;
  code: string;
  uses_count: number;
  created_at: string;
  is_active: boolean;
}

export interface ReferralUse {
  id: string;
  referral_code: string;
  referred_user_id?: string;
  order_id: string;
  discount_amount: number;
  order_amount: number;
  created_at: string;
}

/**
 * Generate a unique referral code for a user
 */
export async function generateReferralCode(
  userId: string
): Promise<{ success: boolean; code?: string; error?: string }> {
  try {
    // Check if user already has an active code
    const { data: existingCode, error: existingError } = await supabase
      .from('referral_codes')
      .select('code')
      .eq('user_id', userId)
      .eq('is_active', true)
      .single();

    if (existingCode && !existingError) {
      return { success: true, code: existingCode.code };
    }

    // Generate unique code
    let code: string;
    let isUnique = false;
    let attempts = 0;
    const maxAttempts = 10;

    while (!isUnique && attempts < maxAttempts) {
      code = nanoid(REFERRAL_CODE_LENGTH).toUpperCase();
      
      // Check if code exists
      const { data: existing } = await supabase
        .from('referral_codes')
        .select('id')
        .eq('code', code)
        .single();

      if (!existing) {
        isUnique = true;
        break;
      }
      attempts++;
    }

    if (!isUnique) {
      return { success: false, error: 'Failed to generate unique code' };
    }

    // Create referral code
    const { data, error } = await supabase
      .from('referral_codes')
      .insert({
        user_id: userId,
        code: code!,
        uses_count: 0,
        is_active: true,
      })
      .select()
      .single();

    if (error) {
      logger.error('Error creating referral code:', error);
      return { success: false, error: 'Failed to create referral code' };
    }

    return { success: true, code: data.code };
  } catch (error) {
    logger.error('Error in generateReferralCode:', error);
    return { success: false, error: 'Failed to generate referral code' };
  }
}

/**
 * Validate referral code
 */
export async function validateReferralCode(
  code: string
): Promise<{ success: boolean; valid: boolean; referralData?: ReferralCode; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('referral_codes')
      .select('*')
      .eq('code', code.toUpperCase())
      .eq('is_active', true)
      .single();

    if (error || !data) {
      return { success: true, valid: false };
    }

    return { success: true, valid: true, referralData: data };
  } catch (error) {
    logger.error('Error validating referral code:', error);
    return { success: false, valid: false, error: 'Failed to validate code' };
  }
}

/**
 * Apply referral discount to order
 */
export async function applyReferralDiscount(
  code: string,
  orderAmount: number
): Promise<{ success: boolean; discountAmount?: number; finalAmount?: number; error?: string }> {
  try {
    // Validate code
    const validation = await validateReferralCode(code);
    
    if (!validation.success || !validation.valid) {
      return { 
        success: false, 
        error: 'Invalid referral code' 
      };
    }

    // Calculate discount
    const discountAmount = Math.round(orderAmount * REFERRAL_DISCOUNT_RATE);
    const finalAmount = orderAmount - discountAmount;

    return {
      success: true,
      discountAmount,
      finalAmount,
    };
  } catch (error) {
    logger.error('Error applying referral discount:', error);
    return { success: false, error: 'Failed to apply discount' };
  }
}

/**
 * Record referral use after successful payment
 */
export async function recordReferralUse(
  code: string,
  orderId: string,
  orderAmount: number,
  discountAmount: number,
  referredUserId?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Get referral code data
    const { data: referralCode, error: codeError } = await supabase
      .from('referral_codes')
      .select('id, user_id')
      .eq('code', code.toUpperCase())
      .single();

    if (codeError || !referralCode) {
      return { success: false, error: 'Referral code not found' };
    }

    // Record the use
    const { error: useError } = await supabase
      .from('referral_uses')
      .insert({
        referral_code: code.toUpperCase(),
        referral_code_id: referralCode.id,
        referrer_user_id: referralCode.user_id,
        referred_user_id: referredUserId,
        order_id: orderId,
        discount_amount: discountAmount,
        order_amount: orderAmount,
      });

    if (useError) {
      logger.error('Error recording referral use:', useError);
      return { success: false, error: 'Failed to record referral use' };
    }

    // Increment uses count
    await supabase.rpc('increment_referral_uses', {
      code_id: referralCode.id,
    });

    return { success: true };
  } catch (error) {
    logger.error('Error in recordReferralUse:', error);
    return { success: false, error: 'Failed to record referral use' };
  }
}

/**
 * Get referral statistics for a user
 */
export async function getReferralStats(
  userId: string
): Promise<{ success: boolean; stats?: any; error?: string }> {
  try {
    // Get referral code
    const { data: code, error: codeError } = await supabase
      .from('referral_codes')
      .select('code, uses_count, created_at')
      .eq('user_id', userId)
      .eq('is_active', true)
      .single();

    if (codeError && codeError.code !== 'PGRST116') {
      throw codeError;
    }

    if (!code) {
      return {
        success: true,
        stats: {
          hasCode: false,
          code: null,
          totalUses: 0,
          totalDiscounts: 0,
        },
      };
    }

    // Get referral uses
    const { data: uses, error: usesError } = await supabase
      .from('referral_uses')
      .select('discount_amount')
      .eq('referral_code', code.code);

    if (usesError) throw usesError;

    const totalDiscounts = uses?.reduce(
      (sum, use) => sum + use.discount_amount,
      0
    ) || 0;

    return {
      success: true,
      stats: {
        hasCode: true,
        code: code.code,
        totalUses: code.uses_count || 0,
        totalDiscounts,
        createdAt: code.created_at,
      },
    };
  } catch (error) {
    logger.error('Error getting referral stats:', error);
    return { success: false, error: 'Failed to get referral stats' };
  }
}

/**
 * Get referral use history
 */
export async function getReferralHistory(
  userId: string,
  limit = 50
): Promise<{ success: boolean; uses?: ReferralUse[]; error?: string }> {
  try {
    // Get user's referral code
    const { data: code, error: codeError } = await supabase
      .from('referral_codes')
      .select('code')
      .eq('user_id', userId)
      .eq('is_active', true)
      .single();

    if (codeError || !code) {
      return { success: true, uses: [] };
    }

    // Get uses
    const { data, error } = await supabase
      .from('referral_uses')
      .select('*')
      .eq('referral_code', code.code)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;

    return { success: true, uses: data };
  } catch (error) {
    logger.error('Error getting referral history:', error);
    return { success: false, error: 'Failed to get referral history' };
  }
}

/**
 * Deactivate a referral code
 */
export async function deactivateReferralCode(
  userId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('referral_codes')
      .update({ is_active: false })
      .eq('user_id', userId);

    if (error) throw error;

    return { success: true };
  } catch (error) {
    logger.error('Error deactivating referral code:', error);
    return { success: false, error: 'Failed to deactivate code' };
  }
}
