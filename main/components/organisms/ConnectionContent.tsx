'use client';

import { motion } from 'framer-motion';
import { useState, useRef, useCallback, useEffect } from 'react';
import { api } from '@/lib/api-client';
import type { ContactMessage, ContactSubmissionPayload } from '@/lib/types';
import { fluidSizing } from '@/lib/fluidSizing';
import { alerts } from '@/shared/alertSystem';
import { validateContactForm, sanitizeContactForm } from '@/shared/formValidations';
import { getReCaptchaToken, loadRecaptchaEnterprise } from '@/shared/recaptchaHelpers';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { useLogger } from '@/shared/hooks/useLogger';
import { trackContactSubmit, trackOutboundLink } from '@/lib/analytics';


export default function ConnectionContent() {
  const log = useLogger('ConnectionContent');
  const [formData, setFormData] = useState<ContactMessage>({
    name: '',
    email: '',
    subject: 'Contacto desde landing',
    message: ''
  });
  const [consoleHistory, setConsoleHistory] = useState<string[]>([]);
  const [sending, setSending] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const { t, language } = useLanguage();

  // Inicializar consola con traducciones
  const initConsole = useCallback(() => {
    setConsoleHistory([
      t('connection.consoleInit'),
      t('connection.consoleWaiting')
    ]);
  }, [t]);

  // Inicializar al montar
  useEffect(() => {
    initConsole();
  }, [initConsole]);

  // Función para limpiar errores cuando el usuario modifica los campos
  const handleInputChange = useCallback((field: keyof ContactMessage, value: string) => {
    // SIEMPRE limpiar mensajes de error del historial cuando el usuario escribe
    initConsole();
    
    setFormData(prev => ({ ...prev, [field]: value }));
  }, [initConsole]);


  const handleConsoleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    log.interaction('contact_submit_click', 'connection_form');
    
    // Validar formulario con traducciones
    const validation = validateContactForm(formData, t);
    if (!validation.isValid) {
      const firstError = Object.values(validation.errors)[0];
      setConsoleHistory(prev => [
        ...prev,
        `> Error: ${firstError}`
      ]);
      log.warn('contact_validation_error', { firstError });
      // Mostrar alerta visual
      alerts.error(
        t('alerts.validationError'),
        firstError || t('alerts.checkForm'),
        6000
      );
      
      // Scroll automático al formulario (sin alerta del sistema, solo consola)
      setTimeout(() => {
        formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
      
      return;
    }

    setSending(true);
    log.info('contact_submit_start');
    
    // Cargar script de reCAPTCHA Enterprise bajo demanda y obtener token (solo en producción)
    let recaptchaToken: string | null | undefined = undefined;
    const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '';
    
    if (siteKey && process.env.NODE_ENV === 'production') {
      try { await loadRecaptchaEnterprise(siteKey); } catch {}
      recaptchaToken = await getReCaptchaToken(siteKey, 'submit_contact');
      
      if (!recaptchaToken) {
        setConsoleHistory(prev => [
          ...prev,
          `> Error: ${t('contact.recaptchaRequired')}`
        ]);
        alerts.error(
          t('alerts.sendError'),
          t('contact.recaptchaRequired'),
          6000
        );
        setSending(false);
        log.error('recaptcha_token_missing');
        return;
      }
    }
    setConsoleHistory(prev => [
      ...prev,
      `${t('connection.consoleSending')} ${formData.name}...`
    ]);

    // Sanitizar datos antes de enviar
    const sanitizedData = sanitizeContactForm(formData);

    try {
      const payload: ContactSubmissionPayload = {
        ...sanitizedData,
        recaptchaToken: recaptchaToken || undefined,
        recaptchaAction: 'submit_contact',
      };
      const response = await api.submitContact(payload);
      
      if (response.success) {
        setConsoleHistory(prev => [
          ...prev,
          t('connection.consoleSuccess'),
          t('connection.consoleSuccessMsg')
        ]);
        setFormData({
          name: '',
          email: '',
          subject: 'Contacto desde landing',
          message: ''
        });
        log.info('contact_submit_success');
        
        // Mostrar alerta de éxito
        alerts.success(
          t('alerts.messageSent'),
          t('alerts.messageSentDesc'),
          8000
        );
        trackContactSubmit('landing_contact');
      } else {
        const errorMsg = response.error?.message || t('contact.error');
        setConsoleHistory(prev => [
          ...prev,
          `${t('connection.consoleError')} ${errorMsg}`,
          t('connection.consoleErrorRetry')
        ]);
        log.error('contact_submit_failed', { message: errorMsg, code: response.error?.code });
        
        // Mostrar alerta de error
        alerts.error(
          t('alerts.sendError'),
          errorMsg,
          6000
        );
      }
    } catch (error) {
      setConsoleHistory(prev => [
        ...prev,
        t('connection.consoleNetError'),
        t('connection.consoleNetErrorMsg')
      ]);
      log.error('contact_submit_network_error', error as any);
      
      // Mostrar alerta de error de red
      alerts.error(
        t('alerts.connectionError'),
        t('alerts.connectionErrorDesc'),
        6000
      );
    } finally {
      setSending(false);
      log.info('contact_submit_end');
    }
  };

  const connections = [
    {
      platform: t('connection.emailLabel'),
      handle: t('connection.emailHandle'),
      description: t('connection.emailDesc'),
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
        <h3 className="text-white font-bold text-fluid-lg">
          {t('connection.title')}
        </h3>
        <p className="text-white/70 leading-relaxed text-fluid-sm">
          {t('connection.subtitle')}
        </p>
        <div className="h-px bg-gradient-to-r from-white/30 via-white/10 to-transparent" />
      </motion.div>

      {/* Formulario de contacto */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        style={{ display: 'flex', flexDirection: 'column', gap: fluidSizing.space.md }}
      >
        <h4 className="text-white/80 font-mono text-fluid-xs">{t('connection.formTitle')}</h4>
        
        {/* Form */}
        <form ref={formRef} onSubmit={handleConsoleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: fluidSizing.space.md }} noValidate>
          <div className="grid grid-cols-2" style={{ gap: fluidSizing.space.sm }}>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder={t('connection.namePlaceholder')}
              className="bg-black/40 border border-white/20 rounded text-white font-mono outline-none focus:border-white/40 placeholder:text-white/30 placeholder:text-xs text-fluid-xs"
              style={{ padding: `${fluidSizing.space.sm} ${fluidSizing.space.md}`, fontSize: 16 }}
            />
            <input
              type="text"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder={t('connection.emailPlaceholder')}
              className="bg-black/40 border border-white/20 rounded text-white font-mono outline-none focus:border-white/40 placeholder:text-white/30 placeholder:text-xs text-fluid-xs"
              style={{ padding: `${fluidSizing.space.sm} ${fluidSizing.space.md}`, fontSize: 16 }}
            />
          </div>
          
          <textarea
            value={formData.message}
            onChange={(e) => handleInputChange('message', e.target.value)}
            placeholder={t('connection.messagePlaceholder')}
            rows={3}
            className="w-full bg-black/40 border border-white/20 rounded text-white font-mono outline-none focus:border-white/40 placeholder:text-white/30 placeholder:text-xs resize-none text-fluid-xs"
            style={{ padding: `${fluidSizing.space.sm} ${fluidSizing.space.md}`, fontSize: 16 }}
          />

          <button
            type="submit"
            disabled={sending}
            className="w-full bg-white/10 hover:bg-white/20 disabled:bg-white/5 border border-white/20 rounded text-white font-mono transition-colors disabled:cursor-not-allowed text-fluid-xs"
            style={{ padding: `${fluidSizing.space.sm} ${fluidSizing.space.md}` }}
          >
            {sending ? t('connection.sendingButton') : t('connection.sendButton')}
          </button>
        </form>

        {/* Console output - solo mostrar si hay más de 2 mensajes (más allá de los iniciales) */}
        {consoleHistory.length > 2 && (
          <div className="bg-black/40 rounded-lg border border-white/20 h-full min-h-[80px]" style={{ padding: fluidSizing.space.md }}>
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
            href="mailto:sergio.jauregui@sergioja.com"
            className="group flex items-center rounded-lg border border-white/10 hover:border-white/30 hover:bg-white/5 transition-all duration-300"
            style={{ gap: fluidSizing.space.md, padding: fluidSizing.space.md }}
            onClick={() => trackOutboundLink('mailto:sergio.jauregui@sergioja.com', 'Email')}
          >
            <div className="rounded-lg bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors text-white" style={{ width: fluidSizing.size.buttonMd, height: fluidSizing.size.buttonMd }}>
              {connection.icon}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-white font-medium text-fluid-sm">{connection.platform}</h4>
              <p className="text-white/60 truncate text-fluid-sm">{connection.handle}</p>
            </div>
            <div className="text-white/40 group-hover:text-white/60 transition-colors">
              <svg className="size-icon-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </a>
        ))}
      </motion.div>

      {/* reCAPTCHA disclaimer - Required when hiding badge */}
      <p className="text-white/50 text-center leading-relaxed font-mono" style={{ fontSize: 'clamp(0.625rem, 0.7vw, 0.7rem)' }}>
        {t('recaptcha.disclaimer')}{' '}
        <a 
          href="https://policies.google.com/privacy" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-white/70 hover:text-white underline transition-colors"
        >
          {t('recaptcha.privacy')}
        </a>
        {' '}{language === 'es' ? 'y los' : 'and'}{' '}
        <a 
          href="https://policies.google.com/terms" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-white/70 hover:text-white underline transition-colors"
        >
          {t('recaptcha.terms')}
        </a>
        {' '}{language === 'es' ? 'de Google' : 'apply'}.
      </p>

    </div>
  );
}
