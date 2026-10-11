// API tests for the admin area and the contact form.
// Needs a PostgreSQL database with migrations applied (DATABASE_URL). No real emails are sent.

import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'crypto';
import type { Server } from 'http';
import type { AddressInfo } from 'net';

// Must be set before the app (and dotenv) load: existing env vars are never overridden by .env
(process.env as Record<string, string>).NODE_ENV = 'test'; // typed read-only by Next.js
process.env.RESEND_API_KEY = '';
process.env.SMTP_HOST = '';
process.env.SMTP_USER = '';
process.env.SMTP_PASS = '';
process.env.CONTACT_RECEIVER_EMAIL = '';

const RUN = crypto.randomBytes(4).toString('hex');
const email = (name: string) => `test+${RUN}-${name}@mamacare.test`;
const PASSWORD = 'CorrectHorse9';

let server: Server;
let baseUrl = '';
let query: (text: string, params?: unknown[]) => Promise<{ rows: Record<string, unknown>[] }>;
let closePool: () => Promise<void>;

before(async () => {
  const { default: app } = await import('../src/app');
  const db = await import('../src/db/client');
  query = db.query as typeof query;
  closePool = db.closePool;
  server = app.listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  baseUrl = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
});

after(async () => {
  await query(`DELETE FROM contact_messages WHERE subject LIKE $1`, [`%${RUN}%`]);
  await query(`DELETE FROM user_otps WHERE email LIKE $1`, [`test+${RUN}-%`]);
  await query(`DELETE FROM users WHERE email LIKE $1`, [`test+${RUN}-%`]);
  server.close();
  await closePool();
});

