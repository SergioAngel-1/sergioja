'use client';

import Button from '../atoms/Button';
import Select from './Select';
import { fluidSizing } from '@/lib/fluidSizing';

export interface TechnologyFormData {
  name: string;
  category: string;
  proficiency: number;
  yearsOfExperience: number;
}

interface Category {
  name: string;
  label: string;
  active: boolean;
}

interface TechnologyFormProps {
  technology: TechnologyFormData;
  categories: Category[];
  onChange: (data: TechnologyFormData) => void;
  onSave: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function TechnologyForm({
  technology,
  categories,
  onChange,
  onSave,
  onCancel,
  isLoading = false,
}: TechnologyFormProps) {
  return (
    <div className="bg-admin-dark-surface border border-admin-primary/30 rounded-lg" style={{ padding: fluidSizing.space.md }}>
      <div className="flex items-center justify-between" style={{ marginBottom: fluidSizing.space.md }}>
        <h4 className="text-admin-primary font-medium" style={{ fontSize: fluidSizing.text.base }}>
          Configurar: {technology.name}
        </h4>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: fluidSizing.space.md }}>
        {/* Category */}
        <div>
          <label className="block text-text-muted font-medium uppercase tracking-wider" style={{ fontSize: fluidSizing.text.xs, marginBottom: fluidSizing.space.sm }}>
            Categoría *
          </label>
          {categories.length > 0 ? (
            <Select
              value={technology.category}
              onChange={(value) => onChange({ ...technology, category: value })}
              options={categories.map(cat => ({
                value: cat.name,
                label: cat.label
              }))}
            />
          ) : (
            <div className="w-full bg-admin-dark-surface border border-admin-primary/20 rounded-lg text-text-muted flex items-center justify-center" style={{ padding: `${fluidSizing.space.sm} ${fluidSizing.space.md}`, fontSize: fluidSizing.text.base }}>
              Cargando categorías...
            </div>
          )}
        </div>

        {/* Proficiency */}
        <div>
          <label className="block text-text-muted font-medium uppercase tracking-wider" style={{ fontSize: fluidSizing.text.xs, marginBottom: fluidSizing.space.sm }}>
            Dominio: {technology.proficiency}%
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={technology.proficiency}
            onChange={(e) => onChange({ ...technology, proficiency: parseInt(e.target.value) })}
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
            value={technology.yearsOfExperience}
            onChange={(e) => onChange({ ...technology, yearsOfExperience: parseFloat(e.target.value) })}
            className="w-full bg-admin-dark-elevated border border-admin-primary/20 rounded-lg text-text-primary focus:outline-none focus:border-admin-primary/50 focus:ring-2 focus:ring-admin-primary/20 transition-all duration-200"
            style={{ padding: `${fluidSizing.space.sm} ${fluidSizing.space.md}`, fontSize: fluidSizing.text.base }}
          />
        </div>

        {/* Buttons */}
        <div className="flex" style={{ gap: fluidSizing.space.sm }}>
          <Button
            type="button"
            onClick={onCancel}
            variant="secondary"
            size="sm"
            fullWidth
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={onSave}
            variant="primary"
            size="sm"
            fullWidth
            isLoading={isLoading}
          >
            Agregar
          </Button>
        </div>
      </div>
    </div>
  );
}
