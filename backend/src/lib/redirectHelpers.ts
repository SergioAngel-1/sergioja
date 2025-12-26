import { prisma } from './prisma';
import { logger } from './logger';

/**
 * Limpia redirects redundantes para un proyecto
 * Un redirect es redundante si oldSlug === newSlug (apunta a sí mismo)
 * o si newSlug === slug actual del proyecto (ya no es necesario)
 * 
 * @param projectId - ID del proyecto
 * @param currentSlug - Slug actual del proyecto
 */
export async function cleanupRedundantRedirects(
  projectId: string,
  currentSlug: string
): Promise<number> {
  // Eliminar redirects donde oldSlug === newSlug (redundantes)
  const deletedSelfReferencing = await prisma.slugRedirect.deleteMany({
    where: {
      projectId,
      oldSlug: currentSlug,
      newSlug: currentSlug,
    },
  });

  if (deletedSelfReferencing.count > 0) {
    logger.info('Cleaned up self-referencing redirects', {
      projectId,
      count: deletedSelfReferencing.count,
    });
  }

  return deletedSelfReferencing.count;
}

/**
 * Actualiza la cadena de redirects cuando cambia un slug
 * Mantiene la trazabilidad completa de URLs
 * 
 * @param projectId - ID del proyecto
 * @param oldSlug - Slug anterior
 * @param newSlug - Slug nuevo
 */
export async function updateRedirectChain(
  projectId: string,
  oldSlug: string,
  newSlug: string
): Promise<void> {
  // 1. Actualizar TODOS los redirects que apuntaban al slug anterior
  const updatedCount = await prisma.slugRedirect.updateMany({
    where: {
      newSlug: oldSlug, // Todos los que apuntaban al slug anterior
    },
    data: {
      newSlug: newSlug, // Ahora apuntan al nuevo
    },
  });

  if (updatedCount.count > 0) {
    logger.info('Updated redirect chain', {
      count: updatedCount.count,
      from: oldSlug,
      to: newSlug,
    });
  }

  // 2. Crear nuevo redirect del slug anterior al nuevo
  await prisma.slugRedirect.create({
    data: {
      projectId,
      oldSlug,
      newSlug,
    },
  });

  logger.info('SEO redirect created', {
    projectId,
    oldSlug,
    newSlug,
  });

  // 3. Limpiar redirects redundantes
  await cleanupRedundantRedirects(projectId, newSlug);
}
