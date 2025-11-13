/**
 * SEO Configuration - Portfolio Frontend
 * Configuración base de SEO para portfolio.sergioja.com
 */

import type { SEOMetadata } from '@/shared/seo';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://portfolio.sergioja.com';
const SITE_NAME = 'Sergio Jáuregui - Portfolio';
const SITE_DESCRIPTION = 'Portfolio profesional de Sergio Jáuregui. Explora mis proyectos, habilidades técnicas y experiencia en desarrollo Full Stack.';

export const defaultSEO: SEOMetadata = {
  title: SITE_NAME,
  description: SITE_DESCRIPTION,
  keywords: [
    'Sergio Jáuregui',
    'Portfolio',
    'Proyectos',
    'Desarrollador Full Stack',
    'React',
    'Next.js',
    'Node.js',
    'TypeScript',
    'Desarrollo Web',
    'Frontend',
    'Backend',
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
        url: `${SITE_URL}/media/logo%20sergioja.png`,
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
    images: [`${SITE_URL}/media/logo%20sergioja.png`],
  },

  alternates: {
    canonical: SITE_URL,
    languages: {
      'es': SITE_URL,
      'en': `${SITE_URL}/en`,
    },
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
