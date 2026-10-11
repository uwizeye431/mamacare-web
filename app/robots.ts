import type { MetadataRoute } from 'next';
import { SITE_URL } from '../lib/site';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Personal pages and API endpoints are never useful in search results
      disallow: ['/api/', '/admin', '/dashboard', '/profile', '/report', '/login', '/forgot-password'],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
