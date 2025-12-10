import { useState, useEffect } from 'react';
import { logger } from '@/lib/logger';

interface Category {
  name: string;
  label: string;
  active: boolean;
}

interface UseCategoriesResult {
  categories: Category[];
  isLoading: boolean;
  error: Error | null;
  reload: () => Promise<void>;
}

/**
 * Hook para cargar categorías desde el backend
 * Evita fetch directo y centraliza la lógica de carga
 */
export function useCategories(
  type: 'project' | 'technology',
  autoLoad: boolean = true
): UseCategoriesResult {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const loadCategories = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const endpoint = type === 'project' 
        ? '/api/admin/categories/projects' 
        : '/api/admin/categories/technologies';
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
        credentials: 'include',
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data && Array.isArray(data.data)) {
          const activeCategories = data.data.filter((cat: Category) => cat.active);
          setCategories(activeCategories);
          logger.info(`Loaded ${activeCategories.length} ${type} categories`);
        } else {
          setCategories([]);
        }
      } else {
        throw new Error(`Failed to load categories: ${response.status}`);
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      logger.error(`Error loading ${type} categories`, error);
      setError(error);
      setCategories([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (autoLoad) {
      loadCategories();
    }
  }, [type, autoLoad]);

  return {
    categories,
    isLoading,
    error,
    reload: loadCategories,
  };
}
