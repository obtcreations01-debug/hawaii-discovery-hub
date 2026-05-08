const { Pool } = require('pg');
require('dotenv').config();

// Railway/Heroku provide a single DATABASE_URL.
// In local dev you can use either DATABASE_URL or the discrete DB_* vars.
const config = process.env.DATABASE_URL
  ? {
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    }
  : {
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      database: process.env.DB_NAME,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    };

const pool = new Pool(config);

pool.on('error', (err) => {
  console.error('Unexpected error on idle Postgres client:', err);
});

pool.on('connect', () => {
  console.log('Database pool: client connected');
});

module.exports = pool;
