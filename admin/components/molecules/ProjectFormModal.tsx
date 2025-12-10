'use client';

import { useState, useEffect } from 'react';
import Button from '../atoms/Button';
import Checkbox from '../atoms/Checkbox';
import Modal from './Modal';
import ImageUploader from './ImageUploader';
import CategorySelector from './CategorySelector';
import TechnologyManager from './TechnologyManager';
import UrlInput from './UrlInput';
import { TechnologyFormData } from './TechnologyForm';
import { fluidSizing } from '@/lib/fluidSizing';
import { logger } from '@/lib/logger';

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

interface ProjectFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (project: Partial<ProjectFormData>) => Promise<void>;
  onDelete?: () => Promise<void>;
  project?: any | null; // eslint-disable-line @typescript-eslint/no-explicit-any
  existingSkills?: string[];
}

export default function ProjectFormModal({
  isOpen,
  onClose,
  onSave,
  onDelete,
  project,
  existingSkills = [],
}: ProjectFormModalProps) {
  const [backendCategories, setBackendCategories] = useState<Array<{ name: string; label: string; active: boolean }>>([]);
  const [techCategories, setTechCategories] = useState<Array<{ name: string; label: string; active: boolean }>>([]);
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [projectTechnologies, setProjectTechnologies] = useState<TechnologyFormData[]>([]);

  // Cargar categorías del backend
  useEffect(() => {
    if (isOpen) {
      loadBackendCategories();
      loadTechCategories();
    }
  }, [isOpen]);

  const loadBackendCategories = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/categories/projects`, {
        credentials: 'include',
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data && Array.isArray(data.data)) {
          setBackendCategories(data.data.filter((cat: any) => cat.active));
          logger.info(`Loaded ${data.data.length} project categories for modal`);
        }
      }
    } catch (error) {
      logger.error('Error loading backend categories', error);
    }
  };

  const loadTechCategories = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/categories/technologies`, {
        credentials: 'include',
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data && Array.isArray(data.data)) {
          const activeCategories = data.data.filter((cat: any) => cat.active);
          setTechCategories(activeCategories);
          logger.info(`Loaded ${data.data.length} technology categories for modal`);
        }
      }
    } catch (error) {
      logger.error('Error loading technology categories', error);
    }
  };

  // Bloquear scroll del body cuando el modal está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    if (project) {
      // Asegurar que categories sea siempre un array
      const projectCategories = Array.isArray(project.categories) 
        ? project.categories 
        : (project.category ? [project.category] : []);
      
      setFormData({
        ...project,
        categories: projectCategories,
        technologies: project.technologies?.map((t: any) => // eslint-disable-line @typescript-eslint/no-explicit-any 
          typeof t === 'string' ? t : t.technology?.name || t.name
        ) || [],
        repositoryUrl: project.repoUrl || project.repositoryUrl || '',
        liveUrl: project.demoUrl || project.liveUrl || '',
        publishedAt: project.publishedAt || null,
      });
      
      setImagePreview(project.imageUrl || project.image || '');
      setImageFile(null);
      
      // Inicializar projectTechnologies con datos existentes
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
    } else {
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
      setImageFile(null);
      setProjectTechnologies([]);
    }
  }, [project, isOpen]);

  // Normalizar las categorías del proyecto contra las categorías del backend
  useEffect(() => {
    if (!project || backendCategories.length === 0) return;
    const raw = Array.isArray(project.categories)
      ? project.categories
      : (project.category ? [project.category] : []);
    const normalized = raw
      .map((c: string) => {
        const match = backendCategories.find(
          (bc) => bc.name?.toLowerCase() === c?.toLowerCase() || bc.label?.toLowerCase() === c?.toLowerCase()
        );
        return match?.name;
      })
      .filter(Boolean) as string[];
    if (normalized.length > 0) {
      setFormData((prev) => ({ ...prev, categories: normalized }));
    }
  }, [backendCategories, project]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const dataToSave = {
        ...formData,
        image: imagePreview || formData.imageUrl || '',
        repoUrl: formData.repositoryUrl,
        demoUrl: formData.liveUrl,
        technologiesData: projectTechnologies,
      };
      await onSave(dataToSave);
      onClose();
    } catch (error) {
      console.error('Error saving project:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePublishToggle = () => {
    setFormData({
      ...formData,
      publishedAt: formData.publishedAt ? null : new Date().toISOString(),
    });
  };

  const handleTechnologiesChange = (techs: TechnologyFormData[]) => {
    setProjectTechnologies(techs);
    setFormData({
      ...formData,
      technologies: techs.map(t => t.name),
    });
  };

  const handleCategoriesChange = (categories: string[]) => {
    setFormData({
      ...formData,
      categories,
      category: categories[0] || 'web',
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={project ? 'Editar Proyecto' : 'Nuevo Proyecto'}
      maxWidth="3xl"
      footer={
        <>
          {project && onDelete && (
            <Button
              type="button"
              onClick={async () => {
                if (window.confirm('¿Estás seguro de que deseas eliminar este proyecto?')) {
                  await onDelete();
                  onClose();
                }
              }}
              variant="secondary"
              size="md"
              fullWidth
              className="!bg-red-500/10 !border-red-500/30 !text-red-500 hover:!bg-red-500/20 hover:!border-red-500/50"
            >
              Eliminar
            </Button>
          )}
          <Button
            type="button"
            onClick={onClose}
            variant="secondary"
            size="md"
            fullWidth
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            form="project-form"
            disabled={isSubmitting}
            isLoading={isSubmitting}
            variant="primary"
            size="md"
            fullWidth
          >
            {project ? 'Actualizar' : 'Crear Proyecto'}
          </Button>
        </>
      }
    >
      <form id="project-form" onSubmit={handleSubmit}>
        <div style={{ padding: fluidSizing.space.lg, display: 'flex', flexDirection: 'column', gap: fluidSizing.space.lg }}>
          {/* Title */}
          <div>
            <label className="block text-text-muted font-medium uppercase tracking-wider" style={{ fontSize: fluidSizing.text.xs, marginBottom: fluidSizing.space.sm }}>
              Título *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              className="w-full bg-admin-dark-surface border border-admin-primary/20 rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:border-admin-primary/50 focus:ring-2 focus:ring-admin-primary/20 transition-all duration-200"
              style={{ padding: `${fluidSizing.space.sm} ${fluidSizing.space.md}`, fontSize: fluidSizing.text.base }}
              placeholder="Nombre del proyecto"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-text-muted font-medium uppercase tracking-wider" style={{ fontSize: fluidSizing.text.xs, marginBottom: fluidSizing.space.sm }}>
              Descripción *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              rows={4}
              className="w-full bg-admin-dark-surface border border-admin-primary/20 rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:border-admin-primary/50 focus:ring-2 focus:ring-admin-primary/20 transition-all duration-200 resize-none"
              style={{ padding: `${fluidSizing.space.sm} ${fluidSizing.space.md}`, fontSize: fluidSizing.text.base }}
              placeholder="Describe el proyecto..."
            />
          </div>

          {/* Image Upload */}
          <ImageUploader
            value={imagePreview}
            onChange={(file, preview) => {
              setImageFile(file);
              setImagePreview(preview);
              if (!preview) {
                setFormData({ ...formData, imageUrl: '' });
              }
            }}
          />

          {/* Categories */}
          <CategorySelector
            categories={backendCategories}
            selectedCategories={formData.categories || []}
            onChange={handleCategoriesChange}
            required
          />

          {/* Technologies */}
          <TechnologyManager
            technologies={projectTechnologies}
            availableSkills={existingSkills}
            categories={techCategories}
            onChange={handleTechnologiesChange}
          />

          {/* Repository Toggle */}
          <Checkbox
            checked={!formData.isCodePublic}
            onChange={(e) => setFormData({ 
              ...formData, 
              isCodePublic: !e.target.checked,
              repositoryUrl: e.target.checked ? '' : formData.repositoryUrl
            })}
            label="Repositorio Privado"
            description="El código fuente no es público"
            variant="card"
          />

          {/* URLs */}
          <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: fluidSizing.space.md }}>
            {formData.isCodePublic && (
              <div>
                <label className="block text-text-muted font-medium uppercase tracking-wider" style={{ fontSize: fluidSizing.text.xs, marginBottom: fluidSizing.space.sm }}>
                  URL del Repositorio
                </label>
                <input
                  type="url"
                  value={formData.repositoryUrl}
                  onChange={(e) => setFormData({ ...formData, repositoryUrl: e.target.value })}
                  className="w-full bg-admin-dark-surface border border-admin-primary/20 rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:border-admin-primary/50 focus:ring-2 focus:ring-admin-primary/20 transition-all duration-200"
                  style={{ padding: `${fluidSizing.space.sm} ${fluidSizing.space.md}`, fontSize: fluidSizing.text.base }}
                  placeholder="https://github.com/..."
                />
              </div>
            )}
            <div className={formData.isCodePublic ? '' : 'md:col-span-2'}>
              <UrlInput
                value={formData.liveUrl || ''}
                onChange={(url) => setFormData({ ...formData, liveUrl: url })}
                label="URL en Vivo"
                placeholder="ejemplo.com"
              />
            </div>
          </div>

          {/* Toggles */}
          <div className="flex" style={{ gap: fluidSizing.space.lg }}>
            <Checkbox
              checked={formData.featured}
              onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
              label="Destacado"
            />

            <Checkbox
              checked={!!formData.publishedAt}
              onChange={handlePublishToggle}
              label="Publicado"
            />
          </div>
        </div>
      </form>
    </Modal>
  );
}
