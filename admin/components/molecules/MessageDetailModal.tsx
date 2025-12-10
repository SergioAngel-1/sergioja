'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../atoms/Icon';
import StatusBadge from '../atoms/StatusBadge';
import { useState } from 'react';
import { alerts } from '@/lib/alerts';

interface MessageDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: {
    id: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    status: 'new' | 'read' | 'replied' | 'spam';
    createdAt: Date;
    ipAddress?: string | null;
    userAgent?: string | null;
  } | null;
  source: 'portfolio' | 'landing';
  onStatusChange: (messageId: string, newStatus: 'new' | 'read' | 'replied' | 'spam') => Promise<void>;
  onDelete: (messageId: string) => Promise<void>;
}

export default function MessageDetailModal({
  isOpen,
  onClose,
  message,
  source,
  onStatusChange,
  onDelete,
}: MessageDetailModalProps) {
  const [isChangingStatus, setIsChangingStatus] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  if (!message) return null;

  const sourceConfig = {
    portfolio: { label: 'Portfolio', color: 'text-purple-400' },
    landing: { label: 'Landing', color: 'text-cyan-400' },
  };

  const handleStatusChange = async (newStatus: 'new' | 'read' | 'replied' | 'spam') => {
    setIsChangingStatus(true);
    try {
      await onStatusChange(message.id, newStatus);
    } finally {
      setIsChangingStatus(false);
    }
  };

  const handleDelete = () => {
    alerts.confirm(
      'Eliminar mensaje',
      '¿Estás seguro de eliminar este mensaje? Esta acción no se puede deshacer.',
      async () => {
        setIsDeleting(true);
        try {
          await onDelete(message.id);
          onClose();
        } finally {
          setIsDeleting(false);
        }
      },
      undefined,
      'Eliminar',
      'Cancelar'
    );
  };

  const handleReply = () => {
    window.location.href = `mailto:${message.email}?subject=Re: ${message.subject}`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-admin-dark/80 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
              className="relative w-full max-w-3xl bg-admin-dark-elevated border border-admin-primary/30 rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-start justify-between p-6 border-b border-admin-primary/20">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-2xl font-orbitron font-bold text-admin-primary">
                      {message.name}
                    </h2>
                    <StatusBadge status={message.status} />
                    <span className={`text-sm ${sourceConfig[source].color}`}>
                      {sourceConfig[source].label}
                    </span>
                  </div>
                  <p className="text-text-muted text-sm">{message.email}</p>
                  <p className="text-text-muted text-xs mt-1">
                    {message.createdAt.toLocaleString('es-ES', {
                      dateStyle: 'full',
                      timeStyle: 'short',
                    })}
                  </p>
                </div>

                <button
                  onClick={onClose}
                  className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg bg-admin-dark-surface border border-admin-primary/20 text-text-muted hover:text-admin-primary hover:border-admin-primary/50 transition-all duration-200"
                >
                  <Icon name="plus" size={20} className="rotate-45" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Subject */}
                <div>
                  <label className="block text-text-muted text-xs font-medium uppercase tracking-wider mb-2">
                    Asunto
                  </label>
                  <p className="text-text-primary font-medium">{message.subject}</p>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-text-muted text-xs font-medium uppercase tracking-wider mb-2">
                    Mensaje
                  </label>
                  <div className="bg-admin-dark-surface border border-admin-primary/20 rounded-lg p-4">
                    <p className="text-text-primary whitespace-pre-wrap leading-relaxed">
                      {message.message}
                    </p>
                  </div>
                </div>

                {/* Metadata */}
                {(message.ipAddress || message.userAgent) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {message.ipAddress && (
                      <div>
                        <label className="block text-text-muted text-xs font-medium uppercase tracking-wider mb-2">
                          IP Address
                        </label>
                        <p className="text-text-secondary text-sm font-mono">{message.ipAddress}</p>
                      </div>
                    )}
                    {message.userAgent && (
                      <div>
                        <label className="block text-text-muted text-xs font-medium uppercase tracking-wider mb-2">
                          User Agent
                        </label>
                        <p className="text-text-secondary text-sm font-mono truncate">
                          {message.userAgent}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Footer Actions */}
              <div className="flex flex-wrap items-center justify-between gap-4 p-6 border-t border-admin-primary/20">
                {/* Status Actions */}
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleStatusChange(message.status === 'read' ? 'new' : 'read')}
                    disabled={isChangingStatus}
                    className="flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/20 text-white rounded-lg text-sm font-medium hover:bg-white/10 hover:border-white/40 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
                    title={message.status === 'read' ? 'Marcar como no leído' : 'Marcar como leído'}
                  >
                    <Icon name="eye" size={16} />
                    <span className="hidden sm:inline">{message.status === 'read' ? 'No leído' : 'Leído'}</span>
                  </button>
                  <button
                    onClick={() => handleStatusChange(message.status === 'replied' ? 'new' : 'replied')}
                    disabled={isChangingStatus}
                    className="flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/20 text-white rounded-lg text-sm font-medium hover:bg-white/10 hover:border-white/40 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
                    title={message.status === 'replied' ? 'Marcar como no respondido' : 'Marcar como respondido'}
                  >
                    <Icon name="check" size={16} />
                    <span className="hidden sm:inline">{message.status === 'replied' ? 'No respondido' : 'Respondido'}</span>
                  </button>
                  <button
                    onClick={() => handleStatusChange(message.status === 'spam' ? 'new' : 'spam')}
                    disabled={isChangingStatus}
                    className="flex items-center gap-2 px-3 py-2 bg-admin-error/10 border border-admin-error/30 text-admin-error rounded-lg text-sm font-medium hover:bg-admin-error/20 hover:border-admin-error/50 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
                    title={message.status === 'spam' ? 'Marcar como no spam' : 'Marcar como spam'}
                  >
                    <Icon name="x" size={16} />
                    <span className="hidden sm:inline">{message.status === 'spam' ? 'No spam' : 'Spam'}</span>
                  </button>
                </div>

                {/* Main Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={handleReply}
                    className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-lg font-medium hover:bg-white/90 transition-all duration-200"
                    title="Responder por email"
                  >
                    <Icon name="messages" size={16} />
                    <span className="hidden sm:inline">Responder</span>
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="flex items-center gap-2 px-4 py-2 bg-admin-error text-white rounded-lg font-medium hover:bg-admin-error/90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Eliminar mensaje"
                  >
                    <Icon name="trash" size={16} />
                    <span className="hidden sm:inline">{isDeleting ? 'Eliminando...' : 'Eliminar'}</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
