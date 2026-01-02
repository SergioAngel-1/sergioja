'use client';

import { useState } from 'react';
import Button from '../atoms/Button';
import Modal from './Modal';
import CategorySelector from './CategorySelector';
import TechnologyManager from './TechnologyManager';
import ProjectBasicFields from './ProjectBasicFields';
import ProjectUrlFields from './ProjectUrlFields';
import ProjectToggles from './ProjectToggles';
import ProjectScoresFields from './ProjectScoresFields';
import ImageUploadTabs from './ImageUploadTabs';
import SingleImageUploader from './SingleImageUploader';
import CategoryManagementModal from './CategoryManagementModal';
import { fluidSizing } from '@/lib/fluidSizing';
import { alerts } from '@/shared/alertSystem';
import { useCategories, useProjectForm } from '@/lib/hooks';
import { logger } from '@/lib/logger';

interface ProjectFormData {
  id?: string;
  title: string;
  category: string;
  categories?: string[];
  technologies: string[];
  isFeatured: boolean;
  status: 'DRAFT' | 'IN_PROGRESS' | 'PUBLISHED';
  publishedAt: string | null;
  repositoryUrl?: string;
  liveUrl?: string;
  imageUrl?: string;
  isCodePublic?: boolean;
  imagesDesktop?: string[];
  imagesMobile?: string[];
}

interface Skill {
  id: string;
  name: string;
  category: string;
  proficiency: number;
  yearsOfExperience: number;
}

interface ProjectFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (project: Partial<ProjectFormData>) => Promise<void>;
  onDelete?: () => Promise<void>;
  project?: any | null; // eslint-disable-line @typescript-eslint/no-explicit-any
  existingSkills?: Skill[];
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
  const [isManualSlugMode, setIsManualSlugMode] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [categoryModalType, setCategoryModalType] = useState<'project' | 'technology'>('project');

  // Cargar categorías usando hook personalizado
  const { categories: backendCategories, isLoading: loadingProjectCats, reload: reloadProjectCategories } = useCategories(
    'project',
    isOpen
  );
  const { categories: techCategories, isLoading: loadingTechCats, reload: reloadTechCategories } = useCategories(
    'technology',
    isOpen
  );

  // Manejar lógica del formulario con hook personalizado
  const {
    formData,
    projectTechnologies,
    normalizedCategories,
    updateFormData,
    handleTechnologiesChange,
    handleCategoriesChange,
    handleStatusChange,
    getSubmitData,
    isValid,
    handleSlugUpdate,
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
      logger.error('Error saving project', error);
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
          <Button type="button" onClick={onClose} variant="secondary" size="md" fullWidth>
            Cancelar
          </Button>
          <Button
            type="submit"
            form="project-form"
            disabled={isSubmitting || isManualSlugMode}
            isLoading={isSubmitting}
            variant="primary"
            size="md"
            fullWidth
            title={isManualSlugMode ? 'Guarda la URL manual primero' : undefined}
          >
            {project ? 'Actualizar' : 'Crear Proyecto'}
          </Button>
        </>
      }
    >
      <form id="project-form" onSubmit={handleSubmit}>
        <div
          style={{
            padding: fluidSizing.space.lg,
            display: 'flex',
            flexDirection: 'column',
            gap: fluidSizing.space.lg,
          }}
        >
          {/* Basic Fields */}
          <ProjectBasicFields
            title={formData.title}
            longDescriptionEs={formData.longDescriptionEs}
            longDescriptionEn={formData.longDescriptionEn}
            existingSlug={project?.slug}
            onSlugUpdated={handleSlugUpdate}
            onTitleChange={(title) => updateFormData({ title })}
            onLongDescriptionEsChange={(longDescriptionEs) => updateFormData({ longDescriptionEs })}
            onLongDescriptionEnChange={(longDescriptionEn) => updateFormData({ longDescriptionEn })}
            onManualModeChange={setIsManualSlugMode}
          />

          {/* Thumbnail Image */}
          <SingleImageUploader
            image={formData.thumbnailImage || ''}
            onChange={(image) => updateFormData({ thumbnailImage: image })}
            label="Imagen Principal (Thumbnail)"
            recommendedDimensions="1920x1080px (16:9 - Horizontal)"
          />

          {/* Multi Image Upload - Desktop & Mobile */}
          <ImageUploadTabs
            desktopImages={formData.imagesDesktop || []}
            mobileImages={formData.imagesMobile || []}
            onDesktopChange={(images) => updateFormData({ imagesDesktop: images })}
            onMobileChange={(images) => updateFormData({ imagesMobile: images })}
          />

          {/* Categories */}
          <CategorySelector
            categories={backendCategories}
            selectedCategories={formData.categories || []}
            onChange={handleCategoriesChange}
            required
            isLoading={loadingProjectCats}
            onCreateNew={() => {
              setCategoryModalType('project');
              setIsCategoryModalOpen(true);
            }}
          />

          {/* Technologies */}
          <TechnologyManager
            technologies={projectTechnologies}
            availableSkills={existingSkills}
            categories={techCategories}
            onChange={handleTechnologiesChange}
            onCreateCategory={() => {
              setCategoryModalType('technology');
              setIsCategoryModalOpen(true);
            }}
          />

          {/* Toggles */}
          <ProjectToggles
            isFeatured={formData.isFeatured}
            isCodePublic={formData.isCodePublic ?? true}
            status={formData.status}
            onIsFeaturedChange={(isFeatured) => updateFormData({ isFeatured })}
            onIsCodePublicChange={(isPublic) => {
              updateFormData({
                isCodePublic: isPublic,
                ...(isPublic ? {} : { repositoryUrl: '' }),
              });
            }}
            onStatusChange={handleStatusChange}
          />

          {/* URL Fields */}
          <ProjectUrlFields
            repositoryUrl={formData.repositoryUrl || ''}
            liveUrl={formData.liveUrl || ''}
            isCodePublic={formData.isCodePublic ?? true}
            onRepositoryUrlChange={(url) => updateFormData({ repositoryUrl: url })}
            onLiveUrlChange={(url) => updateFormData({ liveUrl: url })}
          />

          {/* Scores */}
          <ProjectScoresFields
            performanceScore={formData.performanceScore}
            accessibilityScore={formData.accessibilityScore}
            seoScore={formData.seoScore}
            onPerformanceScoreChange={(performanceScore) => updateFormData({ performanceScore })}
            onAccessibilityScoreChange={(accessibilityScore) =>
              updateFormData({ accessibilityScore })
            }
            onSeoScoreChange={(seoScore) => updateFormData({ seoScore })}
          />
        </div>
      </form>

      {/* Category Management Modal */}
      <CategoryManagementModal
        isOpen={isCategoryModalOpen}
        onClose={() => {
          setIsCategoryModalOpen(false);
          // Recargar las categorías correspondientes después de cerrar el modal
          if (categoryModalType === 'project') {
            reloadProjectCategories();
          } else {
            reloadTechCategories();
          }
        }}
        type={categoryModalType}
      />
    </Modal>
  );
}
