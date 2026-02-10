import DOMPurify from 'dompurify';

const SVG_CONFIG = {
  USE_PROFILES: { svg: true, svgFilters: true },
  ADD_TAGS: ['use'],
  FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed', 'form', 'input'],
  FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'onfocus', 'onblur'],
};

/**
 * Sanitiza contenido SVG para uso seguro con dangerouslySetInnerHTML.
 * Retorna string vacío si el contenido no es válido o estamos en SSR.
 */
export function sanitizeSvg(svgContent: string | null | undefined): string {
  if (!svgContent) return '';
  if (typeof window === 'undefined') return '';
  return DOMPurify.sanitize(svgContent, SVG_CONFIG);
}
