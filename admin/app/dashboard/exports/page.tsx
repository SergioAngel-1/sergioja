'use client';

import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/contexts/AuthContext';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import Loader from '@/components/atoms/Loader';
import Icon from '@/components/atoms/Icon';
import AnalyticsExports from '@/components/organisms/AnalyticsExports';
import WebVitalsExports from '@/components/organisms/WebVitalsExports';
import PortfolioExports from '@/components/organisms/PortfolioExports';
import CommunicationExports from '@/components/organisms/CommunicationExports';
import { clamp, fluidSizing } from '@/lib/fluidSizing';

export default function ExportsPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  const handleExport = useCallback((data: any[], filename: string, format: 'csv' | 'json') => {
    if (format === 'csv') {
      exportToCSV(data, filename);
    } else {
      exportToJSON(data, filename);
    }
  }, []);

  const exportToCSV = (data: any[], filename: string) => {
    if (data.length === 0) return;

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          if (value === null || value === undefined) return '';
          if (typeof value === 'object') return JSON.stringify(value).replace(/"/g, '""');
          return `"${String(value).replace(/"/g, '""')}"`;
        }).join(',')
      )
    ].join('\n');

    downloadFile(csvContent, `${filename}.csv`, 'text/csv');
  };

  const exportToJSON = (data: any[], filename: string) => {
    const jsonContent = JSON.stringify(data, null, 2);
    downloadFile(jsonContent, `${filename}.json`, 'application/json');
  };

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (isLoading || !isAuthenticated) {
    return <Loader fullScreen text="Cargando exportes..." />;
  }

  return (
    <DashboardLayout>
      <div style={{ display: 'flex', flexDirection: 'column', gap: fluidSizing.space.xl }}>
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
        >
          <h1 className="font-orbitron font-bold text-admin-primary text-glow-white" style={{ fontSize: clamp('1.75rem', '5vw', '2.5rem') }}>
            EXPORTES
          </h1>
          <p className="text-text-muted" style={{ fontSize: fluidSizing.text.sm, marginTop: fluidSizing.space.xs }}>
            Exporta datos históricos en formato CSV o JSON
          </p>
        </motion.div>

        {/* Analytics Section */}
        <AnalyticsExports onExport={handleExport} />

        {/* Web Vitals Section */}
        <WebVitalsExports onExport={handleExport} />

        {/* Portfolio Section */}
        <PortfolioExports onExport={handleExport} />

        {/* Communication Section */}
        <CommunicationExports onExport={handleExport} />

        {/* Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5, ease: [0.23, 1, 0.32, 1] }}
          className="bg-admin-dark-elevated border border-admin-primary/20 rounded-lg"
          style={{ padding: fluidSizing.space.lg }}
        >
          <div className="flex items-start" style={{ gap: fluidSizing.space.md }}>
            <Icon name="info" size={24} className="text-admin-primary flex-shrink-0" />
            <div>
              <h3 className="font-orbitron font-bold text-admin-primary" style={{ fontSize: fluidSizing.text.base, marginBottom: fluidSizing.space.sm }}>
                Información sobre exportes
              </h3>
              <ul className="text-text-secondary space-y-2" style={{ fontSize: fluidSizing.text.sm }}>
                <li className="flex items-start" style={{ gap: fluidSizing.space.xs }}>
                  <span className="text-admin-primary">•</span>
                  <span>Los archivos CSV son compatibles con Excel, Google Sheets y herramientas de análisis</span>
                </li>
                <li className="flex items-start" style={{ gap: fluidSizing.space.xs }}>
                  <span className="text-admin-primary">•</span>
                  <span>Los archivos JSON mantienen la estructura completa de datos para procesamiento programático</span>
                </li>
                <li className="flex items-start" style={{ gap: fluidSizing.space.xs }}>
                  <span className="text-admin-primary">•</span>
                  <span>Las exportaciones incluyen todos los registros históricos sin límite de fecha</span>
                </li>
                <li className="flex items-start" style={{ gap: fluidSizing.space.xs }}>
                  <span className="text-admin-primary">•</span>
                  <span>Los datos sensibles como IPs se incluyen para análisis interno</span>
                </li>
                <li className="flex items-start" style={{ gap: fluidSizing.space.xs }}>
                  <span className="text-admin-primary">•</span>
                  <span>Los exportes de portafolio incluyen proyectos y skills con toda su metadata</span>
                </li>
                <li className="flex items-start" style={{ gap: fluidSizing.space.xs }}>
                  <span className="text-admin-primary">•</span>
                  <span>Los mensajes de contacto y suscriptores incluyen información de contacto y metadata de seguimiento</span>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
