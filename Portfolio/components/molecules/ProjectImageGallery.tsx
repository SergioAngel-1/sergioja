'use client';

import ProjectImageGalleryDesktop from './ProjectImageGalleryDesktop';
import ProjectImageGalleryMobile from './ProjectImageGalleryMobile';
import { fluidSizing } from '@/lib/utils/fluidSizing';

interface ProjectImageGalleryProps {
  desktopImages: string[];
  mobileImages: string[];
  selectedImageIndex: number | null;
  selectedGalleryType: 'desktop' | 'mobile';
  onImageSelect: (index: number, galleryType: 'desktop' | 'mobile') => void;
  projectTitle: string;
}

export default function ProjectImageGallery({
  desktopImages,
  mobileImages,
  selectedImageIndex,
  selectedGalleryType,
  onImageSelect,
  projectTitle,
}: ProjectImageGalleryProps) {
  const hasDesktop = desktopImages && desktopImages.length > 0;
  const hasMobile = mobileImages && mobileImages.length > 0;

  if (!hasDesktop && !hasMobile) {
    return null;
  }

  return (
    <div className="flex flex-col" style={{ gap: fluidSizing.space.xl }}>
      {/* Desktop Gallery */}
      {hasDesktop && (
        <div className="bg-background-elevated/30 backdrop-blur-sm border border-white/10 rounded-lg" style={{ padding: fluidSizing.space.lg }}>
          <h3 className="font-orbitron font-semibold text-white mb-4" style={{ fontSize: fluidSizing.text.lg }}>
            Desktop Gallery (16:9)
          </h3>
          <ProjectImageGalleryDesktop
            images={desktopImages}
            selectedImageIndex={selectedGalleryType === 'desktop' ? selectedImageIndex : null}
            onImageSelect={(index) => onImageSelect(index, 'desktop')}
            projectTitle={projectTitle}
          />
        </div>
      )}

      {/* Mobile Gallery */}
      {hasMobile && (
        <div className="bg-background-elevated/30 backdrop-blur-sm border border-white/10 rounded-lg" style={{ padding: fluidSizing.space.lg }}>
          <h3 className="font-orbitron font-semibold text-white mb-4" style={{ fontSize: fluidSizing.text.lg }}>
            Mobile Gallery (9:16)
          </h3>
          <ProjectImageGalleryMobile
            images={mobileImages}
            selectedImageIndex={selectedGalleryType === 'mobile' ? selectedImageIndex : null}
            onImageSelect={(index) => onImageSelect(index, 'mobile')}
            projectTitle={projectTitle}
          />
        </div>
      )}
    </div>
  );
}
