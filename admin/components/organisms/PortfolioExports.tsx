'use client';

import { useState, useCallback, useEffect } from 'react';
import ExportSection from '../molecules/ExportSection';
import ExportCard from '../molecules/ExportCard';
import { api } from '@/lib/api-client';
import { logger } from '@/lib/logger';
import { alerts } from '@/lib/alerts';

interface PortfolioExportsProps {
  onExport: (data: any[], filename: string, format: 'csv' | 'json') => void;
}

export default function PortfolioExports({ onExport }: PortfolioExportsProps) {
  const [stats, setStats] = useState({ projects: 0, skills: 0, redirects: 0 });
  const [exportingItems, setExportingItems] = useState<Record<string, boolean>>({});

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [projectsRes, skillsRes, redirectsRes] = await Promise.all([
        api.getProjects(),
        api.getSkills(),
        api.getRedirects(),
      ]);

      const projectsCount = projectsRes.success && projectsRes.data 
        ? (Array.isArray(projectsRes.data) ? projectsRes.data.length : 0)
        : 0;

      const skillsCount = skillsRes.success && skillsRes.data
        ? (Array.isArray(skillsRes.data) ? skillsRes.data.length : 0)
        : 0;

      const redirectsCount = redirectsRes.success && redirectsRes.data
        ? (Array.isArray(redirectsRes.data) ? redirectsRes.data.length : 0)
        : 0;

      setStats({ projects: projectsCount, skills: skillsCount, redirects: redirectsCount });
    } catch (error) {
      logger.error('Error loading portfolio stats', error);
    }
  };

  const handleExport = useCallback(async (type: 'projects' | 'skills' | 'redirects', format: 'csv' | 'json') => {
    setExportingItems(prev => ({ ...prev, [type]: true }));

    try {
      let data: any[] = [];
      let filename = '';

      switch (type) {
        case 'projects': {
          const res = await api.getProjects();
          data = res.success && res.data ? (Array.isArray(res.data) ? res.data : []) : [];
          filename = `projects-${new Date().toISOString().split('T')[0]}`;
          break;
        }
        case 'skills': {
          const res = await api.getSkills();
          data = res.success && res.data ? (Array.isArray(res.data) ? res.data : []) : [];
          filename = `skills-${new Date().toISOString().split('T')[0]}`;
          break;
        }
        case 'redirects': {
          const res = await api.getRedirects();
          data = res.success && res.data ? (Array.isArray(res.data) ? res.data : []) : [];
          filename = `slug-redirects-${new Date().toISOString().split('T')[0]}`;
          break;
        }
      }

      if (!data || data.length === 0) {
        alerts.warning('Sin datos', 'No hay datos disponibles para exportar');
        return;
      }

      onExport(data, filename, format);
      alerts.success('Exportación exitosa', `Se exportaron ${data.length} registros correctamente`);
      logger.info('Export completed', { type, format, count: data.length });
    } catch (error) {
      logger.error('Export error', error);
      alerts.error('Error de exportación', 'No se pudo completar la exportación');
    } finally {
      setExportingItems(prev => ({ ...prev, [type]: false }));
    }
  }, [onExport]);

  return (
    <ExportSection
      title="Portafolio"
      description="Exporta proyectos y skills del portafolio"
      icon="projects"
      delay={0.35}
    >
      <ExportCard
        title="Proyectos"
        description="Todos los proyectos con información completa: título, descripción, tecnologías, imágenes, categorías y metadata."
        icon="projects"
        recordCount={stats.projects}
        onExport={(format) => handleExport('projects', format)}
        isExporting={exportingItems.projects}
        delay={0.4}
      />
      <ExportCard
        title="Skills"
        description="Catálogo completo de skills y tecnologías con proficiency, categorías, iconos y años de experiencia."
        icon="skills"
        recordCount={stats.skills}
        onExport={(format) => handleExport('skills', format)}
        isExporting={exportingItems.skills}
        delay={0.45}
      />
      <ExportCard
        title="Redirecciones SEO"
        description="Historial de redirecciones de slugs antiguos a nuevos para mantener SEO y evitar enlaces rotos."
        icon="link"
        recordCount={stats.redirects}
        onExport={(format) => handleExport('redirects', format)}
        isExporting={exportingItems.redirects}
        delay={0.5}
      />
    </ExportSection>
  );
}
