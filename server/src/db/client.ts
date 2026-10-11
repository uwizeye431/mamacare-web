import '../config/env';
import { Pool } from 'pg';

// Schema changes live in server/migrations and are applied with `npm run migrate`
// (and automatically on deploy), never from application code.
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const query = (text: string, params?: unknown[]) => pool.query(text, params);

// Lets tests and scripts shut down cleanly
export const closePool = () => pool.end();
