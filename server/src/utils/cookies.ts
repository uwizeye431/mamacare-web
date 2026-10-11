import { CookieOptions } from 'express';

const isProduction = process.env.NODE_ENV === 'production';

// In production the web app and the API live on different domains, so the auth cookies
// are cross-site and need SameSite=None (which browsers only accept with Secure).
// Locally both run on localhost, which counts as same-site, so Lax is enough.
export const AUTH_COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? 'none' : 'lax',
};
