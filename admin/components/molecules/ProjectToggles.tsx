'use client';

import { fluidSizing } from '@/lib/fluidSizing';
import Checkbox from '../atoms/Checkbox';
import { logger } from '@/lib/logger';

interface ProjectTogglesProps {
  featured: boolean;
  publishedAt: string | null;
  onFeaturedChange: (featured: boolean) => void;
  onPublishedChange: () => void;
}

export default function ProjectToggles({
  featured,
  publishedAt,
  onFeaturedChange,
  onPublishedChange,
}: ProjectTogglesProps) {
  const isPublished = !!publishedAt && (typeof publishedAt === 'string' ? publishedAt.trim() !== '' : true);
  
  logger.info('ProjectToggles render:', { featured, publishedAt, isPublished });

  return (
    <div className="flex" style={{ gap: fluidSizing.space.lg }}>
      <Checkbox
        checked={featured}
        onChange={(e) => onFeaturedChange(e.target.checked)}
        label="Destacado"
      />

      <Checkbox
        checked={isPublished}
        onChange={onPublishedChange}
        label="Publicado"
      />
    </div>
  );
}
