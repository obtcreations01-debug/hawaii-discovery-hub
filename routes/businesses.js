const express = require('express');
const pool = require('../config/database');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// GET /api/businesses - list businesses for the authenticated user
router.get('/', authMiddleware, async (req, res) => {
  let client;
  try {
    client = await pool.connect();
    const result = await client.query(
      `SELECT b.*, l.tier, l.status AS listing_status, l.expires_at AS listing_expires_at
       FROM businesses b
       LEFT JOIN listings l ON l.business_id = b.id
       WHERE b.user_id = $1 AND b.deleted_at IS NULL
       ORDER BY b.created_at DESC`,
      [req.user.id]
    );

    const businesses = result.rows.map((b) => ({
      ...b,
      listing: b.tier
        ? { tier: b.tier, status: b.listing_status, expires_at: b.listing_expires_at }
        : null
    }));

    res.json(businesses);
  } catch (err) {
    console.error('List businesses error:', err);
    res.status(500).json({ error: 'Failed to list businesses' });
  } finally {
    if (client) client.release();
  }
});

// POST /api/businesses - create a business owned by the authenticated user
router.post('/', authMiddleware, async (req, res) => {
  let client;
  try {
    client = await pool.connect();
    const {
      name, description, category, island, city,
      address, phone, email, website
    } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    const result = await client.query(
      `INSERT INTO businesses
        (user_id, name, description, category, island, city, address, phone, email, website, verified)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, FALSE)
       RETURNING *`,
      [req.user.id, name, description, category, island, city, address, phone, email, website]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Create business error:', err);
    res.status(500).json({ error: 'Failed to create business' });
  } finally {
    if (client) client.release();
  }
});

module.exports = router;
