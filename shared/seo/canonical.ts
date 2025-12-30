/**
 * Utilidades para generar URLs canónicas
 */

/**
 * Genera una URL canónica limpia removiendo query parameters y normalizando la ruta
 * @param baseUrl - URL base del sitio (ej: https://sergioja.com)
 * @param pathname - Pathname de la página (ej: /projects/ecommerce)
 * @returns URL canónica completa
 */
export function generateCanonicalUrl(baseUrl: string, pathname: string): string {
  // Remover trailing slash excepto para la raíz
  const cleanPathname = pathname === '/' ? '/' : pathname.replace(/\/$/, '');
  
  // Combinar base URL con pathname limpio
  const url = new URL(cleanPathname, baseUrl);
  
  // Retornar URL sin query parameters ni hash
  return `${url.origin}${url.pathname}`;
}

/**
 * Obtiene la URL canónica desde headers de la request (para Server Components)
 * @param headers - Headers de Next.js
 * @param baseUrl - URL base del sitio
 * @returns URL canónica
 */
export function getCanonicalFromHeaders(headers: Headers, baseUrl: string): string {
  const pathname = headers.get('x-pathname') || '/';
  return generateCanonicalUrl(baseUrl, pathname);
}
