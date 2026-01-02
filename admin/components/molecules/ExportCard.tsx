'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Icon from '../atoms/Icon';
import Button from '../atoms/Button';
import { fluidSizing } from '@/lib/fluidSizing';

interface ExportCardProps {
  title: string;
  description: string;
  icon: string;
  recordCount?: number;
  onExport: (format: 'csv' | 'json') => void;
  isExporting?: boolean;
  delay?: number;
}

export default function ExportCard({
  title,
  description,
  icon,
  recordCount,
  onExport,
  isExporting = false,
  delay = 0,
}: ExportCardProps) {
  const [selectedFormat, setSelectedFormat] = useState<'csv' | 'json'>('csv');
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.23, 1, 0.32, 1] }}
      className="bg-admin-dark-elevated border border-admin-primary/20 rounded-lg overflow-hidden hover:border-admin-primary/40 transition-all duration-300"
    >
      <div style={{ padding: fluidSizing.space.lg }}>
        {/* Header */}
        <div className="flex items-start justify-between" style={{ marginBottom: fluidSizing.space.md }}>
          <div className="flex items-center" style={{ gap: fluidSizing.space.sm }}>
            <div className="bg-admin-primary/10 rounded-lg flex items-center justify-center" style={{ width: '48px', height: '48px' }}>
              <Icon name={icon} size={24} className="text-admin-primary" />
            </div>
            <div>
              <h3 className="font-orbitron font-bold text-text-primary" style={{ fontSize: fluidSizing.text.lg }}>
                {title}
              </h3>
              {recordCount !== undefined && (
                <p className="text-text-muted" style={{ fontSize: fluidSizing.text.xs, marginTop: fluidSizing.space.xs }}>
                  {recordCount.toLocaleString()} registros disponibles
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-text-secondary" style={{ fontSize: fluidSizing.text.sm, marginBottom: fluidSizing.space.lg, lineHeight: '1.6' }}>
          {description}
        </p>

        {/* Actions */}
        <div className="flex items-center justify-between flex-wrap" style={{ gap: fluidSizing.space.sm }}>
          <div className="flex items-center" style={{ gap: fluidSizing.space.xs }}>
            <button
              onClick={() => setSelectedFormat('csv')}
              className={`rounded px-2 py-1 transition-all duration-200 ${
                selectedFormat === 'csv'
                  ? 'bg-admin-primary text-admin-dark font-semibold'
                  : 'bg-admin-dark-surface text-text-muted hover:bg-admin-dark-elevated hover:text-text-primary'
              }`}
              disabled={isExporting}
            >
              <span className="font-mono" style={{ fontSize: fluidSizing.text.xs }}>
                CSV
              </span>
            </button>
            <button
              onClick={() => setSelectedFormat('json')}
              className={`rounded px-2 py-1 transition-all duration-200 ${
                selectedFormat === 'json'
                  ? 'bg-admin-primary text-admin-dark font-semibold'
                  : 'bg-admin-dark-surface text-text-muted hover:bg-admin-dark-elevated hover:text-text-primary'
              }`}
              disabled={isExporting}
            >
              <span className="font-mono" style={{ fontSize: fluidSizing.text.xs }}>
                JSON
              </span>
            </button>
          </div>
          <Button
            variant="primary"
            size="sm"
            icon="upload"
            iconPosition="left"
            onClick={() => onExport(selectedFormat)}
            isLoading={isExporting}
            disabled={isExporting || recordCount === 0}
          >
            Exportar
          </Button>
        </div>
      </div>

      {/* Progress bar cuando está exportando */}
      {isExporting && (
        <div className="h-1 bg-admin-dark-surface overflow-hidden">
          <motion.div
            className="h-full bg-admin-primary"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 2, ease: 'easeInOut' }}
          />
        </div>
      )}
    </motion.div>
  );
}
