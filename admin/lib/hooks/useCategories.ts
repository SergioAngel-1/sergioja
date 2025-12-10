import { useState, useEffect } from 'react';
import { api } from '@/lib/api-client';

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
 * Hook para cargar categorías desde el backend usando api-client
 * Centraliza la lógica de carga con manejo de auth automático
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
      
      const response = type === 'project' 
        ? await api.getProjectCategories()
        : await api.getTechnologyCategories();
      
      if (response.success && response.data && Array.isArray(response.data)) {
        const activeCategories = response.data.filter((cat: Category) => cat.active);
        setCategories(activeCategories);
      } else {
        setCategories([]);
        if (response.error) {
          throw new Error(response.error.message || 'Failed to load categories');
        }
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
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
