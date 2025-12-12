import { useState, useEffect, useMemo, useCallback } from 'react';

interface Category {
  name: string;
  label: string;
  active: boolean;
}

interface TechnologyFormData {
  name: string;
  category: string;
  proficiency: number;
  yearsOfExperience: number;
}

interface ProjectFormData {
  id?: string;
  title: string;
  description: string;
  longDescriptionEs: string;
  longDescriptionEn: string;
  category: string;
  categories?: string[];
  technologies: string[];
  featured: boolean;
  publishedAt: string | null;
  repositoryUrl?: string;
  liveUrl?: string;
  images: string[];
  isCodePublic?: boolean;
  performanceScore: number | null;
  accessibilityScore: number | null;
  seoScore: number | null;
}

interface UseProjectFormOptions {
  project: any | null;
  backendCategories: Category[];
  isOpen: boolean;
}

/**
 * Hook para manejar la lógica del formulario de proyectos
 * Separa la lógica de normalización de categorías del componente UI
 */
export function useProjectForm({ project, backendCategories, isOpen }: UseProjectFormOptions) {
  const [formData, setFormData] = useState<ProjectFormData>({
    title: '',
    description: '',
    longDescriptionEs: '',
    longDescriptionEn: '',
    category: 'web',
    categories: [],
    technologies: [],
    featured: false,
    publishedAt: null,
    repositoryUrl: '',
    liveUrl: '',
    images: [],
    isCodePublic: true,
    performanceScore: null,
    accessibilityScore: null,
    seoScore: null,
  });

  const [projectTechnologies, setProjectTechnologies] = useState<TechnologyFormData[]>([]);

  // Normalizar categorías del proyecto contra las del backend
  const normalizedCategories = useMemo(() => {
    if (!project || backendCategories.length === 0) return [];
    
    const rawCategories = Array.isArray(project.categories)
      ? project.categories
      : (project.category ? [project.category] : []);
    
    if (rawCategories.length === 0) return [];
    
    const normalized = rawCategories
      .map((cat: string) => {
        const match = backendCategories.find(
          (bc) => bc.name?.toLowerCase() === cat?.toLowerCase() || 
                  bc.label?.toLowerCase() === cat?.toLowerCase()
        );
        return match?.name;
      })
      .filter(Boolean) as string[];
    
    return normalized.length > 0 ? normalized : rawCategories;
  }, [project, backendCategories]);

  // Inicializar formulario cuando cambia el proyecto
  useEffect(() => {
    if (!isOpen) return;

    if (project) {
      // Inicializar tecnologías (ahora con estructura aplanada del backend)
      const existingTechs = project.technologies?.map((t: any) => {
        // Si es solo un string (nombre de tecnología)
        if (typeof t === 'string') {
          return {
            name: t,
            category: 'other',
            proficiency: 50,
            yearsOfExperience: 0,
          };
        }
        
        // Estructura aplanada del backend
        return {
          name: t.name || '',
          category: t.category || 'other',
          proficiency: t.proficiency !== undefined ? t.proficiency : 50,
          yearsOfExperience: t.yearsOfExperience !== undefined ? t.yearsOfExperience : 0,
        };
      }).filter((t: any) => t.name) || [];
      
      setProjectTechnologies(existingTechs);
      
      // Determinar categorías: usar normalizedCategories si están disponibles, sino usar las del proyecto
      const projectCategories = normalizedCategories.length > 0 
        ? normalizedCategories 
        : (Array.isArray(project.categories) ? project.categories : (project.category ? [project.category] : ['web']));
      
      // Inicializar formData con todos los campos correctamente
      setFormData({
        id: project.id,
        title: project.title || '',
        description: project.description || '',
        longDescriptionEs: project.longDescriptionEs || project.longDescription || '',
        longDescriptionEn: project.longDescriptionEn || '',
        category: projectCategories[0] || 'web',
        categories: projectCategories,
        technologies: project.technologies?.map((t: any) => 
          typeof t === 'string' ? t : t.name
        ) || [],
        featured: project.featured || false,
        repositoryUrl: project.repoUrl || project.repositoryUrl || '',
        liveUrl: project.demoUrl || project.liveUrl || '',
        images: Array.isArray(project.images) ? project.images : [],
        isCodePublic: project.isCodePublic !== undefined ? project.isCodePublic : true,
        publishedAt: project.publishedAt || null,
        performanceScore: project.performanceScore ?? null,
        accessibilityScore: project.accessibilityScore ?? null,
        seoScore: project.seoScore ?? null,
      });
    } else {
      // Nuevo proyecto
      setFormData({
        title: '',
        description: '',
        longDescriptionEs: '',
        longDescriptionEn: '',
        category: 'web',
        categories: [],
        technologies: [],
        featured: false,
        publishedAt: null,
        repositoryUrl: '',
        liveUrl: '',
        images: [],
        isCodePublic: true,
        performanceScore: null,
        accessibilityScore: null,
        seoScore: null,
      });
      setProjectTechnologies([]);
    }
  }, [project, isOpen, normalizedCategories]);

  const updateFormData = (updates: Partial<ProjectFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const handleTechnologiesChange = (techs: TechnologyFormData[]) => {
    setProjectTechnologies(techs);
    setFormData(prev => ({
      ...prev,
      technologies: techs.map(t => t.name),
    }));
  };

  const handleCategoriesChange = (categories: string[]) => {
    setFormData(prev => ({
      ...prev,
      categories,
      category: categories[0] || 'web',
    }));
  };

  const handlePublishToggle = () => {
    const newValue = formData.publishedAt ? null : new Date().toISOString();
    setFormData(prev => ({
      ...prev,
      publishedAt: newValue,
    }));
  };


  const getSubmitData = useCallback(() => {
    return {
      id: formData.id,
      title: formData.title,
      description: formData.description,
      longDescriptionEs: formData.longDescriptionEs,
      longDescriptionEn: formData.longDescriptionEn,
      category: formData.category,
      categories: formData.categories || [],
      technologies: formData.technologies,
      technologiesData: projectTechnologies,
      featured: formData.featured,
      publishedAt: formData.publishedAt,
      repositoryUrl: formData.repositoryUrl,
      repoUrl: formData.repositoryUrl,
      liveUrl: formData.liveUrl,
      demoUrl: formData.liveUrl,
      images: formData.images,
      isCodePublic: formData.isCodePublic,
      performanceScore: formData.performanceScore,
      accessibilityScore: formData.accessibilityScore,
      seoScore: formData.seoScore,
    };
  }, [formData, projectTechnologies]);

  const isValid = () => {
    return formData.categories && formData.categories.length > 0;
  };

  return {
    formData,
    projectTechnologies,
    normalizedCategories,
    updateFormData,
    handleTechnologiesChange,
    handleCategoriesChange,
    handlePublishToggle,
    getSubmitData,
    isValid,
  };
}
