/**
 * Vercel Serverless Function - Create Lemon Squeezy Checkout
 * POST /api/create-lemon-session
 */

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      amount,
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

    const apiKey = process.env.LEMON_SQUEEZY_API_KEY;
    const storeId = process.env.LEMON_SQUEEZY_STORE_ID;

    if (!apiKey || !storeId) {
      return res.status(500).json({ error: 'Lemon Squeezy not configured' });
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.VITE_APP_URL || 'http://localhost:5173';
    const finalSuccessUrl = successUrl || `${siteUrl}/success?order=${orderId}`;
    const finalCancelUrl = cancelUrl || `${siteUrl}/cancel?order=${orderId}`;

    // Create Lemon Squeezy Checkout
    const response = await fetch('https://api.lemonsqueezy.com/v1/checkouts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/vnd.api+json',
        'Accept': 'application/vnd.api+json',
      },
      body: JSON.stringify({
        data: {
          type: 'checkouts',
          attributes: {
            custom_price: amount,
            product_options: {
              name: `Studio Nexora - ${packageType}`,
              description: `Professional photo package: ${packageType}`,
            },
            checkout_options: {
              embed: false,
              media: false,
              logo: true,
            },
            checkout_data: {
              custom: {
                order_id: orderId,
                user_id: userId,
                package_type: packageType,
                referral_code: referralCode || '',
              },
            },
            preview: false,
            test_mode: process.env.NODE_ENV !== 'production',
          },
          relationships: {
            store: {
              data: {
                type: 'stores',
                id: storeId,
              },
            },
          },
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return res.status(response.status).json({
        error: errorData.errors?.[0]?.detail || 'Failed to create Lemon Squeezy checkout',
      });
    }

    const data = await response.json();
    const checkoutUrl = data.data.attributes.url;
    const checkoutId = data.data.id;

    return res.status(200).json({
      checkoutId,
      url: checkoutUrl,
    });
  } catch (error: any) {
    console.error('Lemon Squeezy checkout error:', error);
    return res.status(500).json({
      error: error.message || 'Failed to create Lemon Squeezy checkout',
    });
  }
}

