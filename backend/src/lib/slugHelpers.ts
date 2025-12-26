import { prisma } from './prisma';

/**
 * Encuentra un slug disponible para un proyecto
 * Optimizado para evitar N+1 queries al verificar colisiones
 * 
 * @param baseSlug - Slug base generado desde el título
 * @param excludeId - ID del proyecto a excluir (para actualizaciones)
 * @returns Slug disponible (puede incluir sufijo numérico si hay colisión)
 * 
 * @example
 * await findAvailableSlug('mi-proyecto') // 'mi-proyecto'
 * await findAvailableSlug('mi-proyecto') // 'mi-proyecto-1' (si ya existe)
 * await findAvailableSlug('mi-proyecto', 'project-id-123') // 'mi-proyecto' (excluye el proyecto actual)
 */
export async function findAvailableSlug(
  baseSlug: string,
  excludeId?: string
): Promise<string> {
  // Obtener TODOS los slugs que empiezan con el baseSlug en UNA sola query
  // Esto evita el problema N+1 de hacer una query por cada intento
  const existingSlugs = await prisma.project.findMany({
    where: {
      slug: { startsWith: baseSlug },
      ...(excludeId ? { id: { not: excludeId } } : {}),
    },
    select: { slug: true },
  });

  // Crear un Set para búsquedas O(1)
  const slugSet = new Set(existingSlugs.map((p: { slug: string }) => p.slug));

  // Si el slug base no existe, usarlo directamente
  if (!slugSet.has(baseSlug)) {
    return baseSlug;
  }

  // Buscar el siguiente número disponible
  let counter = 1;
  let newSlug = `${baseSlug}-${counter}`;

  while (slugSet.has(newSlug)) {
    counter++;
    newSlug = `${baseSlug}-${counter}`;
  }

  return newSlug;
}

/**
 * Valida que un slug sea válido antes de usarlo
 * 
 * @param slug - Slug a validar
 * @returns true si el slug es válido
 * @throws Error si el slug es inválido
 */
export function validateSlug(slug: string): boolean {
  if (!slug || slug.length === 0) {
    throw new Error('El slug no puede estar vacío');
  }

  if (slug.length > 100) {
    throw new Error('El slug no puede exceder 100 caracteres');
  }

  // Validar que solo contenga caracteres permitidos (a-z, 0-9, -)
  if (!/^[a-z0-9-]+$/.test(slug)) {
    throw new Error('El slug solo puede contener letras minúsculas, números y guiones');
  }

  // Validar que no empiece o termine con guión
  if (/^-|-$/.test(slug)) {
    throw new Error('El slug no puede empezar o terminar con guión');
  }

  return true;
}
