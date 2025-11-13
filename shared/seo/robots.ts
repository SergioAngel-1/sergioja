/**
 * Robots.txt Utilities
 * Funciones helper para generar robots.txt
 */

export interface RobotsTxtRule {
  userAgent: string;
  allow?: string[];
  disallow?: string[];
  crawlDelay?: number;
}

export interface RobotsTxtConfig {
  rules: RobotsTxtRule[];
  sitemaps?: string[];
  host?: string;
}

/**
 * Genera contenido de robots.txt
 */
export function generateRobotsTxt(config: RobotsTxtConfig): string {
  const lines: string[] = [];

  // Reglas por User-Agent
  config.rules.forEach((rule) => {
    lines.push(`User-agent: ${rule.userAgent}`);

    if (rule.allow) {
      rule.allow.forEach((path) => {
        lines.push(`Allow: ${path}`);
      });
    }

    if (rule.disallow) {
      rule.disallow.forEach((path) => {
        lines.push(`Disallow: ${path}`);
      });
    }

    if (rule.crawlDelay !== undefined) {
      lines.push(`Crawl-delay: ${rule.crawlDelay}`);
    }

    lines.push(''); // Línea en blanco entre reglas
  });

  // Host (opcional)
  if (config.host) {
    lines.push(`Host: ${config.host}`);
    lines.push('');
  }

  // Sitemaps
  if (config.sitemaps && config.sitemaps.length > 0) {
    config.sitemaps.forEach((sitemap) => {
      lines.push(`Sitemap: ${sitemap}`);
    });
  }

  return lines.join('\n');
}

/**
 * Configuración de robots.txt para permitir todo
 */
export function allowAllRobots(sitemaps: string[]): RobotsTxtConfig {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/'],
      },
    ],
    sitemaps,
  };
}

/**
 * Configuración de robots.txt para bloquear todo
 */
export function disallowAllRobots(): RobotsTxtConfig {
  return {
    rules: [
      {
        userAgent: '*',
        disallow: ['/'],
      },
    ],
  };
}

/**
 * Configuración de robots.txt personalizada
 */
export function customRobots(options: {
  allowPaths?: string[];
  disallowPaths?: string[];
  sitemaps?: string[];
  crawlDelay?: number;
}): RobotsTxtConfig {
  return {
    rules: [
      {
        userAgent: '*',
        allow: options.allowPaths,
        disallow: options.disallowPaths,
        crawlDelay: options.crawlDelay,
      },
    ],
    sitemaps: options.sitemaps,
  };
}
