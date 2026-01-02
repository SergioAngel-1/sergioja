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

interface SingleImageUploaderProps {
  image: string;
  onChange: (image: string) => void;
  label?: string;
  recommendedDimensions?: string;
}

export default function SingleImageUploader({
  image,
  onChange,
  label = 'Imagen Principal',
  recommendedDimensions = '1920x1080px (16:9 - Horizontal)',
}: SingleImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        onChange(result);
      };
      reader.readAsDataURL(file);
    }

    // Reset input
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        onChange(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const removeImage = () => {
    onChange('');
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: fluidSizing.space.xs }}>
        <label 
          className="block text-text-muted font-medium uppercase tracking-wider" 
          style={{ fontSize: fluidSizing.text.xs }}
        >
          {label}
        </label>
        <span 
          className="text-admin-primary font-mono" 
          style={{ fontSize: fluidSizing.text.xs }}
          title="Dimensiones recomendadas"
        >
          {recommendedDimensions}
        </span>
      </div>

      {/* Image Preview or Upload Zone */}
      {image ? (
        <div className="relative aspect-video bg-admin-dark-surface border border-admin-primary/20 rounded-lg overflow-hidden group">
          <img
            src={image}
            alt="Thumbnail"
            className="w-full h-full object-cover"
          />
          <button
            type="button"
            onClick={removeImage}
            className="absolute top-2 right-2 bg-red-500/90 hover:bg-red-500 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Eliminar imagen"
          >
            <XIcon />
          </button>
        </div>
      ) : (
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
            onChange={handleFileChange}
            className="hidden"
          />
          <div className="text-admin-primary mb-2">
            <UploadIcon />
          </div>
          <span 
            className="text-text-muted text-center px-2" 
            style={{ fontSize: fluidSizing.text.sm }}
          >
            {isDragging ? 'Suelta la imagen aquí' : 'Haz clic o arrastra una imagen'}
          </span>
        </label>
      )}

      {/* Información */}
      <div className="flex items-start" style={{ gap: fluidSizing.space.xs, marginTop: fluidSizing.space.sm }}>
        <div className="text-admin-primary flex-shrink-0 mt-0.5">
          <ImageIcon />
        </div>
        <p 
          className="text-text-muted" 
          style={{ fontSize: fluidSizing.text.xs }}
        >
          Esta imagen se mostrará en la tarjeta del proyecto. Se recomienda usar una imagen horizontal (16:9).
        </p>
      </div>
    </div>
  );
}
