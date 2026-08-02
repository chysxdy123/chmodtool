import type { MetadataRoute } from 'next';
import { permissionGuides } from '@/content/chmod-permissions';
import { siteConfig } from '@/lib/config';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date('2026-07-30T00:00:00.000Z');

  return [
    { url: `${siteConfig.url}/`, lastModified, priority: 1 },
    ...permissionGuides.map(({ slug }) => ({
      url: `${siteConfig.url}/${slug}`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
    {
      url: `${siteConfig.url}/fix/ssh-key-permissions-too-open`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    },
    {
      url: `${siteConfig.url}/fix/pem-file-permissions`,
      lastModified: new Date('2026-07-31T00:00:00.000Z'),
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    },
    {
      url: `${siteConfig.url}/about`,
      lastModified: new Date('2026-08-02T00:00:00.000Z'),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    { url: `${siteConfig.url}/privacy-policy`, lastModified, priority: 0.2 },
    { url: `${siteConfig.url}/terms-of-service`, lastModified, priority: 0.2 },
  ];
}
