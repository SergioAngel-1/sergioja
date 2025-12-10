'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../atoms/Icon';
import { useState } from 'react';
import { alerts } from '@/lib/alerts';

interface SubscriberCardProps {
  id: string;
  email: string;
  status: 'active' | 'unsubscribed';
  source: 'main' | 'portfolio';
  isRead: boolean;
  createdAt: Date;
  ipAddress?: string | null;
  userAgent?: string | null;
  delay?: number;
  onDelete: (id: string) => Promise<void>;
  onToggleRead?: (id: string, isRead: boolean) => Promise<void>;
  isExpanded?: boolean;
  onToggleExpand?: (id: string) => void;
}

export default function SubscriberCard({
  id,
  email,
  status,
  source,
  isRead,
  createdAt,
  ipAddress,
  userAgent,
  delay = 0,
  onDelete,
  onToggleRead,
  isExpanded = false,
  onToggleExpand,
}: SubscriberCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isTogglingRead, setIsTogglingRead] = useState(false);

  const isActive = status === 'active';

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) {
      return 'Hoy';
    } else if (days === 1) {
      return 'Ayer';
    } else if (days < 30) {
      return `Hace ${days}d`;
    } else if (days < 365) {
      const months = Math.floor(days / 30);
      return `Hace ${months} ${months === 1 ? 'mes' : 'meses'}`;
    } else {
      return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'short' });
    }
  };

  const handleDelete = () => {
    alerts.confirm(
      'Eliminar suscriptor',
      `¿Estás seguro de eliminar al suscriptor ${email}? Esta acción no se puede deshacer.`,
      async () => {
        setIsDeleting(true);
        try {
          await onDelete(id);
        } finally {
          setIsDeleting(false);
        }
      },
      undefined,
      'Eliminar',
      'Cancelar'
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.23, 1, 0.32, 1] }}
      className="group relative bg-admin-dark-elevated border border-admin-primary/20 rounded-lg p-5 transition-all duration-300 hover:shadow-lg hover:border-admin-primary/40 hover:shadow-admin-primary/10"
      style={{ boxShadow: 'inset 0 1px 2px rgba(255, 255, 255, 0.1)' }}
    >
      {/* Read/Unread indicator */}
      <div className="absolute -top-1 -right-1">
        <div className={`w-3 h-3 rounded-full ${!isRead ? 'bg-white animate-pulse shadow-lg shadow-white/50' : 'bg-admin-primary/30'}`} />
      </div>

      {/* Background grid effect */}
      <div className="absolute inset-0 cyber-grid opacity-5 rounded-lg" />

      {/* Content */}
      <div className="relative z-10 space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Icon name="newsletter" size={18} className="text-white" />
              <h3 className="text-base font-bold text-admin-primary truncate">
                {email}
              </h3>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-xs px-2 py-0.5 rounded border ${
                isActive 
                  ? 'text-green-400 bg-green-400/10 border-green-400/30' 
                  : 'text-red-400 bg-red-400/10 border-red-400/30'
              }`}>
                {isActive ? 'Activo' : 'Desuscrito'}
              </span>
              <span className={`text-xs px-2 py-0.5 rounded border ${
                source === 'main'
                  ? 'text-cyan-400 bg-cyan-400/10 border-cyan-400/30'
                  : 'text-purple-400 bg-purple-400/10 border-purple-400/30'
              }`}>
                {source === 'main' ? 'Main' : 'Portfolio'}
              </span>
              <span className="text-text-muted text-xs">
                {formatDate(createdAt)}
              </span>
            </div>
          </div>

          <button
            onClick={() => onToggleExpand?.(id)}
            className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg bg-admin-dark-surface border border-admin-primary/20 text-text-muted hover:text-admin-primary hover:border-admin-primary/50 transition-all duration-200"
          >
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            >
              <Icon name="chevronLeft" size={16} className="-rotate-90" />
            </motion.div>
          </button>
        </div>

        {/* Details (expandable) */}
        <AnimatePresence initial={false}>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
              className="overflow-hidden"
            >
              <div className="pt-3 border-t border-admin-primary/10 space-y-3">
                {(ipAddress || userAgent) && (
                  <div className="space-y-2">
                    {ipAddress && (
                      <div>
                        <label className="block text-text-muted text-xs font-medium uppercase tracking-wider mb-1">
                          IP Address
                        </label>
                        <p className="text-text-secondary text-sm font-mono">{ipAddress}</p>
                      </div>
                    )}
                    {userAgent && (
                      <div>
                        <label className="block text-text-muted text-xs font-medium uppercase tracking-wider mb-1">
                          User Agent
                        </label>
                        <p className="text-text-secondary text-xs font-mono truncate">{userAgent}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-2 border-t border-admin-primary/10">
                  <div className="flex items-center gap-2 text-text-muted text-xs">
                    <Icon name="zap" size={14} />
                    <span>Suscrito {formatDate(createdAt)}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Toggle Read Button */}
                    <button
                      onClick={async () => {
                        if (onToggleRead) {
                          setIsTogglingRead(true);
                          try {
                            await onToggleRead(id, !isRead);
                          } finally {
                            setIsTogglingRead(false);
                          }
                        }
                      }}
                      disabled={isTogglingRead}
                      className="flex items-center justify-center w-8 h-8 rounded-lg border bg-white/10 border-white/30 text-white hover:bg-white/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      title={isRead ? 'Marcar como no leído' : 'Marcar como leído'}
                    >
                      {isTogglingRead ? (
                        <svg className="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                      ) : (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          {isRead ? (
                            <>
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                              <circle cx="12" cy="12" r="3" />
                              <line x1="3" y1="3" x2="21" y2="21" />
                            </>
                          ) : (
                            <>
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                              <circle cx="12" cy="12" r="3" />
                            </>
                          )}
                        </svg>
                      )}
                    </button>

                    {/* Delete Button */}
                    <button
                      onClick={handleDelete}
                      disabled={isDeleting}
                      className="flex items-center justify-center w-8 h-8 bg-admin-error/20 border border-admin-error/30 text-admin-error rounded-lg hover:bg-admin-error/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Eliminar suscriptor"
                    >
                      {isDeleting ? (
                        <svg className="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                      ) : (
                        <Icon name="trash" size={16} />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom accent line */}
      <div
        className={`
          absolute bottom-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300
          ${isActive ? 'bg-gradient-to-r from-transparent via-green-400/50 to-transparent' : 'bg-gradient-to-r from-transparent via-red-400/50 to-transparent'}
        `}
      />
    </motion.div>
  );
}
