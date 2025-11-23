/**
 * Robots.txt - Portfolio Frontend
 * https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots
 */

import { MetadataRoute } from 'next';
import { customRobots } from '@/shared/seo';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://portfolio.sergioja.com';

  const cfg = customRobots({
    allowPaths: ['/'],
    disallowPaths: ['/api/', '/admin/'],
    sitemaps: [`${baseUrl}/sitemap.xml`],
  });

  return {
    rules: cfg.rules.map(rule => ({
      userAgent: rule.userAgent,
      allow: rule.allow,
      disallow: rule.disallow,
      crawlDelay: rule.crawlDelay,
    })),
    sitemap: cfg.sitemaps?.[0] || `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
