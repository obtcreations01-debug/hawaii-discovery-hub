const express = require('express');
const pool = require('../config/database');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// GET /api/listings - Get all listings (public)
router.get('/', async (req, res) => {
  let client;
  try {
    client = await pool.connect();
    const { island, category, search, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    
    let query = `
      SELECT 
        b.id, b.name, b.description, b.category, b.island, 
        b.rating, b.review_count, b.logo_url, b.phone, b.website,
        l.tier, l.status, l.expires_at
      FROM businesses b
      LEFT JOIN listings l ON b.id = l.business_id
      WHERE b.verified = TRUE AND (l.status = 'active' OR l.status IS NULL)
    `;
    
    const params = [];
    
    if (island) {
      params.push(island);
      query += ` AND b.island = $${params.length}`;
    }
    
    if (category) {
      params.push(category);
      query += ` AND b.category = $${params.length}`;
    }
    
    if (search) {
      params.push(`%${search}%`);
      query += ` AND (b.name ILIKE $${params.length} OR b.description ILIKE $${params.length})`;
    }
    
    query += ` ORDER BY b.rating DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);
    
    const result = await client.query(query, params);
    
    res.json({
      data: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: result.rows.length
      }
    });
    
  } catch (error) {
    console.error('Get listings error:', error);
    res.status(500).json({ error: 'Failed to get listings' });
  } finally {
    if (client) client.release();
  }
});

// GET /api/listings/:id - Get single listing
router.get('/:id', async (req, res) => {
  let client;
  try {
    client = await pool.connect();
    const { id } = req.params;
    
    const result = await client.query(
      `SELECT b.*, l.tier, l.status, l.expires_at
       FROM businesses b
       LEFT JOIN listings l ON b.id = l.business_id
       WHERE b.id = $1 AND b.verified = TRUE`,
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Listing not found' });
    }
    
    res.json(result.rows[0]);
    
  } catch (error) {
    res.status(500).json({ error: 'Failed to get listing' });
  } finally {
    if (client) client.release();
  }
});

// POST /api/listings - Create listing (authenticated)
router.post('/', authMiddleware, async (req, res) => {
  let client;
  try {
    client = await pool.connect();
    const { businessId, tier } = req.body;
    const userId = req.user.id;
    
    if (!businessId || !tier) {
      return res.status(400).json({ error: 'businessId and tier required' });
    }
    
    // Verify business belongs to user
    const business = await client.query(
      'SELECT id FROM businesses WHERE id = $1 AND user_id = $2',
      [businessId, userId]
    );
    
    if (business.rows.length === 0) {
      return res.status(403).json({ error: 'Business not found or unauthorized' });
    }
    
    // Calculate expiration (1 month from now)
    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + 1);
    
    const result = await client.query(
      `INSERT INTO listings (business_id, tier, expires_at, status)
       VALUES ($1, $2, $3, 'active')
       RETURNING *`,
      [businessId, tier, expiresAt]
    );
    
    res.status(201).json(result.rows[0]);
    
  } catch (error) {
    console.error('Create listing error:', error);
    res.status(500).json({ error: 'Failed to create listing' });
  } finally {
    if (client) client.release();
  }
});

// PUT /api/listings/:id - Update listing
router.put('/:id', authMiddleware, async (req, res) => {
  let client;
  try {
    client = await pool.connect();
    const { id } = req.params;
    const { name, description, category, island, phone, website } = req.body;
    const userId = req.user.id;
    
    // Verify ownership
    const check = await client.query(
      `SELECT b.id FROM listings l
       JOIN businesses b ON l.business_id = b.id
       WHERE l.id = $1 AND b.user_id = $2`,
      [id, userId]
    );
    
    if (check.rows.length === 0) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    
    // Get business_id from listing
    const listingResult = await client.query(
      'SELECT business_id FROM listings WHERE id = $1',
      [id]
    );
    
    const businessId = listingResult.rows[0].business_id;
    
    // Update business info
    const result = await client.query(
      `UPDATE businesses SET 
        name = $1, description = $2, category = $3, 
        island = $4, phone = $5, website = $6, updated_at = NOW()
       WHERE id = $7
       RETURNING *`,
      [name, description, category, island, phone, website, businessId]
    );
    
    res.json(result.rows[0]);
    
  } catch (error) {
    console.error('Update listing error:', error);
    res.status(500).json({ error: 'Failed to update listing' });
  } finally {
    if (client) client.release();
  }
});

module.exports = router;
