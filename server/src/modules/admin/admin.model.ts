import { query } from '../../db/client';

// ---- Overview: aggregate counts only, never individual health records ----

export const getStats = async () => {
  const [users, signups, checks, levels, messages] = await Promise.all([
    query(`
      SELECT count(*)::int AS total,
             count(*) FILTER (WHERE is_verified)::int AS verified,
             count(*) FILTER (WHERE role = 'admin')::int AS admins,
             count(*) FILTER (WHERE disabled_at IS NOT NULL)::int AS deactivated,
             count(*) FILTER (WHERE created_at >= now() - interval '7 days')::int AS new_7_days,
             count(*) FILTER (WHERE created_at >= now() - interval '30 days')::int AS new_30_days
      FROM users`),
    query(`
      SELECT to_char(date_trunc('week', created_at), 'YYYY-MM-DD') AS week, count(*)::int AS count
      FROM users
      WHERE created_at >= date_trunc('week', now()) - interval '7 weeks'
      GROUP BY 1 ORDER BY 1`),
    query(`
      SELECT count(*)::int AS total,
             count(*) FILTER (WHERE created_at >= now() - interval '30 days')::int AS last_30_days
      FROM symptom_logs`),
    query(`
      SELECT triage_level::text AS level, count(*)::int AS count
      FROM symptom_logs
      WHERE created_at >= now() - interval '30 days'
      GROUP BY 1`),
    query(`
      SELECT count(*)::int AS total, count(*) FILTER (WHERE read_at IS NULL)::int AS unread
      FROM contact_messages`),
  ]);

  const byLevel = Object.fromEntries(levels.rows.map((r) => [r.level, r.count]));
  return {
    users: users.rows[0],
    signupsByWeek: signups.rows,
    symptomChecks: {
      ...checks.rows[0],
      last30DaysByLevel: { red: byLevel.red ?? 0, yellow: byLevel.yellow ?? 0, green: byLevel.green ?? 0 },
    },
    messages: messages.rows[0],
  };
};

// ---- Users ----

const USER_COLUMNS = 'id, name, email, phone, role, is_verified, disabled_at, created_at';

export const listUsers = async (search: string, limit: number, offset: number) => {
  const pattern = `%${search.replace(/[\\%_]/g, (c) => `\\${c}`)}%`;
  const where = search ? `WHERE name ILIKE $1 OR email ILIKE $1 OR phone ILIKE $1` : '';
  const params = search ? [pattern] : [];
  const [rows, count] = await Promise.all([
    query(
      `SELECT ${USER_COLUMNS} FROM users ${where} ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`,
      params
    ),
    query(`SELECT count(*)::int AS total FROM users ${where}`, params),
  ]);
  return { users: rows.rows, total: count.rows[0].total as number };
};

export const findUser = async (id: string) =>
  (await query(`SELECT ${USER_COLUMNS} FROM users WHERE id = $1`, [id])).rows[0];

export const countActiveAdmins = async () =>
  (await query(`SELECT count(*)::int AS n FROM users WHERE role = 'admin' AND disabled_at IS NULL`)).rows[0].n as number;

export const setUserRole = async (id: string, role: 'patient' | 'admin') =>
  (await query(`UPDATE users SET role = $2, updated_at = now() WHERE id = $1 RETURNING ${USER_COLUMNS}`, [id, role])).rows[0];

export const setUserDisabled = async (id: string, disabled: boolean) =>
  (
    await query(
      `UPDATE users SET disabled_at = ${disabled ? 'now()' : 'NULL'}, updated_at = now() WHERE id = $1 RETURNING ${USER_COLUMNS}`,
      [id]
    )
  ).rows[0];

// Permanently deletes the account and everything linked to it (profiles, symptom logs and
// visits are removed by ON DELETE CASCADE; codes are keyed by email)
export const deleteUser = async (id: string) => {
  const user = await findUser(id);
  if (!user) return false;
  if (user.email) {
    await query('DELETE FROM user_otps WHERE email = $1', [user.email]);
    await query('DELETE FROM password_resets WHERE email = $1', [user.email]);
  }
  await query('DELETE FROM users WHERE id = $1', [id]);
  return true;
};

// ---- Contact messages ----

export const listMessages = async (unreadOnly: boolean, limit: number, offset: number) => {
  const where = unreadOnly ? 'WHERE read_at IS NULL' : '';
  const [rows, count] = await Promise.all([
    query(`SELECT * FROM contact_messages ${where} ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`),
    query(`SELECT count(*)::int AS total FROM contact_messages ${where}`),
  ]);
  return { messages: rows.rows, total: count.rows[0].total as number };
};

export const setMessageRead = async (id: string, read: boolean) =>
  (
    await query(`UPDATE contact_messages SET read_at = ${read ? 'now()' : 'NULL'} WHERE id = $1 RETURNING *`, [id])
  ).rows[0];

export const deleteMessage = async (id: string) =>
  ((await query('DELETE FROM contact_messages WHERE id = $1', [id])).rowCount ?? 0) > 0;
