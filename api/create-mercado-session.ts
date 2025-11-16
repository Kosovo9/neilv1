/**
 * Vercel Serverless Function - Create Mercado Pago Payment
 * POST /api/create-mercado-session
 * 
 * Creates a Mercado Pago preference for checkout
 * Fixed amount: 1 MXN (for testing)
 */

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      orderId,
      userId,
      packageType,
      referralCode,
      successUrl,
      cancelUrl,
    } = req.body;

    if (!orderId || !userId || !packageType) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
    if (!accessToken) {
      return res.status(500).json({ error: 'Mercado Pago not configured' });
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.VITE_APP_URL || 'http://localhost:5173';
    const finalSuccessUrl = successUrl || `${siteUrl}/success?order=${orderId}`;
    const finalCancelUrl = cancelUrl || `${siteUrl}/cancel?order=${orderId}`;

    // Fixed amount: 1 MXN for testing
    const amount = 1;

    // Create Mercado Pago Preference
    const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items: [
          {
            title: `Studio Nexora - ${packageType}`,
            description: `Professional photo package: ${packageType}`,
            quantity: 1,
            unit_price: amount,
            currency_id: 'MXN',
          },
        ],
        back_urls: {
          success: finalSuccessUrl,
          failure: finalCancelUrl,
          pending: finalCancelUrl,
        },
        auto_return: 'approved',
        external_reference: orderId,
        metadata: {
          order_id: orderId,
          user_id: userId,
          package_type: packageType,
          referral_code: referralCode || '',
        },
        notification_url: `${siteUrl}/api/webhooks/mercado`,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return res.status(response.status).json({
        error: errorData.message || 'Failed to create Mercado Pago payment',
      });
    }

    const data = await response.json();
    const checkoutUrl = data.init_point || data.sandbox_init_point;

    return res.status(200).json({
      preferenceId: data.id,
      url: checkoutUrl,
    });
  } catch (error: any) {
    console.error('Mercado Pago checkout error:', error);
    return res.status(500).json({
      error: error.message || 'Failed to create Mercado Pago payment',
    });
  }
}

