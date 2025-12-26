'use client';

import { useState, useEffect } from 'react';
import { fluidSizing } from '@/lib/fluidSizing';
import { slugify } from '@/lib/utils/slugify';
import { api } from '@/lib/api-client';
import { alerts } from '@/shared/alertSystem';
import Button from '../atoms/Button';

interface ProjectBasicFieldsProps {
  title: string;
  longDescriptionEs: string;
  longDescriptionEn: string;
  existingSlug?: string; // Slug actual del proyecto (solo en edición)
  onTitleChange: (title: string) => void;
  onLongDescriptionEsChange: (longDescription: string) => void;
  onLongDescriptionEnChange: (longDescription: string) => void;
  onSlugRegenerated?: (newSlug: string) => void; // Callback cuando se regenera el slug
}

export default function ProjectBasicFields({
  title,
  longDescriptionEs,
  longDescriptionEn,
  existingSlug,
  onTitleChange,
  onLongDescriptionEsChange,
  onLongDescriptionEnChange,
  onSlugRegenerated,
}: ProjectBasicFieldsProps) {
  const [previewSlug, setPreviewSlug] = useState<string>('');
  const [isRegenerating, setIsRegenerating] = useState(false);

  // Inicializar con el slug existente en modo edición
  useEffect(() => {
    if (existingSlug && !previewSlug) {
      setPreviewSlug(existingSlug);
    }
  }, [existingSlug, previewSlug]);

  // Generar preview del slug cuando cambia el título
  useEffect(() => {
    if (title) {
      setPreviewSlug(slugify(title));
    } else {
      setPreviewSlug('');
    }
  }, [title]);

  const handleRegenerateSlug = async () => {
    if (!title) return;

    // Si estamos en modo edición (existingSlug existe), llamar al backend
    if (existingSlug) {
      try {
        setIsRegenerating(true);
        // Enviar el título actual para que el backend genere el slug desde él
        const response = await api.regenerateProjectSlug(existingSlug, title);
        
        if (response.success && response.data) {
          const { newSlug, changed, oldSlug } = response.data as any;
          
          if (changed) {
            setPreviewSlug(newSlug);
            alerts.success(
              'URL Actualizada',
              `La URL se actualizó de "${oldSlug}" a "${newSlug}"`
            );
            
            // Notificar al componente padre del cambio
            if (onSlugRegenerated) {
              onSlugRegenerated(newSlug);
            }
          } else {
            alerts.info('Sin Cambios', 'La URL ya está actualizada');
          }
        } else {
          alerts.error('Error', response.error?.message || 'No se pudo regenerar la URL');
        }
      } catch (error) {
        alerts.error('Error', 'Ocurrió un error al regenerar la URL');
      } finally {
        setIsRegenerating(false);
      }
    } else {
      // Modo creación: solo actualizar preview local
      const newSlug = slugify(title);
      setPreviewSlug(newSlug);
    }
  };
  return (
    <>
      {/* Title */}
      <div>
        <label className="block text-text-muted font-medium uppercase tracking-wider" style={{ fontSize: fluidSizing.text.xs, marginBottom: fluidSizing.space.sm }}>
          Título *
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            required
            className="flex-1 bg-admin-dark-surface border border-admin-primary/20 rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:border-admin-primary/50 focus:ring-2 focus:ring-admin-primary/20 transition-all duration-200"
            style={{ padding: `${fluidSizing.space.sm} ${fluidSizing.space.md}`, fontSize: fluidSizing.text.base }}
            placeholder="Nombre del proyecto"
          />
          <Button
            type="button"
            onClick={handleRegenerateSlug}
            variant="secondary"
            size="md"
            icon="refresh"
            disabled={!title || isRegenerating}
            isLoading={isRegenerating}
            title={existingSlug ? "Regenerar y actualizar URL en la base de datos" : "Regenerar URL desde el título"}
          >
            <span className="hidden sm:inline">
              {existingSlug ? 'Actualizar URL' : 'Regenerar URL'}
            </span>
          </Button>
        </div>
        
        {/* Slug Preview */}
        {previewSlug && (
          <div className="mt-2 p-3 bg-admin-dark-elevated/50 border border-admin-primary/10 rounded-lg">
            <div className="flex items-center gap-2 text-xs">
              <span className="text-text-muted font-mono">URL:</span>
              <code className="text-admin-primary font-mono flex-1">
                /projects/{previewSlug}
              </code>
              {existingSlug && existingSlug !== previewSlug && (
                <span className="text-yellow-400 text-xs">
                  ⚠ Cambió desde: {existingSlug}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Long Description ES */}
      <div>
        <label className="block text-text-muted font-medium uppercase tracking-wider" style={{ fontSize: fluidSizing.text.xs, marginBottom: fluidSizing.space.sm }}>
          Descripción Detallada (ES)
        </label>
        <textarea
          value={longDescriptionEs}
          onChange={(e) => onLongDescriptionEsChange(e.target.value)}
          rows={6}
          className="w-full bg-admin-dark-surface border border-admin-primary/20 rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:border-admin-primary/50 focus:ring-2 focus:ring-admin-primary/20 transition-all duration-200 resize-none"
          style={{ padding: `${fluidSizing.space.sm} ${fluidSizing.space.md}`, fontSize: fluidSizing.text.base }}
          placeholder="Descripción completa del proyecto, características, tecnologías utilizadas, desafíos, etc..."
        />
      </div>

      {/* Long Description EN */}
      <div>
        <label className="block text-text-muted font-medium uppercase tracking-wider" style={{ fontSize: fluidSizing.text.xs, marginBottom: fluidSizing.space.sm }}>
          Detailed Description (EN)
        </label>
        <textarea
          value={longDescriptionEn}
          onChange={(e) => onLongDescriptionEnChange(e.target.value)}
          rows={6}
          className="w-full bg-admin-dark-surface border border-admin-primary/20 rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:border-admin-primary/50 focus:ring-2 focus:ring-admin-primary/20 transition-all duration-200 resize-none"
          style={{ padding: `${fluidSizing.space.sm} ${fluidSizing.space.md}`, fontSize: fluidSizing.text.base }}
          placeholder="Full project description in English..."
        />
      </div>
    </>
  );
}
