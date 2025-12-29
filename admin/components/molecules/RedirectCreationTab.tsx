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
    <div className="flex flex-col" style={{ gap: fluidSizing.space.lg }}>
      <form
        id={formId}
        onSubmit={handleSubmit}
        className="flex flex-col"
        style={{ gap: fluidSizing.space.lg }}
      >
        <div
          className="grid grid-cols-1 md:grid-cols-2"
          style={{ gap: fluidSizing.space.lg }}
        >
          <div className="flex flex-col" style={{ gap: fluidSizing.space.xs }}>
            <Input
              id="redirect-oldSlug"
              label="URL de entrada"
              type="text"
              placeholder="promo, blog/articulo-viejo, landing-page"
              value={oldSlug}
              onChange={(event) => setOldSlug(event.target.value)}
              disabled={submitting}
              required
            />
            <p
              className="text-text-muted"
              style={{ fontSize: fluidSizing.text.xs }}
            >
              La URL antigua que quieres redirigir. Ejemplos: promo, blog/post-viejo, campaña-2024
            </p>
          </div>

          <div className="flex flex-col" style={{ gap: fluidSizing.space.xs }}>
            <Input
              id="redirect-newSlug"
              label="Redirigir hacia"
              type="text"
              placeholder="projects/nuevo-proyecto, blog/articulo-nuevo, /about"
              value={newSlug}
              onChange={(event) => setNewSlug(event.target.value)}
              disabled={submitting}
              required
            />
            <p
              className="text-text-muted"
              style={{ fontSize: fluidSizing.text.xs }}
            >
              Acepta rutas internas o URLs completas (https://...).
            </p>
          </div>
        </div>

        <div className="flex flex-col" style={{ gap: fluidSizing.space.xs }}>
          <label
            className="font-medium text-text-primary"
            htmlFor="redirect-notes"
            style={{ fontSize: fluidSizing.text.sm }}
          >
            Notas (opcional)
          </label>
          <textarea
            id="redirect-notes"
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder="Contexto, motivo o ticket asociado a esta redirección."
            rows={3}
            className="w-full rounded-lg border border-admin-primary/20 bg-admin-dark-surface text-white focus:outline-none focus:border-admin-primary focus:ring-1 focus:ring-admin-primary/40 transition-colors"
            style={{
              padding: `${fluidSizing.space.sm} ${fluidSizing.space.md}`,
              fontSize: fluidSizing.text.base,
            }}
            disabled={submitting}
          />
        </div>

        {errorMessage && (
          <div
            className="text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg"
            style={{ fontSize: fluidSizing.text.sm, padding: fluidSizing.space.md }}
          >
            {errorMessage}
          </div>
        )}
      </form>

      <div className="border border-admin-primary/20 rounded-lg overflow-hidden">
        <button
          type="button"
          onClick={() => setShowCustomRedirects((prev) => !prev)}
          className="w-full flex items-center justify-between bg-admin-dark-surface hover:bg-admin-dark-elevated transition-colors text-left"
          style={{ padding: `${fluidSizing.space.sm} ${fluidSizing.space.md}` }}
        >
          <div
            className="flex items-center"
            style={{ gap: fluidSizing.space.sm }}
          >
            <Icon name="link" size={18} className="text-admin-primary" />
            <div>
              <p
                className="font-semibold text-text-primary"
                style={{ fontSize: fluidSizing.text.sm }}
              >
                Mostrar redirecciones personalizadas
              </p>
              <p
                className="text-text-muted"
                style={{ fontSize: fluidSizing.text.xs }}
              >
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
                <div
                  key={redirect.id}
                  className="flex flex-col"
                  style={{
                    padding: fluidSizing.space.md,
                    gap: fluidSizing.space.sm,
                  }}
                >
                  <div
                    className="flex flex-wrap"
                    style={{ gap: fluidSizing.space.lg }}
                  >
                    <div>
                      <p
                        className="text-text-muted"
                        style={{
                          fontSize: fluidSizing.text.xs,
                          marginBottom: fluidSizing.space.xs,
                        }}
                      >
                        Desde
                      </p>
                      <code
                        className="text-red-300 bg-red-500/10 rounded text-xs font-mono break-all"
                        style={{
                          padding: `${fluidSizing.space.xs} ${fluidSizing.space.sm}`,
                        }}
                      >
                        /{redirect.oldSlug.replace(/^\/+/, '')}
                      </code>
                    </div>
                    <div>
                      <p
                        className="text-text-muted"
                        style={{
                          fontSize: fluidSizing.text.xs,
                          marginBottom: fluidSizing.space.xs,
                        }}
                      >
                        Hacia
                      </p>
                      <code
                        className="text-green-300 bg-green-500/10 rounded text-xs font-mono break-all"
                        style={{
                          padding: `${fluidSizing.space.xs} ${fluidSizing.space.sm}`,
                        }}
                      >
                        {redirect.newSlug}
                      </code>
                    </div>
                  </div>
                  {redirect.notes && (
                    <p
                      className="text-text-muted bg-white/5 border border-white/10 rounded-lg"
                      style={{
                        fontSize: fluidSizing.text.xs,
                        padding: `${fluidSizing.space.sm} ${fluidSizing.space.md}`,
                      }}
                    >
                      {redirect.notes}
                    </p>
                  )}
                  {redirect.createdAtLabel && (
                    <p
                      className="uppercase tracking-wide text-text-muted"
                      style={{ fontSize: fluidSizing.text.xs }}
                    >
                      Creada el {redirect.createdAtLabel}
                    </p>
                  )}
                </div>
              ))
            ) : (
              <p
                className="text-text-muted text-center"
                style={{
                  fontSize: fluidSizing.text.base,
                  padding: `${fluidSizing.space.md} ${fluidSizing.space.lg}`,
                }}
              >
                No hay redirecciones personalizadas registradas todavía.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
