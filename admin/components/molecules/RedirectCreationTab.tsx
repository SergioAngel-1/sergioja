'use client';

import { useMemo, useState } from 'react';
import Input from '@/components/atoms/Input';
import Icon from '@/components/atoms/Icon';
import { fluidSizing } from '@/lib/fluidSizing';

interface RedirectCreationPayload {
  oldSlug: string;
  newSlug: string;
  notes?: string;
}

interface CustomRedirect {
  id: string;
  oldSlug: string;
  newSlug: string;
  notes?: string | null;
  createdAt?: string;
}

interface RedirectCreationTabProps {
  onSubmit?: (payload: RedirectCreationPayload) => Promise<void> | void;
  isSubmitting?: boolean;
  customRedirects?: CustomRedirect[];
  formId?: string;
}

export default function RedirectCreationTab({
  onSubmit,
  isSubmitting,
  customRedirects = [],
  formId = 'redirect-creation-form',
}: RedirectCreationTabProps) {
  const [oldSlug, setOldSlug] = useState('');
  const [newSlug, setNewSlug] = useState('');
  const [notes, setNotes] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [localSubmitting, setLocalSubmitting] = useState(false);
  const [showCustomRedirects, setShowCustomRedirects] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!oldSlug.trim() || !newSlug.trim()) {
      setErrorMessage('Debes completar la URL de entrada y la de destino.');
      return;
    }

    setErrorMessage(null);

    if (!onSubmit) {
      return;
    }

    try {
      setLocalSubmitting(true);
      await onSubmit({
        oldSlug: oldSlug.trim().replace(/^\/+/, ''),
        newSlug: newSlug.trim(),
        notes: notes.trim() || undefined,
      });
      setOldSlug('');
      setNewSlug('');
      setNotes('');
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'No se pudo crear la redirección.');
    } finally {
      setLocalSubmitting(false);
    }
  };

  const submitting = isSubmitting || localSubmitting;

  const formattedCustomRedirects = useMemo(() => {
    return customRedirects.map((redirect) => ({
      ...redirect,
      createdAtLabel: redirect.createdAt
        ? new Intl.DateTimeFormat('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }).format(new Date(redirect.createdAt))
        : null,
    }));
  }, [customRedirects]);

  return (
    <div className="space-y-6">
      <form id={formId} onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Input
              id="redirect-oldSlug"
              label="URL de entrada"
              type="text"
              placeholder="projects/mi-proyecto-anterior"
              value={oldSlug}
              onChange={(event) => setOldSlug(event.target.value)}
              disabled={submitting}
              required
            />
            <p className="text-xs text-text-muted">
              Puedes introducir una ruta absoluta (/blog/post) o un slug relativo (projects/mi-slug).
            </p>
          </div>

          <div className="space-y-2">
            <Input
              id="redirect-newSlug"
              label="Redirigir hacia"
              type="text"
              placeholder="/projects/nuevo-slug o /blog/nueva-ruta"
              value={newSlug}
              onChange={(event) => setNewSlug(event.target.value)}
              disabled={submitting}
              required
            />
            <p className="text-xs text-text-muted">
              Acepta rutas internas o URLs completas (https://...).
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-text-primary" htmlFor="redirect-notes">
            Notas (opcional)
          </label>
          <textarea
            id="redirect-notes"
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder="Contexto, motivo o ticket asociado a esta redirección."
            rows={3}
            className="w-full rounded-lg border border-admin-primary/20 bg-admin-dark-surface text-white px-4 py-3 focus:outline-none focus:border-admin-primary focus:ring-1 focus:ring-admin-primary/40 transition-colors"
            disabled={submitting}
          />
        </div>

        {errorMessage && (
          <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
            {errorMessage}
          </div>
        )}
      </form>

      <div className="border border-admin-primary/20 rounded-lg overflow-hidden">
        <button
          type="button"
          onClick={() => setShowCustomRedirects((prev) => !prev)}
          className="w-full flex items-center justify-between bg-admin-dark-surface hover:bg-admin-dark-elevated transition-colors px-4 py-3 text-left"
        >
          <div className="flex items-center gap-3">
            <Icon name="link" size={18} className="text-admin-primary" />
            <div>
              <p className="font-semibold text-text-primary">Mostrar redirecciones personalizadas</p>
              <p className="text-xs text-text-muted">
                {(customRedirects?.length ?? 0) > 0
                  ? `${customRedirects.length} definidas manualmente`
                  : 'Aún no tienes redirecciones manuales registradas'}
              </p>
            </div>
          </div>
          <Icon
            name={showCustomRedirects ? 'chevron-up' : 'chevron-down'}
            size={20}
            className="text-text-muted"
          />
        </button>

        {showCustomRedirects && (
          <div className="bg-admin-dark-surface/60 border-t border-admin-primary/10 divide-y divide-admin-primary/10">
            {formattedCustomRedirects.length > 0 ? (
              formattedCustomRedirects.map((redirect) => (
                <div key={redirect.id} className="p-4 flex flex-col gap-3">
                  <div className="flex flex-wrap gap-6">
                    <div>
                      <p className="text-xs text-text-muted mb-1">Desde</p>
                      <code className="text-red-300 bg-red-500/10 px-2 py-1 rounded text-xs font-mono break-all">
                        /{redirect.oldSlug.replace(/^\/+/, '')}
                      </code>
                    </div>
                    <div>
                      <p className="text-xs text-text-muted mb-1">Hacia</p>
                      <code className="text-green-300 bg-green-500/10 px-2 py-1 rounded text-xs font-mono break-all">
                        {redirect.newSlug}
                      </code>
                    </div>
                  </div>
                  {redirect.notes && (
                    <p className="text-xs text-text-muted bg-white/5 border border-white/10 rounded-lg px-3 py-2">
                      {redirect.notes}
                    </p>
                  )}
                  {redirect.createdAtLabel && (
                    <p className="text-[0.65rem] uppercase tracking-wide text-text-muted">
                      Creada el {redirect.createdAtLabel}
                    </p>
                  )}
                </div>
              ))
            ) : (
              <p className="text-sm text-text-muted px-4 py-6 text-center">
                No hay redirecciones personalizadas registradas todavía.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
