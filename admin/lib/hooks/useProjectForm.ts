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
  longDescriptionEs: string;
  longDescriptionEn: string;
  category: string;
  categories?: string[];
  technologies: string[];
  isFeatured: boolean;
  status: 'DRAFT' | 'IN_PROGRESS' | 'PUBLISHED';
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
    longDescriptionEs: '',
    longDescriptionEn: '',
    category: 'web',
    categories: [],
    technologies: [],
    isFeatured: false,
    status: 'DRAFT',
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
        longDescriptionEs: project.longDescriptionEs || project.longDescription || '',
        longDescriptionEn: project.longDescriptionEn || '',
        category: projectCategories[0] || 'web',
        categories: projectCategories,
        technologies: project.technologies?.map((t: any) => 
          typeof t === 'string' ? t : t.name
        ) || [],
        isFeatured: project.isFeatured || false,
        status: project.status || (project.publishedAt ? 'PUBLISHED' : 'DRAFT'),
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
        longDescriptionEs: '',
        longDescriptionEn: '',
        category: 'web',
        categories: [],
        technologies: [],
        isFeatured: false,
        status: 'DRAFT',
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

  const handleStatusChange = (status: ProjectFormData['status']) => {
    setFormData((prev) => {
      const nextPublishedAt = status === 'PUBLISHED'
        ? (prev.publishedAt || new Date().toISOString())
        : null;

      return {
        ...prev,
        status,
        publishedAt: nextPublishedAt,
      };
    });
  };

  const normalizeLongDescription = (value: string) => {
    // Preserve line breaks but avoid multiple blank lines.
    // - Normalize Windows newlines
    // - Collapse 3+ consecutive newlines into 2 (max one empty line)
    // - Trim trailing spaces per line
    const normalized = (value ?? '')
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      .split('\n')
      .map((line) => line.replace(/\s+$/g, ''))
      .join('\n')
      .replace(/\n{3,}/g, '\n\n');

    return normalized;
  };


  const getSubmitData = useCallback(() => {
    const resolvedPublishedAt = formData.status === 'PUBLISHED'
      ? (formData.publishedAt || new Date().toISOString())
      : null;

    return {
      id: formData.id,
      title: formData.title,
      longDescriptionEs: normalizeLongDescription(formData.longDescriptionEs),
      longDescriptionEn: normalizeLongDescription(formData.longDescriptionEn),
      category: formData.category,
      categories: formData.categories || [],
      technologies: formData.technologies,
      technologiesData: projectTechnologies,
      status: formData.status,
      isFeatured: formData.isFeatured,
      publishedAt: resolvedPublishedAt,
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
    handleStatusChange,
    getSubmitData,
    isValid,
  };
}
