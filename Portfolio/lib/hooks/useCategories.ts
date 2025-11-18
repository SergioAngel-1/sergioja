import { useMemo } from 'react';
import { useLanguage } from '@/lib/contexts/LanguageContext';

/**
 * Hook para obtener categorías dinámicas desde un array de items
 * Solo muestra categorías que existen en los datos
 */
export function useCategories<T extends { category: string }>(
  items: T[],
  allLabel: string = 'All'
) {
  const { t } = useLanguage();

  return useMemo(() => {
    // Agrupar items por categoría y contar
    const categoryMap = items.reduce((acc, item) => {
      const category = item.category;
      if (!acc[category]) {
        acc[category] = 0;
      }
      acc[category]++;
      return acc;
    }, {} as Record<string, number>);

    // Crear array de categorías con conteo
    const categories = [
      { value: undefined, label: allLabel, count: items.length },
      ...Object.entries(categoryMap)
        .sort(([a], [b]) => a.localeCompare(b)) // Ordenar alfabéticamente
        .map(([category, count]) => ({
          value: category,
          label: category,
          count,
        })),
    ];

    return categories;
  }, [items, allLabel]);
}

/**
 * Hook para obtener categorías de proyectos con traducciones
 */
export function useProjectCategories<T extends { category: string }>(items: T[]) {
  const { t } = useLanguage();

  return useMemo(() => {
    const categoryMap = items.reduce((acc, item) => {
      const category = item.category;
      if (!acc[category]) {
        acc[category] = 0;
      }
      acc[category]++;
      return acc;
    }, {} as Record<string, number>);

    // Mapeo de categorías a traducciones
    const categoryLabels: Record<string, string> = {
      fullstack: t('work.fullstackCat'),
      web: t('work.web'),
      ai: t('work.ai'),
      mobile: t('work.mobile'),
      backend: t('work.backend'),
      frontend: t('work.frontend'),
      automation: t('work.automation'),
      devops: t('work.devops'),
    };

    const categories = [
      { value: undefined, label: t('work.all'), count: items.length },
      ...Object.entries(categoryMap)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([category, count]) => ({
          value: category,
          label: categoryLabels[category] || category,
          count,
        })),
    ];

    return categories;
  }, [items, t]);
}

/**
 * Hook para obtener categorías de skills con traducciones
 */
export function useSkillCategories<T extends { category: string }>(items: T[]) {
  const { t } = useLanguage();

  return useMemo(() => {
    const categoryMap = items.reduce((acc, item) => {
      const category = item.category;
      if (!acc[category]) {
        acc[category] = 0;
      }
      acc[category]++;
      return acc;
    }, {} as Record<string, number>);

    const categories = [
      { value: 'all', label: t('about.all'), count: items.length },
      ...Object.entries(categoryMap)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([category, count]) => ({
          value: category,
          label: category, // Skills usan el nombre directo de la categoría
          count,
        })),
    ];

    return categories;
  }, [items, t]);
}
