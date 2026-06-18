const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder');
const pool = require('../config/database');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Pricing tiers (in cents)
const PRICING = {
  'standard': { monthly: 4900, annual: 39900 },
  'aloha-pro': { monthly: 9900, annual: 79900 }
};

// POST /api/payments/create-checkout - Create Stripe checkout session
router.post('/create-checkout', authMiddleware, async (req, res) => {
  try {
    const { businessId, tier, period } = req.body;
    const userId = req.user.id;

    const business = await pool.query(
      `SELECT id, name, email FROM businesses WHERE id = $1 AND user_id = $2`,
      [businessId, userId]
    );

    if (business.rows.length === 0) {
      return res.status(403).json({ error: 'Business not found' });
    }

    const businessData = business.rows[0];
    const amount = PRICING[tier]?.[period];

    if (!amount) {
      return res.status(400).json({ error: 'Invalid tier or period' });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${tier.charAt(0).toUpperCase() + tier.slice(1)} Listing - ${businessData.name}`,
              description: `${period.charAt(0).toUpperCase() + period.slice(1)} subscription`
            },
            unit_amount: amount,
            recurring: {
              interval: period === 'monthly' ? 'month' : 'year',
              interval_count: 1
            }
          },
          quantity: 1
        }
      ],
      mode: 'subscription',
      customer_email: businessData.email,
      success_url: `${process.env.FRONTEND_URL}/dashboard.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/for-businesses.html`,
      metadata: {
        business_id: businessId.toString(),
        user_id: userId.toString(),
        tier,
        period
      }
    });

    await pool.query(
      `INSERT INTO payments (user_id, business_id, amount, tier, period, stripe_payment_intent_id, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [userId, businessId, amount / 100, tier, period, session.subscription || session.id, 'pending']
    );

    return res.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('Checkout error:', error);
    return res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

// POST /api/payments/webhook - Stripe webhook handler (raw body required)
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];

  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    switch (event.type) {
      case 'customer.subscription.updated':
      case 'customer.subscription.created':
        await handleSubscriptionEvent(event.data.object);
        break;
      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object);
        break;
      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object);
        break;
    }

    return res.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return res.status(400).json({ error: 'Webhook failed' });
  }
});

async function handleSubscriptionEvent(subscription) {
  const metadata = subscription.metadata || {};
  await pool.query(
    `INSERT INTO subscriptions (user_id, business_id, tier, stripe_subscription_id,
       stripe_customer_id, status, next_billing_date)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     ON CONFLICT (stripe_subscription_id) DO UPDATE SET
       status = EXCLUDED.status,
       next_billing_date = EXCLUDED.next_billing_date`,
    [
      metadata.user_id,
      metadata.business_id,
      metadata.tier,
      subscription.id,
      subscription.customer,
      subscription.status === 'active' ? 'active' : 'inactive',
      new Date(subscription.current_period_end * 1000)
    ]
  );
  await pool.query(
    `UPDATE listings SET status = 'active', expires_at = $1
     WHERE business_id = $2`,
    [new Date(subscription.current_period_end * 1000), metadata.business_id]
  );
}

async function handlePaymentSucceeded(invoice) {
  await pool.query(
    `UPDATE payments SET status = 'completed', stripe_invoice_id = $1
     WHERE stripe_payment_intent_id = $2`,
    [invoice.id, invoice.payment_intent]
  );
}

async function handlePaymentFailed(invoice) {
  await pool.query(
    `UPDATE payments SET status = 'failed'
     WHERE stripe_payment_intent_id = $1`,
    [invoice.payment_intent]
  );
}

module.exports = router;
