'use client';

import { fluidSizing } from '@/lib/fluidSizing';
import Select from './Select';

interface ProjectTogglesProps {
  isFeatured: boolean;
  isCodePublic: boolean;
  status: 'DRAFT' | 'IN_PROGRESS' | 'PUBLISHED';
  onIsFeaturedChange: (isFeatured: boolean) => void;
  onIsCodePublicChange: (isPublic: boolean) => void;
  onStatusChange: (status: 'DRAFT' | 'IN_PROGRESS' | 'PUBLISHED') => void;
}

export default function ProjectToggles({
  isFeatured,
  isCodePublic,
  status,
  onIsFeaturedChange,
  onIsCodePublicChange,
  onStatusChange,
}: ProjectTogglesProps) {
  const yesNoOptions = [
    { value: 'no', label: 'No' },
    { value: 'yes', label: 'Sí' },
  ];

  const statusOptions = [
    { value: 'DRAFT', label: 'Borrador' },
    { value: 'IN_PROGRESS', label: 'En proceso' },
    { value: 'PUBLISHED', label: 'Publicado' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: fluidSizing.space.lg, alignItems: 'end' }}>
      <Select
        value={!isCodePublic ? 'yes' : 'no'}
        onChange={(value) => onIsCodePublicChange(value === 'no')}
        options={yesNoOptions}
        label="Repositorio Privado"
      />

      <Select
        value={isFeatured ? 'yes' : 'no'}
        onChange={(value) => onIsFeaturedChange(value === 'yes')}
        options={yesNoOptions}
        label="Destacado"
      />

      <Select
        value={status}
        onChange={(value) => onStatusChange(value as ProjectTogglesProps['status'])}
        options={statusOptions}
        label="Estado"
      />
    </div>
  );
}
