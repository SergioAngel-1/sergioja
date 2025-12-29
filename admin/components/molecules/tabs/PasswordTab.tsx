'use client';

import Input from '@/components/atoms/Input';
import { fluidSizing } from '@/lib/fluidSizing';

interface PasswordTabProps {
  currentPassword: string;
  setCurrentPassword: (value: string) => void;
  newPassword: string;
  setNewPassword: (value: string) => void;
  confirmPassword: string;
  setConfirmPassword: (value: string) => void;
  isLoading: boolean;
  onSubmit?: (e: React.FormEvent) => void;
}

export default function PasswordTab({
  currentPassword,
  setCurrentPassword,
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
  isLoading,
  onSubmit,
}: PasswordTabProps) {
  return (
    <form onSubmit={onSubmit} className="flex flex-col" style={{ gap: fluidSizing.space.md }}>
      <Input
        type="text"
        name="username"
        autoComplete="username"
        value=""
        onChange={() => {}}
        style={{ display: 'none' }}
        aria-hidden="true"
        tabIndex={-1}
      />
      <Input
        id="current-password"
        type="password"
        label="Contraseña Actual"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
        placeholder="Ingresa tu contraseña actual"
        required
        disabled={isLoading}
        autoComplete="current-password"
      />

      <div className="flex flex-col" style={{ gap: fluidSizing.space.md }}>
        <Input
          id="new-password"
          type="password"
          label="Nueva Contraseña"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Mínimo 8 caracteres"
          required
          disabled={isLoading}
          autoComplete="new-password"
        />

        <Input
          id="confirm-password"
          type="password"
          label="Repetir Nueva Contraseña"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Repite la nueva contraseña"
          required
          disabled={isLoading}
          autoComplete="new-password"
        />
      </div>

      <div
        className="bg-admin-primary/10 border border-admin-primary/30 rounded-lg"
        style={{ padding: fluidSizing.space.md }}
      >
        <p
          className="text-text-muted"
          style={{ fontSize: fluidSizing.text.sm, lineHeight: '1.6' }}
        >
          <strong className="text-admin-primary">Requisitos de seguridad:</strong>
          <br />
          • Mínimo 8 caracteres
          <br />
          • Debe ser diferente a tu contraseña actual
          <br />
          • Debe contener al menos una letra mayúscula
          <br />
          • Debe contener al menos un número
        </p>
      </div>
    </form>
  );
}
