'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/contexts/AuthContext';
import { alerts } from '@/lib/alerts';
import { fluidSizing } from '@/lib/fluidSizing';
import { getReCaptchaToken, loadRecaptchaEnterprise, RECAPTCHA_ACTIONS } from '@/lib/recaptcha';
import { trackLoginSuccess, trackLoginFailed, trackLoginError } from '@/lib/analytics';
import { usePageAnalytics } from '@/lib/hooks/usePageAnalytics';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Track scroll depth and time on page
  usePageAnalytics();

  // Cargar reCAPTCHA Enterprise en producción
  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '';
      if (siteKey) {
        loadRecaptchaEnterprise(siteKey).catch(() => {
          // Silenciar error, reCAPTCHA es opcional en desarrollo
        });
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Obtener token de reCAPTCHA Enterprise en producción
      let recaptchaToken: string | null = null;
      if (process.env.NODE_ENV === 'production') {
        const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '';
        if (siteKey) {
          recaptchaToken = await getReCaptchaToken(siteKey, RECAPTCHA_ACTIONS.LOGIN);
          
          if (!recaptchaToken) {
            alerts.error('Error de seguridad', 'No se pudo verificar reCAPTCHA. Intenta de nuevo.');
            setIsLoading(false);
            return;
          }
        }
      }

      // Intentar login
      const success = await login(email, password);
      
      if (success) {
        alerts.success('Inicio de sesión exitoso', 'Redirigiendo al dashboard...');
        trackLoginSuccess('email');
        router.push('/dashboard');
      } else {
        alerts.error('Error de autenticación', 'Credenciales inválidas');
        trackLoginFailed('invalid_credentials', 'email');
      }
    } catch (error) {
      console.error('Login error:', error);
      alerts.error('Error', 'Ocurrió un error al iniciar sesión');
      trackLoginError('network_error', 'email');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-viewport bg-admin-dark relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 cyber-grid opacity-10 z-0" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
        style={{
          padding: fluidSizing.space.lg,
        }}
      >
        <div 
          className="bg-admin-dark-elevated border border-admin-primary/30 rounded-lg shadow-2xl glow-white"
          style={{
            padding: fluidSizing.space.xl,
          }}
        >
          {/* Logo/Title */}
          <div 
            className="text-center"
            style={{
              marginBottom: fluidSizing.space.xl,
            }}
          >
            <h1 
              className="font-orbitron font-bold text-admin-primary text-glow-white"
              style={{
                fontSize: fluidSizing.text['4xl'],
                marginBottom: fluidSizing.space.sm,
              }}
            >
              ADMIN
            </h1>
            <p 
              className="text-admin-gray-light"
              style={{
                fontSize: fluidSizing.text.base,
              }}
            >
              Panel de Administración
            </p>
          </div>

          {/* Login Form */}
          <form 
            onSubmit={handleSubmit}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: fluidSizing.space.lg,
            }}
          >
            <Input
              id="email"
              type="email"
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              placeholder="admin@sergioja.com"
              size="md"
            />

            <Input
              id="password"
              type="password"
              label="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              placeholder="••••••••"
              size="md"
            />

            <Button
              type="submit"
              disabled={isLoading}
              isLoading={isLoading}
              className="w-full"
              style={{
                fontSize: fluidSizing.text.base,
                padding: `${fluidSizing.space.md} ${fluidSizing.space.lg}`,
              }}
            >
              Iniciar Sesión
            </Button>
          </form>

          {/* Footer */}
          <div 
            className="text-center text-admin-gray-medium"
            style={{
              marginTop: fluidSizing.space.lg,
              fontSize: fluidSizing.text.sm,
            }}
          >
            <p>Acceso restringido solo para administradores</p>
          </div>

          {/* reCAPTCHA disclaimer */}
          <p 
            className="text-center text-admin-gray-medium/50 font-mono leading-relaxed"
            style={{
              marginTop: fluidSizing.space.md,
              fontSize: fluidSizing.text.xs,
            }}
          >
            Este sitio está protegido por reCAPTCHA y se aplican la{' '}
            <a 
              href="https://policies.google.com/privacy" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-admin-gray-light hover:text-admin-primary underline transition-colors"
            >
              Política de Privacidad
            </a>
            {' '}y los{' '}
            <a 
              href="https://policies.google.com/terms" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-admin-gray-light hover:text-admin-primary underline transition-colors"
            >
              Términos de Servicio
            </a>
            {' '}de Google.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
