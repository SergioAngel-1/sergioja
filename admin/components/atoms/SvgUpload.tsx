'use client';

import { useState, useRef } from 'react';
import { fluidSizing } from '@/lib/fluidSizing';
import Icon from './Icon';

interface SvgUploadProps {
  value: string;
  onChange: (svg: string) => void;
  label?: string;
  placeholder?: string;
}

export default function SvgUpload({
  value,
  onChange,
  label = 'Ícono SVG',
  placeholder = 'Pega el código SVG o sube un archivo .svg',
}: SvgUploadProps) {
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateSvg = (svgContent: string): boolean => {
    if (!svgContent.trim()) {
      setError(null);
      return true;
    }

    // Check if it's valid SVG
    if (!svgContent.trim().startsWith('<svg')) {
      setError('El contenido debe ser un SVG válido (debe comenzar con <svg)');
      return false;
    }

    // Check for potentially dangerous content
    const dangerousPatterns = [
      /<script/i,
      /javascript:/i,
      /on\w+\s*=/i, // onclick, onload, etc.
      /<iframe/i,
      /<object/i,
      /<embed/i,
    ];

    for (const pattern of dangerousPatterns) {
      if (pattern.test(svgContent)) {
        setError('El SVG contiene contenido potencialmente peligroso');
        return false;
      }
    }

    setError(null);
    return true;
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    if (validateSvg(newValue)) {
      onChange(newValue);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.name.endsWith('.svg')) {
      setError('Solo se permiten archivos .svg');
      return;
    }

    // Validate file size (max 100KB)
    if (file.size > 100 * 1024) {
      setError('El archivo SVG es demasiado grande (máximo 100KB)');
      return;
    }

    try {
      const text = await file.text();
      if (validateSvg(text)) {
        onChange(text);
      }
    } catch (err) {
      setError('Error al leer el archivo');
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClear = () => {
    onChange('');
    setError(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: fluidSizing.space.sm }}>
      {/* Label */}
      <label className="block text-text-muted font-medium uppercase tracking-wider" style={{ fontSize: fluidSizing.text.xs }}>
        {label}
      </label>

      {/* Upload button and clear */}
      <div className="flex items-center" style={{ gap: fluidSizing.space.sm }}>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="bg-admin-dark-surface border border-admin-primary/20 hover:border-admin-primary rounded-lg text-text-primary hover:text-admin-primary transition-all duration-300 flex items-center"
          style={{ padding: `${fluidSizing.space.sm} ${fluidSizing.space.md}`, gap: fluidSizing.space.xs, fontSize: fluidSizing.text.sm }}
        >
          <Icon name="upload" size={16} />
          <span>Subir SVG</span>
        </button>

        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="bg-admin-dark-surface border border-admin-error/20 hover:border-admin-error rounded-lg text-text-muted hover:text-admin-error transition-all duration-300 flex items-center"
            style={{ padding: `${fluidSizing.space.sm} ${fluidSizing.space.md}`, gap: fluidSizing.space.xs, fontSize: fluidSizing.text.sm }}
          >
            <Icon name="trash" size={16} />
            <span>Limpiar</span>
          </button>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept=".svg"
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>

      {/* Textarea for manual input */}
      <textarea
        value={value}
        onChange={handleTextChange}
        placeholder={placeholder}
        rows={6}
        className="w-full bg-admin-dark-surface border border-admin-primary/20 rounded-lg text-text-primary focus:border-admin-primary focus:outline-none transition-colors font-mono resize-y"
        style={{ padding: fluidSizing.space.md, fontSize: fluidSizing.text.xs, lineHeight: '1.5' }}
      />

      {/* Preview and error */}
      <div className="flex items-start" style={{ gap: fluidSizing.space.md }}>
        {/* Preview */}
        {value && !error && (
          <div className="flex-shrink-0">
            <p className="text-text-muted uppercase tracking-wider" style={{ fontSize: fluidSizing.text.xs, marginBottom: fluidSizing.space.xs }}>
              Vista Previa
            </p>
            <div
              className="bg-admin-dark-surface border border-admin-primary/20 rounded-lg flex items-center justify-center"
              style={{ width: '64px', height: '64px', padding: fluidSizing.space.sm }}
              dangerouslySetInnerHTML={{ __html: value }}
            />
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="flex-1 bg-admin-error/10 border border-admin-error/30 rounded-lg flex items-start" style={{ padding: fluidSizing.space.sm, gap: fluidSizing.space.xs }}>
            <Icon name="alert" size={16} className="text-admin-error flex-shrink-0 mt-0.5" />
            <p className="text-admin-error" style={{ fontSize: fluidSizing.text.xs }}>
              {error}
            </p>
          </div>
        )}
      </div>

      {/* Help text */}
      <p className="text-text-muted/60" style={{ fontSize: fluidSizing.text.xs }}>
        Sube un archivo .svg o pega el código SVG directamente. Máximo 100KB.
      </p>
    </div>
  );
}
