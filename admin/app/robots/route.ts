/**
 * Robots.txt Route Handler para Admin
 * Bloquea completamente el acceso de bots al panel de administración
 */

import { disallowAllRobots, generateRobotsTxt } from '@/shared/seo';

export async function GET() {
  // Bloquear todo el sitio admin de los motores de búsqueda
  const robotsConfig = disallowAllRobots();
  const robotsTxt = generateRobotsTxt(robotsConfig);

  return new Response(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
