'use client';

import { motion } from 'framer-motion';
import Icon from '../atoms/Icon';
import StatusBadge from '../atoms/StatusBadge';

interface MessageCardProps {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'replied' | 'spam';
  createdAt: Date;
  source: 'portfolio' | 'landing';
  delay?: number;
  onClick: () => void;
  messageCount?: number; // Número total de mensajes de este remitente
}

export default function MessageCard({
  id: _id,
  name,
  email,
  subject,
  message,
  status,
  createdAt,
  source,
  delay = 0,
  onClick,
  messageCount = 1,
}: MessageCardProps) {
  const isNew = status === 'new';
  const sourceConfig = {
    portfolio: {
      label: 'Portfolio',
      color: 'text-purple-400',
      bg: 'bg-purple-400/10',
      border: 'border-purple-400/30',
    },
    landing: {
      label: 'Landing',
      color: 'text-cyan-400',
      bg: 'bg-cyan-400/10',
      border: 'border-cyan-400/30',
    },
  };

  const sourceStyle = sourceConfig[source];

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) {
      const hours = Math.floor(diff / (1000 * 60 * 60));
      if (hours === 0) {
        const minutes = Math.floor(diff / (1000 * 60));
        return minutes <= 1 ? 'Hace un momento' : `Hace ${minutes}m`;
      }
      return `Hace ${hours}h`;
    } else if (days === 1) {
      return 'Ayer';
    } else if (days < 7) {
      return `Hace ${days}d`;
    } else {
      return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.23, 1, 0.32, 1] }}
      onClick={onClick}
      className={`
        group relative bg-admin-dark-elevated border rounded-lg p-5 cursor-pointer
        transition-all duration-300 hover:shadow-lg hover:shadow-admin-primary/10
        ${isNew ? 'border-blue-400/40 hover:border-blue-400/60' : 'border-admin-primary/20 hover:border-admin-primary/50'}
      `}
    >
      {/* New indicator */}
      {isNew && (
        <div className="absolute -top-1 -right-1">
          <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse shadow-lg shadow-blue-400/50" />
        </div>
      )}

      {/* Background grid effect */}
      <div className="absolute inset-0 cyber-grid opacity-5 rounded-lg" />

      {/* Content */}
      <div className="relative z-10 space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-base font-bold text-admin-primary group-hover:text-glow-subtle transition-all duration-300 truncate">
                {name}
              </h3>
              {messageCount > 1 && (
                <span className="px-2 py-0.5 text-xs font-medium bg-admin-primary/10 border border-admin-primary/30 text-admin-primary rounded">
                  {messageCount} mensajes
                </span>
              )}
              <StatusBadge status={status} size="sm" />
            </div>
            <p className="text-text-muted text-sm truncate">{email}</p>
          </div>

          <div className="flex flex-col items-end gap-2 flex-shrink-0">
            <span className="text-text-muted text-xs whitespace-nowrap">
              {formatDate(createdAt)}
            </span>
            <span className={`text-xs px-2 py-0.5 rounded border ${sourceStyle.color} ${sourceStyle.bg} ${sourceStyle.border}`}>
              {sourceStyle.label}
            </span>
          </div>
        </div>

        {/* Subject */}
        <div className="flex items-start gap-2">
          <Icon name="messages" size={16} className="text-admin-primary/50 flex-shrink-0 mt-0.5" />
          <p className="text-text-primary text-sm font-medium line-clamp-1">
            {subject}
          </p>
        </div>

        {/* Message preview */}
        <p className="text-text-muted text-sm line-clamp-2 leading-relaxed">
          {message}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-admin-primary/10">
          <div className="flex items-center gap-2 text-text-muted text-xs">
            <Icon name="eye" size={14} />
            <span>Click para ver detalles</span>
          </div>

          <div className="flex items-center gap-1 text-admin-primary text-xs font-medium group-hover:translate-x-1 transition-transform duration-300">
            <span>Abrir</span>
            <Icon name="chevronRight" size={14} />
          </div>
        </div>
      </div>

      {/* Bottom accent line */}
      <div
        className={`
          absolute bottom-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300
          ${isNew ? 'bg-gradient-to-r from-transparent via-blue-400/50 to-transparent' : 'bg-gradient-to-r from-transparent via-admin-primary/50 to-transparent'}
        `}
      />
    </motion.div>
  );
}
