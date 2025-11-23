/**
 * SEO Metadata Utilities
 * Funciones helper para generar metadata de Next.js 14
 */

import type { Metadata } from 'next';
import type { SEOMetadata, OpenGraphMetadata, TwitterCardMetadata } from './types';

/**
 * Genera metadata de Next.js 14 desde configuración SEO
 */
export function generateMetadata(config: SEOMetadata, baseUrl: string): Metadata {
  const metadata: Metadata = {
    title: config.title,
    description: config.description,
    keywords: config.keywords,
    authors: config.author ? [{ name: config.author }] : undefined,
    
    // Robots
    robots: config.robots ? {
      index: config.robots.index ?? true,
      follow: config.robots.follow ?? true,
      noarchive: config.robots.noarchive,
      nosnippet: config.robots.nosnippet,
      noimageindex: config.robots.noimageindex,
      'max-snippet': config.robots.maxSnippet,
      'max-image-preview': config.robots.maxImagePreview,
      'max-video-preview': config.robots.maxVideoPreview,
    } : undefined,

    // Open Graph
    openGraph: config.openGraph ? generateOpenGraph(config.openGraph, baseUrl) : undefined,

    // Twitter
    twitter: config.twitter ? generateTwitterCard(config.twitter) : undefined,

    // Alternates
    alternates: config.alternates ? {
      canonical: config.alternates.canonical,
      languages: config.alternates.languages,
    } : undefined,
  };

  return metadata;
}

/**
 * Genera configuración de Open Graph
 */
function generateOpenGraph(og: OpenGraphMetadata, baseUrl: string): Metadata['openGraph'] {
  return {
    type: og.type || 'website',
    title: og.title,
    description: og.description,
    url: og.url || baseUrl,
    siteName: og.siteName,
    locale: og.locale || 'es_ES',
    images: og.images?.map(img => ({
      url: img.url,
      secureUrl: img.secureUrl,
      type: img.type,
      width: img.width,
      height: img.height,
      alt: img.alt,
    })),
    videos: og.videos?.map(video => ({
      url: video.url,
      secureUrl: video.secureUrl,
      type: video.type,
      width: video.width,
      height: video.height,
    })),
    publishedTime: og.article?.publishedTime,
    modifiedTime: og.article?.modifiedTime,
    expirationTime: og.article?.expirationTime,
    authors: og.article?.authors,
    section: og.article?.section,
    tags: og.article?.tags,
  };
}

/**
 * Genera configuración de Twitter Card
 */
function generateTwitterCard(twitter: TwitterCardMetadata): Metadata['twitter'] {
  return {
    card: twitter.card || 'summary_large_image',
    site: twitter.site,
    creator: twitter.creator,
    title: twitter.title,
    description: twitter.description,
    images: twitter.images,
  };
}

/**
 * Combina metadata base con metadata específica de página
 */
export function mergeMetadata(base: SEOMetadata, page: Partial<SEOMetadata>): SEOMetadata {
  return {
    ...base,
    ...page,
    title: page.title || base.title,
    description: page.description || base.description,
    keywords: page.keywords || base.keywords,
    openGraph: page.openGraph ? {
      ...base.openGraph,
      ...page.openGraph,
      images: page.openGraph.images || base.openGraph?.images,
    } : base.openGraph,
    twitter: page.twitter ? {
      ...base.twitter,
      ...page.twitter,
    } : base.twitter,
  };
}

/**
 * Genera título con template
 */
export function generateTitle(title: string, siteName: string, separator: string = '|'): string {
  return `${title} ${separator} ${siteName}`;
}

/**
 * Trunca descripción a longitud máxima para SEO
 */
export function truncateDescription(description: string, maxLength: number = 160): string {
  if (description.length <= maxLength) return description;
  return description.substring(0, maxLength - 3) + '...';
}

/**
 * Genera keywords desde array
 */
export function generateKeywords(keywords: string[]): string {
  return keywords.join(', ');
}

/**
 * Valida y normaliza URL
 */
export function normalizeUrl(url: string, baseUrl: string): string {
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  return `${baseUrl.replace(/\/$/, '')}/${url.replace(/^\//, '')}`;
}
