/**
 * Sitemap Utilities
 * Funciones helper para generar sitemaps XML
 */

import type { SitemapEntry } from './types';

/**
 * Genera XML de sitemap desde array de URLs
 */
export function generateSitemapXml(entries: SitemapEntry[]): string {
  const urlEntries = entries
    .map((entry) => {
      const loc = escapeXml(entry.url);
      const lastmod = entry.lastModified
        ? `\n    <lastmod>${formatDate(entry.lastModified)}</lastmod>`
        : '';
      const changefreq = entry.changeFrequency
        ? `\n    <changefreq>${entry.changeFrequency}</changefreq>`
        : '';
      const priority = entry.priority !== undefined
        ? `\n    <priority>${entry.priority}</priority>`
        : '';

      // Alternates para i18n
      const alternates = entry.alternates?.languages
        ? Object.entries(entry.alternates.languages)
            .map(
              ([lang, url]) =>
                `\n    <xhtml:link rel="alternate" hreflang="${lang}" href="${escapeXml(url)}" />`
            )
            .join('')
        : '';

      return `  <url>
    <loc>${loc}</loc>${lastmod}${changefreq}${priority}${alternates}
  </url>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urlEntries}
</urlset>`;
}

/**
 * Genera sitemap index (para múltiples sitemaps)
 */
export function generateSitemapIndex(sitemaps: Array<{ url: string; lastModified?: Date | string }>): string {
  const sitemapEntries = sitemaps
    .map((sitemap) => {
      const loc = escapeXml(sitemap.url);
      const lastmod = sitemap.lastModified
        ? `\n    <lastmod>${formatDate(sitemap.lastModified)}</lastmod>`
        : '';

      return `  <sitemap>
    <loc>${loc}</loc>${lastmod}
  </sitemap>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries}
</sitemapindex>`;
}

/**
 * Formatea fecha para sitemap (ISO 8601)
 */
function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toISOString();
}

/**
 * Escapa caracteres especiales XML
 */
function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Crea entrada de sitemap básica
 */
export function createSitemapEntry(
  url: string,
  options?: {
    lastModified?: Date | string;
    changeFrequency?: SitemapEntry['changeFrequency'];
    priority?: number;
    alternates?: Record<string, string>;
  }
): SitemapEntry {
  return {
    url,
    lastModified: options?.lastModified,
    changeFrequency: options?.changeFrequency,
    priority: options?.priority,
    alternates: options?.alternates ? { languages: options.alternates } : undefined,
  };
}

/**
 * Valida prioridad de sitemap (0.0 - 1.0)
 */
export function validatePriority(priority: number): number {
  return Math.max(0, Math.min(1, priority));
}
