'use client';

import { useIsMobile } from '@/shared/hooks/useIsMobile';
import ProjectImageGalleryDesktop from './ProjectImageGalleryDesktop';
import ProjectImageGalleryMobile from './ProjectImageGalleryMobile';

interface ProjectImageGalleryProps {
  desktopImages: string[];
  mobileImages: string[];
  selectedImageIndex: number | null;
  onImageSelect: (index: number) => void;
  projectTitle: string;
}

/**
 * Wrapper component que muestra la galería apropiada según el dispositivo
 * - Desktop: Imágenes horizontales (16:9)
 * - Mobile: Imágenes verticales (9:16)
 */
export default function ProjectImageGallery({
  desktopImages,
  mobileImages,
  selectedImageIndex,
  onImageSelect,
  projectTitle,
}: ProjectImageGalleryProps) {
  const isMobile = useIsMobile();

  // Si hay imágenes mobile y estamos en mobile, usar esas
  // Si no, usar desktop como fallback
  const shouldUseMobile = isMobile && mobileImages.length > 0;
  const images = shouldUseMobile ? mobileImages : desktopImages;

  if (!images || images.length === 0) {
    return null;
  }

  return shouldUseMobile ? (
    <ProjectImageGalleryMobile
      images={images}
      selectedImageIndex={selectedImageIndex}
      onImageSelect={onImageSelect}
      projectTitle={projectTitle}
    />
  ) : (
    <ProjectImageGalleryDesktop
      images={images}
      selectedImageIndex={selectedImageIndex}
      onImageSelect={onImageSelect}
      projectTitle={projectTitle}
    />
  );
}
