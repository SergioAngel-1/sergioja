import { prisma } from './prisma';
import { logger } from './logger';

const BATCH_SIZE = 100; // Procesar redirects en lotes de 100

/**
 * Detecta si crear un redirect causaría un ciclo infinito
 * Recorre la cadena de redirects para verificar que no forme un loop
 * 
 * IMPORTANTE: Permite revertir a un slug anterior eliminando el redirect existente
 * 
 * @param projectId - ID del proyecto (para permitir reversión)
 * @param oldSlug - Slug de origen
 * @param newSlug - Slug de destino
 * @returns true si se detecta un ciclo
 */
async function detectRedirectCycle(
  projectId: string,
  oldSlug: string,
  newSlug: string
): Promise<boolean> {
  // CASO ESPECIAL: Revertir a slug anterior
  // Si existe un redirect oldSlug → newSlug para este proyecto,
  // significa que estamos revirtiendo el cambio, lo cual es válido
  const existingRedirect = await prisma.slugRedirect.findFirst({
    where: {
      projectId,
      oldSlug: newSlug,
      newSlug: oldSlug,
    },
  });

  if (existingRedirect) {
    logger.info('Reverting to previous slug - deleting old redirect', {
      projectId,
      oldSlug,
      newSlug,
      redirectId: existingRedirect.id,
    });
    
    // Eliminar el redirect anterior para permitir la reversión
    await prisma.slugRedirect.delete({
      where: { id: existingRedirect.id },
    });
    
    return false; // No es un ciclo, es una reversión válida
  }

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
 * BUG #5 FIX: Solo elimina auto-referencias (oldSlug === newSlug)
 * 
 * Los redirects que apuntan al slug actual (oldSlug → currentSlug) son VÁLIDOS
 * y necesarios para que las URLs antiguas sigan funcionando.
 * 
 * @param projectId - ID del proyecto
 * @param currentSlug - Slug actual del proyecto
 */
export async function cleanupRedundantRedirects(
  projectId: string,
  currentSlug: string
): Promise<number> {
  // Solo eliminar auto-referencias donde oldSlug === newSlug
  // Esto puede ocurrir si alguien revierte un slug al valor original
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
  const wouldCreateCycle = await detectRedirectCycle(projectId, oldSlug, newSlug);
  
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
