/**
 * SEO Utilities para Admin
 * Re-exporta funciones compartidas con configuración específica para admin
 */

export {
  generateMetadata,
  mergeMetadata,
  generateTitle,
  truncateDescription,
  generateKeywords,
  normalizeUrl,
} from '@/shared/seo';

export {
  disallowAllRobots,
  generateRobotsTxt,
  type RobotsTxtConfig,
  type RobotsTxtRule,
} from '@/shared/seo';

export type {
  SEOMetadata,
  RobotsConfig,
  OpenGraphMetadata,
  TwitterCardMetadata,
} from '@/shared/seo';

export { siteConfig } from './config';

/**
 * Metadata base para admin - Bloquea completamente la indexación
 */
export const adminBaseMetadata = {
  robots: {
    index: false,
    follow: false,
    noarchive: true,
    nosnippet: true,
    noimageindex: true,
    maxSnippet: -1,
    maxImagePreview: 'none' as const,
    maxVideoPreview: -1,
  },
};
