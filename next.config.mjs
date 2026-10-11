import createNextIntlPlugin from 'next-intl/plugin';

// Interface translations (English / Kinyarwanda): see i18n/request.ts and messages/
const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

// When API_PROXY_URL is set (e.g. https://mamacare-api.onrender.com), the website forwards
// /api/* requests to the Express API itself. The browser then talks to a single site, so the
// login cookie is first-party and works in every browser (Safari blocks cross-site cookies).
// Leave NEXT_PUBLIC_API_URL unset in that case so the pages call relative /api/... URLs.
const apiProxyUrl = process.env.API_PROXY_URL?.replace(/\/+$/, '');

/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return apiProxyUrl ? [{ source: '/api/:path*', destination: `${apiProxyUrl}/api/:path*` }] : [];
  },
};

export default withNextIntl(nextConfig);
