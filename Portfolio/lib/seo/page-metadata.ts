/**
 * Page Metadata Generator - Portfolio
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
  description: 'Portfolio profesional de Sergio Jáuregui. Explora mis proyectos, habilidades técnicas y experiencia en desarrollo Full Stack.',
  keywords: [
    'Sergio Jáuregui',
    'Portfolio',
    'Desarrollador Full Stack',
    'React',
    'Next.js',
    'TypeScript',
  ],
  canonical: siteConfig.url,
});

/**
 * Metadata para página de proyectos
 */
export const workMetadata = generatePageMetadata({
  title: 'Proyectos',
  description: 'Descubre los proyectos en los que he trabajado. Aplicaciones web modernas, e-commerce, dashboards y más.',
  keywords: [
    'Proyectos',
    'Portfolio',
    'Desarrollo Web',
    'React',
    'Next.js',
    'Node.js',
  ],
  canonical: `${siteConfig.url}/projects`,
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
    'Full Stack',
  ],
  canonical: `${siteConfig.url}/about`,
  type: 'profile',
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
    'Desarrollador',
  ],
  canonical: `${siteConfig.url}/contact`,
});

/**
 * Genera metadata para página de proyecto individual
 */
export function generateProjectMetadata(project: {
  title: string;
  description: string;
  slug: string;
  image?: string;
  technologies?: string[];
  publishedAt?: string;
}): Metadata {
  const keywords = [
    project.title,
    'Proyecto',
    ...(project.technologies || []),
  ];

  return generatePageMetadata({
    title: project.title,
    description: project.description,
    keywords,
    canonical: `${siteConfig.url}/projects/${project.slug}`,
    ogImage: project.image || `${siteConfig.url}/media/logo%20sergioja.png`,
    type: 'article',
  });
}
