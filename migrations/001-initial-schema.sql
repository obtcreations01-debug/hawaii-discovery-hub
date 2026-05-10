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
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_id ON subscriptions(stripe_subscription_id);

-- Seed data: a few sample businesses so the directory has something to show on first load
INSERT INTO users (email, password_hash, first_name, last_name, company_name)
VALUES ('demo@hawaiidiscoveryhub.com', '$2a$10$abcdefghijklmnopqrstuv', 'Demo', 'Owner', 'Demo Co')
ON CONFLICT (email) DO NOTHING;

INSERT INTO businesses (user_id, name, description, category, island, city, phone, website, rating, review_count, verified)
VALUES
  ((SELECT id FROM users WHERE email='demo@hawaiidiscoveryhub.com'), 'Aloha Surf School', 'Beginner surf lessons on Waikiki Beach with certified ISA instructors.', 'Activities', 'Oahu', 'Honolulu', '808-555-0101', 'https://example.com/surf', 4.8, 124, TRUE),
  ((SELECT id FROM users WHERE email='demo@hawaiidiscoveryhub.com'), 'Maui Plate Lunch Co', 'Family-run plate lunch spot serving kalua pork and lomi salmon.', 'Restaurants', 'Maui', 'Lahaina', '808-555-0102', 'https://example.com/maui-plate', 4.6, 87, TRUE),
  ((SELECT id FROM users WHERE email='demo@hawaiidiscoveryhub.com'), 'Big Island Coffee Roasters', '100% Kona coffee roasted daily, tours available on weekends.', 'Food & Drink', 'Big Island', 'Kailua-Kona', '808-555-0103', 'https://example.com/coffee', 4.9, 212, TRUE),
  ((SELECT id FROM users WHERE email='demo@hawaiidiscoveryhub.com'), 'Kauai Helicopter Tours', 'Doors-off Na Pali Coast helicopter tours.', 'Tours', 'Kauai', 'Lihue', '808-555-0104', 'https://example.com/heli', 4.7, 156, TRUE),
  ((SELECT id FROM users WHERE email='demo@hawaiidiscoveryhub.com'), 'North Shore Shave Ice', 'Locally famous rainbow shave ice with homemade syrups.', 'Food & Drink', 'Oahu', 'Haleiwa', '808-555-0105', 'https://example.com/shaveice', 4.5, 301, TRUE),
  ((SELECT id FROM users WHERE email='demo@hawaiidiscoveryhub.com'), 'Hilo Botanical Gardens', 'A 17-acre tropical garden with rare native Hawaiian plants.', 'Attractions', 'Big Island', 'Hilo', '808-555-0106', 'https://example.com/gardens', 4.6, 98, TRUE)
ON CONFLICT DO NOTHING;

INSERT INTO listings (business_id, tier, status)
SELECT id, 'standard', 'active' FROM businesses
ON CONFLICT DO NOTHING;
