-- Users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  phone VARCHAR(20),
  company_name VARCHAR(255),
  website VARCHAR(255),
  avatar_url VARCHAR(500),
  role VARCHAR(20) DEFAULT 'business_owner',
  email_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP
);

-- Businesses table
CREATE TABLE IF NOT EXISTS businesses (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  sub_category VARCHAR(100),
  island VARCHAR(50),
  address VARCHAR(255),
  city VARCHAR(100),
  zip_code VARCHAR(10),
  phone VARCHAR(20),
  email VARCHAR(255),
  website VARCHAR(255),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  google_business_id VARCHAR(100),
  rating DECIMAL(2, 1) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  logo_url VARCHAR(500),
  cover_image_url VARCHAR(500),
  hours_of_operation JSONB,
  social_media JSONB,
  verified BOOLEAN DEFAULT FALSE,
  featured BOOLEAN DEFAULT FALSE,
  featured_expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP
);

-- Listings table
CREATE TABLE IF NOT EXISTS listings (
  id SERIAL PRIMARY KEY,
  business_id INTEGER REFERENCES businesses(id) ON DELETE CASCADE,
  tier VARCHAR(50),
  status VARCHAR(20) DEFAULT 'active',
  expires_at TIMESTAMP,
  auto_renew BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  business_id INTEGER REFERENCES businesses(id),
  amount DECIMAL(10, 2),
  currency VARCHAR(3) DEFAULT 'USD',
  tier VARCHAR(50),
  period VARCHAR(20),
  stripe_payment_intent_id VARCHAR(255) UNIQUE,
  stripe_invoice_id VARCHAR(255),
  status VARCHAR(20) DEFAULT 'pending',
  payment_method VARCHAR(50),
  receipt_url VARCHAR(500),
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  business_id INTEGER REFERENCES businesses(id),
  tier VARCHAR(50),
  status VARCHAR(20) DEFAULT 'active',
  start_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  end_date TIMESTAMP,
  auto_renew BOOLEAN DEFAULT TRUE,
  stripe_subscription_id VARCHAR(255) UNIQUE,
  stripe_customer_id VARCHAR(255),
  next_billing_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Audit scores table
CREATE TABLE IF NOT EXISTS audit_scores (
  id SERIAL PRIMARY KEY,
  business_id INTEGER REFERENCES businesses(id) ON DELETE CASCADE,
  overall_score INTEGER,
  listings_score INTEGER,
  reviews_score INTEGER,
  website_score INTEGER,
  google_business_score INTEGER,
  report_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id SERIAL PRIMARY KEY,
  business_id INTEGER REFERENCES businesses(id) ON DELETE CASCADE,
  reviewer_name VARCHAR(255),
  reviewer_email VARCHAR(255),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(255),
  comment TEXT,
  verified_customer BOOLEAN DEFAULT FALSE,
  source VARCHAR(50),
  source_id VARCHAR(255),
  helpful_count INTEGER DEFAULT 0,
  status VARCHAR(20) DEFAULT 'approved',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_businesses_user_id ON businesses(user_id);
CREATE INDEX IF NOT EXISTS idx_businesses_island ON businesses(island);
CREATE INDEX IF NOT EXISTS idx_businesses_category ON businesses(category);
CREATE INDEX IF NOT EXISTS idx_listings_business_id ON listings(business_id);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_id ON subscriptions(stripe_subscriptio