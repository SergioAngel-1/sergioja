'use client';

import Icon from '../atoms/Icon';
import StatusBadge from '../atoms/StatusBadge';
import Modal from './Modal';
import { useState } from 'react';
import { alerts } from '@/lib/alerts';
import { fluidSizing } from '@/lib/fluidSizing';

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

  // Custom Header
  const customHeader = (
    <div className="flex items-start justify-between" style={{ padding: fluidSizing.space.lg }}>
      <div className="flex-1">
        <div className="flex items-center" style={{ gap: fluidSizing.space.sm, marginBottom: fluidSizing.space.xs }}>
          <h2 className="font-orbitron font-bold text-admin-primary" style={{ fontSize: fluidSizing.text['2xl'] }}>
            {message.name}
          </h2>
          <StatusBadge status={message.status} />
          <span className={sourceConfig[source].color} style={{ fontSize: fluidSizing.text.sm }}>
            {sourceConfig[source].label}
          </span>
        </div>
        <p className="text-text-muted" style={{ fontSize: fluidSizing.text.sm }}>{message.email}</p>
        <p className="text-text-muted" style={{ fontSize: fluidSizing.text.xs, marginTop: fluidSizing.space.xs }}>
          {message.createdAt.toLocaleString('es-ES', {
            dateStyle: 'full',
            timeStyle: 'short',
          })}
        </p>
      </div>

      <button
        onClick={onClose}
        className="text-text-muted hover:text-text-primary transition-colors"
      >
        <Icon name="plus" size={24} className="rotate-45" />
      </button>
    </div>
  );

  // Footer Actions
  const footer = (
    <div className="flex flex-wrap items-center justify-between w-full" style={{ gap: fluidSizing.space.md }}>
      {/* Status Actions */}
      <div className="flex flex-wrap" style={{ gap: fluidSizing.space.xs }}>
        <button
          onClick={() => handleStatusChange(message.status === 'read' ? 'new' : 'read')}
          disabled={isChangingStatus}
          className="bg-white/5 border border-white/20 text-white rounded-lg font-medium hover:bg-white/10 hover:border-white/40 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
          style={{ padding: `${fluidSizing.space.xs} ${fluidSizing.space.sm}`, fontSize: fluidSizing.text.sm }}
          title={message.status === 'read' ? 'Marcar como no leído' : 'Marcar como leído'}
        >
          {message.status === 'read' ? 'No leído' : 'Leído'}
        </button>
        <button
          onClick={() => handleStatusChange(message.status === 'replied' ? 'new' : 'replied')}
          disabled={isChangingStatus}
          className="bg-white/5 border border-white/20 text-white rounded-lg font-medium hover:bg-white/10 hover:border-white/40 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
          style={{ padding: `${fluidSizing.space.xs} ${fluidSizing.space.sm}`, fontSize: fluidSizing.text.sm }}
          title={message.status === 'replied' ? 'Marcar como no respondido' : 'Marcar como respondido'}
        >
          {message.status === 'replied' ? 'No respondido' : 'Respondido'}
        </button>
        <button
          onClick={() => handleStatusChange(message.status === 'spam' ? 'new' : 'spam')}
          disabled={isChangingStatus}
          className="bg-admin-error/10 border border-admin-error/30 text-admin-error rounded-lg font-medium hover:bg-admin-error/20 hover:border-admin-error/50 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
          style={{ padding: `${fluidSizing.space.xs} ${fluidSizing.space.sm}`, fontSize: fluidSizing.text.sm }}
          title={message.status === 'spam' ? 'Marcar como no spam' : 'Marcar como spam'}
        >
          {message.status === 'spam' ? 'No spam' : 'Spam'}
        </button>
      </div>

      {/* Main Actions - Alineados a la derecha */}
      <div className="flex" style={{ gap: fluidSizing.space.xs }}>
        <button
          onClick={handleReply}
          className="bg-white text-black rounded-lg font-medium hover:bg-white/90 transition-all duration-200"
          style={{ padding: `${fluidSizing.space.sm} ${fluidSizing.space.md}`, fontSize: fluidSizing.text.sm }}
          title="Responder por email"
        >
          Responder
        </button>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="bg-admin-error text-white rounded-lg font-medium hover:bg-admin-error/90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ padding: `${fluidSizing.space.sm} ${fluidSizing.space.md}`, fontSize: fluidSizing.text.sm }}
          title="Eliminar mensaje"
        >
          {isDeleting ? 'Eliminando...' : 'Eliminar'}
        </button>
      </div>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      customHeader={customHeader}
      footer={footer}
      maxWidth="3xl"
      showCloseButton={false}
    >
      <div style={{ padding: fluidSizing.space.lg, display: 'flex', flexDirection: 'column', gap: fluidSizing.space.lg }}>
        {/* Subject */}
        <div>
          <label className="block text-text-muted font-medium uppercase tracking-wider" style={{ fontSize: fluidSizing.text.xs, marginBottom: fluidSizing.space.xs }}>
            Asunto
          </label>
          <p className="text-text-primary font-medium">{message.subject}</p>
        </div>

        {/* Message */}
        <div>
          <label className="block text-text-muted font-medium uppercase tracking-wider" style={{ fontSize: fluidSizing.text.xs, marginBottom: fluidSizing.space.xs }}>
            Mensaje
          </label>
          <div className="bg-admin-dark-surface border border-admin-primary/20 rounded-lg" style={{ padding: fluidSizing.space.md }}>
            <p className="text-text-primary whitespace-pre-wrap leading-relaxed">
              {message.message}
            </p>
          </div>
        </div>

        {/* Metadata */}
        {(message.ipAddress || message.userAgent) && (
          <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: fluidSizing.space.md }}>
            {message.ipAddress && (
              <div>
                <label className="block text-text-muted font-medium uppercase tracking-wider" style={{ fontSize: fluidSizing.text.xs, marginBottom: fluidSizing.space.xs }}>
                  IP Address
                </label>
                <p className="text-text-secondary font-mono" style={{ fontSize: fluidSizing.text.sm }}>{message.ipAddress}</p>
              </div>
            )}
            {message.userAgent && (
              <div>
                <label className="block text-text-muted font-medium uppercase tracking-wider" style={{ fontSize: fluidSizing.text.xs, marginBottom: fluidSizing.space.xs }}>
                  User Agent
                </label>
                <p className="text-text-secondary font-mono truncate" style={{ fontSize: fluidSizing.text.sm }}>
                  {message.userAgent}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
}
