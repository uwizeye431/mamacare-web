// Base URL for calls to the Express API (baked into the frontend at build time).
// - Set NEXT_PUBLIC_API_URL to call the API directly (local development: http://localhost:5000).
// - Leave it empty when the website forwards /api/* to the API (API_PROXY_URL in next.config.mjs);
//   pages then call relative /api/... URLs on their own site.
export const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? '').replace(/\/+$/, '');
