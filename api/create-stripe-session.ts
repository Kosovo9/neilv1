/**
 * Vercel Serverless Function - Create Stripe Checkout Session
 * POST /api/create-stripe-session
 * 
 * Note: Requires 'stripe' package: npm install stripe
 */

let Stripe: any;
let stripe: any;

try {
  Stripe = require('stripe');
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2024-12-18.acacia',
  });
} catch (error) {
  console.warn('Stripe package not installed. Run: npm install stripe');
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!stripe) {
    return res.status(500).json({ error: 'Stripe not configured. Please install stripe package and set STRIPE_SECRET_KEY' });
  }

  try {
    const {
      amount,
      currency = 'mxn',
      orderId,
      userId,
      packageType,
      referralCode,
      successUrl,
      cancelUrl,
    } = req.body;

    if (!amount || !orderId || !userId || !packageType) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.VITE_APP_URL || 'http://localhost:5173';
    const finalSuccessUrl = successUrl || `${siteUrl}/success?order=${orderId}`;
    const finalCancelUrl = cancelUrl || `${siteUrl}/cancel?order=${orderId}`;

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: currency.toLowerCase(),
            product_data: {
              name: `Studio Nexora - ${packageType}`,
              description: `Professional photo package: ${packageType}`,
            },
            unit_amount: Math.round(amount * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: finalSuccessUrl,
      cancel_url: finalCancelUrl,
      metadata: {
        order_id: orderId,
        user_id: userId,
        package_type: packageType,
        referral_code: referralCode || '',
      },
      customer_email: req.body.customerEmail,
    });

    return res.status(200).json({
      sessionId: session.id,
      url: session.url,
    });
  } catch (error: any) {
    console.error('Stripe checkout error:', error);
    return res.status(500).json({
      error: error.message || 'Failed to create Stripe checkout session',
    });
  }
}

