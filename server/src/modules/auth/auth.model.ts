import { query } from '../../db/client';

export const findUserByEmailOrPhone = async (email: string, phone: string) => {
  const res = await query(
    'SELECT * FROM users WHERE email = $1 OR phone = $2 LIMIT 1',
    [email, phone]
  );
  return res.rows[0];
};

export const findUserById = async (id: string) => {
  const res = await query('SELECT * FROM users WHERE id = $1 LIMIT 1', [id]);
  return res.rows[0];
};

export const createUser = async (
  phone: string,
  email: string,
  passwordHash: string,
  name: string,
  role: string = 'patient'
) => {
  const res = await query(
    `INSERT INTO users (phone, email, password_hash, name, role) 
     VALUES ($1, $2, $3, $4, $5) RETURNING id, phone, email, name, role, language, avatar_url`,
    [phone, email, passwordHash, name, role]
  );
  return res.rows[0];
};

export const updateUserProfile = async (
  id: string,
  name: string,
  email: string | null,
  phone: string | null,
  avatarUrl: string | null
) => {
  const res = await query(
    `UPDATE users 
     SET name = $1, email = $2, phone = $3, avatar_url = $4, updated_at = CURRENT_TIMESTAMP
     WHERE id = $5
     RETURNING id, name, email, phone, role, language, avatar_url`,
    [name, email, phone, avatarUrl, id]
  );
  return res.rows[0];
};