const call = async (method: string, path: string, body?: object, cookie = '') => {
  const res = await fetch(`${baseUrl}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json', ...(cookie ? { Cookie: cookie } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = await res.json().catch(() => ({}));
  const setCookie = res.headers.getSetCookie().map((c) => c.split(';')[0]).join('; ');
  return { status: res.status, body: json as Record<string, unknown>, cookie: setCookie };
};

/** Creates a verified account (optionally an admin) and returns its id and session cookie. */
const account = async (name: string, role: 'patient' | 'admin' = 'patient') => {
  const address = email(name);
  await call('POST', '/api/auth/register', { name: `Test ${name}`, email: address, password: PASSWORD, acceptedTerms: true });
  await query(`UPDATE users SET is_verified = TRUE, role = $2 WHERE email = $1`, [address, role]);
  const login = await call('POST', '/api/auth/login', { identifier: address, password: PASSWORD });
  assert.equal(login.status, 200);
  const id = (await query('SELECT id FROM users WHERE email = $1', [address])).rows[0].id as string;
  return { id, email: address, cookie: login.cookie };
};

test('admin endpoints require an admin', async () => {
  assert.equal((await call('GET', '/api/admin/stats')).status, 401);
  const mother = await account('mother');
  assert.equal((await call('GET', '/api/admin/stats', undefined, mother.cookie)).status, 403);
  assert.equal((await call('GET', '/api/admin/users', undefined, mother.cookie)).status, 403);
});

test('admin overview returns totals only', async () => {
  const admin = await account('admin-stats', 'admin');
  const res = await call('GET', '/api/admin/stats', undefined, admin.cookie);
  assert.equal(res.status, 200);
  const users = res.body.users as Record<string, number>;
  assert.ok(users.total >= 1 && users.admins >= 1);
  assert.ok(Array.isArray(res.body.signupsByWeek));
  assert.deepEqual(Object.keys((res.body.symptomChecks as Record<string, object>).last30DaysByLevel).sort(), ['green', 'red', 'yellow']);
});

test('admin can search users, change roles and deactivate, but not lock themselves out', async () => {
  const admin = await account('admin-users', 'admin');
  const target = await account('target');

  const found = await call('GET', `/api/admin/users?search=${encodeURIComponent(target.email)}`, undefined, admin.cookie);
  assert.equal(found.status, 200);
  const users = found.body.users as Record<string, unknown>[];
  assert.equal(users.length, 1);
  assert.equal('password_hash' in users[0], false);

  assert.equal((await call('PATCH', `/api/admin/users/${admin.id}`, { role: 'patient' }, admin.cookie)).status, 400);
  assert.equal((await call('PATCH', `/api/admin/users/${admin.id}`, { disabled: true }, admin.cookie)).status, 400);
  assert.equal((await call('DELETE', `/api/admin/users/${admin.id}`, undefined, admin.cookie)).status, 400);
  assert.equal((await call('PATCH', '/api/admin/users/not-a-uuid', { role: 'admin' }, admin.cookie)).status, 400);
  assert.equal((await call('PATCH', `/api/admin/users/${target.id}`, { role: 'superuser' }, admin.cookie)).status, 400);

  const promoted = await call('PATCH', `/api/admin/users/${target.id}`, { role: 'admin' }, admin.cookie);
  assert.equal((promoted.body.user as Record<string, unknown>).role, 'admin');
  await call('PATCH', `/api/admin/users/${target.id}`, { role: 'patient' }, admin.cookie);

  // A deactivated account cannot log in, and its session stops renewing
  assert.equal((await call('PATCH', `/api/admin/users/${target.id}`, { disabled: true }, admin.cookie)).status, 200);
  assert.equal((await call('POST', '/api/auth/login', { identifier: target.email, password: PASSWORD })).status, 403);
  const refreshOnly = target.cookie.split('; ').filter((c) => c.startsWith('refresh_token=')).join('; ');
  assert.equal((await call('GET', '/api/symptoms/history', undefined, refreshOnly)).status, 401);

  await call('PATCH', `/api/admin/users/${target.id}`, { disabled: false }, admin.cookie);
  assert.equal((await call('POST', '/api/auth/login', { identifier: target.email, password: PASSWORD })).status, 200);
});

test('a demoted admin loses access once their session renews', async () => {
  const admin = await account('admin-demote', 'admin');
  const other = await account('admin-other', 'admin');
  await call('PATCH', `/api/admin/users/${other.id}`, { role: 'patient' }, admin.cookie);
  // Simulate the 15-minute access token expiring: only the refresh token is left
  const refreshOnly = other.cookie.split('; ').filter((c) => c.startsWith('refresh_token=')).join('; ');
  assert.equal((await call('GET', '/api/admin/stats', undefined, refreshOnly)).status, 403);
});

test('admin can delete a user and their data', async () => {
  const admin = await account('admin-delete', 'admin');
  const target = await account('delete-me');
  await call('POST', '/api/symptoms/log', { symptoms: 'I feel nauseous every morning' }, target.cookie);

  assert.equal((await call('DELETE', `/api/admin/users/${target.id}`, undefined, admin.cookie)).status, 204);
  assert.equal((await query('SELECT count(*)::int AS n FROM users WHERE id = $1', [target.id])).rows[0].n, 0);
  assert.equal((await call('DELETE', `/api/admin/users/${target.id}`, undefined, admin.cookie)).status, 404);
});

test('contact form messages are stored and managed in the admin area', async () => {
  assert.equal((await call('POST', '/api/contact', { fullName: 'A' })).status, 400);
  assert.equal(
    (await call('POST', '/api/contact', { fullName: 'A', email: 'not-an-email', subject: 's', message: 'long enough message' })).status,
    400
  );

  const subject = `Question ${RUN}`;
  const sent = await call('POST', '/api/contact', {
    fullName: 'Test Visitor',
    email: 'visitor@mamacare.test',
    phone: '+250788000000',
    subject,
    message: 'When should I book my first antenatal visit?',
  });
  assert.equal(sent.status, 201);

  const admin = await account('admin-messages', 'admin');
  const unread = await call('GET', '/api/admin/messages?status=unread', undefined, admin.cookie);
  const message = (unread.body.messages as Record<string, unknown>[]).find((m) => m.subject === subject);
  assert.ok(message, 'the new message is listed as unread');

  const read = await call('PATCH', `/api/admin/messages/${message!.id}`, { read: true }, admin.cookie);
  assert.ok((read.body.message as Record<string, unknown>).read_at);
  assert.equal((await call('DELETE', `/api/admin/messages/${message!.id}`, undefined, admin.cookie)).status, 204);
});
