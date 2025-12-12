'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/contexts/AuthContext';
import { useAlerts } from '@/shared/hooks/useAlerts';
import { useLogger } from '@/shared/hooks/useLogger';
import Modal from '@/components/molecules/Modal';
import Input from '@/components/atoms/Input';
import Select from '@/components/molecules/Select';
import Icon from '@/components/atoms/Icon';
import Button from '@/components/atoms/Button';
import { fluidSizing } from '@/lib/fluidSizing';
import { api } from '@/lib/api-client';
import { alerts } from '@/lib/alerts';
import { logger } from '@/lib/logger';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ProfileData {
  name: string;
  availability: string;
  location: string;
  email: string;
  phone: string;
  githubUrl: string;
  linkedinUrl: string;
  twitterUrl: string;
  cvFileName: string;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'password'>('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingProfile, setIsFetchingProfile] = useState(false);

  // Profile form state
  const [profileData, setProfileData] = useState<ProfileData>({
    name: '',
    availability: 'available',
    location: '',
    email: '',
    phone: '',
    githubUrl: '',
    linkedinUrl: '',
    twitterUrl: '',
    cvFileName: '',
  });

  // CV file state
  const [cvFile, setCvFile] = useState<File | null>(null);

  // Password form state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Fetch profile data when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchProfile();
    }
  }, [isOpen]);

  const fetchProfile = async () => {
    try {
      setIsFetchingProfile(true);
      const response = await api.getProfile();
      
      if (response.success) {
        if (response.data) {
          const data = response.data as ProfileData;
          setProfileData({
            name: data.name || '',
            availability: data.availability || 'available',
            location: data.location || '',
            email: data.email || '',
            phone: data.phone || '',
            githubUrl: data.githubUrl || '',
            linkedinUrl: data.linkedinUrl || '',
            twitterUrl: data.twitterUrl || '',
            cvFileName: data.cvFileName || '',
          });
        } else {
          // No hay datos de perfil, mantener valores por defecto
          logger.info('No profile data found, using default values');
        }
      } else {
        const errorMessage = typeof response.error === 'string' 
          ? response.error 
          : response.error?.message || 'No se pudo cargar la información del perfil';
        alerts.error('Error', errorMessage);
        logger.error('Failed to fetch profile', response.error);
      }
    } catch (error) {
      logger.error('Error fetching profile', error);
      alerts.error('Error', 'No se pudo cargar la información del perfil');
    } finally {
      setIsFetchingProfile(false);
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones
    if (!profileData.name || !profileData.email || !profileData.location) {
      alerts.error('Error', 'Nombre, email y ubicación son obligatorios');
      return;
    }

    try {
      setIsLoading(true);
      
      // Prepare data with CV file if uploaded
      let dataToSend: Record<string, unknown> = { ...profileData };
      
      if (cvFile) {
        // Convert file to base64
        const reader = new FileReader();
        const base64Promise = new Promise<string>((resolve, reject) => {
          reader.onload = () => {
            const base64 = reader.result as string;
            // Remove data:application/pdf;base64, prefix
            const base64Data = base64.split(',')[1];
            resolve(base64Data);
          };
          reader.onerror = reject;
          reader.readAsDataURL(cvFile);
        });
        
        const cvData = await base64Promise;
        dataToSend = {
          ...dataToSend,
          cvData,
          cvFileName: cvFile.name,
          cvMimeType: cvFile.type,
        };
      }
      
      const response = await api.updateProfile(dataToSend);

      if (response.success) {
        alerts.success('Perfil actualizado', 'Los datos del perfil se actualizaron correctamente');
        handleClose();
      } else {
        const errorMessage = typeof response.error === 'string' 
          ? response.error 
          : response.error?.message || 'No se pudo actualizar el perfil';
        alerts.error('Error', errorMessage);
        logger.error('Failed to update profile', response.error);
      }
    } catch (error) {
      logger.error('Error updating profile', error);
      alerts.error('Error', 'Ocurrió un error al actualizar el perfil');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
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
            alerts.success('Contraseña actualizada', 'Tu contraseña ha sido cambiada exitosamente. Cerrando sesión...');
            handleClose();
            
            // Cerrar sesión correctamente
            setTimeout(async () => {
              await logout();
            }, 1500);
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
    setActiveTab('profile');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Configuración"
      maxWidth="2xl"
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
            onClick={activeTab === 'profile' ? handleProfileSubmit : handlePasswordSubmit}
            variant="primary"
            isLoading={isLoading}
            disabled={isLoading || isFetchingProfile}
            className="flex-1"
          >
            {activeTab === 'profile' ? 'Guardar Cambios' : 'Cambiar Contraseña'}
          </Button>
        </>
      }
    >
      <div>
        {/* Tabs */}
        <div 
          className="flex border-b border-admin-primary/10"
          style={{ gap: fluidSizing.space.sm, padding: `0 ${fluidSizing.space.lg}`, paddingTop: fluidSizing.space.md }}
        >
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center font-orbitron font-medium transition-all duration-200 relative group ${
              activeTab === 'profile'
                ? 'text-admin-primary'
                : 'text-text-muted hover:text-text-primary'
            }`}
            style={{ 
              gap: fluidSizing.space.xs, 
              fontSize: fluidSizing.text.sm,
              padding: `${fluidSizing.space.sm} ${fluidSizing.space.md}`,
              paddingBottom: fluidSizing.space.md
            }}
          >
            <Icon name="user" size={16} />
            <span>PERFIL</span>
            {activeTab === 'profile' && (
              <div 
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-admin-primary"
                style={{ boxShadow: '0 0 8px rgba(0, 191, 255, 0.6)' }}
              />
            )}
          </button>
          <button
            onClick={() => setActiveTab('password')}
            className={`flex items-center font-orbitron font-medium transition-all duration-200 relative group ${
              activeTab === 'password'
                ? 'text-admin-primary'
                : 'text-text-muted hover:text-text-primary'
            }`}
            style={{ 
              gap: fluidSizing.space.xs, 
              fontSize: fluidSizing.text.sm,
              padding: `${fluidSizing.space.sm} ${fluidSizing.space.md}`,
              paddingBottom: fluidSizing.space.md
            }}
          >
            <Icon name="lock" size={16} />
            <span>CONTRASEÑA</span>
            {activeTab === 'password' && (
              <div 
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-admin-primary"
                style={{ boxShadow: '0 0 8px rgba(0, 191, 255, 0.6)' }}
              />
            )}
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: fluidSizing.space.lg }}>
          {activeTab === 'profile' ? (
            <form onSubmit={handleProfileSubmit}>
              {isFetchingProfile ? (
                <div className="flex items-center justify-center" style={{ padding: fluidSizing.space['2xl'] }}>
                  <div className="animate-spin rounded-full border-4 border-admin-primary/20 border-t-admin-primary" style={{ width: '40px', height: '40px' }} />
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: fluidSizing.space.lg }}>
                  {/* Información básica */}
                  <div>
                    <h3 className="font-orbitron font-bold text-admin-primary mb-4" style={{ fontSize: fluidSizing.text.lg }}>
                      Información Básica
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: fluidSizing.space.md }}>
                      <Input
                        id="profile-name"
                        type="text"
                        label="Nombre"
                        value={profileData.name}
                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                        placeholder="Tu nombre completo"
                        required
                        disabled={isLoading}
                      />

                      <Input
                        id="profile-email"
                        type="email"
                        label="Email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                        placeholder="tu@email.com"
                        disabled={isLoading}
                        required
                      />

                      <Input
                        id="profile-phone"
                        type="tel"
                        label="Teléfono"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                        placeholder="+57 300 123 4567"
                        disabled={isLoading}
                      />

                      <Input
                        id="profile-location"
                        type="text"
                        label="Ubicación"
                        value={profileData.location}
                        onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                        placeholder="Ciudad, País"
                        required
                        disabled={isLoading}
                      />

                      <Select
                        label="Estado de Disponibilidad"
                        value={profileData.availability}
                        onChange={(value) => setProfileData({ ...profileData, availability: value })}
                        options={[
                          { value: 'available', label: 'Disponible' },
                          { value: 'busy', label: 'Ocupado' },
                          { value: 'unavailable', label: 'No disponible' },
                        ]}
                      />
                    </div>
                  </div>

                  {/* Redes sociales */}
                  <div>
                    <h3 className="font-orbitron font-bold text-admin-primary mb-4" style={{ fontSize: fluidSizing.text.lg }}>
                      Redes Sociales
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: fluidSizing.space.md }}>
                      <Input
                        id="profile-github"
                        type="url"
                        label="GitHub URL"
                        value={profileData.githubUrl}
                        onChange={(e) => setProfileData({ ...profileData, githubUrl: e.target.value })}
                        placeholder="https://github.com/usuario"
                        disabled={isLoading}
                      />

                      <Input
                        id="profile-linkedin"
                        type="url"
                        label="LinkedIn URL"
                        value={profileData.linkedinUrl}
                        onChange={(e) => setProfileData({ ...profileData, linkedinUrl: e.target.value })}
                        placeholder="https://linkedin.com/in/usuario"
                        disabled={isLoading}
                      />

                      <Input
                        id="profile-twitter"
                        type="url"
                        label="Twitter/X URL"
                        value={profileData.twitterUrl}
                        onChange={(e) => setProfileData({ ...profileData, twitterUrl: e.target.value })}
                        placeholder="https://twitter.com/usuario"
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  {/* Hoja de Vida / CV */}
                  <div>
                    <h3 className="font-orbitron font-bold text-admin-primary mb-4" style={{ fontSize: fluidSizing.text.lg }}>
                      Hoja de Vida / CV
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: fluidSizing.space.md }}>
                      {/* Show file input only when no CV exists */}
                      {!profileData.cvFileName && (
                        <div>
                          <label htmlFor="profile-cv-file" className="block font-medium text-admin-gray-light mb-2" style={{ fontSize: fluidSizing.text.sm }}>
                            Archivo PDF
                          </label>
                          <input
                            id="profile-cv-file"
                            type="file"
                            accept=".pdf,application/pdf"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                if (file.type !== 'application/pdf') {
                                  alerts.error('Error', 'Solo se permiten archivos PDF');
                                  e.target.value = '';
                                  return;
                                }
                                if (file.size > 5 * 1024 * 1024) { // 5MB limit
                                  alerts.error('Error', 'El archivo no debe superar 5MB');
                                  e.target.value = '';
                                  return;
                                }
                                setCvFile(file);
                                setProfileData({ ...profileData, cvFileName: file.name });
                              }
                            }}
                            disabled={isLoading}
                            className="w-full bg-admin-dark-elevated border border-admin-gray-dark rounded-lg text-admin-primary file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-admin-primary file:text-black hover:file:bg-admin-primary/80 focus:outline-none focus:ring-2 focus:ring-admin-primary/50 transition-all duration-200"
                            style={{ padding: fluidSizing.space.sm }}
                          />
                          <p className="text-text-muted mt-2" style={{ fontSize: fluidSizing.text.xs }}>
                            Selecciona un archivo PDF (máx. 5MB)
                          </p>
                        </div>
                      )}

                      {/* Show current CV info with action icons when CV exists */}
                      {profileData.cvFileName && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: fluidSizing.space.md }}>
                          <p className="text-text-muted flex-1" style={{ fontSize: fluidSizing.text.sm }}>
                            Archivo actual: <span className="text-admin-primary font-semibold">{profileData.cvFileName}</span>
                          </p>
                          <div style={{ display: 'flex', gap: fluidSizing.space.sm, alignItems: 'center' }}>
                            {/* Download icon */}
                            <button
                              type="button"
                              onClick={async () => {
                                try {
                                  const fileName = profileData.cvFileName || 'CV.pdf';
                                  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
                                  const response = await fetch(`${apiUrl}/api/admin/cv/${encodeURIComponent(fileName)}`, {
                                    credentials: 'include',
                                  });
                                  if (!response.ok) {
                                    throw new Error('CV not found');
                                  }
                                  const blob = await response.blob();
                                  const url = window.URL.createObjectURL(blob);
                                  const link = document.createElement('a');
                                  link.href = url;
                                  link.download = fileName;
                                  document.body.appendChild(link);
                                  link.click();
                                  document.body.removeChild(link);
                                  window.URL.revokeObjectURL(url);
                                  alerts.success('Descarga iniciada', 'El CV se está descargando');
                                } catch (error) {
                                  logger.error('Error downloading CV', error);
                                  alerts.error('Error', 'No se pudo descargar el CV');
                                }
                              }}
                              disabled={isLoading}
                              className="text-admin-primary hover:text-admin-primary/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Descargar CV"
                            >
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                                <polyline points="7 10 12 15 17 10"/>
                                <line x1="12" y1="15" x2="12" y2="3"/>
                              </svg>
                            </button>
                            {/* Delete icon */}
                            <button
                              type="button"
                              onClick={async () => {
                                if (!confirm('¿Estás seguro de que deseas eliminar el CV?')) {
                                  return;
                                }
                                try {
                                  setIsLoading(true);
                                  const response = await api.updateProfile({
                                    ...profileData,
                                    cvData: null,
                                    cvFileName: null,
                                    cvMimeType: null,
                                  });
                                  if (response.success) {
                                    setProfileData({ ...profileData, cvFileName: '' });
                                    setCvFile(null);
                                    alerts.success('CV eliminado', 'El CV se eliminó correctamente');
                                  } else {
                                    throw new Error('Failed to delete CV');
                                  }
                                } catch (error) {
                                  logger.error('Error deleting CV', error);
                                  alerts.error('Error', 'No se pudo eliminar el CV');
                                } finally {
                                  setIsLoading(false);
                                }
                              }}
                              disabled={isLoading}
                              className="text-red-500 hover:text-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Eliminar CV"
                            >
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
                                <polyline points="3 6 5 6 21 6"/>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                                <line x1="10" y1="11" x2="10" y2="17"/>
                                <line x1="14" y1="11" x2="14" y2="17"/>
                              </svg>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </form>
          ) : (
            <form onSubmit={handlePasswordSubmit}>
              {/* Campo de username oculto para accesibilidad */}
              <input
                type="text"
                name="username"
                autoComplete="username"
                style={{ display: 'none' }}
                aria-hidden="true"
                tabIndex={-1}
              />
              
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
                  autoComplete="current-password"
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
                  autoComplete="new-password"
                />

                {/* Confirmar contraseña */}
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
          )}
        </div>
      </div>
    </Modal>
  );
}
