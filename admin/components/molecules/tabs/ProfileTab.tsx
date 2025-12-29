'use client';

import { useState } from 'react';
import Input from '@/components/atoms/Input';
import Select from '@/components/molecules/Select';
import { fluidSizing } from '@/lib/fluidSizing';
import { alerts } from '@/lib/alerts';
import { logger } from '@/lib/logger';
import { api } from '@/lib/api-client';

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

interface ProfileTabProps {
  profileData: ProfileData;
  setProfileData: (data: ProfileData) => void;
  isLoading: boolean;
  isFetchingProfile: boolean;
  cvFile: File | null;
  setCvFile: (file: File | null) => void;
  onSubmit?: (e: React.FormEvent) => void;
}

export default function ProfileTab({
  profileData,
  setProfileData,
  isLoading,
  isFetchingProfile,
  cvFile,
  setCvFile,
  onSubmit,
}: ProfileTabProps) {
  if (isFetchingProfile) {
    return (
      <div className="flex items-center justify-center" style={{ padding: fluidSizing.space['2xl'] }}>
        <div className="animate-spin rounded-full border-4 border-admin-primary/20 border-t-admin-primary" style={{ width: '40px', height: '40px' }} />
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: fluidSizing.space.lg }}>
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
                    if (file.size > 5 * 1024 * 1024) {
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

          {profileData.cvFileName && (
            <div style={{ display: 'flex', alignItems: 'center', gap: fluidSizing.space.md }}>
              <p className="text-text-muted flex-1" style={{ fontSize: fluidSizing.text.sm }}>
                Archivo actual: <span className="text-admin-primary font-semibold">{profileData.cvFileName}</span>
              </p>
              <div style={{ display: 'flex', gap: fluidSizing.space.sm, alignItems: 'center' }}>
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      const fileName = profileData.cvFileName || 'CV.pdf';
                      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
                      const response = await fetch(`${apiUrl}/api/admin/cv/${encodeURIComponent(fileName)}`, {
                        credentials: 'include',
                      });
                      if (!response.ok) throw new Error('CV not found');
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
                <button
                  type="button"
                  onClick={async () => {
                    if (!confirm('¿Estás seguro de que deseas eliminar el CV?')) return;
                    try {
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
    </form>
  );
}
