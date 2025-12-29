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
import ProfileTab from '@/components/molecules/tabs/ProfileTab';
import PasswordTab from '@/components/molecules/tabs/PasswordTab';
import RedirectsTab from '@/components/molecules/tabs/RedirectsTab';
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
  const [activeTab, setActiveTab] = useState<'profile' | 'password' | 'redirects'>('profile');
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

  // Custom redirects state
  const [customRedirects, setCustomRedirects] = useState<any[]>([]);

  // Fetch profile data when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchProfile();
    }
  }, [isOpen]);

  // Fetch custom redirects when redirects tab is active
  useEffect(() => {
    if (isOpen && activeTab === 'redirects') {
      fetchCustomRedirects();
    }
  }, [isOpen, activeTab]);

  const fetchCustomRedirects = async () => {
    try {
      const response = await api.getRedirects();
      if (response.success && response.data) {
        const data = response.data as any;
        setCustomRedirects(data.custom || []);
      }
    } catch (error) {
      logger.error('Error fetching custom redirects', error);
    }
  };

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
            onClick={
              activeTab === 'profile'
                ? handleProfileSubmit
                : activeTab === 'password'
                  ? handlePasswordSubmit
                  : undefined
            }
            variant="primary"
            isLoading={isLoading}
            disabled={isLoading || isFetchingProfile}
            className="flex-1"
          >
            {activeTab === 'profile'
              ? 'Guardar Cambios'
              : activeTab === 'password'
                ? 'Cambiar Contraseña'
                : 'Crear redirección'}
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
          <button
            onClick={() => setActiveTab('redirects')}
            className={`flex items-center font-orbitron font-medium transition-all duration-200 relative group ${
              activeTab === 'redirects'
                ? 'text-admin-primary'
                : 'text-text-muted hover:text-text-primary'
            }`}
            style={{ 
              gap: fluidSizing.space.xs, 
              fontSize: fluidSizing.text.sm,
              padding: `${fluidSizing.space.sm} ${fluidSizing.space.md}`,
              paddingBottom: fluidSizing.space.md,
            }}
          >
            <Icon name="link" size={16} />
            <span>REDIRECCIONES</span>
            {activeTab === 'redirects' && (
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
            <ProfileTab
              profileData={profileData}
              setProfileData={setProfileData}
              isLoading={isLoading}
              isFetchingProfile={isFetchingProfile}
              cvFile={cvFile}
              setCvFile={setCvFile}
              onSubmit={(e) => {
                e.preventDefault();
                handleProfileSubmit(e);
              }}
            />
          ) : activeTab === 'password' ? (
            <PasswordTab
              currentPassword={currentPassword}
              setCurrentPassword={setCurrentPassword}
              newPassword={newPassword}
              setNewPassword={setNewPassword}
              confirmPassword={confirmPassword}
              setConfirmPassword={setConfirmPassword}
              isLoading={isLoading}
              onSubmit={(e) => {
                e.preventDefault();
                handlePasswordSubmit(e);
              }}
            />
          ) : (
            <RedirectsTab customRedirects={customRedirects} />
          )}
        </div>
      </div>
    </Modal>
  );
}