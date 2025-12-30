'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function OfflinePage() {
  const router = useRouter();
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setTimeout(() => {
        router.back();
      }, 1000);
    };

    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-light p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        {isOnline ? (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-500/20 flex items-center justify-center"
            >
              <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </motion.div>
            <h1 className="font-orbitron font-bold text-2xl text-text-primary mb-2">
              ¡Conexión Restaurada!
            </h1>
            <p className="text-text-muted">
              Volviendo a la página anterior...
            </p>
          </>
        ) : (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="w-20 h-20 mx-auto mb-6 rounded-full border-4 border-accent-primary border-t-transparent"
            />
            <h1 className="font-orbitron font-bold text-3xl text-text-primary mb-4">
              Sin Conexión
            </h1>
            <p className="text-text-muted mb-6">
              Parece que no tienes conexión a internet. Verifica tu conexión e intenta nuevamente.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-accent-primary text-background-dark font-rajdhani font-bold rounded-lg hover:bg-accent-secondary transition-colors"
            >
              Reintentar
            </button>
          </>
        )}
      </motion.div>
    </div>
  );
}
