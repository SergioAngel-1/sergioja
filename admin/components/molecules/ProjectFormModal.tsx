'use client';

import { useState, useEffect } from 'react';
import Icon from '../atoms/Icon';
import Button from '../atoms/Button';
import Checkbox from '../atoms/Checkbox';
import Modal from './Modal';
import Select from './Select';
import { fluidSizing } from '@/lib/fluidSizing';

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
  project?: any | null; // eslint-disable-line @typescript-eslint/no-explicit-any
  existingSkills?: string[];
}

export default function ProjectFormModal({
  isOpen,
  onClose,
  onSave,
  project,
  existingSkills = [],
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
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [showTechForm, setShowTechForm] = useState(false);
  const [techFormData, setTechFormData] = useState<TechnologyFormData>({
    name: '',
    category: 'other',
    proficiency: 50,
    yearsOfExperience: 0,
  });
  const [projectTechnologies, setProjectTechnologies] = useState<TechnologyFormData[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);

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
        technologies: project.technologies?.map((t: any) => // eslint-disable-line @typescript-eslint/no-explicit-any 
          typeof t === 'string' ? t : t.technology?.name || t.name
        ) || [],
      });
      setImagePreview(project.imageUrl || project.image || '');
      setImageFile(null);
      
      // Inicializar projectTechnologies con datos existentes
      const existingTechs = project.technologies?.map((t: any) => {
        // Si viene de la relación ProjectTechnology, tiene los datos completos
        if (t.category !== undefined && t.proficiency !== undefined) {
          return {
            name: t.technology?.name || t.name,
            category: t.category,
            proficiency: t.proficiency,
            yearsOfExperience: t.yearsOfExperience || 0,
          };
        }
        // Fallback: valores por defecto
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview('');
    setFormData({ ...formData, imageUrl: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Preparar datos para enviar al backend
      const dataToSave = {
        ...formData,
        technologiesData: projectTechnologies, // Enviar información completa de tecnologías
      };
      await onSave(dataToSave);
      onClose();
    } catch (error) {
      console.error('Error saving project:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter suggestions based on input
  useEffect(() => {
    if (techInput.trim()) {
      const filtered = existingSkills.filter(skill => 
        skill.toLowerCase().includes(techInput.toLowerCase()) &&
        !projectTechnologies.find(t => t.name === skill)
      );
      setFilteredSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
      setFilteredSuggestions([]);
    }
  }, [techInput, existingSkills, projectTechnologies]);

  const handleAddTechnology = () => {
    if (techInput.trim()) {
      setTechFormData({ ...techFormData, name: techInput.trim() });
      setShowTechForm(true);
      setTechInput('');
      setShowSuggestions(false);
    }
  };

  const handleSelectSuggestion = (skillName: string) => {
    setTechFormData({ ...techFormData, name: skillName });
    setShowTechForm(true);
    setTechInput('');
    setShowSuggestions(false);
  };

  const handleSaveTechnology = () => {
    if (techFormData.name && !projectTechnologies.find(t => t.name === techFormData.name)) {
      const newTech = { ...techFormData };
      setProjectTechnologies([...projectTechnologies, newTech]);
      setFormData({
        ...formData,
        technologies: [...(formData.technologies || []), techFormData.name],
      });
      setShowTechForm(false);
      setTechFormData({
        name: '',
        category: 'other',
        proficiency: 50,
        yearsOfExperience: 0,
      });
    }
  };

  const handleCancelTechForm = () => {
    setShowTechForm(false);
    setTechFormData({
      name: '',
      category: 'other',
      proficiency: 50,
      yearsOfExperience: 0,
    });
  };

  const handleRemoveTechnology = (tech: string) => {
    setProjectTechnologies(projectTechnologies.filter(t => t.name !== tech));
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

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={project ? 'Editar Proyecto' : 'Nuevo Proyecto'}
      maxWidth="3xl"
      footer={
        <>
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
                <div>
                  <label className="block text-text-muted font-medium uppercase tracking-wider" style={{ fontSize: fluidSizing.text.xs, marginBottom: fluidSizing.space.sm }}>
                    Imagen del Proyecto
                  </label>
                  
                  {imagePreview ? (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-lg border border-admin-primary/20"
                      />
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 transition-colors"
                      >
                        <Icon name="x" size={16} />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-admin-primary/30 rounded-lg cursor-pointer hover:border-admin-primary/50 transition-colors bg-admin-dark-surface">
                      <div className="flex flex-col items-center justify-center" style={{ padding: fluidSizing.space.lg }}>
                        <Icon name="upload" size={32} className="text-admin-primary mb-2" />
                        <p className="text-text-muted" style={{ fontSize: fluidSizing.text.sm }}>
                          Click para subir imagen
                        </p>
                        <p className="text-text-muted/50" style={{ fontSize: fluidSizing.text.xs, marginTop: fluidSizing.space.xs }}>
                          PNG, JPG, WEBP (max. 5MB)
                        </p>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  )}
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
                  
                  {!showTechForm ? (
                    <>
                      <div className="relative">
                        <div className="flex" style={{ gap: fluidSizing.space.sm }}>
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
                        
                        {/* Suggestions Dropdown */}
                        {showSuggestions && filteredSuggestions.length > 0 && (
                          <div 
                            className="absolute z-10 w-full bg-admin-dark-elevated border border-admin-primary/30 rounded-lg shadow-lg overflow-hidden"
                            style={{ marginTop: fluidSizing.space.xs, maxHeight: '200px', overflowY: 'auto' }}
                          >
                            {filteredSuggestions.map((skill) => (
                              <button
                                key={skill}
                                type="button"
                                onClick={() => handleSelectSuggestion(skill)}
                                className="w-full text-left px-4 py-2 hover:bg-admin-primary/20 text-text-primary transition-colors"
                                style={{ fontSize: fluidSizing.text.sm }}
                              >
                                {skill}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-wrap" style={{ gap: fluidSizing.space.sm, marginTop: fluidSizing.space.sm }}>
                        {projectTechnologies.map((tech) => (
                          <span
                            key={tech.name}
                            className="inline-flex items-center bg-admin-primary/10 border border-admin-primary/30 text-admin-primary rounded-lg"
                            style={{ gap: fluidSizing.space.xs, padding: `${fluidSizing.space.xs} ${fluidSizing.space.sm}`, fontSize: fluidSizing.text.sm }}
                            title={`${tech.category} | Dominio: ${tech.proficiency}% | Exp: ${tech.yearsOfExperience} años`}
                          >
                            {tech.name}
                            <button
                              type="button"
                              onClick={() => handleRemoveTechnology(tech.name)}
                              className="hover:text-admin-error transition-colors"
                            >
                              <Icon name="plus" size={14} className="rotate-45" />
                            </button>
                          </span>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="bg-admin-dark-surface border border-admin-primary/30 rounded-lg" style={{ padding: fluidSizing.space.md }}>
                      <div className="flex items-center justify-between" style={{ marginBottom: fluidSizing.space.md }}>
                        <h4 className="text-admin-primary font-medium" style={{ fontSize: fluidSizing.text.base }}>
                          Configurar: {techFormData.name}
                        </h4>
                      </div>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: fluidSizing.space.md }}>
                        {/* Category */}
                        <div>
                          <label className="block text-text-muted font-medium uppercase tracking-wider" style={{ fontSize: fluidSizing.text.xs, marginBottom: fluidSizing.space.sm }}>
                            Categoría *
                          </label>
                          <Select
                            value={techFormData.category}
                            onChange={(value) => setTechFormData({ ...techFormData, category: value })}
                            options={[
                              { value: 'frontend', label: 'Frontend' },
                              { value: 'backend', label: 'Backend' },
                              { value: 'devops', label: 'DevOps' },
                              { value: 'design', label: 'Diseño' },
                              { value: 'other', label: 'Otros' },
                            ]}
                          />
                        </div>

                        {/* Proficiency */}
                        <div>
                          <label className="block text-text-muted font-medium uppercase tracking-wider" style={{ fontSize: fluidSizing.text.xs, marginBottom: fluidSizing.space.sm }}>
                            Dominio: {techFormData.proficiency}%
                          </label>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={techFormData.proficiency}
                            onChange={(e) => setTechFormData({ ...techFormData, proficiency: parseInt(e.target.value) })}
                            className="w-full h-2 bg-admin-dark-elevated rounded-lg appearance-none cursor-pointer accent-admin-primary"
                          />
                        </div>

                        {/* Years of Experience */}
                        <div>
                          <label className="block text-text-muted font-medium uppercase tracking-wider" style={{ fontSize: fluidSizing.text.xs, marginBottom: fluidSizing.space.sm }}>
                            Años de Experiencia
                          </label>
                          <input
                            type="number"
                            min="0"
                            max="50"
                            step="0.5"
                            value={techFormData.yearsOfExperience}
                            onChange={(e) => setTechFormData({ ...techFormData, yearsOfExperience: parseFloat(e.target.value) })}
                            className="w-full bg-admin-dark-elevated border border-admin-primary/20 rounded-lg text-text-primary focus:outline-none focus:border-admin-primary/50 focus:ring-2 focus:ring-admin-primary/20 transition-all duration-200"
                            style={{ padding: `${fluidSizing.space.sm} ${fluidSizing.space.md}`, fontSize: fluidSizing.text.base }}
                          />
                        </div>

                        {/* Buttons */}
                        <div className="flex" style={{ gap: fluidSizing.space.sm }}>
                          <Button
                            type="button"
                            onClick={handleCancelTechForm}
                            variant="secondary"
                            size="sm"
                            fullWidth
                          >
                            Cancelar
                          </Button>
                          <Button
                            type="button"
                            onClick={handleSaveTechnology}
                            variant="primary"
                            size="sm"
                            fullWidth
                          >
                            Agregar
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

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
