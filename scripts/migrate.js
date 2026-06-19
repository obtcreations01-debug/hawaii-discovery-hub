const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function runMigrations() {
  const client = await pool.connect();
  try {
    console.log('Starting database migrations...');
    
    const migrationFile = fs.readFileSync(
      path.join(__dirname, '../migrations/001-initial-schema.sql'),
      'utf8'
    );
    
    await client.query(migrationFile);
    console.log('✅ Database migrations completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  } finally {
    await client.end();
    await pool.end();
  }
}

runMigrations();
