// Browser error monitoring. Does nothing unless NEXT_PUBLIC_SENTRY_DSN is set.
import * as Sentry from '@sentry/nextjs';
import { sentryOptions } from './lib/sentry';

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
if (dsn) {
  Sentry.init(sentryOptions(dsn));
}

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
