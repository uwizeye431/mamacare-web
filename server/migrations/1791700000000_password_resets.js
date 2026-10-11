/**
 * Password reset codes.
 *
 * One row per email. The 6-digit code and the follow-up reset token are stored only as
 * SHA-256 hashes. `attempts` limits guessing; the row is deleted once the password is reset.
 *
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 */
exports.up = (pgm) => {
  pgm.createTable('password_resets', {
    email: { type: 'varchar(255)', primaryKey: true },
    code_hash: { type: 'varchar(64)', notNull: true },
    expires_at: { type: 'timestamptz', notNull: true },
    attempts: { type: 'integer', notNull: true, default: 0 },
    reset_token_hash: { type: 'varchar(64)' },
    reset_token_expires_at: { type: 'timestamptz' },
    created_at: { type: 'timestamptz', notNull: true, default: pgm.func('current_timestamp') },
  });

  // Phone is optional: store "no phone" as NULL, not '' (two empty strings clash on the unique index)
  pgm.sql(`UPDATE users SET phone = NULL WHERE phone = ''`);
};

exports.down = (pgm) => {
  pgm.dropTable('password_resets');
};
