'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../atoms/Icon';
import Loader from '../atoms/Loader';
import { fluidSizing } from '@/lib/fluidSizing';

interface Redirect {
  id: string;
  oldSlug: string;
  newSlug: string;
  createdAt: string;
  notes?: string;
}

interface SimpleRedirectCardProps {
  title: string;
  subtitle: string;
  icon: string;
  redirectCount: number;
  redirects: Redirect[];
  onDelete: (redirectId: string, oldSlug: string) => void;
  deletingId: string | null;
  variant?: 'default' | 'deleted' | 'custom';
  initialExpanded?: boolean;
}

export default function SimpleRedirectCard({
  title,
  subtitle,
  icon,
  redirectCount,
  redirects,
  onDelete,
  deletingId,
  variant = 'default',
  initialExpanded = false,
}: SimpleRedirectCardProps) {
  const [isExpanded, setIsExpanded] = useState(initialExpanded);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const isDeleted = variant === 'deleted';
  const isCustom = variant === 'custom';

  const cardStyles = {
    border: isDeleted ? 'border-red-500/30' : isCustom ? 'border-blue-500/30' : 'border-admin-primary/30',
    headerBg: isDeleted ? 'bg-red-500/10' : isCustom ? 'bg-blue-500/10' : 'bg-admin-dark-elevated',
    headerHover: isDeleted ? 'hover:bg-red-500/15' : isCustom ? 'hover:bg-blue-500/15' : 'hover:bg-admin-primary/10',
    iconBg: isDeleted ? 'bg-red-500/20' : isCustom ? 'bg-blue-500/20' : 'bg-admin-primary/10',
    iconBorder: isDeleted ? 'border-red-500/40' : isCustom ? 'border-blue-500/40' : 'border-admin-primary/30',
    iconColor: isDeleted ? 'text-red-400' : isCustom ? 'text-blue-400' : 'text-admin-primary',
    divider: isDeleted ? 'border-red-500/20' : isCustom ? 'border-blue-500/20' : 'border-admin-primary/20',
    rowDivider: isDeleted ? 'divide-red-500/10' : isCustom ? 'divide-blue-500/10' : 'divide-admin-primary/10',
    rowHover: isDeleted ? 'hover:bg-red-500/5' : isCustom ? 'hover:bg-blue-500/5' : 'hover:bg-admin-primary/5',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-admin-dark-surface border ${cardStyles.border} rounded-lg overflow-hidden`}
    >
      {/* Header - Collapsible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`w-full ${cardStyles.headerBg} ${cardStyles.headerHover} transition-colors duration-200`}
        style={{ padding: `${fluidSizing.space.md} ${fluidSizing.space.lg}` }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center" style={{ gap: fluidSizing.space.md }}>
            {/* Icon */}
            <div
              className={`${cardStyles.iconBg} border ${cardStyles.iconBorder} rounded-lg flex items-center justify-center`}
              style={{
                width: '36px',
                height: '36px',
              }}
            >
              <Icon name={icon} size={20} className={cardStyles.iconColor} />
            </div>

            {/* Title and subtitle */}
            <div className="text-left">
              <h3 className="font-semibold text-white" style={{ fontSize: fluidSizing.text.base }}>
                {title}
              </h3>
              <p className="text-text-muted" style={{ fontSize: fluidSizing.text.xs }}>
                {subtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center" style={{ gap: fluidSizing.space.md }}>
            {/* Count badge */}
            <span
              className="bg-admin-primary/20 text-admin-primary font-medium rounded-full"
              style={{
                padding: `${fluidSizing.space.xs} ${fluidSizing.space.sm}`,
                fontSize: fluidSizing.text.xs,
              }}
            >
              {redirectCount}
            </span>

            {/* Chevron */}
            <Icon
              name={isExpanded ? 'chevron-up' : 'chevron-down'}
              size={20}
              className="text-text-muted"
            />
          </div>
        </div>
      </button>

      {/* Expanded content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className={`border-t ${cardStyles.divider}`}
          >
            <div className={`divide-y ${cardStyles.rowDivider}`}>
              {redirects.map((redirect, index) => (
                <motion.div
                  key={redirect.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03, duration: 0.2 }}
                  className={`${cardStyles.rowHover} transition-colors duration-150`}
                  style={{ padding: `${fluidSizing.space.md} ${fluidSizing.space.lg}` }}
                >
                  <div className="flex items-center justify-between" style={{ gap: fluidSizing.space.lg }}>
                    {/* Old Slug */}
                    <div className="flex-1">
                      <code className="text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-1 rounded text-xs font-mono break-all inline-block">
                        /projects/{redirect.oldSlug}
                      </code>
                    </div>

                    {/* Arrow */}
                    <Icon name="arrow-right" size={16} className="text-text-muted flex-shrink-0" />

                    {/* New Slug */}
                    <div className="flex-1">
                      <code className="text-green-400 bg-green-500/10 border border-green-500/20 px-2 py-1 rounded text-xs font-mono break-all inline-block">
                        /projects{redirect.newSlug !== 'projects' ? `/${redirect.newSlug}` : ''}
                      </code>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center flex-shrink-0" style={{ gap: fluidSizing.space.sm }}>
                      <p className="text-text-muted text-xs">
                        {formatDate(redirect.createdAt)}
                      </p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(redirect.id, redirect.oldSlug);
                        }}
                        disabled={deletingId === redirect.id}
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 rounded-md"
                        style={{ padding: fluidSizing.space.xs }}
                        title={`Eliminar ${redirect.oldSlug}`}
                      >
                        {deletingId === redirect.id ? (
                          <Loader size="sm" />
                        ) : (
                          <Icon name="delete" size={14} />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Notes if present */}
                  {redirect.notes && (
                    <div className="mt-2">
                      <p className="text-text-muted text-xs bg-white/5 border border-white/10 rounded px-2 py-1">
                        {redirect.notes}
                      </p>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
