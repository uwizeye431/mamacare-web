import { query } from '../../db/client';

// Emails are stored and compared in lower case
export const normalizeEmail = (email: string) => email.trim().toLowerCase();

// Only matches on phone when one is given: an empty phone must not match other users
export const findUserByEmailOrPhone = async (email: string, phone: string) => {
  const res = await query(
    `SELECT * FROM users WHERE lower(email) = lower($1) OR ($2 <> '' AND phone = $2) LIMIT 1`,
    [email || '', phone || '']
  );
  return res.rows[0];
};

export const updatePassword = async (email: string, passwordHash: string) => {
  // Proving ownership of the email by reset code also verifies the account
  const res = await query(
    `UPDATE users SET password_hash = $1, is_verified = TRUE, updated_at = CURRENT_TIMESTAMP
     WHERE lower(email) = lower($2) RETURNING id`,
    [passwordHash, email]
  );
  return res.rows[0];
};

// ---- Password reset codes (stored as SHA-256 hashes) ----

export const upsertPasswordReset = async (email: string, codeHash: string, expiresAt: Date) => {
  await query(
    `INSERT INTO password_resets (email, code_hash, expires_at, attempts, reset_token_hash, reset_token_expires_at, created_at)
     VALUES ($1, $2, $3, 0, NULL, NULL, CURRENT_TIMESTAMP)
     ON CONFLICT (email) DO UPDATE
       SET code_hash = $2, expires_at = $3, attempts = 0,
           reset_token_hash = NULL, reset_token_expires_at = NULL, created_at = CURRENT_TIMESTAMP`,
    [email, codeHash, expiresAt]
  );
};

export const findPasswordReset = async (email: string) => {
  const res = await query('SELECT * FROM password_resets WHERE email = $1', [email]);
  return res.rows[0];
};

export const incrementPasswordResetAttempts = async (email: string) => {
  await query('UPDATE password_resets SET attempts = attempts + 1 WHERE email = $1', [email]);
};

export const setPasswordResetToken = async (email: string, tokenHash: string, expiresAt: Date) => {
  await query(
    'UPDATE password_resets SET reset_token_hash = $2, reset_token_expires_at = $3 WHERE email = $1',
    [email, tokenHash, expiresAt]
  );
};

export const deletePasswordReset = async (email: string) => {
  await query('DELETE FROM password_resets WHERE email = $1', [email]);
};

export const findUserById = async (id: string) => {
  const res = await query('SELECT * FROM users WHERE id = $1 LIMIT 1', [id]);
  return res.rows[0];
};

export const createUser = async (
  phone: string | null,
  email: string,
  passwordHash: string,
  name: string,
  role: string = 'patient'
) => {
  const res = await query(
    `INSERT INTO users (phone, email, password_hash, name, role, terms_accepted_at)
     VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP) RETURNING id, phone, email, name, role, language, avatar_url`,
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

export const upsertOtp = async (email: string, otp: string, expiresAt: Date) => {
  await query('DELETE FROM user_otps WHERE email = $1', [email]);
  const res = await query(
    'INSERT INTO user_otps (email, otp, expires_at) VALUES ($1, $2, $3) RETURNING *',
    [email, otp, expiresAt]
  );
  return res.rows[0];
};

export const findOtpByEmail = async (email: string) => {
  const res = await query('SELECT * FROM user_otps WHERE email = $1 LIMIT 1', [email]);
  return res.rows[0];
};

export const deleteOtpByEmail = async (email: string) => {
  await query('DELETE FROM user_otps WHERE email = $1', [email]);
};

export const verifyUserEmail = async (email: string) => {
  const res = await query(
    'UPDATE users SET is_verified = TRUE, updated_at = CURRENT_TIMESTAMP WHERE email = $1 RETURNING id, name, email, phone, role, language, avatar_url, is_verified',
    [email]
  );
  return res.rows[0];
};

