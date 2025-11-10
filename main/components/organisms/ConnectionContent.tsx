'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { api } from '@/lib/api-client';
import type { ContactMessage } from '@/lib/types';
import { fluidSizing } from '@/lib/fluidSizing';
import { alerts } from '../../../shared/alertSystem';

export default function ConnectionContent() {
  const [formData, setFormData] = useState<ContactMessage>({
    name: '',
    email: '',
    subject: 'Contacto desde landing',
    message: ''
  });
  const [consoleHistory, setConsoleHistory] = useState<string[]>([
    '> Sistema de conexión iniciado...',
    '> Esperando tu mensaje...'
  ]);
  const [sending, setSending] = useState(false);

  const handleConsoleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.message.trim() || !formData.name.trim() || !formData.email.trim()) {
      setConsoleHistory(prev => [
        ...prev,
        '> Error: Por favor completa nombre, email y mensaje'
      ]);
      
      // Mostrar alerta de validación
      alerts.warning(
        'Campos incompletos',
        'Por favor completa nombre, email y mensaje',
        4000
      );
      return;
    }

    setSending(true);
    setConsoleHistory(prev => [
      ...prev,
      `> Enviando mensaje de ${formData.name}...`
    ]);

    // Mostrar alerta de procesamiento
    const processingId = alerts.processing(
      'Enviando mensaje...',
      'Conectando con el servidor'
    );

    try {
      const response = await api.submitContact(formData);
      
      // Dismissar alerta de procesamiento
      alerts.dismiss(processingId);
      
      if (response.success) {
        setConsoleHistory(prev => [
          ...prev,
          '> ✓ Mensaje enviado correctamente',
          '> Te responderé pronto. Gracias por conectar.'
        ]);
        setFormData({
          name: '',
          email: '',
          subject: 'Contacto desde landing',
          message: ''
        });
        
        // Mostrar alerta de éxito
        alerts.success(
          '¡Mensaje enviado!',
          'Recibirás una confirmación por email. Te responderé pronto.',
          8000
        );
      } else {
        const errorMsg = response.error?.message || 'No se pudo enviar el mensaje';
        setConsoleHistory(prev => [
          ...prev,
          `> ✗ Error: ${errorMsg}`,
          '> Intenta de nuevo o contáctame por email directo'
        ]);
        
        // Mostrar alerta de error
        alerts.error(
          'Error al enviar',
          errorMsg,
          6000
        );
      }
    } catch (error) {
      // Dismissar alerta de procesamiento
      alerts.dismiss(processingId);
      
      setConsoleHistory(prev => [
        ...prev,
        '> ✗ Error de red. Verifica tu conexión',
        '> O contáctame directamente por email'
      ]);
      
      // Mostrar alerta de error de red
      alerts.error(
        'Error de conexión',
        'No se pudo conectar con el servidor. Verifica tu conexión a internet.',
        6000
      );
    } finally {
      setSending(false);
    }
  };

  const connections = [
    {
      platform: 'GitHub',
      handle: '@SergioJA',
      description: 'Código y proyectos',
      icon: (
        <svg className="size-icon-md" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
      )
    },
    {
      platform: 'LinkedIn',
      handle: 'Sergio Jáuregui',
      description: 'Red profesional',
      icon: (
        <svg className="size-icon-md" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      )
    },
    {
      platform: 'Email',
      handle: 'sergio@example.com',
      description: 'Contacto directo',
      icon: (
        <svg className="size-icon-md" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: fluidSizing.space.lg }}>
      {/* Llamado a conectar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ display: 'flex', flexDirection: 'column', gap: fluidSizing.space.md }}
      >
        <h3 className="text-white font-bold text-fluid-sm">
          Busco aprender de otros creadores, ingenieros y diseñadores
        </h3>
        <p className="text-white/70 leading-relaxed text-fluid-xs">
          Si tienes ideas, proyectos o simplemente quieres intercambiar perspectivas sobre tecnología y diseño, 
          conectemos.
        </p>
        <div className="h-px bg-gradient-to-r from-white/30 via-white/10 to-transparent" />
      </motion.div>

      {/* Plataformas de conexión */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        style={{ display: 'flex', flexDirection: 'column', gap: fluidSizing.space.sm }}
      >
        {connections.map((connection, index) => (
          <a
            key={index}
            href="#"
            className="group flex items-center rounded-lg border border-white/10 hover:border-white/30 hover:bg-white/5 transition-all duration-300"
            style={{ gap: fluidSizing.space.md, padding: fluidSizing.space.md }}
          >
            <div className="rounded-lg bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors text-white" style={{ width: fluidSizing.size.buttonMd, height: fluidSizing.size.buttonMd }}>
              {connection.icon}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-white font-medium text-fluid-sm">{connection.platform}</h4>
              <p className="text-white/60 truncate text-fluid-xs">{connection.handle}</p>
            </div>
            <div className="text-white/40 group-hover:text-white/60 transition-colors">
              <svg className="size-icon-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </a>
        ))}
      </motion.div>

      {/* Formulario de contacto */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        style={{ display: 'flex', flexDirection: 'column', gap: fluidSizing.space.md }}
      >
        <h4 className="text-white/80 font-mono text-fluid-xs">$ contact.send()</h4>
        
        {/* Form */}
        <form onSubmit={handleConsoleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: fluidSizing.space.md }}>
          <div className="grid grid-cols-2" style={{ gap: fluidSizing.space.sm }}>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Nombre"
              className="bg-black/40 border border-white/20 rounded text-white font-mono outline-none focus:border-white/40 placeholder:text-white/30 text-fluid-xs"
              style={{ padding: `${fluidSizing.space.sm} ${fluidSizing.space.md}` }}
              required
            />
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="Email"
              className="bg-black/40 border border-white/20 rounded text-white font-mono outline-none focus:border-white/40 placeholder:text-white/30 text-fluid-xs"
              style={{ padding: `${fluidSizing.space.sm} ${fluidSizing.space.md}` }}
              required
            />
          </div>
          
          <textarea
            value={formData.message}
            onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
            placeholder="Tu mensaje..."
            rows={3}
            className="w-full bg-black/40 border border-white/20 rounded text-white font-mono outline-none focus:border-white/40 placeholder:text-white/30 resize-none text-fluid-xs"
            style={{ padding: `${fluidSizing.space.sm} ${fluidSizing.space.md}` }}
            required
          />

          <button
            type="submit"
            disabled={sending}
            className="w-full bg-white/10 hover:bg-white/20 disabled:bg-white/5 border border-white/20 rounded text-white font-mono transition-colors disabled:cursor-not-allowed text-fluid-xs"
            style={{ padding: `${fluidSizing.space.sm} ${fluidSizing.space.md}` }}
          >
            {sending ? '[ENVIANDO...]' : '[ENVIAR MENSAJE]'}
          </button>
        </form>

        {/* Console output */}
        {consoleHistory.length > 2 && (
          <div className="bg-black/40 rounded-lg border border-white/20" style={{ padding: fluidSizing.space.md }}>
            <div className="max-h-20 overflow-y-auto font-mono text-fluid-xs" style={{ display: 'flex', flexDirection: 'column', gap: fluidSizing.space.xs }}>
              {consoleHistory.slice(-4).map((line, index) => (
                <div 
                  key={index} 
                  className={line.includes('✓') ? 'text-green-400' : line.includes('✗') ? 'text-red-400' : 'text-white/60'}
                >
                  {line}
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
