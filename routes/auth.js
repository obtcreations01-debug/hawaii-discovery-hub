const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');

const router = express.Router();

// Generate tokens
const generateTokens = (userId) => {
  const accessToken = jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
  
  const refreshToken = jwt.sign(
    { id: userId },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRE || '30d' }
  );
  
  return { accessToken, refreshToken };
};

// POST /api/auth/register
router.post('/register', async (req, res) => {
  let client;
  try {
    client = await pool.connect();
    const { email, password, firstName, lastName, companyName } = req.body;
    
    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }
    
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }
    
    // Check if user exists
    const existing = await client.query('SELECT id FROM users WHERE email = $1', [email.toLowerCase()]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'Email already registered' });
    }
    
    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);
    
    // Create user
    const result = await client.query(
      `INSERT INTO users (email, password_hash, first_name, last_name, company_name)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, email, first_name, last_name, company_name, created_at`,
      [email.toLowerCase(), passwordHash, firstName, lastName, companyName]
    );
    
    const user = result.rows[0];
    const tokens = generateTokens(user.id);
    
    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        companyName: user.company_name
      },
      ...tokens
    });
    
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Registration failed' });
  } finally {
    if (client) client.release();
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  let client;
  try {
    client = await pool.connect();
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }
    
    // Find user
    const result = await client.query(
      'SELECT * FROM users WHERE email = $1 AND deleted_at IS NULL',
      [email.toLowerCase()]
    );
    
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    const user = result.rows[0];
    
    // Check password
    const passwordValid = await bcrypt.compare(password, user.password_hash);
    if (!passwordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    // Generate tokens
    const tokens = generateTokens(user.id);
    
    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        companyName: user.company_name
      },
      ...tokens
    });
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  } finally {
    if (client) client.release();
  }
});

// POST /api/auth/refresh-token
router.post('/refresh-token', (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return res.status(400).json({ error: 'Refresh token required' });
    }
    
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const tokens = generateTokens(decoded.id);
    
    res.json(tokens);
  } catch (error) {
    res.status(401).json({ error: 'Invalid or expired refresh token' });
  }
});

module.exports = router;
