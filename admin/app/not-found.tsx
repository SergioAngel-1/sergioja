'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { fluidSizing } from '@/lib/fluidSizing';
import Icon from '@/components/atoms/Icon';

export default function NotFound() {
  return (
    <div className="relative w-full min-h-screen bg-admin-dark overflow-hidden flex items-center justify-center">
      {/* Cyber grid background */}
      <div className="absolute inset-0 cyber-grid opacity-10 z-0" />

      {/* Animated glow effects */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.15, scale: 1 }}
        transition={{ duration: 4, repeat: Infinity, repeatType: 'reverse' }}
        className="absolute top-1/3 right-1/3 w-64 h-64 md:w-96 md:h-96 bg-admin-primary rounded-full blur-[120px]"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.1, scale: 1 }}
        transition={{ duration: 5, repeat: Infinity, repeatType: 'reverse', delay: 1 }}
        className="absolute bottom-1/3 left-1/3 w-64 h-64 md:w-96 md:h-96 bg-admin-primary rounded-full blur-[120px]"
      />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* 404 Number with glitch effect */}
          <motion.h1
            className="font-orbitron font-black mb-6 text-transparent bg-clip-text bg-gradient-to-r from-admin-primary via-white to-admin-primary text-glow-primary"
            style={{ fontSize: 'clamp(6rem, 20vw, 12rem)' }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            404
          </motion.h1>

          {/* Error icon */}
          <motion.div
            className="flex justify-center mb-6"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <div className="p-4 bg-admin-primary/10 border border-admin-primary/30 rounded-full">
              <Icon name="alert-triangle" size={48} className="text-admin-primary" />
            </div>
          </motion.div>

          {/* Error message */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <h2 
              className="font-orbitron font-bold mb-4 text-white"
              style={{ fontSize: fluidSizing.text['3xl'] }}
            >
              PÁGINA NO ENCONTRADA
            </h2>
            <p 
              className="text-admin-gray-light max-w-2xl mx-auto"
              style={{ fontSize: fluidSizing.text.lg }}
            >
              La página que buscas no existe o ha sido movida. Verifica la URL o regresa al dashboard.
            </p>
          </motion.div>

          {/* Glitch lines decoration */}
          <motion.div
            className="flex justify-center gap-2 mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="h-1 bg-admin-primary"
                style={{ width: `${Math.random() * 60 + 20}px` }}
                animate={{
                  opacity: [0.3, 1, 0.3],
                  scaleX: [1, 1.2, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </motion.div>

          {/* Navigation buttons */}
          <motion.div
            className="flex flex-col sm:flex-row justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <Link href="/dashboard">
              <motion.button
                className="px-8 py-4 bg-admin-primary hover:bg-admin-primary-hover text-admin-dark font-orbitron font-bold rounded-lg transition-all duration-300"
                style={{ fontSize: fluidSizing.text.base }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="flex items-center gap-2">
                  <Icon name="home" size={20} />
                  IR AL DASHBOARD
                </span>
              </motion.button>
            </Link>

            <Link href="/login">
              <motion.button
                className="px-8 py-4 bg-admin-dark-elevated hover:bg-admin-dark-surface border-2 border-admin-primary/30 hover:border-admin-primary/50 text-admin-primary font-orbitron font-bold rounded-lg transition-all duration-300"
                style={{ fontSize: fluidSizing.text.base }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="flex items-center gap-2">
                  <Icon name="log-in" size={20} />
                  INICIAR SESIÓN
                </span>
              </motion.button>
            </Link>
          </motion.div>

          {/* Additional info */}
          <motion.p
            className="mt-12 text-admin-gray-medium font-mono"
            style={{ fontSize: fluidSizing.text.sm }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
          >
            ERROR CODE: <span className="text-admin-primary">404</span> | STATUS: <span className="text-admin-primary">NOT_FOUND</span>
          </motion.p>
        </motion.div>
      </div>

      {/* Animated particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-admin-primary rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
    </div>
  );
}
