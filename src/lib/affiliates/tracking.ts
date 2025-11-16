/**
 * Studio Nexora - Affiliate Tracking System
 * Handles affiliate click tracking, cookie management, and commission calculation
 * Cookie duration: 90 days
 * Commission rate: 40%
 */

import { createClient } from '@supabase/supabase-js';
import Cookies from 'js-cookie';
import { logger } from '../utils/logger';

const AFFILIATE_COOKIE_NAME = 'sn_affiliate_ref';
const COOKIE_DURATION = 90; // days
const COMMISSION_RATE = 0.40; // 40%

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export interface AffiliateClick {
  id: string;
  affiliate_code: string;
  clicked_at: string;
  ip_address?: string;
  user_agent?: string;
  referrer?: string;
}

export interface AffiliateCommission {
  id: string;
  affiliate_user_id: string;
  order_id: string;
  order_amount: number;
  commission_amount: number;
  commission_rate: number;
  status: 'pending' | 'paid' | 'cancelled';
  created_at: string;
}

/**
 * Track affiliate click and set cookie
 */
export async function trackAffiliateClick(
  affiliateCode: string,
  metadata?: {
    ipAddress?: string;
    userAgent?: string;
    referrer?: string;
  }
): Promise<{ success: boolean; error?: string }> {
  try {
    // Validate affiliate code exists
    const { data: affiliate, error: affiliateError } = await supabase
      .from('users')
      .select('id, affiliate_code')
      .eq('affiliate_code', affiliateCode)
      .single();

    if (affiliateError || !affiliate) {
      return { success: false, error: 'Invalid affiliate code' };
    }

    // Set affiliate cookie (90 days)
    Cookies.set(AFFILIATE_COOKIE_NAME, affiliateCode, {
      expires: COOKIE_DURATION,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });

    // Track click in database
    const { error: trackError } = await supabase
      .from('affiliate_clicks')
      .insert({
        affiliate_code: affiliateCode,
        affiliate_user_id: affiliate.id,
        ip_address: metadata?.ipAddress,
        user_agent: metadata?.userAgent,
        referrer: metadata?.referrer,
      });

    if (trackError) {
      logger.error('Error tracking affiliate click:', trackError);
      // Don't fail if tracking fails, cookie is still set
    }

    return { success: true };
  } catch (error) {
    logger.error('Error in trackAffiliateClick:', error);
    return { success: false, error: 'Failed to track affiliate click' };
  }
}

/**
 * Get affiliate code from cookie
 */
export function getAffiliateCode(): string | undefined {
  return Cookies.get(AFFILIATE_COOKIE_NAME);
}

/**
 * Calculate commission for an order
 */
export async function calculateCommission(
  orderId: string,
  orderAmount: number
): Promise<{ success: boolean; commission?: AffiliateCommission; error?: string }> {
  try {
    // Get affiliate code from cookie
    const affiliateCode = getAffiliateCode();
    
    if (!affiliateCode) {
      return { success: true }; // No affiliate, no commission
    }

    // Get affiliate user
    const { data: affiliate, error: affiliateError } = await supabase
      .from('users')
      .select('id')
      .eq('affiliate_code', affiliateCode)
      .single();

    if (affiliateError || !affiliate) {
      logger.error('Affiliate not found:', affiliateCode);
      return { success: true }; // Continue without commission
    }

    // Calculate commission amount
    const commissionAmount = orderAmount * COMMISSION_RATE;

    // Create commission record
    const { data: commission, error: commissionError } = await supabase
      .from('affiliate_commissions')
      .insert({
        affiliate_user_id: affiliate.id,
        order_id: orderId,
        order_amount: orderAmount,
        commission_amount: commissionAmount,
        commission_rate: COMMISSION_RATE,
        status: 'pending',
      })
      .select()
      .single();

    if (commissionError) {
      logger.error('Error creating commission:', commissionError);
      return { success: false, error: 'Failed to create commission' };
    }

    // Update affiliate stats
    await supabase.rpc('increment_affiliate_stats', {
      affiliate_id: affiliate.id,
      sale_amount: orderAmount,
      commission: commissionAmount,
    });

    return { success: true, commission };
  } catch (error) {
    logger.error('Error in calculateCommission:', error);
    return { success: false, error: 'Failed to calculate commission' };
  }
}

/**
 * Get affiliate statistics
 */
export async function getAffiliateStats(userId: string) {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('affiliate_clicks_count, affiliate_sales_count, affiliate_revenue, affiliate_commissions_earned')
      .eq('id', userId)
      .single();

    if (error) throw error;

    // Get pending commissions
    const { data: pendingCommissions, error: pendingError } = await supabase
      .from('affiliate_commissions')
      .select('commission_amount')
      .eq('affiliate_user_id', userId)
      .eq('status', 'pending');

    if (pendingError) throw pendingError;

    const pendingAmount = pendingCommissions?.reduce(
      (sum, comm) => sum + comm.commission_amount,
      0
    ) || 0;

    return {
      success: true,
      stats: {
        totalClicks: data.affiliate_clicks_count || 0,
        totalSales: data.affiliate_sales_count || 0,
        totalRevenue: data.affiliate_revenue || 0,
        totalCommissions: data.affiliate_commissions_earned || 0,
        pendingCommissions: pendingAmount,
      },
    };
  } catch (error) {
    logger.error('Error getting affiliate stats:', error);
    return { success: false, error: 'Failed to get affiliate stats' };
  }
}

/**
 * Get affiliate commission history
 */
export async function getCommissionHistory(
  userId: string,
  limit = 50
): Promise<{ success: boolean; commissions?: AffiliateCommission[]; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('affiliate_commissions')
      .select('*')
      .eq('affiliate_user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;

    return { success: true, commissions: data };
  } catch (error) {
    logger.error('Error getting commission history:', error);
    return { success: false, error: 'Failed to get commission history' };
  }
}

/**
 * Mark commission as paid
 */
export async function markCommissionPaid(
  commissionId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('affiliate_commissions')
      .update({ status: 'paid', paid_at: new Date().toISOString() })
      .eq('id', commissionId);

    if (error) throw error;

    return { success: true };
  } catch (error) {
    logger.error('Error marking commission as paid:', error);
    return { success: false, error: 'Failed to mark commission as paid' };
  }
}

/**
 * Clear affiliate cookie
 */
export function clearAffiliateCookie(): void {
  Cookies.remove(AFFILIATE_COOKIE_NAME);
}
