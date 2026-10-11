/**
 * Admin area support:
 * - users.disabled_at: set when an admin deactivates an account (blocks login)
 * - contact_messages: messages from the website's contact form, read in the admin area
 *
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 */
exports.up = (pgm) => {
  pgm.addColumn('users', {
    disabled_at: { type: 'timestamptz' },
  });

  pgm.createTable('contact_messages', {
    id: { type: 'uuid', primaryKey: true, default: pgm.func('gen_random_uuid()') },
    full_name: { type: 'varchar(100)', notNull: true },
    email: { type: 'varchar(254)', notNull: true },
    phone: { type: 'varchar(30)' },
    subject: { type: 'varchar(200)', notNull: true },
    message: { type: 'text', notNull: true },
    read_at: { type: 'timestamptz' },
    created_at: { type: 'timestamptz', notNull: true, default: pgm.func('current_timestamp') },
  });
  pgm.createIndex('contact_messages', 'created_at');
};

exports.down = (pgm) => {
  pgm.dropTable('contact_messages');
  pgm.dropColumn('users', 'disabled_at');
};
