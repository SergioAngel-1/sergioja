'use client';

import { motion } from 'framer-motion';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { fluidSizing } from '@/lib/utils/fluidSizing';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const { t } = useLanguage();
  const getPageNumbers = (isMobile: boolean = false) => {
    const pages: (number | string)[] = [];
    const maxVisible = isMobile ? 3 : 5;

    if (totalPages <= maxVisible) {
      // Mostrar todas las páginas si son pocas
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Mostrar páginas con elipsis
      if (currentPage <= 3) {
        // Inicio
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Final
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Medio
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  if (totalPages <= 1) return null;

  // Detectar si es móvil basado en el ancho de pantalla
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;

  return (
    <div className="flex flex-col items-center justify-center" style={{ gap: fluidSizing.space.md, marginTop: fluidSizing.space['2xl'] }}>
      {/* Fila de navegación - Flechas y números */}
      <div className="flex items-center justify-center" style={{ gap: fluidSizing.space.sm }}>
      {/* Botón Anterior */}
      <motion.button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`rounded-lg font-mono transition-all duration-300 text-fluid-sm ${
          currentPage === 1
            ? 'bg-background-surface text-text-muted cursor-not-allowed opacity-50'
            : 'bg-background-surface border border-white/30 text-white hover:bg-white/10 hover:border-white hover:shadow-glow-white'
        }`}
        style={{ padding: `${fluidSizing.space.sm} ${fluidSizing.space.md}` }}
        whileHover={currentPage !== 1 ? { scale: 1.05 } : {}}
        whileTap={currentPage !== 1 ? { scale: 0.95 } : {}}
      >
        <span className="flex items-center" style={{ gap: fluidSizing.space.sm }}>
          <svg className="size-icon-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="hidden sm:inline">{t('common.previous')}</span>
        </span>
      </motion.button>

      {/* Números de página */}
      <div className="flex items-center" style={{ gap: fluidSizing.space.xs }}>
        {getPageNumbers(isMobile).map((page, index) => {
          if (page === '...') {
            return (
              <span key={`ellipsis-${index}`} className="text-text-muted text-fluid-sm" style={{ padding: `0 ${fluidSizing.space.sm}` }}>
                ...
              </span>
            );
          }

          const pageNumber = page as number;
          const isActive = pageNumber === currentPage;

          return (
            <motion.button
              key={pageNumber}
              onClick={() => onPageChange(pageNumber)}
              className={`rounded-lg font-mono transition-all duration-300 text-fluid-sm ${
                isActive
                  ? 'bg-white/10 text-white border-2 border-white font-bold'
                  : 'bg-background-surface border border-white/30 text-text-secondary hover:bg-white/10 hover:border-white hover:text-white'
              }`}
              style={{ width: fluidSizing.size.buttonMd, height: fluidSizing.size.buttonMd }}
              whileHover={{ scale: isActive ? 1 : 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {pageNumber}
            </motion.button>
          );
        })}
      </div>

      {/* Botón Siguiente */}
      <motion.button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`rounded-lg font-mono transition-all duration-300 text-fluid-sm ${
          currentPage === totalPages
            ? 'bg-background-surface text-text-muted cursor-not-allowed opacity-50'
            : 'bg-background-surface border border-white/30 text-white hover:bg-white/10 hover:border-white hover:shadow-glow-white'
        }`}
        style={{ padding: `${fluidSizing.space.sm} ${fluidSizing.space.md}` }}
        whileHover={currentPage !== totalPages ? { scale: 1.05 } : {}}
        whileTap={currentPage !== totalPages ? { scale: 0.95 } : {}}
      >
        <span className="flex items-center" style={{ gap: fluidSizing.space.sm }}>
          <span className="hidden sm:inline">{t('common.next')}</span>
          <svg className="size-icon-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </span>
      </motion.button>
      </div>

      {/* Info de página */}
      <div className="bg-background-surface/50 rounded-lg border border-white/30" style={{ padding: `${fluidSizing.space.sm} ${fluidSizing.space.md}` }}>
        <span className="font-mono text-text-muted whitespace-nowrap text-fluid-xs">
          {t('common.page')} <span className="text-white font-bold">{currentPage}</span> {t('common.of')}{' '}
          <span className="text-white font-bold">{totalPages}</span>
        </span>
      </div>
    </div>
  );
}
