/**
 * Page Metadata Generator - Main
 * Genera metadata consistente para todas las páginas
 */

import { Metadata } from 'next';
import { mergeMetadata, generateTitle } from '@/shared/seo';
import { defaultSEO, siteConfig } from './config';

interface PageMetadataOptions {
  title: string;
  description: string;
  keywords?: string[];
  canonical?: string;
  ogImage?: string;
  noIndex?: boolean;
  type?: 'website' | 'article' | 'profile';
}

/**
 * Genera metadata completa para una página
 */
export function generatePageMetadata(options: PageMetadataOptions): Metadata {
  const baseUrl = siteConfig.url;
  const fullTitle = generateTitle(options.title, siteConfig.name);
  const canonicalUrl = options.canonical || baseUrl;
  const ogImageUrl = options.ogImage || `${baseUrl}/media/logo%20sergioja.png`;

  return {
    title: fullTitle,
    description: options.description,
    keywords: options.keywords || defaultSEO.keywords,
    
    robots: options.noIndex ? {
      index: false,
      follow: false,
    } : {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },

    alternates: {
      canonical: canonicalUrl,
    },

    openGraph: {
      type: options.type || 'website',
      title: fullTitle,
      description: options.description,
      url: canonicalUrl,
      siteName: siteConfig.name,
      locale: 'es_ES',
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: options.title,
          type: 'image/jpeg',
        },
      ],
    },

    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: options.description,
      images: [ogImageUrl],
    },
  };
}

/**
 * Metadata para página de inicio
 */
export const homeMetadata = generatePageMetadata({
  title: 'Inicio',
  description: 'Desarrollador Full Stack especializado en React, Next.js, Node.js y TypeScript. Creando experiencias web modernas y escalables.',
  keywords: [
    'Sergio Jáuregui',
    'Desarrollador Full Stack',
    'React',
    'Next.js',
    'TypeScript',
  ],
  canonical: siteConfig.url,
});

/**
 * Metadata para página sobre mí
 */
export const aboutMetadata = generatePageMetadata({
  title: 'Sobre Mí',
  description: 'Conoce más sobre mi experiencia profesional, habilidades técnicas y trayectoria como desarrollador Full Stack.',
  keywords: [
    'Sobre Mí',
    'Experiencia',
    'Habilidades',
    'Desarrollador',
  ],
  canonical: `${siteConfig.url}/about`,
  type: 'profile',
});

/**
 * Metadata para página de servicios
 */
export const servicesMetadata = generatePageMetadata({
  title: 'Servicios',
  description: 'Servicios de desarrollo web profesional: aplicaciones React, APIs REST, consultoría técnica y más.',
  keywords: [
    'Servicios',
    'Desarrollo Web',
    'Consultoría',
    'React',
    'Node.js',
  ],
  canonical: `${siteConfig.url}/services`,
});

/**
 * Metadata para página de contacto
 */
export const contactMetadata = generatePageMetadata({
  title: 'Contacto',
  description: '¿Tienes un proyecto en mente? Contáctame para discutir cómo puedo ayudarte a hacerlo realidad.',
  keywords: [
    'Contacto',
    'Contratar',
    'Freelance',
  ],
  canonical: `${siteConfig.url}/contact`,
});
