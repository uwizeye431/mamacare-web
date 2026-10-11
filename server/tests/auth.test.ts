// API tests for sign-up, verification, login, password reset and symptom checks.
// Needs a PostgreSQL database with migrations applied (DATABASE_URL), like the real server.
// No real emails are sent: email settings are cleared, so the dev JSON transport is used.

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
  await query(`DELETE FROM user_otps WHERE email LIKE $1`, [`test+${RUN}-%`]);
  await query(`DELETE FROM password_resets WHERE email LIKE $1`, [`test+${RUN}-%`]);
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

const register = (address: string, extra: object = {}) =>
  call('POST', '/api/auth/register', { name: 'Test Mother', email: address, password: PASSWORD, acceptedTerms: true, ...extra });

const otpFor = async (address: string) =>
  (await query('SELECT otp FROM user_otps WHERE email = $1', [address])).rows[0]?.otp as string;

/** Registers and verifies an account, returning its session cookie. */
const verifiedAccount = async (address: string) => {
  await register(address);
  const res = await call('POST', '/api/auth/verify-otp', { email: address, otp: await otpFor(address) });
  assert.equal(res.status, 200);
  return res.cookie;
};

test('sign-up rejects a short password', async () => {
  const res = await call('POST', '/api/auth/register', { name: 'A', email: email('short'), password: 'short', acceptedTerms: true });
  assert.equal(res.status, 400);
});

test('sign-up requires accepting the terms', async () => {
  const res = await call('POST', '/api/auth/register', { name: 'A', email: email('noterms'), password: PASSWORD });
  assert.equal(res.status, 400);
});

test('sign-up ignores a role sent by the client and records consent', async () => {
  const address = email('role');
  assert.equal((await register(address, { role: 'admin' })).status, 201);
  const row = (await query('SELECT role, phone, terms_accepted_at FROM users WHERE email = $1', [address])).rows[0];
  assert.equal(row.role, 'patient');
  assert.equal(row.phone, null);
  assert.ok(row.terms_accepted_at);
});

test('two people can sign up without a phone number', async () => {
  assert.equal((await register(email('nophone1'))).status, 201);
  assert.equal((await register(email('nophone2'))).status, 201);
});

test('login is blocked until the email is verified', async () => {
  const address = email('unverified');
  await register(address);
  const res = await call('POST', '/api/auth/login', { identifier: address, password: PASSWORD });
  assert.equal(res.status, 403);
  assert.equal(res.body.requiresVerification, true);
});

test('email verification: wrong code fails, right code logs in without leaking the password hash', async () => {
  const address = email('verify');
  await register(address);
  assert.equal((await call('POST', '/api/auth/verify-otp', { email: address, otp: '000000' })).status, 400);

  const res = await call('POST', '/api/auth/verify-otp', { email: address, otp: await otpFor(address) });
  assert.equal(res.status, 200);
  assert.match(res.cookie, /access_token=/);
  const user = res.body.user as Record<string, unknown>;
  assert.equal(user.email, address);
  assert.equal('password_hash' in user, false);
});

test('login: wrong password fails, email is case-insensitive', async () => {
  const address = email('login');
  await verifiedAccount(address);
  assert.equal((await call('POST', '/api/auth/login', { identifier: address, password: 'WrongPass99' })).status, 401);

  const res = await call('POST', '/api/auth/login', { identifier: address.toUpperCase(), password: PASSWORD });
  assert.equal(res.status, 200);
  assert.equal('password_hash' in (res.body.user as object), false);
});

test('password reset: same answer for unknown emails, then code, token and new password', async () => {
  const address = email('reset');
  await verifiedAccount(address);

  const unknown = await call('POST', '/api/auth/forgot-password', { email: email('nobody') });
  const known = await call('POST', '/api/auth/forgot-password', { email: address });
  assert.equal(unknown.status, 200);
  assert.equal(known.status, 200);
  assert.equal(unknown.body.message, known.body.message);

  // The real code is only in the email; plant a known one (codes are stored as SHA-256 hashes)
  const code = '424242';
  await query('UPDATE password_resets SET code_hash = $2 WHERE email = $1', [
    address,
    crypto.createHash('sha256').update(code).digest('hex'),
  ]);

  assert.equal((await call('POST', '/api/auth/verify-reset-code', { email: address, code: '111111' })).status, 400);
  const verified = await call('POST', '/api/auth/verify-reset-code', { email: address, code });
  assert.equal(verified.status, 200);
  const resetToken = verified.body.resetToken as string;

  const newPassword = 'BrandNewPass7';
  assert.equal((await call('POST', '/api/auth/reset-password', { email: address, resetToken, password: newPassword })).status, 200);
  // The token works only once
  assert.equal((await call('POST', '/api/auth/reset-password', { email: address, resetToken, password: 'Another1234' })).status, 400);

  assert.equal((await call('POST', '/api/auth/login', { identifier: address, password: PASSWORD })).status, 401);
  assert.equal((await call('POST', '/api/auth/login', { identifier: address, password: newPassword })).status, 200);
});

test('password reset locks after too many wrong codes', async () => {
  const address = email('lockout');
  await verifiedAccount(address);
  await call('POST', '/api/auth/forgot-password', { email: address });
  for (let i = 0; i < 5; i++) {
    await call('POST', '/api/auth/verify-reset-code', { email: address, code: '000000' });
  }
  const res = await call('POST', '/api/auth/verify-reset-code', { email: address, code: '000000' });
  assert.equal(res.status, 429);
});

test('symptom checks: guests get a result that is not saved; logged-in results are saved', async () => {
  const guest = await call('POST', '/api/symptoms/log', { symptoms: 'I am bleeding heavily' });
  assert.equal(guest.status, 200);
  assert.equal(guest.body.saved, false);
  assert.equal((guest.body.log as Record<string, unknown>).triage_level, 'red');

  assert.equal((await call('GET', '/api/symptoms/history')).status, 401);

  const cookie = await verifiedAccount(email('symptoms'));
  const saved = await call('POST', '/api/symptoms/log', { symptoms: 'I feel nauseous every morning' }, cookie);
  assert.equal(saved.status, 201);
  assert.equal(saved.body.saved, true);

  const history = await call('GET', '/api/symptoms/history', undefined, cookie);
  assert.equal(history.status, 200);
  assert.equal((history.body.logs as unknown[]).length, 1);
});

test('a forged token signed with the old fallback secret is rejected', async () => {
  const jwt = await import('jsonwebtoken');
  const forged = jwt.default.sign({ userId: crypto.randomUUID(), role: 'admin' }, 'fallback_secret_please_change');
  assert.equal((await call('GET', '/api/symptoms/history', undefined, `access_token=${forged}`)).status, 401);
});
