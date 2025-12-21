/**
 * Genera un slug URL-safe desde un string
 * Normaliza acentos, caracteres especiales y espacios
 * 
 * @param text - Texto a convertir en slug
 * @returns Slug normalizado
 * 
 * @example
 * slugify('Aplicación de Gestión') // 'aplicacion-de-gestion'
 * slugify('Proyecto con ñ y acentos') // 'proyecto-con-n-y-acentos'
 */
export function slugify(text: string): string {
  if (!text) return '';
  
  return text
    .toLowerCase()
    .normalize('NFD') // Descomponer caracteres Unicode (á -> a + ´)
    .replace(/[\u0300-\u036f]/g, '') // Eliminar marcas diacríticas (acentos)
    .replace(/ñ/g, 'n') // Reemplazar ñ específicamente
    .replace(/[^a-z0-9]+/g, '-') // Reemplazar caracteres no alfanuméricos con guiones
    .replace(/^-+|-+$/g, '') // Eliminar guiones al inicio y final
    .replace(/-+/g, '-'); // Reemplazar múltiples guiones consecutivos con uno solo
}
