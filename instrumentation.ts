// Server-side error monitoring for the website (rendering and route errors).
// Does nothing unless SENTRY_DSN (or NEXT_PUBLIC_SENTRY_DSN) is set.
import * as Sentry from '@sentry/nextjs';
import { sentryOptions } from './lib/sentry';

export function register() {
  const dsn = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;
  if (dsn) {
    Sentry.init(sentryOptions(dsn));
  }
}

// Called by Next.js for errors thrown while rendering pages or running route handlers
export const onRequestError = Sentry.captureRequestError;
