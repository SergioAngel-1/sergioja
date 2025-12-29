'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../atoms/Icon';
import Loader from '../atoms/Loader';
import { fluidSizing } from '@/lib/fluidSizing';

interface Redirect {
  id?: string;
  oldSlug?: string;
  oldSlugs?: string[];
  newSlug: string;
  createdAt: string;
  redirectType?: string;
  redirects?: Array<{ id: string; oldSlug: string; createdAt: string }>;
}

interface RedirectGroupCardProps {
  title: string;
  subtitle: string;
  icon: string;
  redirectCount: number;
  redirects: Redirect[];
  onDelete: (redirectId: string, oldSlug: string) => void;
  deletingId: string | null;
  variant?: 'default' | 'deleted';
  initialExpanded?: boolean;
}

export default function RedirectGroupCard({
  title,
  subtitle,
  icon,
  redirectCount,
  redirects,
  onDelete,
  deletingId,
  variant = 'default',
  initialExpanded = false,
}: RedirectGroupCardProps) {
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

  const cardStyles = {
    border: isDeleted ? 'border-red-500/30' : 'border-admin-primary/30',
    headerBg: isDeleted ? 'bg-red-500/10' : 'bg-admin-dark-elevated',
    headerHover: isDeleted ? 'hover:bg-red-500/15' : 'hover:bg-admin-primary/10',
    iconBg: isDeleted ? 'bg-red-500/20' : 'bg-admin-primary/10',
    iconBorder: isDeleted ? 'border-red-500/40' : 'border-admin-primary/30',
    iconColor: isDeleted ? 'text-red-400' : 'text-admin-primary',
    divider: isDeleted ? 'border-red-500/20' : 'border-admin-primary/10',
    rowDivider: isDeleted ? 'divide-red-500/10' : 'divide-admin-primary/10',
    rowHover: isDeleted ? 'hover:bg-red-500/5' : 'hover:bg-admin-dark-elevated/50',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-admin-dark-surface border ${cardStyles.border} rounded-xl overflow-hidden shadow-lg`}
    >
      {/* Header - Clickable */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`w-full flex items-center justify-between ${cardStyles.headerBg} ${cardStyles.headerHover} transition-all duration-200`}
        style={{ padding: `${fluidSizing.space.md} ${fluidSizing.space.lg}` }}
      >
        <div className="flex items-center" style={{ gap: fluidSizing.space.md }}>
          {/* Expand/Collapse Icon */}
          <div className={`flex items-center justify-center rounded-lg ${cardStyles.iconBg} border ${cardStyles.iconBorder} transition-all duration-200`} style={{ width: '36px', height: '36px' }}>
            <Icon
              name={isExpanded ? 'chevron-down' : 'chevron-right'}
              size={18}
              className={`${cardStyles.iconColor} transition-transform duration-200`}
            />
          </div>

          {/* Title & Subtitle */}
          <div className="text-left">
            <h3
              className="font-semibold text-text-primary flex items-center"
              style={{ fontSize: fluidSizing.text.base, gap: fluidSizing.space.xs, marginBottom: '2px' }}
            >
              <Icon name={icon} size={16} className={cardStyles.iconColor} />
              {title}
            </h3>
            <p className="text-text-muted" style={{ fontSize: fluidSizing.text.xs }}>
              {subtitle}
            </p>
          </div>
        </div>

        {/* Count Badge */}
        <div className="flex items-center" style={{ gap: fluidSizing.space.sm }}>
          <div className={`rounded-md ${cardStyles.iconBg} border ${cardStyles.iconBorder}`} style={{ padding: `${fluidSizing.space.xs} ${fluidSizing.space.md}` }}>
            <p
              className={`font-bold ${cardStyles.iconColor} text-center`}
              style={{ fontSize: fluidSizing.text.lg }}
            >
              {redirectCount}
            </p>
          </div>
        </div>
      </button>

      {/* Redirects List - Collapsible */}
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
                  <div>
                    {/* Header with date */}
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-text-muted" style={{ fontSize: fluidSizing.text.xs }}>
                        {formatDate(redirect.createdAt)}
                      </p>
                    </div>

                    {/* Main redirect display */}
                    <div className="flex items-center" style={{ gap: fluidSizing.space.lg }}>
                      {/* Old Slugs - Multiple URLs */}
                      <div className="flex-1">
                        <p className="text-text-muted mb-2" style={{ fontSize: fluidSizing.text.xs }}>
                          {isDeleted ? 'URLs Eliminadas' : 'URLs Antiguas'} ({redirect.oldSlugs?.length || 1})
                        </p>
                        <div className="flex flex-col" style={{ gap: fluidSizing.space.xs }}>
                          {redirect.oldSlugs ? (
                            redirect.oldSlugs.map((oldSlug, idx) => {
                              const redirectItem = redirect.redirects?.[idx];
                              return (
                                <div key={redirectItem?.id || `${oldSlug}-${idx}`} className="flex items-center" style={{ gap: fluidSizing.space.sm }}>
                                  <code className="text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-1 rounded text-xs font-mono break-all flex-1">
                                    /projects/{oldSlug}
                                  </code>
                                  {redirectItem && (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        onDelete(redirectItem.id, redirectItem.oldSlug);
                                      }}
                                      disabled={deletingId === redirectItem.id}
                                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 rounded-md flex-shrink-0"
                                      style={{ padding: fluidSizing.space.xs }}
                                      title={`Eliminar ${oldSlug}`}
                                    >
                                      {deletingId === redirectItem.id ? (
                                        <Loader size="sm" />
                                      ) : (
                                        <Icon name="delete" size={14} />
                                      )}
                                    </button>
                                  )}
                                </div>
                              );
                            })
                          ) : (
                            <div className="flex items-center" style={{ gap: fluidSizing.space.sm }}>
                              <code className="text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-1 rounded text-xs font-mono break-all flex-1">
                                /projects/{redirect.oldSlug}
                              </code>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onDelete(redirect.id!, redirect.oldSlug!);
                                }}
                                disabled={deletingId === redirect.id}
                                className="text-red-400 hover:text-red-300 hover:bg-red-500/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 rounded-md flex-shrink-0"
                                style={{ padding: fluidSizing.space.xs }}
                                title="Eliminar redirección"
                              >
                                {deletingId === redirect.id ? (
                                  <Loader size="sm" />
                                ) : (
                                  <Icon name="delete" size={14} />
                                )}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Arrow */}
                      <div className="flex items-center flex-shrink-0">
                        <Icon name="arrow-right" size={20} className="text-text-muted" />
                      </div>

                      {/* New Slug */}
                      <div className="flex-1">
                        <p className="text-text-muted mb-2" style={{ fontSize: fluidSizing.text.xs }}>
                          {isDeleted ? 'Redirige a' : 'URL Actual'}
                        </p>
                        <code className="text-green-400 bg-green-500/10 border border-green-500/20 px-2 py-1 rounded text-xs font-mono break-all inline-block">
                          /projects{redirect.newSlug !== 'projects' ? `/${redirect.newSlug}` : ''}
                        </code>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
