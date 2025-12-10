'use client';

import { useState, useEffect } from 'react';
import Icon from '../atoms/Icon';
import { fluidSizing } from '@/lib/fluidSizing';

interface ImageUploaderProps {
  value: string;
  onChange: (file: File | null, preview: string) => void;
  label?: string;
  maxSizeMB?: number;
  acceptedFormats?: string;
}

export default function ImageUploader({
  value,
  onChange,
  label = 'Imagen del Proyecto',
  maxSizeMB = 5,
  acceptedFormats = 'PNG, JPG, WEBP',
}: ImageUploaderProps) {
  const [preview, setPreview] = useState<string>(value);

  // Sincronizar preview con value del padre
  useEffect(() => {
    setPreview(value);
  }, [value]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreview(result);
        onChange(file, result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setPreview('');
    onChange(null, '');
  };

  return (
    <div>
      <label className="block text-text-muted font-medium uppercase tracking-wider" style={{ fontSize: fluidSizing.text.xs, marginBottom: fluidSizing.space.sm }}>
        {label}
      </label>
      
      {preview ? (
        <div className="relative" style={{ margin: 0, padding: 0 }}>
          <img
            src={preview}
            alt="Preview"
            className="w-full h-48 object-cover rounded-lg border border-admin-primary/20"
            style={{ display: 'block', margin: 0 }}
          />
          <button
            type="button"
            onClick={handleRemoveImage}
            className="absolute top-2 right-2 bg-white hover:bg-gray-100 text-black rounded-full p-2 transition-colors shadow-lg"
          >
            <Icon name="x" size={16} />
          </button>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-admin-primary/30 rounded-lg cursor-pointer hover:border-admin-primary/50 transition-colors bg-admin-dark-surface">
          <div className="flex flex-col items-center justify-center" style={{ padding: fluidSizing.space.lg }}>
            <Icon name="upload" size={32} className="text-admin-primary mb-2" />
            <p className="text-text-muted" style={{ fontSize: fluidSizing.text.sm }}>
              Click para subir imagen
            </p>
            <p className="text-text-muted/50" style={{ fontSize: fluidSizing.text.xs, marginTop: fluidSizing.space.xs }}>
              {acceptedFormats} (max. {maxSizeMB}MB)
            </p>
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </label>
      )}
    </div>
  );
}
