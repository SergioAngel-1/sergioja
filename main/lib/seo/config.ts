/**
 * SEO Configuration - Main Frontend
 * Configuración base de SEO para sergioja.com
 */

import type { SEOMetadata } from '@/shared/seo';
import { optimizeDescription } from '@/shared/seo';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://sergioja.com';
const TWITTER_HANDLE = (process.env.NEXT_PUBLIC_TWITTER_HANDLE || '').replace(/^@/, '') || undefined;
const SITE_NAME = 'SergioJA';

// Description: 149 chars - Optimal length for SEO (120-160 chars recommended)
const SITE_DESCRIPTION = 'Desarrollador Full Stack especializado en React, Next.js, Node.js y TypeScript. Creando experiencias web modernas y escalables.';

// Validar y optimizar descripción en desarrollo
if (process.env.NODE_ENV === 'development') {
  const { validation } = optimizeDescription(SITE_DESCRIPTION);
  if (!validation.isValid) {
    console.warn(`[SEO Warning] Main site description: ${validation.message}`);
  }
}

export const defaultSEO: SEOMetadata = {
  title: SITE_NAME,
  description: SITE_DESCRIPTION,
  keywords: [
    'Sergio Jáuregui',
    'Desarrollador Full Stack',
    'React',
    'Next.js',
    'Node.js',
    'TypeScript',
    'Desarrollo Web',
    'Frontend',
    'Backend',
    'JavaScript',
  ],
  author: 'Sergio Jáuregui',
  
  robots: {
    index: true,
    follow: true,
    maxImagePreview: 'large',
    maxSnippet: -1,
    maxVideoPreview: -1,
  },

  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    locale: 'es_ES',
    images: [
      {
        url: `${SITE_URL}/media/logo-sergioja.png`,
        width: 1200,
        height: 630,
        alt: SITE_NAME,
        type: 'image/png',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: [`${SITE_URL}/media/logo-sergioja.png`],
    site: TWITTER_HANDLE ? `@${TWITTER_HANDLE}` : undefined,
    creator: TWITTER_HANDLE ? `@${TWITTER_HANDLE}` : undefined,
  },

  alternates: {
    canonical: SITE_URL,
  },
};

export const siteConfig = {
  name: SITE_NAME,
  url: SITE_URL,
  description: SITE_DESCRIPTION,
  author: {
    name: 'Sergio Jáuregui',
    email: 'contact@sergioja.com',
    url: SITE_URL,
    social: {
      github: 'https://github.com/SergioAngel-1',
      linkedin: 'https://www.linkedin.com/in/sergio-jauregui-angel',
    },
  },
};
