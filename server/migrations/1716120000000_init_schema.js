/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  // Extensions
  pgm.createExtension('btree_gist', { ifNotExists: true });

  // Enums
  pgm.createType('role_enum', ['patient', 'chw', 'provider', 'admin']);
  pgm.createType('triage_enum', ['red', 'yellow', 'green']);
  pgm.createType('doc_type_enum', ['lab', 'ultrasound', 'vaccination', 'prescription', 'other']);
  pgm.createType('facility_type_enum', ['health_center', 'district_hospital', 'referral_hospital']);
  pgm.createType('mod_status_enum', ['pending', 'approved', 'rejected']);
  pgm.createType('notif_channel_enum', ['push', 'sms', 'email']);
  pgm.createType('notif_status_enum', ['pending', 'sent', 'failed']);

  // Users
  pgm.createTable('users', {
    id: { type: 'uuid', primaryKey: true, default: pgm.func('gen_random_uuid()') },
    phone: { type: 'varchar(20)', unique: true },
    email: { type: 'varchar(255)', unique: true },
    password_hash: { type: 'varchar(255)', notNull: true },
    name: { type: 'varchar(255)', notNull: true },
    language: { type: 'varchar(10)', default: 'rw' },
    role: { type: 'role_enum', default: 'patient' },
    district: { type: 'varchar(100)' },
    sector: { type: 'varchar(100)' },
    created_at: { type: 'timestamp', default: pgm.func('current_timestamp') },
    updated_at: { type: 'timestamp', default: pgm.func('current_timestamp') },
  });

  // Facilities
  pgm.createTable('facilities', {
    id: { type: 'uuid', primaryKey: true, default: pgm.func('gen_random_uuid()') },
    name: { type: 'varchar(255)', notNull: true },
    type: { type: 'facility_type_enum' },
    lat: { type: 'numeric' },
    lng: { type: 'numeric' },
    district: { type: 'varchar(100)' },
    services: { type: 'text[]' },
    phone: { type: 'varchar(20)' },
    hours: { type: 'jsonb' },
    mutuelle_accredited: { type: 'boolean', default: false },
    emergency_capable: { type: 'boolean', default: false },
  });

  // Pregnancy Profiles
  pgm.createTable('pregnancy_profiles', {
    id: { type: 'uuid', primaryKey: true, default: pgm.func('gen_random_uuid()') },
    user_id: { type: 'uuid', notNull: true, references: '"users"', onDelete: 'CASCADE' },
    lmp: { type: 'date' },
    edd: { type: 'date' },
    gravida: { type: 'integer' },
    para: { type: 'integer' },
    conditions: { type: 'text[]' },
    facility_id: { type: 'uuid', references: '"facilities"', onDelete: 'SET NULL' },
    active: { type: 'boolean', default: true },
    created_at: { type: 'timestamp', default: pgm.func('current_timestamp') },
  });

  // ANC Visits
  pgm.createTable('anc_visits', {
    id: { type: 'uuid', primaryKey: true, default: pgm.func('gen_random_uuid()') },
    profile_id: { type: 'uuid', notNull: true, references: '"pregnancy_profiles"', onDelete: 'CASCADE' },
    scheduled_date: { type: 'date' },
    actual_date: { type: 'date' },
    bp_systolic: { type: 'integer' },
    bp_diastolic: { type: 'integer' },
    weight_kg: { type: 'numeric' },
    fundal_height_cm: { type: 'numeric' },
    fetal_heart_rate: { type: 'integer' },
    urine_protein: { type: 'varchar(50)' },
    urine_glucose: { type: 'varchar(50)' },
    provider_notes: { type: 'text' },
    created_at: { type: 'timestamp', default: pgm.func('current_timestamp') },
  });

  // Symptom Logs
  pgm.createTable('symptom_logs', {
    id: { type: 'uuid', primaryKey: true, default: pgm.func('gen_random_uuid()') },
    profile_id: { type: 'uuid', notNull: true, references: '"pregnancy_profiles"', onDelete: 'CASCADE' },
    description: { type: 'text', notNull: true },
    triage_level: { type: 'triage_enum', notNull: true },
    ai_response: { type: 'jsonb' },
    danger_signs_detected: { type: 'text[]' },
    created_at: { type: 'timestamp', default: pgm.func('current_timestamp') },
    visit_flagged: { type: 'boolean', default: false },
  });

  // Medications
  pgm.createTable('medications', {
    id: { type: 'uuid', primaryKey: true, default: pgm.func('gen_random_uuid()') },
    profile_id: { type: 'uuid', notNull: true, references: '"pregnancy_profiles"', onDelete: 'CASCADE' },
    name: { type: 'varchar(255)', notNull: true },
    dose: { type: 'varchar(100)' },
    frequency: { type: 'varchar(100)' },
    start_date: { type: 'date' },
    end_date: { type: 'date' },
    reminder_time: { type: 'time' },
  });

  // Documents
  pgm.createTable('documents', {
    id: { type: 'uuid', primaryKey: true, default: pgm.func('gen_random_uuid()') },
    profile_id: { type: 'uuid', notNull: true, references: '"pregnancy_profiles"', onDelete: 'CASCADE' },
    type: { type: 'doc_type_enum' },
    s3_key: { type: 'text', notNull: true },
    file_name: { type: 'text' },
    mime_type: { type: 'varchar(100)' },
    encrypted: { type: 'boolean', default: true },
    deleted_at: { type: 'timestamp' },
    created_at: { type: 'timestamp', default: pgm.func('current_timestamp') },
  });

  // Community Posts
  pgm.createTable('community_posts', {
    id: { type: 'uuid', primaryKey: true, default: pgm.func('gen_random_uuid()') },
    user_id: { type: 'uuid', notNull: true, references: '"users"', onDelete: 'CASCADE' },
    subforum: { type: 'varchar(100)', notNull: true },
    content: { type: 'text', notNull: true },
    anonymous: { type: 'boolean', default: false },
    moderation_status: { type: 'mod_status_enum', default: 'pending' },
    parent_id: { type: 'uuid', references: '"community_posts"', onDelete: 'CASCADE' },
    created_at: { type: 'timestamp', default: pgm.func('current_timestamp') },
  });

  // Notifications
  pgm.createTable('notifications', {
    id: { type: 'uuid', primaryKey: true, default: pgm.func('gen_random_uuid()') },
    user_id: { type: 'uuid', notNull: true, references: '"users"', onDelete: 'CASCADE' },
    channel: { type: 'notif_channel_enum', notNull: true },
    type: { type: 'varchar(100)' },
    payload: { type: 'jsonb' },
    scheduled_at: { type: 'timestamp' },
    sent_at: { type: 'timestamp' },
    status: { type: 'notif_status_enum', default: 'pending' },
  });

  // CHW Assignments
  pgm.createTable('chw_assignments', {
    id: { type: 'uuid', primaryKey: true, default: pgm.func('gen_random_uuid()') },
    chw_user_id: { type: 'uuid', notNull: true, references: '"users"', onDelete: 'CASCADE' },
    patient_user_id: { type: 'uuid', notNull: true, references: '"users"', onDelete: 'CASCADE' },
    sector: { type: 'varchar(100)' },
    active: { type: 'boolean', default: true },
    assigned_at: { type: 'timestamp', default: pgm.func('current_timestamp') },
  });

  // Mood Logs
  pgm.createTable('mood_logs', {
    id: { type: 'uuid', primaryKey: true, default: pgm.func('gen_random_uuid()') },
    profile_id: { type: 'uuid', notNull: true, references: '"pregnancy_profiles"', onDelete: 'CASCADE' },
    score: { type: 'integer' },
    note: { type: 'text' },
    epds_score: { type: 'integer' },
    flagged: { type: 'boolean', default: false },
    created_at: { type: 'timestamp', default: pgm.func('current_timestamp') },
  });

  // Birth Plans
  pgm.createTable('birth_plans', {
    id: { type: 'uuid', primaryKey: true, default: pgm.func('gen_random_uuid()') },
    profile_id: { type: 'uuid', notNull: true, references: '"pregnancy_profiles"', onDelete: 'CASCADE' },
    content_json: { type: 'jsonb' },
    pdf_s3_key: { type: 'text' },
    updated_at: { type: 'timestamp', default: pgm.func('current_timestamp') },
  });

  // Indexes
  pgm.createIndex('facilities', ['lat', 'lng'], { method: 'gist' });
  pgm.createIndex('pregnancy_profiles', 'user_id');
  pgm.createIndex('pregnancy_profiles', 'facility_id');
  pgm.createIndex('anc_visits', 'profile_id');
  pgm.createIndex('symptom_logs', 'profile_id');
  pgm.createIndex('symptom_logs', 'triage_level', { where: "triage_level = 'red'" });
  pgm.createIndex('medications', 'profile_id');
  pgm.createIndex('documents', 'profile_id');
  pgm.createIndex('community_posts', 'user_id');
  pgm.createIndex('community_posts', 'parent_id');
  pgm.createIndex('notifications', 'user_id');
  pgm.createIndex('chw_assignments', 'chw_user_id');
  pgm.createIndex('chw_assignments', 'patient_user_id');
  pgm.createIndex('mood_logs', 'profile_id');
  pgm.createIndex('birth_plans', 'profile_id');
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  // Drop Indexes (auto-dropped with tables usually, but good practice)
  
  // Drop Tables
  pgm.dropTable('birth_plans');
  pgm.dropTable('mood_logs');
  pgm.dropTable('chw_assignments');
  pgm.dropTable('notifications');
  pgm.dropTable('community_posts');
  pgm.dropTable('documents');
  pgm.dropTable('medications');
  pgm.dropTable('symptom_logs');
  pgm.dropTable('anc_visits');
  pgm.dropTable('pregnancy_profiles');
  pgm.dropTable('facilities');
  pgm.dropTable('users');

  // Drop Enums
  pgm.dropType('notif_status_enum');
  pgm.dropType('notif_channel_enum');
  pgm.dropType('mod_status_enum');
  pgm.dropType('facility_type_enum');
  pgm.dropType('doc_type_enum');
  pgm.dropType('triage_enum');
  pgm.dropType('role_enum');
};
