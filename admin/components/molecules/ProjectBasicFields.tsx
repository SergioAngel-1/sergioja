'use client';

import { fluidSizing } from '@/lib/fluidSizing';

interface ProjectBasicFieldsProps {
  title: string;
  description: string;
  longDescription: string;
  onTitleChange: (title: string) => void;
  onDescriptionChange: (description: string) => void;
  onLongDescriptionChange: (longDescription: string) => void;
}

export default function ProjectBasicFields({
  title,
  description,
  longDescription,
  onTitleChange,
  onDescriptionChange,
  onLongDescriptionChange,
}: ProjectBasicFieldsProps) {
  return (
    <>
      {/* Title */}
      <div>
        <label className="block text-text-muted font-medium uppercase tracking-wider" style={{ fontSize: fluidSizing.text.xs, marginBottom: fluidSizing.space.sm }}>
          Título *
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          required
          className="w-full bg-admin-dark-surface border border-admin-primary/20 rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:border-admin-primary/50 focus:ring-2 focus:ring-admin-primary/20 transition-all duration-200"
          style={{ padding: `${fluidSizing.space.sm} ${fluidSizing.space.md}`, fontSize: fluidSizing.text.base }}
          placeholder="Nombre del proyecto"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-text-muted font-medium uppercase tracking-wider" style={{ fontSize: fluidSizing.text.xs, marginBottom: fluidSizing.space.sm }}>
          Descripción Corta *
        </label>
        <textarea
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          required
          rows={3}
          className="w-full bg-admin-dark-surface border border-admin-primary/20 rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:border-admin-primary/50 focus:ring-2 focus:ring-admin-primary/20 transition-all duration-200 resize-none"
          style={{ padding: `${fluidSizing.space.sm} ${fluidSizing.space.md}`, fontSize: fluidSizing.text.base }}
          placeholder="Descripción breve para listados..."
        />
      </div>

      {/* Long Description */}
      <div>
        <label className="block text-text-muted font-medium uppercase tracking-wider" style={{ fontSize: fluidSizing.text.xs, marginBottom: fluidSizing.space.sm }}>
          Descripción Detallada
        </label>
        <textarea
          value={longDescription}
          onChange={(e) => onLongDescriptionChange(e.target.value)}
          rows={6}
          className="w-full bg-admin-dark-surface border border-admin-primary/20 rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:border-admin-primary/50 focus:ring-2 focus:ring-admin-primary/20 transition-all duration-200 resize-none"
          style={{ padding: `${fluidSizing.space.sm} ${fluidSizing.space.md}`, fontSize: fluidSizing.text.base }}
          placeholder="Descripción completa del proyecto, características, tecnologías utilizadas, desafíos, etc..."
        />
      </div>
    </>
  );
}
