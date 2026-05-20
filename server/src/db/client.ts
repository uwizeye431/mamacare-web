import { Pool } from 'pg';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Self-running migration check
pool.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url TEXT;')
  .then(() => console.log('Database Migration: Checked and ensured avatar_url column exists in users table.'))
  .catch(err => console.error('Database Migration Error:', err));

export const query = (text: string, params?: any[]) => pool.query(text, params);
