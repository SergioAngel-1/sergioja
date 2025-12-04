'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/contexts/AuthContext';
import { alerts } from '@/shared/alertSystem';
import Button from '@/components/atoms/Button';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        alerts.success('Inicio de sesión exitoso', 'Redirigiendo al dashboard...');
        router.push('/dashboard');
      } else {
        alerts.error('Error de autenticación', 'Credenciales inválidas');
      }
    } catch (error) {
      alerts.error('Error', 'Ocurrió un error al iniciar sesión');
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
        className="relative z-10 w-full max-w-md px-6"
      >
        <div className="bg-admin-dark-elevated border border-admin-primary/30 rounded-lg p-8 shadow-2xl glow-red">
          {/* Logo/Title */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-orbitron font-bold text-admin-primary text-glow-red mb-2">
              ADMIN
            </h1>
            <p className="text-text-secondary">Panel de Administración</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-text-secondary mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                className="w-full"
                placeholder="admin@sergioja.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-text-secondary mb-2">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                className="w-full"
                placeholder="••••••••"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-admin-primary hover:bg-admin-primary/80 text-white font-medium py-3 rounded-lg transition-all duration-200 glow-red"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <span className="inline-block animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></span>
                  Iniciando sesión...
                </span>
              ) : (
                'Iniciar Sesión'
              )}
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center text-sm text-text-muted">
            <p>Acceso restringido solo para administradores</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
