'use client';

import { motion } from 'framer-motion';
import { fluidSizing } from '@/lib/fluidSizing';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage?: number;
  totalItems?: number;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  totalItems,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col sm:flex-row items-center justify-between gap-4"
      style={{ paddingTop: fluidSizing.space.md, paddingBottom: fluidSizing.space.lg }}
    >
      {/* Info de items */}
      {itemsPerPage && totalItems !== undefined && (
        <div className="text-text-muted text-sm">
          Mostrando {Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)} -{' '}
          {Math.min(currentPage * itemsPerPage, totalItems)} de {totalItems} resultados
        </div>
      )}

      {/* Controles de paginación */}
      <div className="flex items-center gap-2">
        {/* Botón anterior */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-2 rounded-lg bg-background-elevated border border-white/10 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-admin-primary/20 hover:border-admin-primary/50 transition-all duration-200"
          style={{ fontSize: fluidSizing.text.sm }}
        >
          ←
        </button>

        {/* Números de página */}
        <div className="flex items-center gap-1">
          {pageNumbers.map((page, index) => {
            if (page === '...') {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className="px-3 py-2 text-text-muted"
                  style={{ fontSize: fluidSizing.text.sm }}
                >
                  ...
                </span>
              );
            }

            const pageNum = page as number;
            const isActive = pageNum === currentPage;

            return (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                className={`px-3 py-2 rounded-lg border transition-all duration-200 ${
                  isActive
                    ? 'bg-admin-primary border-admin-primary text-black font-semibold shadow-lg shadow-admin-primary/50'
                    : 'bg-background-elevated border-white/10 text-white hover:bg-admin-primary/20 hover:border-admin-primary/50'
                }`}
                style={{ fontSize: fluidSizing.text.sm }}
              >
                {pageNum}
              </button>
            );
          })}
        </div>

        {/* Botón siguiente */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-2 rounded-lg bg-background-elevated border border-white/10 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-admin-primary/20 hover:border-admin-primary/50 transition-all duration-200"
          style={{ fontSize: fluidSizing.text.sm }}
        >
          →
        </button>
      </div>
    </motion.div>
  );
}
