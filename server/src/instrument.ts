// Error monitoring with Sentry. Imported first by index.ts (Sentry must start before Express loads).
// Does nothing unless SENTRY_DSN is set.
import './config/env';
import * as Sentry from '@sentry/node';

if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV || 'development',
    // Health data must never leave our servers in error reports: no user details, cookies,
    // query strings or request/response bodies (symptom descriptions, profiles). Sentry 11
    // collects bodies by default, so every category is switched off explicitly.
    dataCollection: {
      userInfo: false,
      cookies: false,
      httpHeaders: { request: { allow: ['user-agent', 'content-type'] }, response: false },
      httpBodies: [],
      urlQueryParams: false,
    },
    tracesSampleRate: 0,
    // Second line of defence: strip anything sensitive that still made it into the event
    beforeSend(event) {
      if (event.request) {
        delete event.request.data;
        delete event.request.cookies;
        delete event.request.query_string;
        // URLs keep their path only: query strings can carry personal data
        if (event.request.url) event.request.url = event.request.url.split('?')[0];
        if (event.request.headers) {
          delete event.request.headers.cookie;
          delete event.request.headers.authorization;
        }
      }
      delete event.user;
      for (const crumb of event.breadcrumbs ?? []) {
        if (typeof crumb.data?.url === 'string') crumb.data.url = crumb.data.url.split('?')[0];
      }
      return event;
    },
  });
  console.log('Sentry: error monitoring enabled.');
}
