'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { fluidSizing } from '@/lib/utils/fluidSizing';

interface ProjectImageGalleryProps {
  images: string[];
  selectedImageIndex: number;
  onImageSelect: (index: number) => void;
}

export default function ProjectImageGallery({
  images,
  selectedImageIndex,
  onImageSelect,
}: ProjectImageGalleryProps) {
  if (!images || images.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto custom-scrollbar" style={{ gap: fluidSizing.space.sm }}>
      {images.map((image, index) => {
        const isSelected = selectedImageIndex === index;
        return (
          <motion.button
            key={index}
            onClick={() => onImageSelect(index)}
            className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all duration-300 flex-shrink-0 ${
              isSelected
                ? 'border-white shadow-lg shadow-white/20'
                : 'border-white/20 hover:border-white/50'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Image
              src={image}
              alt={`Preview ${index + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 15vw"
            />
            {isSelected && (
              <motion.div
                layoutId="selectedImage"
                className="absolute inset-0 bg-white/10 backdrop-blur-[1px]"
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            )}
            <div 
              className="absolute bg-black/50 backdrop-blur-sm text-white rounded"
              style={{ 
                bottom: fluidSizing.space.xs,
                right: fluidSizing.space.xs,
                padding: `${fluidSizing.space.xs} ${fluidSizing.space.sm}`,
                fontSize: fluidSizing.text.xs,
              }}
            >
              {index + 1}
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
