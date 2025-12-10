'use client';

import { useState } from 'react';
import { fluidSizing } from '@/lib/fluidSizing';

// SVG Icons
const UploadIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);

const XIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const ImageIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21 15 16 10 5 21" />
  </svg>
);

interface MultiImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
}

export default function MultiImageUploader({
  images,
  onChange,
  maxImages = 5,
}: MultiImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const remainingSlots = maxImages - images.length;
    const filesToProcess = Array.from(files).slice(0, remainingSlots);

    filesToProcess.forEach((file) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result as string;
          onChange([...images, result]);
        };
        reader.readAsDataURL(file);
      }
    });

    // Reset input
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (!files) return;

    const remainingSlots = maxImages - images.length;
    const filesToProcess = Array.from(files).slice(0, remainingSlots);

    filesToProcess.forEach((file) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result as string;
          onChange([...images, result]);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onChange(newImages);
  };

  const canAddMore = images.length < maxImages;

  return (
    <div>
      <label 
        className="block text-text-muted font-medium uppercase tracking-wider" 
        style={{ fontSize: fluidSizing.text.xs, marginBottom: fluidSizing.space.sm }}
      >
        Imágenes del Proyecto ({images.length}/{maxImages})
      </label>

      {/* Grid de imágenes */}
      <div 
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5" 
        style={{ gap: fluidSizing.space.md, marginBottom: fluidSizing.space.md }}
      >
        {images.map((img, index) => (
          <div
            key={index}
            className="relative aspect-video bg-admin-dark-surface border border-admin-primary/20 rounded-lg overflow-hidden group"
          >
            <img
              src={img}
              alt={`Imagen ${index + 1}`}
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="absolute top-2 right-2 bg-red-500/90 hover:bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Eliminar imagen"
            >
              <XIcon />
            </button>
            {index === 0 && (
              <div 
                className="absolute bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm text-black font-semibold text-center py-1 border-t border-gray-200"
                style={{ fontSize: fluidSizing.text.xs }}
              >
                Principal
              </div>
            )}
          </div>
        ))}

        {/* Botón para agregar más imágenes */}
        {canAddMore && (
          <label
            className={`aspect-video bg-admin-dark-surface border-2 border-dashed rounded-lg cursor-pointer transition-all duration-200 flex flex-col items-center justify-center ${
              isDragging
                ? 'border-admin-primary bg-admin-primary/10'
                : 'border-admin-primary/30 hover:border-admin-primary/50 hover:bg-admin-primary/5'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="text-admin-primary mb-2">
              <UploadIcon />
            </div>
            <span 
              className="text-text-muted text-center px-2" 
              style={{ fontSize: fluidSizing.text.xs }}
            >
              {isDragging ? 'Suelta aquí' : 'Agregar'}
            </span>
          </label>
        )}
      </div>

      {/* Información */}
      <div className="flex items-start" style={{ gap: fluidSizing.space.xs }}>
        <div className="text-admin-primary flex-shrink-0 mt-0.5">
          <ImageIcon />
        </div>
        <p 
          className="text-text-muted" 
          style={{ fontSize: fluidSizing.text.xs }}
        >
          {canAddMore 
            ? `Puedes agregar hasta ${maxImages - images.length} imagen${maxImages - images.length !== 1 ? 'es' : ''} más. La primera imagen será la principal.`
            : `Límite de ${maxImages} imágenes alcanzado. Elimina alguna para agregar otra.`
          }
        </p>
      </div>
    </div>
  );
}
