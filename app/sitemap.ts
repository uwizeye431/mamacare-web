import type { MetadataRoute } from 'next';
import { SITE_URL } from '../lib/site';

// Public pages only: personal pages (dashboard, profile, report, ...) are excluded and marked noindex
const PAGES: { path: string; priority: number; changeFrequency: 'weekly' | 'monthly' | 'yearly' }[] = [
  { path: '', priority: 1, changeFrequency: 'weekly' },
  { path: '/prenatal-care', priority: 0.9, changeFrequency: 'monthly' },
  { path: '/symptoms', priority: 0.9, changeFrequency: 'monthly' },
  { path: '/lactation-consulting', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/postpartum-support', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/pediatric-basics', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/fitness', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/baby-names', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/blog', priority: 0.6, changeFrequency: 'weekly' },
  { path: '/blog/first-anc-visit', priority: 0.5, changeFrequency: 'yearly' },
  { path: '/blog/nutrition-tips-stronger-pregnancy', priority: 0.5, changeFrequency: 'yearly' },
  { path: '/about', priority: 0.5, changeFrequency: 'yearly' },
  { path: '/contact', priority: 0.5, changeFrequency: 'yearly' },
  { path: '/careers', priority: 0.3, changeFrequency: 'monthly' },
  { path: '/register', priority: 0.4, changeFrequency: 'yearly' },
  { path: '/privacy', priority: 0.2, changeFrequency: 'yearly' },
  { path: '/terms', priority: 0.2, changeFrequency: 'yearly' },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return PAGES.map((page) => ({
    url: `${SITE_URL}${page.path}`,
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));
}
