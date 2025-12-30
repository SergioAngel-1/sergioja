/**
 * Sitemap - Main Frontend
 * https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
 * 
 * Main es una SPA con homepage única que contiene modales para:
 * - Navigation (enlaces externos)
 * - Identity (perfil)
 * - Purpose (proyectos destacados)
 * - Connection (contacto)
 * 
 * No hay rutas adicionales que indexar.
 */

import { MetadataRoute } from 'next';
import { createSitemapEntry } from '@/shared/seo';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sergioja.com';
  const currentDate = new Date();

  // Main solo tiene homepage - es una SPA con modales
  return [
    createSitemapEntry(baseUrl, { 
      lastModified: currentDate, 
      changeFrequency: 'weekly', // Cambiado de monthly a weekly por contenido dinámico
      priority: 1.0 
    }),
  ];
}
