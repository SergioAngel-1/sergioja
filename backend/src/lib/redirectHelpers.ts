import { prisma } from './prisma';
import { logger } from './logger';

const BATCH_SIZE = 100; // Procesar redirects en lotes de 100

/**
 * Detecta si crear un redirect causaría un ciclo infinito
 * Recorre la cadena de redirects para verificar que no forme un loop
 * 
 * @param oldSlug - Slug de origen
 * @param newSlug - Slug de destino
 * @returns true si se detecta un ciclo
 */
async function detectRedirectCycle(
  oldSlug: string,
  newSlug: string
): Promise<boolean> {
  const visited = new Set<string>();
  let current = newSlug;
  const maxDepth = 50; // Límite de seguridad para evitar loops infinitos
  let depth = 0;

  while (current && !visited.has(current) && depth < maxDepth) {
    visited.add(current);
    depth++;

    // Si el newSlug apunta de vuelta al oldSlug, hay un ciclo
    if (current === oldSlug) {
      logger.warn('Redirect cycle detected', {
        oldSlug,
        newSlug,
        chainLength: depth,
      });
      return true;
    }

    // Buscar si existe un redirect desde current
    const redirect = await prisma.slugRedirect.findUnique({
      where: { oldSlug: current },
      select: { newSlug: true },
    });

    if (!redirect) break;
    current = redirect.newSlug;
  }

  if (depth >= maxDepth) {
    logger.error('Redirect chain too deep', { oldSlug, newSlug, depth });
    return true; // Considerar como ciclo si es demasiado profundo
  }

  return false;
}

/**
 * Limpia redirects redundantes para un proyecto
 * BUG #5 FIX: Ahora elimina tanto auto-referencias como redirects que apuntan al slug actual
 * 
 * @param projectId - ID del proyecto
 * @param currentSlug - Slug actual del proyecto
 */
export async function cleanupRedundantRedirects(
  projectId: string,
  currentSlug: string
): Promise<number> {
  let totalDeleted = 0;

  // 1. Eliminar auto-referencias (oldSlug === newSlug)
  const deletedSelfReferencing = await prisma.slugRedirect.deleteMany({
    where: {
      projectId,
      oldSlug: currentSlug,
      newSlug: currentSlug,
    },
  });

  totalDeleted += deletedSelfReferencing.count;

  if (deletedSelfReferencing.count > 0) {
    logger.info('Cleaned up self-referencing redirects', {
      projectId,
      count: deletedSelfReferencing.count,
    });
  }

  // 2. Eliminar redirects que apuntan al slug actual (ya no necesarios)
  // Estos redirects eran útiles antes pero ahora el proyecto ya tiene ese slug
  const deletedPointingToCurrent = await prisma.slugRedirect.deleteMany({
    where: {
      projectId,
      newSlug: currentSlug,
      oldSlug: { not: currentSlug }, // Excluir auto-referencias ya eliminadas
    },
  });

  totalDeleted += deletedPointingToCurrent.count;

  if (deletedPointingToCurrent.count > 0) {
    logger.info('Cleaned up redirects pointing to current slug', {
      projectId,
      currentSlug,
      count: deletedPointingToCurrent.count,
    });
  }

  return totalDeleted;
}

/**
 * Actualiza la cadena de redirects cuando cambia un slug
 * BOTTLENECK #1 FIX: Procesa en batches para evitar bloqueos
 * BUG #4 FIX: Detecta y previene ciclos infinitos
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
  // BUG #4: Detectar ciclos antes de crear el redirect
  const wouldCreateCycle = await detectRedirectCycle(oldSlug, newSlug);
  
  if (wouldCreateCycle) {
    const error = new Error(
      `No se puede crear la redirección: causaría un ciclo infinito (${oldSlug} → ${newSlug})`
    );
    logger.error('Redirect cycle prevented', {
      projectId,
      oldSlug,
      newSlug,
    });
    throw error;
  }

  // BOTTLENECK #1: Actualizar redirects en batches
  let totalUpdated = 0;
  let hasMore = true;

  while (hasMore) {
    // Buscar batch de redirects que apuntan al slug anterior
    const redirectsToUpdate = await prisma.slugRedirect.findMany({
      where: { newSlug: oldSlug },
      take: BATCH_SIZE,
      select: { id: true },
    });

    if (redirectsToUpdate.length === 0) {
      hasMore = false;
      break;
    }

    // Actualizar este batch
    const result = await prisma.slugRedirect.updateMany({
      where: {
        id: { in: redirectsToUpdate.map((r: { id: string }) => r.id) },
      },
      data: {
        newSlug: newSlug,
      },
    });

    totalUpdated += result.count;
    hasMore = redirectsToUpdate.length === BATCH_SIZE;

    if (hasMore) {
      logger.debug('Batch update progress', {
        batchSize: BATCH_SIZE,
        totalUpdated,
      });
    }
  }

  if (totalUpdated > 0) {
    logger.info('Updated redirect chain in batches', {
      totalUpdated,
      from: oldSlug,
      to: newSlug,
    });
  }

  // 2. Crear nuevo redirect del slug anterior al nuevo
  try {
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
  } catch (error) {
    // Si ya existe, solo loguearlo (puede ser un duplicate key error)
    if ((error as any).code === 'P2002') {
      logger.warn('Redirect already exists', { oldSlug, newSlug });
    } else {
      throw error;
    }
  }

  // 3. Limpiar redirects redundantes (BUG #5 mejorado)
  await cleanupRedundantRedirects(projectId, newSlug);
}
