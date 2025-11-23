/**
 * Sitemap - Main Frontend
 * https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
 */

import { MetadataRoute } from 'next';
import { createSitemapEntry } from '@/shared/seo';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sergioja.com';
  const currentDate = new Date();

  return [
    createSitemapEntry(baseUrl, { lastModified: currentDate, changeFrequency: 'monthly', priority: 1.0 }),
  ];
}
