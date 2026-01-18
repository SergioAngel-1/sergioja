import { prisma } from './prisma';
import { logger } from './logger';

interface CategoryLabel {
  name: string;
  label: string;
}

class CategoryCacheManager {
  private projectCategoryCache: Map<string, string> = new Map();
  private technologyCategoryCache: Map<string, string> = new Map();
  private lastProjectUpdate: number = 0;
  private lastTechnologyUpdate: number = 0;
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutos

  /**
   * Obtiene el mapa de labels de categorías de proyectos
   * Usa caché en memoria con TTL de 5 minutos
   */
  async getProjectCategoryLabels(): Promise<Record<string, string>> {
    const now = Date.now();
    
    // Si el caché está vigente, retornar desde memoria
    if (this.projectCategoryCache.size > 0 && (now - this.lastProjectUpdate) < this.CACHE_TTL) {
      return Object.fromEntries(this.projectCategoryCache);
    }

    // Caché expirado o vacío, recargar desde DB
    try {
      const categories = await prisma.projectCategory.findMany({
        where: { active: true },
        select: { name: true, label: true },
      });

      this.projectCategoryCache.clear();
      categories.forEach((cat: CategoryLabel) => {
        this.projectCategoryCache.set(cat.name, cat.label);
      });

      this.lastProjectUpdate = now;
      logger.info(`Project category cache refreshed: ${categories.length} categories`, 'CategoryCache');

      return Object.fromEntries(this.projectCategoryCache);
    } catch (error) {
      logger.error('Failed to refresh project category cache', error, 'CategoryCache');
      return Object.fromEntries(this.projectCategoryCache);
    }
  }

  /**
   * Obtiene el mapa de labels de categorías de tecnologías
   * Usa caché en memoria con TTL de 5 minutos
   */
  async getTechnologyCategoryLabels(): Promise<Record<string, string>> {
    const now = Date.now();
    
    if (this.technologyCategoryCache.size > 0 && (now - this.lastTechnologyUpdate) < this.CACHE_TTL) {
      return Object.fromEntries(this.technologyCategoryCache);
    }

    try {
      const categories = await prisma.technologyCategory.findMany({
        where: { active: true },
        select: { name: true, label: true },
      });

      this.technologyCategoryCache.clear();
      categories.forEach((cat: CategoryLabel) => {
        this.technologyCategoryCache.set(cat.name, cat.label);
      });

      this.lastTechnologyUpdate = now;
      logger.info(`Technology category cache refreshed: ${categories.length} categories`, 'CategoryCache');

      return Object.fromEntries(this.technologyCategoryCache);
    } catch (error) {
      logger.error('Failed to refresh technology category cache', error, 'CategoryCache');
      return Object.fromEntries(this.technologyCategoryCache);
    }
  }

  /**
   * Invalida el caché de categorías de proyectos
   * Llamar cuando se crea/actualiza/elimina una categoría
   */
  invalidateProjectCategories(): void {
    this.projectCategoryCache.clear();
    this.lastProjectUpdate = 0;
    logger.info('Project category cache invalidated', 'CategoryCache');
  }

  /**
   * Invalida el caché de categorías de tecnologías
   */
  invalidateTechnologyCategories(): void {
    this.technologyCategoryCache.clear();
    this.lastTechnologyUpdate = 0;
    logger.info('Technology category cache invalidated', 'CategoryCache');
  }

  /**
   * Obtiene el label de una categoría específica (project)
   */
  async getProjectCategoryLabel(name: string): Promise<string | undefined> {
    const labels = await this.getProjectCategoryLabels();
    return labels[name];
  }

  /**
   * Obtiene el label de una categoría específica (technology)
   */
  async getTechnologyCategoryLabel(name: string): Promise<string | undefined> {
    const labels = await this.getTechnologyCategoryLabels();
    return labels[name];
  }
}

export const categoryCache = new CategoryCacheManager();
