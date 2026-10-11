/**
 * Record when each user accepted the Terms of Service and Privacy Policy,
 * including explicit consent to processing their health data.
 * NULL for accounts created before consent was collected.
 *
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 */
exports.up = (pgm) => {
  pgm.addColumn('users', {
    terms_accepted_at: { type: 'timestamptz' },
  });
};

exports.down = (pgm) => {
  pgm.dropColumn('users', 'terms_accepted_at');
};
