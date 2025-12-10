'use client';

import { useState } from 'react';
import Button from '../atoms/Button';
import Modal from './Modal';
import ImageUploader from './ImageUploader';
import CategorySelector from './CategorySelector';
import TechnologyManager from './TechnologyManager';
import ProjectBasicFields from './ProjectBasicFields';
import ProjectUrlFields from './ProjectUrlFields';
import ProjectToggles from './ProjectToggles';
import ProjectScoresFields from './ProjectScoresFields';
import { fluidSizing } from '@/lib/fluidSizing';
import { alerts } from '@/shared/alertSystem';
import { useCategories, useProjectForm } from '@/lib/hooks';

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Cargar categorías usando hook personalizado
  const { categories: backendCategories, isLoading: loadingProjectCats } = useCategories('project', isOpen);
  const { categories: techCategories, isLoading: loadingTechCats } = useCategories('technology', isOpen);
  
  // Manejar lógica del formulario con hook personalizado
  const {
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
  } = useProjectForm({ project, backendCategories, isOpen });

  // Categorías se cargan automáticamente con los hooks useCategories

  // La lógica de inicialización y normalización ahora está en useProjectForm

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isValid()) {
      alerts.error('Error', 'Debes seleccionar al menos una categoría');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const dataToSave = getSubmitData();
      await onSave(dataToSave);
      onClose();
    } catch (error) {
      console.error('Error saving project:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handlers ahora vienen del hook useProjectForm

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
              onClick={() => {
                alerts.confirm(
                  'Eliminar proyecto',
                  'Esta acción no se puede deshacer. ¿Deseas continuar?',
                  async () => {
                    await onDelete();
                    onClose();
                  },
                  undefined,
                  'Eliminar',
                  'Cancelar'
                );
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
          {/* Basic Fields */}
          <ProjectBasicFields
            title={formData.title}
            description={formData.description}
            longDescription={formData.longDescription}
            onTitleChange={(title) => updateFormData({ title })}
            onDescriptionChange={(description) => updateFormData({ description })}
            onLongDescriptionChange={(longDescription) => updateFormData({ longDescription })}
          />

          {/* Image Upload */}
          <ImageUploader
            value={imagePreview}
            onChange={handleImageChange}
          />

          {/* Categories */}
          <CategorySelector
            categories={backendCategories}
            selectedCategories={formData.categories || []}
            onChange={handleCategoriesChange}
            required
            isLoading={loadingProjectCats}
          />

          {/* Technologies */}
          <TechnologyManager
            technologies={projectTechnologies}
            availableSkills={existingSkills}
            categories={techCategories}
            onChange={handleTechnologiesChange}
          />

          {/* URL Fields */}
          <ProjectUrlFields
            repositoryUrl={formData.repositoryUrl || ''}
            liveUrl={formData.liveUrl || ''}
            isCodePublic={formData.isCodePublic ?? true}
            onRepositoryUrlChange={(url) => updateFormData({ repositoryUrl: url })}
            onLiveUrlChange={(url) => updateFormData({ liveUrl: url })}
            onIsCodePublicChange={(isPublic) => updateFormData({ isCodePublic: isPublic })}
          />

          {/* Scores */}
          <ProjectScoresFields
            performanceScore={formData.performanceScore}
            accessibilityScore={formData.accessibilityScore}
            seoScore={formData.seoScore}
            onPerformanceScoreChange={(performanceScore) => updateFormData({ performanceScore })}
            onAccessibilityScoreChange={(accessibilityScore) => updateFormData({ accessibilityScore })}
            onSeoScoreChange={(seoScore) => updateFormData({ seoScore })}
          />

          {/* Toggles */}
          <ProjectToggles
            featured={formData.featured}
            publishedAt={formData.publishedAt}
            onFeaturedChange={(featured) => updateFormData({ featured })}
            onPublishedChange={handlePublishToggle}
          />
        </div>
      </form>
    </Modal>
  );
}
