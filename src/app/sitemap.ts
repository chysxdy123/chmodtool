import type { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/config';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date('2026-07-29T00:00:00.000Z');

  return [
    { url: `${siteConfig.url}/`, lastModified, priority: 1 },
    { url: `${siteConfig.url}/privacy-policy`, lastModified, priority: 0.2 },
    { url: `${siteConfig.url}/terms-of-service`, lastModified, priority: 0.2 },
  ];
}
