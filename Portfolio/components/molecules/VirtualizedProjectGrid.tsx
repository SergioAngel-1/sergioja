'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import ProjectCard from './ProjectCard';
import type { Project } from '@/shared/types';

interface VirtualizedProjectGridProps {
  projects: Project[];
  itemsPerRow?: number;
  itemHeight?: number;
  gap?: number;
  overscan?: number;
}

/**
 * Virtualized grid for projects - only renders visible items
 * Optimizado para listas grandes (>50 proyectos)
 */
export default function VirtualizedProjectGrid({
  projects,
  itemsPerRow = 4,
  itemHeight = 400,
  gap = 24,
  overscan = 2,
}: VirtualizedProjectGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: itemsPerRow * 3 });
  const [containerHeight, setContainerHeight] = useState(0);

  // Calcular número de filas totales
  const totalRows = Math.ceil(projects.length / itemsPerRow);
  const totalHeight = totalRows * (itemHeight + gap) - gap;

  // Calcular qué items están visibles
  const updateVisibleRange = useCallback(() => {
    if (!containerRef.current) return;

    const scrollTop = window.scrollY;
    const viewportHeight = window.innerHeight;
    const containerTop = containerRef.current.offsetTop;

    // Calcular primera y última fila visible
    const firstVisibleRow = Math.max(0, Math.floor((scrollTop - containerTop) / (itemHeight + gap)) - overscan);
    const lastVisibleRow = Math.min(
      totalRows - 1,
      Math.ceil((scrollTop + viewportHeight - containerTop) / (itemHeight + gap)) + overscan
    );

    // Convertir filas a índices de items
    const start = firstVisibleRow * itemsPerRow;
    const end = Math.min(projects.length, (lastVisibleRow + 1) * itemsPerRow);

    setVisibleRange({ start, end });
  }, [itemHeight, gap, itemsPerRow, totalRows, projects.length, overscan]);

  // Escuchar scroll con throttle
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateVisibleRange();
          ticking = false;
        });
        ticking = true;
      }
    };

    // Calcular altura inicial
    updateVisibleRange();
    setContainerHeight(totalHeight);

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', updateVisibleRange);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', updateVisibleRange);
    };
  }, [updateVisibleRange, totalHeight]);

  // Calcular posición de cada item visible
  const visibleProjects = projects.slice(visibleRange.start, visibleRange.end).map((project, index) => {
    const absoluteIndex = visibleRange.start + index;
    const row = Math.floor(absoluteIndex / itemsPerRow);
    const col = absoluteIndex % itemsPerRow;
    
    return {
      project,
      style: {
        position: 'absolute' as const,
        top: `${row * (itemHeight + gap)}px`,
        left: `${col * (100 / itemsPerRow)}%`,
        width: `calc(${100 / itemsPerRow}% - ${gap * (itemsPerRow - 1) / itemsPerRow}px)`,
        height: `${itemHeight}px`,
      },
    };
  });

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        height: `${containerHeight}px`,
        width: '100%',
      }}
    >
      {visibleProjects.map(({ project, style }) => (
        <div key={project.slug} style={style}>
          <ProjectCard project={project} />
        </div>
      ))}
    </div>
  );
}
