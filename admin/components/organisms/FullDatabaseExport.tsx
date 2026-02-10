'use client';

import { useState, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import Icon from '../atoms/Icon';
import Button from '../atoms/Button';
import { api } from '@/lib/api-client';
import { logger } from '@/lib/logger';
import { alerts } from '@/lib/alerts';
import { fluidSizing } from '@/lib/fluidSizing';

const TABLE_TAGS = ['Profiles', 'Projects', 'Technologies', 'Categories', 'Messages', 'Newsletter', 'Redirects', 'PageViews', 'ProjectViews', 'WebVitals', 'AdminUsers'];

export default function FullDatabaseExport() {
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importPreview, setImportPreview] = useState<Record<string, number> | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pendingDataRef = useRef<any>(null);

  // ── Export ──
  const handleExport = useCallback(async () => {
    setIsExporting(true);

    try {
      const res = await api.exportFullDatabase();

      if (!res.success || !res.data) {
        alerts.error('Error de exportación', 'No se pudo obtener los datos del servidor');
        return;
      }

      const exportData = res.data as any;
      const counts = exportData._meta?.counts || {};
      const totalRecords = Object.values(counts).reduce((a: number, b: any) => a + Number(b), 0);

      const jsonContent = JSON.stringify(exportData, null, 2);
      const blob = new Blob([jsonContent], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `sergioja-full-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      alerts.success(
        'Exportación completa',
        `Se exportaron ${totalRecords} registros de ${Object.keys(counts).length} tablas`
      );
      logger.info('Full database export completed', { totalRecords, counts });
    } catch (error) {
      logger.error('Full database export error', error);
      alerts.error('Error de exportación', 'No se pudo completar la exportación');
    } finally {
      setIsExporting(false);
    }
  }, []);

  // ── Import: file select ──
  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.json')) {
      alerts.error('Archivo inválido', 'Solo se aceptan archivos .json');
      return;
    }

    setImportFile(file);
    setImportPreview(null);
    setShowConfirm(false);
    pendingDataRef.current = null;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);

        if (!data?._meta?.version || data._meta.version !== 1) {
          alerts.error('Formato inválido', 'El archivo no es un export válido (versión incompatible)');
          setImportFile(null);
          return;
        }

        pendingDataRef.current = data;
        setImportPreview(data._meta.counts);
        setShowConfirm(true);
      } catch {
        alerts.error('Error de lectura', 'No se pudo parsear el archivo JSON');
        setImportFile(null);
      }
    };
    reader.readAsText(file);
  }, []);

  // ── Import: confirm & send ──
  const handleImportConfirm = useCallback(async () => {
    if (!pendingDataRef.current) return;

    setIsImporting(true);
    setShowConfirm(false);

    try {
      const res = await api.importFullDatabase(pendingDataRef.current);

      if (!res.success) {
        const errorMsg = (res as any).error?.message || 'Error desconocido';
        alerts.error('Error de importación', errorMsg);
        return;
      }

      const result = res.data as any;
      alerts.success(
        'Importación completa',
        `Se importaron ${result.totalRecords} registros en ${(result.durationMs / 1000).toFixed(1)}s`
      );
      logger.info('Full database import completed', result);
    } catch (error) {
      logger.error('Full database import error', error);
      alerts.error('Error de importación', 'No se pudo completar la importación. Revisa la consola.');
    } finally {
      setIsImporting(false);
      setImportFile(null);
      setImportPreview(null);
      pendingDataRef.current = null;
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }, []);

  const handleImportCancel = useCallback(() => {
    setShowConfirm(false);
    setImportFile(null);
    setImportPreview(null);
    pendingDataRef.current = null;
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
    >
      {/* Section Header */}
      <div className="flex items-center" style={{ gap: fluidSizing.space.md, marginBottom: fluidSizing.space.lg }}>
        <div className="bg-admin-primary/10 rounded-lg flex items-center justify-center border border-admin-primary/20" style={{ width: '56px', height: '56px' }}>
          <Icon name="database" size={28} className="text-admin-primary" />
        </div>
        <div className="flex-1">
          <h2 className="font-orbitron font-bold text-admin-primary" style={{ fontSize: fluidSizing.text['2xl'] }}>
            Base de Datos
          </h2>
          <p className="text-text-muted" style={{ fontSize: fluidSizing.text.sm, marginTop: fluidSizing.space.xs }}>
            Exporta o importa toda la base de datos en un solo archivo JSON
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2" style={{ gap: fluidSizing.space.lg }}>
        {/* ── Export Card ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15, ease: [0.23, 1, 0.32, 1] }}
          className="bg-admin-dark-elevated border border-admin-primary/20 rounded-lg overflow-hidden hover:border-admin-primary/40 transition-all duration-300 flex flex-col"
        >
          <div className="flex-1 flex flex-col" style={{ padding: fluidSizing.space.lg }}>
            <div className="flex items-center" style={{ gap: fluidSizing.space.sm, marginBottom: fluidSizing.space.md }}>
              <div className="bg-admin-primary/10 rounded-lg flex items-center justify-center" style={{ width: '48px', height: '48px' }}>
                <Icon name="download" size={24} className="text-admin-primary" />
              </div>
              <div>
                <h3 className="font-orbitron font-bold text-text-primary" style={{ fontSize: fluidSizing.text.lg }}>
                  Exportar
                </h3>
                <p className="text-text-muted" style={{ fontSize: fluidSizing.text.xs, marginTop: fluidSizing.space.xs }}>
                  Descarga toda la BDD como JSON
                </p>
              </div>
            </div>

            <p className="text-text-secondary" style={{ fontSize: fluidSizing.text.sm, marginBottom: fluidSizing.space.md, lineHeight: '1.6' }}>
              Perfiles, proyectos, tecnologías, categorías, mensajes, suscriptores, redirecciones, analytics y web vitals.
            </p>

            <div className="flex flex-wrap" style={{ gap: fluidSizing.space.xs, marginBottom: fluidSizing.space.lg }}>
              {TABLE_TAGS.map((table) => (
                <span key={table} className="bg-admin-dark-surface text-text-muted rounded px-2 py-0.5 font-mono" style={{ fontSize: fluidSizing.text.xs }}>
                  {table}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-end mt-auto">
              <Button
                variant="primary"
                size="sm"
                icon="download"
                iconPosition="left"
                onClick={handleExport}
                isLoading={isExporting}
                disabled={isExporting}
              >
                Exportar Todo
              </Button>
            </div>
          </div>

          {isExporting && (
            <div className="h-1 bg-admin-dark-surface overflow-hidden">
              <motion.div className="h-full bg-admin-primary" initial={{ width: '0%' }} animate={{ width: '100%' }} transition={{ duration: 3, ease: 'easeInOut' }} />
            </div>
          )}
        </motion.div>

        {/* ── Import Card ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
          className="bg-admin-dark-elevated border border-admin-primary/20 rounded-lg overflow-hidden hover:border-admin-primary/40 transition-all duration-300 flex flex-col"
        >
          <div className="flex-1 flex flex-col" style={{ padding: fluidSizing.space.lg }}>
            <div className="flex items-center" style={{ gap: fluidSizing.space.sm, marginBottom: fluidSizing.space.md }}>
              <div className="bg-admin-primary/10 rounded-lg flex items-center justify-center" style={{ width: '48px', height: '48px' }}>
                <Icon name="upload" size={24} className="text-admin-primary" />
              </div>
              <div>
                <h3 className="font-orbitron font-bold text-text-primary" style={{ fontSize: fluidSizing.text.lg }}>
                  Importar
                </h3>
                <p className="text-text-muted" style={{ fontSize: fluidSizing.text.xs, marginTop: fluidSizing.space.xs }}>
                  Restaura desde un archivo de exportación
                </p>
              </div>
            </div>

            <p className="text-text-secondary" style={{ fontSize: fluidSizing.text.sm, marginBottom: fluidSizing.space.md, lineHeight: '1.6' }}>
              Sube un archivo JSON generado por la exportación. Reemplaza todos los datos existentes excepto usuarios admin.
            </p>

            <div className="flex flex-wrap" style={{ gap: fluidSizing.space.xs, marginBottom: fluidSizing.space.lg }}>
              {TABLE_TAGS.map((table) => (
                <span key={table} className="bg-admin-dark-surface text-text-muted rounded px-2 py-0.5 font-mono" style={{ fontSize: fluidSizing.text.xs }}>
                  {table}
                </span>
              ))}
            </div>

            {/* File input */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileSelect}
              className="hidden"
              id="import-file-input"
            />

            {/* Preview: file selected but not confirmed */}
            {importPreview && showConfirm ? (
              <div style={{ marginBottom: fluidSizing.space.lg }}>
                <div className="bg-admin-dark-surface border border-yellow-500/30 rounded-lg" style={{ padding: fluidSizing.space.md }}>
                  <div className="flex items-center" style={{ gap: fluidSizing.space.xs, marginBottom: fluidSizing.space.sm }}>
                    <Icon name="alert-triangle" size={16} className="text-yellow-400" />
                    <span className="font-orbitron font-bold text-yellow-400" style={{ fontSize: fluidSizing.text.sm }}>
                      Confirmar importación
                    </span>
                  </div>
                  <p className="text-text-secondary" style={{ fontSize: fluidSizing.text.xs, marginBottom: fluidSizing.space.sm }}>
                    <strong className="text-text-primary">{importFile?.name}</strong> — Esto eliminará todos los datos actuales y los reemplazará con:
                  </p>
                  <div className="grid grid-cols-2" style={{ gap: fluidSizing.space.xs, marginBottom: fluidSizing.space.md }}>
                    {Object.entries(importPreview).map(([key, count]) => (
                      <div key={key} className="flex items-center justify-between">
                        <span className="text-text-muted font-mono" style={{ fontSize: fluidSizing.text.xs }}>{key}</span>
                        <span className="text-admin-primary font-bold font-mono" style={{ fontSize: fluidSizing.text.xs }}>{count}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-end" style={{ gap: fluidSizing.space.sm }}>
                    <Button variant="ghost" size="sm" onClick={handleImportCancel}>
                      Cancelar
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      icon="upload"
                      iconPosition="left"
                      onClick={handleImportConfirm}
                      isLoading={isImporting}
                      disabled={isImporting}
                    >
                      Confirmar Importación
                    </Button>
                  </div>
                </div>
              </div>
            ) : null}

            <div className="flex items-center justify-end mt-auto">
              <Button
                variant="secondary"
                size="sm"
                icon="upload"
                iconPosition="left"
                onClick={() => fileInputRef.current?.click()}
                disabled={isImporting}
              >
                Seleccionar archivo JSON
              </Button>
            </div>
          </div>

          {isImporting && (
            <div className="h-1 bg-admin-dark-surface overflow-hidden">
              <motion.div className="h-full bg-yellow-400" initial={{ width: '0%' }} animate={{ width: '100%' }} transition={{ duration: 8, ease: 'easeInOut' }} />
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
