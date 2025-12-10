'use client';

import { fluidSizing } from '@/lib/fluidSizing';
import Checkbox from '../atoms/Checkbox';
import UrlInput from './UrlInput';

interface ProjectUrlFieldsProps {
  repositoryUrl: string;
  liveUrl: string;
  isCodePublic: boolean;
  onRepositoryUrlChange: (url: string) => void;
  onLiveUrlChange: (url: string) => void;
  onIsCodePublicChange: (isPublic: boolean) => void;
}

export default function ProjectUrlFields({
  repositoryUrl,
  liveUrl,
  isCodePublic,
  onRepositoryUrlChange,
  onLiveUrlChange,
  onIsCodePublicChange,
}: ProjectUrlFieldsProps) {
  const handleCodePublicToggle = (checked: boolean) => {
    onIsCodePublicChange(checked);
    if (!checked) {
      onRepositoryUrlChange('');
    }
  };

  return (
    <>
      <div>
        <Checkbox
          checked={!isCodePublic}
          onChange={() => handleCodePublicToggle(!isCodePublic)}
          label="Repositorio Privado"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: fluidSizing.space.lg }}>
        {isCodePublic && (
          <div>
            <label className="block text-text-muted font-medium uppercase tracking-wider" style={{ fontSize: fluidSizing.text.xs, marginBottom: fluidSizing.space.sm }}>
              URL del Repositorio
            </label>
            <input
              type="url"
              value={repositoryUrl}
              onChange={(e) => onRepositoryUrlChange(e.target.value)}
              className="w-full bg-admin-dark-surface border border-admin-primary/20 rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:border-admin-primary/50 focus:ring-2 focus:ring-admin-primary/20 transition-all duration-200"
              style={{ padding: `${fluidSizing.space.sm} ${fluidSizing.space.md}`, fontSize: fluidSizing.text.base }}
              placeholder="https://github.com/usuario/repo"
            />
          </div>
        )}
        <div className={isCodePublic ? '' : 'md:col-span-2'}>
          <UrlInput
            value={liveUrl || ''}
            onChange={onLiveUrlChange}
            label="URL en Vivo"
            placeholder="ejemplo.com"
          />
        </div>
      </div>
    </>
  );
}

