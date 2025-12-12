'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { clamp, fluidSizing } from '@/lib/fluidSizing';
import Button from '@/components/atoms/Button';
import { useAuth } from '@/lib/contexts/AuthContext';

export default function NotFound() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="relative w-full min-h-screen bg-admin-dark flex items-center justify-center">
      {/* Cyber grid background - estático */}
      <div className="absolute inset-0 cyber-grid opacity-5 z-0" />

      {/* Content */}
      <div 
        className="relative z-10 max-w-4xl mx-auto text-center"
        style={{ padding: `${fluidSizing.space.md} ${fluidSizing.space.lg}` }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* 404 Number */}
          <h1
            className="font-orbitron font-black text-white"
            style={{ 
              fontSize: clamp('6rem', '20vw', '12rem'),
              lineHeight: '1',
              marginBottom: fluidSizing.space.xl 
            }}
          >
            404
          </h1>

          {/* Error message */}
          <div style={{ marginBottom: fluidSizing.space['2xl'] }}>
            <h2 
              className="font-orbitron font-bold text-white"
              style={{ 
                fontSize: fluidSizing.text['3xl'],
                marginBottom: fluidSizing.space.md 
              }}
            >
              PÁGINA NO ENCONTRADA
            </h2>
            <p 
              className="text-admin-gray-light max-w-2xl mx-auto"
              style={{ fontSize: fluidSizing.text.lg }}
            >
              La página que buscas no existe o ha sido movida. Verifica la URL o regresa al dashboard.
            </p>
          </div>

          {/* Decorative line */}
          <div 
            className="flex justify-center"
            style={{ 
              gap: fluidSizing.space.xs,
              marginBottom: fluidSizing.space['2xl'] 
            }}
          >
            <div className="h-1 w-16 bg-admin-primary/50" />
            <div className="h-1 w-8 bg-admin-primary/30" />
            <div className="h-1 w-24 bg-admin-primary/50" />
            <div className="h-1 w-12 bg-admin-primary/30" />
            <div className="h-1 w-16 bg-admin-primary/50" />
          </div>

          {/* Navigation buttons */}
          <div 
            className="flex flex-col sm:flex-row justify-center"
            style={{ gap: fluidSizing.space.md }}
          >
            {isAuthenticated ? (
              <Link href="/dashboard">
                <Button variant="primary" size="lg" fullWidth>
                  IR AL DASHBOARD
                </Button>
              </Link>
            ) : (
              <Link href="/login">
                <Button variant="primary" size="lg" fullWidth>
                  INICIAR SESIÓN
                </Button>
              </Link>
            )}
          </div>

          {/* Additional info */}
          <p
            className="text-admin-gray-medium font-mono"
            style={{ 
              fontSize: fluidSizing.text.sm,
              marginTop: fluidSizing.space['2xl'] 
            }}
          >
            ERROR CODE: <span className="text-admin-primary">404</span> | STATUS: <span className="text-admin-primary">NOT_FOUND</span>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
