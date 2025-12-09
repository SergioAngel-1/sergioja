'use client';

import { useState } from 'react';
import Modal from './Modal';
import Input from '../atoms/Input';
import Button from '../atoms/Button';
import { fluidSizing } from '@/lib/fluidSizing';
import { api } from '@/lib/api-client';
import { alerts } from '@/lib/alerts';
import { logger } from '@/lib/logger';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChangePasswordModal({ isOpen, onClose }: ChangePasswordModalProps) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones
    if (!currentPassword || !newPassword || !confirmPassword) {
      alerts.error('Error', 'Todos los campos son obligatorios');
      return;
    }

    if (newPassword.length < 8) {
      alerts.error('Error', 'La nueva contraseña debe tener al menos 8 caracteres');
      return;
    }

    if (newPassword !== confirmPassword) {
      alerts.error('Error', 'Las contraseñas no coinciden');
      return;
    }

    if (currentPassword === newPassword) {
      alerts.error('Error', 'La nueva contraseña debe ser diferente a la actual');
      return;
    }

    // Confirmación antes de cambiar la contraseña
    alerts.confirm(
      '¿Cambiar contraseña?',
      'Al cambiar tu contraseña, tu sesión actual se cerrará y deberás iniciar sesión nuevamente con la nueva contraseña.',
      async () => {
        try {
          setIsLoading(true);
          const response = await api.changePassword({
            currentPassword,
            newPassword,
          });

          if (response.success) {
            alerts.success('Contraseña actualizada', 'Tu contraseña ha sido cambiada exitosamente. Redirigiendo al login...');
            logger.info('Password changed successfully');
            handleClose();
            
            // Cerrar sesión después de 2 segundos
            setTimeout(() => {
              window.location.href = '/login';
            }, 2000);
          } else {
            const errorMessage = typeof response.error === 'string' 
              ? response.error 
              : response.error?.message || 'No se pudo cambiar la contraseña';
            alerts.error('Error', errorMessage);
            logger.error('Failed to change password', response.error);
          }
        } catch (error) {
          logger.error('Error changing password', error);
          alerts.error('Error', 'Ocurrió un error al cambiar la contraseña');
        } finally {
          setIsLoading(false);
        }
      },
      undefined,
      'Cambiar Contraseña',
      'Cancelar'
    );
  };

  const handleClose = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Cambiar Contraseña"
      maxWidth="md"
      footer={
        <>
          <Button
            onClick={handleClose}
            variant="outline"
            disabled={isLoading}
            className="flex-1"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            variant="primary"
            isLoading={isLoading}
            disabled={isLoading}
            className="flex-1"
          >
            Cambiar Contraseña
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} style={{ padding: fluidSizing.space.lg }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: fluidSizing.space.lg }}>
          {/* Contraseña actual */}
          <Input
            id="current-password"
            type="password"
            label="Contraseña Actual"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Ingresa tu contraseña actual"
            required
            disabled={isLoading}
            size="md"
          />

          {/* Nueva contraseña */}
          <Input
            id="new-password"
            type="password"
            label="Nueva Contraseña"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Mínimo 8 caracteres"
            required
            disabled={isLoading}
            size="md"
          />

          {/* Confirmar contraseña */}
          <Input
            id="confirm-password"
            type="password"
            label="Confirmar Nueva Contraseña"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Repite la nueva contraseña"
            required
            disabled={isLoading}
            size="md"
          />

          {/* Información de seguridad */}
          <div 
            className="bg-admin-primary/10 border border-admin-primary/30 rounded-lg"
            style={{ padding: fluidSizing.space.md }}
          >
            <p className="text-text-muted" style={{ fontSize: fluidSizing.text.sm, lineHeight: '1.6' }}>
              <strong className="text-admin-primary">Requisitos de seguridad:</strong>
              <br />
              • Mínimo 8 caracteres
              <br />
              • Debe ser diferente a tu contraseña actual
            </p>
          </div>
        </div>
      </form>
    </Modal>
  );
}
