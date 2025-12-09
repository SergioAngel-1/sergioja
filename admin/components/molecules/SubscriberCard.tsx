'use client';

import { motion } from 'framer-motion';
import Icon from '../atoms/Icon';
import { useState } from 'react';

interface SubscriberCardProps {
  id: string;
  email: string;
  status: 'active' | 'unsubscribed';
  createdAt: Date;
  ipAddress?: string | null;
  userAgent?: string | null;
  delay?: number;
  onDelete: (id: string) => Promise<void>;
}

export default function SubscriberCard({
  id,
  email,
  status,
  createdAt,
  ipAddress,
  userAgent,
  delay = 0,
  onDelete,
}: SubscriberCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

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

  const handleDelete = async () => {
    if (!confirm(`¿Eliminar suscriptor ${email}?`)) return;
    
    setIsDeleting(true);
    try {
      await onDelete(id);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.23, 1, 0.32, 1] }}
      className={`
        group relative bg-admin-dark-elevated border rounded-lg p-5
        transition-all duration-300 hover:shadow-lg hover:shadow-admin-primary/10
        ${isActive ? 'border-green-400/40 hover:border-green-400/60' : 'border-red-400/40 hover:border-red-400/60'}
      `}
    >
      {/* Status indicator */}
      <div className="absolute -top-1 -right-1">
        <div className={`w-3 h-3 rounded-full ${isActive ? 'bg-green-400 animate-pulse shadow-lg shadow-green-400/50' : 'bg-red-400'}`} />
      </div>

      {/* Background grid effect */}
      <div className="absolute inset-0 cyber-grid opacity-5 rounded-lg" />

      {/* Content */}
      <div className="relative z-10 space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Icon name="newsletter" size={18} className={isActive ? 'text-green-400' : 'text-red-400'} />
              <h3 className="text-base font-bold text-admin-primary truncate">
                {email}
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-xs px-2 py-0.5 rounded border ${
                isActive 
                  ? 'text-green-400 bg-green-400/10 border-green-400/30' 
                  : 'text-red-400 bg-red-400/10 border-red-400/30'
              }`}>
                {isActive ? 'Activo' : 'Desuscrito'}
              </span>
              <span className="text-text-muted text-xs">
                {formatDate(createdAt)}
              </span>
            </div>
          </div>

          <button
            onClick={() => setShowDetails(!showDetails)}
            className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg bg-admin-dark-surface border border-admin-primary/20 text-text-muted hover:text-admin-primary hover:border-admin-primary/50 transition-all duration-200"
          >
            <Icon name={showDetails ? 'chevronLeft' : 'chevronRight'} size={16} className={showDetails ? 'rotate-90' : '-rotate-90'} />
          </button>
        </div>

        {/* Details (expandable) */}
        {showDetails && (ipAddress || userAgent) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="pt-3 border-t border-admin-primary/10 space-y-2"
          >
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
          </motion.div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-admin-primary/10">
          <div className="flex items-center gap-2 text-text-muted text-xs">
            <Icon name="zap" size={14} />
            <span>Suscrito {formatDate(createdAt)}</span>
          </div>

          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex items-center gap-1 px-3 py-1.5 bg-admin-error/20 border border-admin-error/30 text-admin-error rounded-lg text-xs font-medium hover:bg-admin-error/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDeleting ? (
              <>
                <svg className="animate-spin w-3 h-3" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Eliminando...
              </>
            ) : (
              <>
                <Icon name="plus" size={14} className="rotate-45" />
                Eliminar
              </>
            )}
          </button>
        </div>
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
