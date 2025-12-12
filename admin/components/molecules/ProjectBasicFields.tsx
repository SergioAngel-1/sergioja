'use client';

import { fluidSizing } from '@/lib/fluidSizing';

interface ProjectBasicFieldsProps {
  title: string;
  longDescriptionEs: string;
  longDescriptionEn: string;
  onTitleChange: (title: string) => void;
  onLongDescriptionEsChange: (longDescription: string) => void;
  onLongDescriptionEnChange: (longDescription: string) => void;
}

export default function ProjectBasicFields({
  title,
  longDescriptionEs,
  longDescriptionEn,
  onTitleChange,
  onLongDescriptionEsChange,
  onLongDescriptionEnChange,
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

      {/* Long Description ES */}
      <div>
        <label className="block text-text-muted font-medium uppercase tracking-wider" style={{ fontSize: fluidSizing.text.xs, marginBottom: fluidSizing.space.sm }}>
          Descripción Detallada (ES)
        </label>
        <textarea
          value={longDescriptionEs}
          onChange={(e) => onLongDescriptionEsChange(e.target.value)}
          rows={6}
          className="w-full bg-admin-dark-surface border border-admin-primary/20 rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:border-admin-primary/50 focus:ring-2 focus:ring-admin-primary/20 transition-all duration-200 resize-none"
          style={{ padding: `${fluidSizing.space.sm} ${fluidSizing.space.md}`, fontSize: fluidSizing.text.base }}
          placeholder="Descripción completa del proyecto, características, tecnologías utilizadas, desafíos, etc..."
        />
      </div>

      {/* Long Description EN */}
      <div>
        <label className="block text-text-muted font-medium uppercase tracking-wider" style={{ fontSize: fluidSizing.text.xs, marginBottom: fluidSizing.space.sm }}>
          Detailed Description (EN)
        </label>
        <textarea
          value={longDescriptionEn}
          onChange={(e) => onLongDescriptionEnChange(e.target.value)}
          rows={6}
          className="w-full bg-admin-dark-surface border border-admin-primary/20 rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:border-admin-primary/50 focus:ring-2 focus:ring-admin-primary/20 transition-all duration-200 resize-none"
          style={{ padding: `${fluidSizing.space.sm} ${fluidSizing.space.md}`, fontSize: fluidSizing.text.base }}
          placeholder="Full project description in English..."
        />
      </div>
    </>
  );
}
