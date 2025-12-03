/**
 * Sistema de sizing fluido centralizado
 * Usa clamp() para responsive automático sin breakpoints
 * 
 * Compartido entre Portfolio y Main
 */

export const fluidSizing = {
  // Spacing
  space: {
    xs: 'clamp(0.25rem, 0.3vw, 0.5rem)',
    sm: 'clamp(0.5rem, 0.75vw, 1rem)',
    md: 'clamp(0.75rem, 1vw, 1.5rem)',
    lg: 'clamp(1rem, 1.5vw, 2rem)',
    xl: 'clamp(1.5rem, 2vw, 2.5rem)',
    '2xl': 'clamp(2rem, 3vw, 4rem)',
  },

  // Sizing - Icons, buttons, cards
  size: {
    iconSm: 'clamp(1rem, 1.2vw, 1.25rem)',
    iconMd: 'clamp(1.25rem, 1.5vw, 1.5rem)',
    iconLg: 'clamp(1.5rem, 2vw, 2rem)',
    buttonSm: 'clamp(2rem, 2.5vw, 2.5rem)',
    buttonMd: 'clamp(2.5rem, 3vw, 3rem)',
    buttonLg: 'clamp(3rem, 4vw, 4rem)',
    hexButton: 'clamp(5.2rem, 7.8vw, 7.8rem)',
    heroContainer: 'clamp(364px, 46vw, 650px)',
  },

  // Typography
  text: {
    xs: 'clamp(0.625rem, 0.75vw, 0.75rem)',
    sm: 'clamp(0.75rem, 0.875vw, 0.875rem)',
    base: 'clamp(0.875rem, 1vw, 1rem)',
    lg: 'clamp(1rem, 1.25vw, 1.25rem)',
    xl: 'clamp(1.25rem, 1.5vw, 1.5rem)',
    '2xl': 'clamp(1.5rem, 2vw, 2rem)',
    '3xl': 'clamp(2rem, 2.5vw, 3rem)',
    '4xl': 'clamp(2.5rem, 3vw, 4rem)',
    '5xl': 'clamp(3rem, 4vw, 5rem)',
    '6xl': 'clamp(3.5rem, 5vw, 6rem)',
  },

  // Navbar specific
  nav: {
    width: 'clamp(4rem, 5vw, 5rem)',
    gap: 'clamp(0.5rem, 1.2vw, 2rem)',
  },

  // Header specific
  header: {
    height: 'clamp(4rem, 6vw, 6rem)', // Altura del header para padding-top
  },
} as const;

/**
 * Helper para crear clamp personalizado
 * @param min - Tamaño mínimo (ej: '1rem')
 * @param preferred - Tamaño preferido viewport-based (ej: '2vw')
 * @param max - Tamaño máximo (ej: '2rem')
 */
export function clamp(min: string, preferred: string, max: string): string {
  return `clamp(${min}, ${preferred}, ${max})`;
}

/**
 * Genera objeto de estilos con sizing fluido
 */
export function fluidStyle(config: {
  width?: keyof typeof fluidSizing.size | string;
  height?: keyof typeof fluidSizing.size | string;
  gap?: keyof typeof fluidSizing.space | string;
  padding?: keyof typeof fluidSizing.space | string;
  margin?: keyof typeof fluidSizing.space | string;
  fontSize?: keyof typeof fluidSizing.text | string;
  [key: string]: any;
}): Record<string, any> {
  const style: Record<string, any> = {};

  if (config.width) {
    style.width = typeof config.width === 'string' && config.width in fluidSizing.size
      ? fluidSizing.size[config.width as keyof typeof fluidSizing.size]
      : config.width;
  }

  if (config.height) {
    style.height = typeof config.height === 'string' && config.height in fluidSizing.size
      ? fluidSizing.size[config.height as keyof typeof fluidSizing.size]
      : config.height;
  }

  if (config.gap) {
    style.gap = typeof config.gap === 'string' && config.gap in fluidSizing.space
      ? fluidSizing.space[config.gap as keyof typeof fluidSizing.space]
      : config.gap;
  }

  if (config.padding) {
    style.padding = typeof config.padding === 'string' && config.padding in fluidSizing.space
      ? fluidSizing.space[config.padding as keyof typeof fluidSizing.space]
      : config.padding;
  }

  if (config.margin) {
    style.margin = typeof config.margin === 'string' && config.margin in fluidSizing.space
      ? fluidSizing.space[config.margin as keyof typeof fluidSizing.space]
      : config.margin;
  }

  if (config.fontSize) {
    style.fontSize = typeof config.fontSize === 'string' && config.fontSize in fluidSizing.text
      ? fluidSizing.text[config.fontSize as keyof typeof fluidSizing.text]
      : config.fontSize;
  }

  // Agregar cualquier otra propiedad personalizada
  Object.keys(config).forEach(key => {
    if (!['width', 'height', 'gap', 'padding', 'margin', 'fontSize'].includes(key)) {
      style[key as any] = config[key];
    }
  });

  return style;
}
