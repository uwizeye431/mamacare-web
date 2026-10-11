/**
 * Schema changes that used to run on every server start (from server/src/db/client.ts).
 * Written with IF NOT EXISTS so it is safe on databases where they were already applied.
 *
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 */
exports.up = (pgm) => {
  pgm.sql('ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url TEXT');

  // Accounts that existed before email verification was introduced count as verified;
  // every new account must verify its email.
  pgm.sql('ALTER TABLE users ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT TRUE');
  pgm.sql('ALTER TABLE users ALTER COLUMN is_verified SET DEFAULT FALSE');

  // One pending sign-up verification code per email
  pgm.sql(`
    CREATE TABLE IF NOT EXISTS user_otps (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      email VARCHAR(255) NOT NULL UNIQUE,
      otp VARCHAR(6) NOT NULL,
      expires_at TIMESTAMP NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
};

exports.down = (pgm) => {
  pgm.sql('DROP TABLE IF EXISTS user_otps');
  pgm.sql('ALTER TABLE users DROP COLUMN IF EXISTS is_verified');
  pgm.sql('ALTER TABLE users DROP COLUMN IF EXISTS avatar_url');
};
