import { useState, useEffect } from 'react';

interface ProjectCategory {
  name: string;
  label: string;
  active: boolean;
  color?: string;
  icon?: string;
}

interface UseProjectCategoriesResult {
  categories: ProjectCategory[];
  isLoading: boolean;
  error: Error | null;
}

/**
 * Hook para cargar categorías de proyectos desde el backend
 */
export function useProjectCategories(): UseProjectCategoriesResult {
  const [categories, setCategories] = useState<ProjectCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories/projects`);
        
        if (!response.ok) {
          throw new Error('Failed to load categories');
        }
        
        const data = await response.json();
        
        if (data.success && data.data && Array.isArray(data.data)) {
          // Filtrar solo categorías activas
          const activeCategories = data.data.filter((cat: ProjectCategory) => cat.active);
          setCategories(activeCategories);
        } else {
          setCategories([]);
        }
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Unknown error');
        setError(error);
        setCategories([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadCategories();
  }, []);

  return {
    categories,
    isLoading,
    error,
  };
}
