'use client';

import { useState, useEffect } from 'react';
import Modal from './Modal';
import Button from '../atoms/Button';
import Select from './Select';
import { fluidSizing } from '@/lib/fluidSizing';
import { Skill } from '@/lib/types';
import { useCategories } from '@/lib/hooks';

interface SkillEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (skill: Partial<Skill>) => Promise<void>;
  skill: Skill | null;
}

export default function SkillEditModal({
  isOpen,
  onClose,
  onSave,
  skill,
}: SkillEditModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    proficiency: 0,
    yearsOfExperience: 0,
    color: '#FF0000',
    icon: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { categories, isLoading: loadingCategories } = useCategories('technology', isOpen);

  useEffect(() => {
    if (skill && isOpen) {
      setFormData({
        name: skill.name || '',
        category: skill.category || '',
        proficiency: skill.proficiency || 0,
        yearsOfExperience: skill.yearsOfExperience || 0,
        color: skill.color || '#FF0000',
        icon: skill.icon || '',
      });
    }
  }, [skill, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!skill) return;

    try {
      setIsSubmitting(true);
      await onSave({
        id: skill.id,
        ...formData,
      });
      onClose();
    } catch (error) {
      console.error('Error saving skill:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const footerContent = (
    <>
      <Button
        variant="secondary"
        onClick={onClose}
        disabled={isSubmitting}
        className="flex-1"
      >
        Cancelar
      </Button>
      <Button
        type="submit"
        variant="primary"
        isLoading={isSubmitting}
        onClick={handleSubmit}
        className="flex-1"
      >
        Guardar Cambios
      </Button>
    </>
  );

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Editar Tecnología"
      footer={footerContent}
      maxWidth="lg"
    >
      <div style={{ padding: fluidSizing.space.lg, display: 'flex', flexDirection: 'column', gap: fluidSizing.space.lg }}>
        {/* Name (readonly) */}
        <div>
          <label className="block text-text-muted font-medium uppercase tracking-wider" style={{ fontSize: fluidSizing.text.xs, marginBottom: fluidSizing.space.sm }}>
            Nombre
          </label>
          <input
            type="text"
            value={formData.name}
            disabled
            className="w-full bg-admin-dark-surface/50 border border-admin-primary/20 rounded-lg text-text-muted cursor-not-allowed"
            style={{ padding: `${fluidSizing.space.sm} ${fluidSizing.space.md}`, fontSize: fluidSizing.text.base }}
          />
          <p className="text-text-muted/60" style={{ fontSize: fluidSizing.text.xs, marginTop: fluidSizing.space.xs }}>
            El nombre no se puede editar
          </p>
        </div>

        {/* Category */}
        <div>
          <label className="block text-text-muted font-medium uppercase tracking-wider" style={{ fontSize: fluidSizing.text.xs, marginBottom: fluidSizing.space.sm }}>
            Categoría *
          </label>
          {loadingCategories ? (
            <div className="w-full bg-admin-dark-surface border border-admin-primary/20 rounded-lg text-text-muted flex items-center justify-center" style={{ padding: `${fluidSizing.space.sm} ${fluidSizing.space.md}`, fontSize: fluidSizing.text.base }}>
              Cargando categorías...
            </div>
          ) : (
            <Select
              value={formData.category}
              onChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
              options={categories.map(cat => ({
                value: cat.name,
                label: cat.label
              }))}
            />
          )}
        </div>

        {/* Proficiency */}
        <div>
          <label className="block text-text-muted font-medium uppercase tracking-wider" style={{ fontSize: fluidSizing.text.xs, marginBottom: fluidSizing.space.sm }}>
            Dominio ({formData.proficiency}%)
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={formData.proficiency}
            onChange={(e) => setFormData(prev => ({ ...prev, proficiency: parseInt(e.target.value) }))}
            className="w-full"
          />
          <div className="flex justify-between text-text-muted" style={{ fontSize: fluidSizing.text.xs, marginTop: fluidSizing.space.xs }}>
            <span>Principiante</span>
            <span>Experto</span>
          </div>
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
            value={formData.yearsOfExperience}
            onChange={(e) => setFormData(prev => ({ ...prev, yearsOfExperience: parseFloat(e.target.value) }))}
            className="w-full bg-admin-dark-surface border border-admin-primary/20 rounded-lg text-text-primary focus:border-admin-primary focus:outline-none transition-colors"
            style={{ padding: `${fluidSizing.space.sm} ${fluidSizing.space.md}`, fontSize: fluidSizing.text.base }}
          />
        </div>

        {/* Color */}
        <div>
          <label className="block text-text-muted font-medium uppercase tracking-wider" style={{ fontSize: fluidSizing.text.xs, marginBottom: fluidSizing.space.sm }}>
            Color
          </label>
          <div className="flex items-center" style={{ gap: fluidSizing.space.sm }}>
            <input
              type="color"
              value={formData.color.substring(0, 7)}
              onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value.substring(0, 7) }))}
              className="h-10 w-20 rounded-lg border border-admin-primary/20 cursor-pointer"
            />
            <input
              type="text"
              value={formData.color}
              onChange={(e) => {
                const color = e.target.value.substring(0, 7);
                setFormData(prev => ({ ...prev, color }));
              }}
              className="flex-1 bg-admin-dark-surface border border-admin-primary/20 rounded-lg text-text-primary focus:border-admin-primary focus:outline-none transition-colors"
              style={{ padding: `${fluidSizing.space.sm} ${fluidSizing.space.md}`, fontSize: fluidSizing.text.base }}
              placeholder="#FF0000"
              maxLength={7}
            />
          </div>
        </div>

        {/* Icon URL */}
        <div>
          <label className="block text-text-muted font-medium uppercase tracking-wider" style={{ fontSize: fluidSizing.text.xs, marginBottom: fluidSizing.space.sm }}>
            URL del Ícono (opcional)
          </label>
          <input
            type="text"
            value={formData.icon}
            onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))}
            className="w-full bg-admin-dark-surface border border-admin-primary/20 rounded-lg text-text-primary focus:border-admin-primary focus:outline-none transition-colors"
            style={{ padding: `${fluidSizing.space.sm} ${fluidSizing.space.md}`, fontSize: fluidSizing.text.base }}
            placeholder="https://..."
          />
        </div>
      </div>
    </Modal>
  );
}
