import { Pool } from 'pg';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Self-running migration check
const runMigrations = async () => {
  try {
    // 1. Ensure avatar_url column exists
    await pool.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url TEXT;');
    console.log('Database Migration: Checked/ensured avatar_url column exists in users.');

    // 2. Ensure is_verified column exists. Existing users get TRUE.
    await pool.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT TRUE;');
    console.log('Database Migration: Checked/ensured is_verified column exists in users.');

    // 3. Set the default value for new users to FALSE
    await pool.query('ALTER TABLE users ALTER COLUMN is_verified SET DEFAULT FALSE;');
    console.log('Database Migration: Altered is_verified default value to FALSE for new records.');

    // 4. Create user_otps table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS user_otps (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) NOT NULL UNIQUE,
        otp VARCHAR(6) NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Database Migration: Checked/ensured user_otps table exists.');
  } catch (err) {
    console.error('Database Migration Error:', err);
  }
};

runMigrations();

export const query = (text: string, params?: any[]) => pool.query(text, params);
