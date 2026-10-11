// Shared Sentry settings for the website (browser and server). Error reports must never contain
// health data: no user details, cookies, query strings or request/response bodies.
import type { ErrorEvent } from '@sentry/nextjs';

export const sentryOptions = (dsn: string) => ({
  dsn,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0,
  dataCollection: {
    userInfo: false,
    cookies: false,
    httpHeaders: { request: { allow: ['user-agent', 'content-type'] }, response: false },
    httpBodies: [],
    urlQueryParams: false,
  },
  beforeSend(event: ErrorEvent) {
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
