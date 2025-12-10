import { useState, useEffect, useMemo } from 'react';

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
  category: string;
  categories?: string[];
  technologies: string[];
  featured: boolean;
  publishedAt: string | null;
  repositoryUrl?: string;
  liveUrl?: string;
  imageUrl?: string;
  isCodePublic?: boolean;
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
    category: 'web',
    categories: [],
    technologies: [],
    featured: false,
    publishedAt: null,
    repositoryUrl: '',
    liveUrl: '',
    imageUrl: '',
    isCodePublic: true,
  });

  const [projectTechnologies, setProjectTechnologies] = useState<TechnologyFormData[]>([]);
  const [imagePreview, setImagePreview] = useState<string>('');

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
      // Inicializar tecnologías
      const existingTechs = project.technologies?.map((t: any) => {
        if (t.category !== undefined && t.proficiency !== undefined) {
          return {
            name: t.technology?.name || t.name,
            category: t.category,
            proficiency: t.proficiency,
            yearsOfExperience: t.yearsOfExperience || 0,
          };
        }
        return {
          name: typeof t === 'string' ? t : t.technology?.name || t.name,
          category: 'other',
          proficiency: 50,
          yearsOfExperience: 0,
        };
      }) || [];
      
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
        category: projectCategories[0] || 'web',
        categories: projectCategories,
        technologies: project.technologies?.map((t: any) => 
          typeof t === 'string' ? t : t.technology?.name || t.name
        ) || [],
        featured: project.featured || false,
        repositoryUrl: project.repoUrl || project.repositoryUrl || '',
        liveUrl: project.demoUrl || project.liveUrl || '',
        imageUrl: project.imageUrl || project.image || '',
        isCodePublic: project.isCodePublic !== undefined ? project.isCodePublic : true,
        publishedAt: project.publishedAt || null,
      });
      
      setImagePreview(project.imageUrl || project.image || '');
    } else {
      // Nuevo proyecto
      setFormData({
        title: '',
        description: '',
        category: 'web',
        categories: [],
        technologies: [],
        featured: false,
        publishedAt: null,
        repositoryUrl: '',
        liveUrl: '',
        imageUrl: '',
        isCodePublic: true,
      });
      setImagePreview('');
      setProjectTechnologies([]);
    }
  }, [project, isOpen, normalizedCategories]);

  // Actualizar categorías cuando se normalizan (solo si cambian realmente)
  useEffect(() => {
    if (!isOpen || !project || normalizedCategories.length === 0) return;
    
    // Solo actualizar si las categorías normalizadas son diferentes
    const currentCats = JSON.stringify(formData.categories?.sort());
    const normalizedCats = JSON.stringify(normalizedCategories.sort());
    
    if (currentCats !== normalizedCats) {
      setFormData(prev => ({
        ...prev,
        categories: normalizedCategories,
        category: normalizedCategories[0] || prev.category,
      }));
    }
  }, [normalizedCategories, isOpen, project, formData.categories]);

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

  const handleImageChange = (file: File | null, preview: string) => {
    setImagePreview(preview);
    if (!preview) {
      setFormData(prev => ({ ...prev, imageUrl: '' }));
    }
  };

  const getSubmitData = () => {
    return {
      id: formData.id,
      title: formData.title,
      description: formData.description,
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
      image: imagePreview || formData.imageUrl || '',
      imageUrl: imagePreview || formData.imageUrl || '',
      isCodePublic: formData.isCodePublic,
    };
  };

  const isValid = () => {
    return formData.categories && formData.categories.length > 0;
  };

  return {
    formData,
    projectTechnologies,
    imagePreview,
    normalizedCategories,
    updateFormData,
    handleTechnologiesChange,
    handleCategoriesChange,
    handlePublishToggle,
    handleImageChange,
    getSubmitData,
    isValid,
  };
}
