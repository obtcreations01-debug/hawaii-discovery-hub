const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Routes
const authRoutes = require('./routes/auth');
const listingsRoutes = require('./routes/listings');
const paymentsRoutes = require('./routes/payments');
const businessesRoutes = require('./routes/businesses');

const app = express();

// Security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  if (process.env.NODE_ENV === 'production') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }
  next();
});

// CORS - same-origin (we serve frontend from this app) plus an optional FRONTEND_URL
const FRONTEND_URL = process.env.FRONTEND_URL || '*';
app.use(cors({
  origin: FRONTEND_URL === '*' ? true : FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// IMPORTANT: Stripe webhook needs the raw body, mount BEFORE express.json
app.use('/api/payments/webhook', express.raw({ type: 'application/json' }));

// Body parsers (everything else)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging (API only)
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  }
  next();
});

// Health
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    uptime: process.uptime()
  });
});

// API
app.use('/api/auth', authRoutes);
app.use('/api/listings', listingsRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/api/businesses', businessesRoutes);

// Static frontend
const PUBLIC_DIR = path.join(__dirname, 'public');
app.use(express.static(PUBLIC_DIR, { extensions: ['html'] }));

// SPA-ish fallback for any non-API path
app.get(/^\/(?!api).*/, (req, res, next) => {
  res.sendFile(path.join(PUBLIC_DIR, 'index.html'), (err) => {
    if (err) next();
  });
});

// API 404
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found', path: req.path, method: req.method });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('[ERROR]', err);
  const status = err.status || 500;
  const message = process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message;
  res.status(status).json({
    error: message,
    status,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  const env = process.env.NODE_ENV || 'development';
  console.log(`Hawaii Discovery Hub - ${env} - listening on port ${PORT}`);
  console.log(`  API:      /api`);
  console.log(`  Health:   /api/health`);
  console.log(`  Frontend: served from /public`);
});

process.on('SIGTERM', () => { console.log('SIGTERM'); process.exit(0); });
process.on('SIGINT',  () => { console.log('SIGINT');  process.exit(0); });
