'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../atoms/Icon';
import Select from './Select';
import { fluidSizing } from '@/lib/fluidSizing';

interface ProjectFormData {
  id?: string;
  title: string;
  description: string;
  category: string;
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
  project?: any | null;
}

export default function ProjectFormModal({
  isOpen,
  onClose,
  onSave,
  project,
}: ProjectFormModalProps) {
  const [formData, setFormData] = useState<Partial<ProjectFormData>>({
    title: '',
    description: '',
    category: 'web',
    technologies: [],
    featured: false,
    publishedAt: null,
    repositoryUrl: '',
    liveUrl: '',
    imageUrl: '',
    isCodePublic: true,
  });
  const [techInput, setTechInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      setFormData({
        ...project,
        technologies: project.technologies?.map((t: any) => 
          typeof t === 'string' ? t : t.technology?.name || t.name
        ) || [],
      });
    } else {
      setFormData({
        title: '',
        description: '',
        category: 'web',
        technologies: [],
        featured: false,
        publishedAt: null,
        repositoryUrl: '',
        liveUrl: '',
        imageUrl: '',
        isCodePublic: true,
      });
    }
  }, [project, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Error saving project:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddTechnology = () => {
    if (techInput.trim() && !formData.technologies?.includes(techInput.trim())) {
      setFormData({
        ...formData,
        technologies: [...(formData.technologies || []), techInput.trim()],
      });
      setTechInput('');
    }
  };

  const handleRemoveTechnology = (tech: string) => {
    setFormData({
      ...formData,
      technologies: formData.technologies?.filter((t) => t !== tech) || [],
    });
  };

  const handlePublishToggle = () => {
    setFormData({
      ...formData,
      publishedAt: formData.publishedAt ? null : new Date().toISOString(),
    });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ padding: fluidSizing.space.md }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="bg-admin-dark-elevated border border-admin-primary/30 rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header - Fixed */}
              <div className="flex items-center justify-between border-b border-admin-primary/20 flex-shrink-0" style={{ padding: fluidSizing.space.lg, gap: fluidSizing.space.md }}>
                <h2 className="font-orbitron font-bold text-admin-primary" style={{ fontSize: fluidSizing.text['2xl'] }}>
                  {project ? 'Editar Proyecto' : 'Nuevo Proyecto'}
                </h2>
                <button
                  onClick={onClose}
                  className="text-text-muted hover:text-text-primary transition-colors"
                >
                  <Icon name="plus" size={24} className="rotate-45" />
                </button>
              </div>

              {/* Form - Scrollable */}
              <form id="project-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
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

                {/* Category */}
                <Select
                  value={formData.category || 'web'}
                  onChange={(value) => setFormData({ ...formData, category: value })}
                  options={[
                    { value: 'web', label: 'Web' },
                    { value: 'mobile', label: 'Mobile' },
                    { value: 'ai', label: 'IA' },
                    { value: 'backend', label: 'Backend' },
                    { value: 'fullstack', label: 'Full Stack' },
                  ]}
                  label="Categoría *"
                />

                {/* Technologies */}
                <div>
                  <label className="block text-text-muted font-medium uppercase tracking-wider" style={{ fontSize: fluidSizing.text.xs, marginBottom: fluidSizing.space.sm }}>
                    Tecnologías
                  </label>
                  <div className="flex" style={{ gap: fluidSizing.space.sm, marginBottom: fluidSizing.space.sm }}>
                    <input
                      type="text"
                      value={techInput}
                      onChange={(e) => setTechInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTechnology())}
                      className="flex-1 bg-admin-dark-surface border border-admin-primary/20 rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:border-admin-primary/50 focus:ring-2 focus:ring-admin-primary/20 transition-all duration-200"
                      style={{ padding: `${fluidSizing.space.sm} ${fluidSizing.space.md}`, fontSize: fluidSizing.text.base }}
                      placeholder="Agregar tecnología..."
                    />
                    <button
                      type="button"
                      onClick={handleAddTechnology}
                      className="bg-admin-primary/20 hover:bg-admin-primary/30 text-admin-primary rounded-lg transition-all duration-200 flex items-center justify-center"
                      style={{ padding: fluidSizing.space.sm, minWidth: fluidSizing.size.buttonMd }}
                    >
                      <Icon name="plus" size={20} />
                    </button>
                  </div>
                  <div className="flex flex-wrap" style={{ gap: fluidSizing.space.sm }}>
                    {formData.technologies?.map((tech) => (
                      <span
                        key={tech}
                        className="inline-flex items-center bg-admin-primary/10 border border-admin-primary/30 text-admin-primary rounded-lg"
                        style={{ gap: fluidSizing.space.xs, padding: `${fluidSizing.space.xs} ${fluidSizing.space.sm}`, fontSize: fluidSizing.text.sm }}
                      >
                        {tech}
                        <button
                          type="button"
                          onClick={() => handleRemoveTechnology(tech)}
                          className="hover:text-admin-error transition-colors"
                        >
                          <Icon name="plus" size={14} className="rotate-45" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Repository Toggle */}
                <div>
                  <label className="flex items-center cursor-pointer" style={{ gap: fluidSizing.space.sm }}>
                    <input
                      type="checkbox"
                      checked={!formData.isCodePublic}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        isCodePublic: !e.target.checked,
                        repositoryUrl: e.target.checked ? '' : formData.repositoryUrl
                      })}
                      className="rounded border-admin-primary/30 bg-admin-dark-surface text-admin-primary focus:ring-2 focus:ring-admin-primary/20 cursor-pointer"
                      style={{ width: fluidSizing.size.iconMd, height: fluidSizing.size.iconMd }}
                    />
                    <div>
                      <span className="text-text-primary font-medium" style={{ fontSize: fluidSizing.text.base }}>Repositorio Privado</span>
                      <p className="text-text-muted" style={{ fontSize: fluidSizing.text.xs, marginTop: fluidSizing.space.xs }}>El código fuente no es público</p>
                    </div>
                  </label>
                </div>

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
                    <label className="block text-text-muted font-medium uppercase tracking-wider" style={{ fontSize: fluidSizing.text.xs, marginBottom: fluidSizing.space.sm }}>
                      URL en Vivo
                    </label>
                    <input
                      type="url"
                      value={formData.liveUrl}
                      onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                      className="w-full bg-admin-dark-surface border border-admin-primary/20 rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:border-admin-primary/50 focus:ring-2 focus:ring-admin-primary/20 transition-all duration-200"
                      style={{ padding: `${fluidSizing.space.sm} ${fluidSizing.space.md}`, fontSize: fluidSizing.text.base }}
                      placeholder="https://..."
                    />
                  </div>
                </div>

                {/* Image URL */}
                <div>
                  <label className="block text-text-muted font-medium uppercase tracking-wider" style={{ fontSize: fluidSizing.text.xs, marginBottom: fluidSizing.space.sm }}>
                    URL de Imagen
                  </label>
                  <input
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    className="w-full bg-admin-dark-surface border border-admin-primary/20 rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:border-admin-primary/50 focus:ring-2 focus:ring-admin-primary/20 transition-all duration-200"
                    style={{ padding: `${fluidSizing.space.sm} ${fluidSizing.space.md}`, fontSize: fluidSizing.text.base }}
                    placeholder="https://..."
                  />
                </div>

                {/* Toggles */}
                <div className="flex" style={{ gap: fluidSizing.space.lg }}>
                  <label className="flex items-center cursor-pointer" style={{ gap: fluidSizing.space.sm }}>
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      className="rounded border-admin-primary/30 bg-admin-dark-surface text-admin-primary focus:ring-2 focus:ring-admin-primary/20 cursor-pointer"
                      style={{ width: fluidSizing.size.iconMd, height: fluidSizing.size.iconMd }}
                    />
                    <span className="text-text-primary font-medium" style={{ fontSize: fluidSizing.text.base }}>Destacado</span>
                  </label>

                  <label className="flex items-center cursor-pointer" style={{ gap: fluidSizing.space.sm }}>
                    <input
                      type="checkbox"
                      checked={!!formData.publishedAt}
                      onChange={handlePublishToggle}
                      className="rounded border-admin-primary/30 bg-admin-dark-surface text-admin-primary focus:ring-2 focus:ring-admin-primary/20 cursor-pointer"
                      style={{ width: fluidSizing.size.iconMd, height: fluidSizing.size.iconMd }}
                    />
                    <span className="text-text-primary font-medium" style={{ fontSize: fluidSizing.text.base }}>Publicado</span>
                  </label>
                </div>
                </div>
              </form>

              {/* Actions - Fixed at bottom */}
              <div className="flex border-t border-admin-primary/20 flex-shrink-0" style={{ gap: fluidSizing.space.md, padding: fluidSizing.space.lg }}>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 bg-admin-dark-surface border border-admin-primary/20 text-text-primary rounded-lg font-medium hover:bg-admin-dark-elevated transition-all duration-200"
                  style={{ padding: `${fluidSizing.space.sm} ${fluidSizing.space.lg}`, fontSize: fluidSizing.text.base }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  form="project-form"
                  disabled={isSubmitting}
                  className="flex-1 bg-admin-primary text-admin-dark rounded-lg font-medium hover:bg-admin-primary/90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ padding: `${fluidSizing.space.sm} ${fluidSizing.space.lg}`, fontSize: fluidSizing.text.base }}
                >
                  {isSubmitting ? 'Guardando...' : project ? 'Actualizar' : 'Crear Proyecto'}
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
