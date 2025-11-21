'use client';

import { useState, FormEvent, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useLogger } from '@/lib/hooks/useLogger';
import PageHeader from '@/components/organisms/PageHeader';
import Button from '@/components/atoms/Button';
import FloatingParticles from '@/components/atoms/FloatingParticles';
import GlowEffect from '@/components/atoms/GlowEffect';
import { api } from '@/lib/api-client';
import DevTipsModal from '@/components/molecules/DevTipsModal';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { fluidSizing } from '@/lib/utils/fluidSizing';
import { alerts } from '@/shared/alertSystem';
import { validateContactForm, sanitizeContactForm } from '@/shared/formValidations';
import { getReCaptchaToken } from '@/shared/recaptchaHelpers';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const log = useLogger('ContactPage');
  const { t, language } = useLanguage();
  const formRef = useRef<HTMLFormElement>(null);
  const [showNewsletterModal, setShowNewsletterModal] = useState(false);


  const handleNewsletterSubmit = async (email: string) => {
    // Suscripción al newsletter con reCAPTCHA Enterprise
    const recaptchaToken = await getReCaptchaToken(
      process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '',
      'subscribe_newsletter'
    );
    if (!recaptchaToken) {
      alerts.error(t('alerts.sendError'), t('contact.recaptchaRequired'), 6000);
      throw new Error('Missing reCAPTCHA token');
    }
    try {
      const res = await api.subscribeNewsletter({
        email,
        recaptchaToken,
        recaptchaAction: 'subscribe_newsletter',
      });
      if (!res.success) {
        throw new Error(res.error?.message || 'Subscription failed');
      }
      alerts.success(t('alerts.success'), t('devTips.success'), 6000);
    } catch (err) {
      alerts.error(t('alerts.sendError'), t('devTips.submitError'), 6000);
      throw err;
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Validar formulario con traducciones
    const validation = validateContactForm(formData, t);
    if (!validation.isValid) {
      const firstError = Object.values(validation.errors)[0];
      setStatus('error');
      setErrorMessage(firstError || t('alerts.checkForm'));
      
      // Scroll automático al formulario (sin alerta del sistema)
      setTimeout(() => {
        formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
      
      return;
    }

    setStatus('loading');
    
    // Obtener token de reCAPTCHA v3
    const recaptchaToken = await getReCaptchaToken(
      process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '',
      'submit_contact'
    );
    if (!recaptchaToken) {
      setStatus('error');
      setErrorMessage(t('contact.recaptchaRequired') || 'Por favor completa el reCAPTCHA');
      return;
    }
    log.interaction('submit_contact_form', 'contact_form', formData);

    // Sanitizar datos antes de enviar
    const sanitizedData = sanitizeContactForm(formData);

    try {
      const response = await api.submitContact({ ...sanitizedData, recaptchaToken, recaptchaAction: 'submit_contact' });
      
      if (response.success) {
        setStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
        log.info('Contact form submitted successfully');
        
        // Mostrar alerta de éxito
        alerts.success(
          t('alerts.messageSent'),
          t('alerts.messageSentDesc'),
          8000
        );
      } else {
        setStatus('error');
        const errorMsg = response.error?.message || t('contact.error');
        setErrorMessage(errorMsg);
        log.error('Contact form submission failed', response.error);
        
        // Mostrar alerta de error
        alerts.error(
          t('alerts.sendError'),
          errorMsg,
          6000
        );
      }
    } catch (error) {
      setStatus('error');
      const errorMsg = t('contact.error');
      setErrorMessage(errorMsg);
      log.error('Contact form network error', error);
      
      // Mostrar alerta de error de red
      alerts.error(
        t('alerts.connectionError'),
        t('alerts.connectionErrorDesc'),
        6000
      );
    }
  };

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Limpiar estado de error INMEDIATAMENTE cuando el usuario empiece a escribir
    setStatus('idle');
    setErrorMessage('');
    
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);


  const contactMethods = [
    {
      icon: (
        <svg className="size-icon-md" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      label: t('contact.emailLabel'),
      value: 'sergiojauregui22@gmail.com',
      href: 'mailto:sergiojauregui22@gmail.com',
    },
    {
      icon: (
        <svg className="size-icon-md" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      label: t('contact.locationLabel'),
      value: t('contact.locationValue'),
    },
    {
      icon: (
        <svg className="size-icon-md" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      label: t('contact.responseTime'),
      value: t('contact.responseValue'),
    },
  ];

  const socialLinks = [
    { name: 'GitHub', url: 'https://github.com', icon: 'M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z' },
    { name: 'LinkedIn', url: 'https://linkedin.com', icon: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' },
    { name: 'WhatsApp', url: 'https://wa.me/1234567890', icon: 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.304-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z' },
    { name: 'Newsletter', url: '#newsletter', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden pl-0 md:pl-20 with-bottom-nav-inset">
      {/* Cyber grid background */}
      <div className="absolute inset-0 cyber-grid opacity-10" />

      {/* Animated glow effects */}
      <GlowEffect
        color="white"
        size="lg"
        position={{ top: '5rem', right: '10rem' }}
        opacity={0.1}
        duration={3}
        animationType="pulse"
      />

      <GlowEffect
        color="white"
        size="lg"
        position={{ bottom: '5rem', left: '5rem' }}
        opacity={0.15}
        duration={4}
        delay={0.5}
        animationType="pulse"
      />

      {/* Floating particles - Reducidas en móvil */}
      <FloatingParticles count={50} color="bg-white" />

      <div className="relative z-10 mx-auto w-full" style={{ maxWidth: '1600px', padding: `${fluidSizing.space['2xl']} ${fluidSizing.space.lg}`, paddingTop: `calc(${fluidSizing.header.height} + ${fluidSizing.space.md})` }}>
        {/* Header */}
        <div className="mb-8 md:mb-16">
          <PageHeader 
            title={t('contact.title')} 
            subtitle={t('contact.intro')} 
          />
        </div>

        <div className="grid lg:grid-cols-5" style={{ gap: fluidSizing.space['2xl'] }}>
          {/* Left side - Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="lg:col-span-3 flex"
          >
            <div className="relative w-full bg-background-surface/50 backdrop-blur-sm border border-white/30 rounded-lg hover:border-white/50 transition-all duration-300 flex flex-col" style={{ padding: fluidSizing.space.xl }}>
              <h2 className="font-orbitron font-bold text-white text-fluid-2xl" style={{ marginBottom: fluidSizing.space.lg }}>
                {t('contact.sendMessage')}
              </h2>

              {status === 'success' ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex-1 flex flex-col items-center justify-center text-center"
                  style={{ gap: fluidSizing.space.xl }}
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                  >
                    <svg className="w-20 h-20 text-white/80 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </motion.div>
                  
                  <div>
                    <h3 className="font-orbitron font-bold text-white text-fluid-xl mb-2">
                      {t('contact.success')}
                    </h3>
                    <p className="text-white/70 font-rajdhani text-fluid-base">
                      {t('contact.successMsg')}
                    </p>
                  </div>

                  <Button
                    onClick={() => setStatus('idle')}
                    variant="blue"
                    size="lg"
                    className="w-full max-w-xs"
                  >
                    Enviar otro mensaje
                  </Button>
                </motion.div>
              ) : (
                <form ref={formRef} onSubmit={handleSubmit} className="flex-1 flex flex-col" style={{ display: 'flex', flexDirection: 'column', gap: fluidSizing.space.lg }} noValidate>
                  {/* Name Input */}
                  <div>
                    <label htmlFor="name" className="block font-mono text-white uppercase tracking-wider text-fluid-xs" style={{ marginBottom: fluidSizing.space.sm }}>
                      {t('contact.name')} *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full bg-background-elevated border border-white/20 rounded-lg focus:border-white focus:outline-none focus:ring-2 focus:ring-white/50 transition-all text-text-primary font-rajdhani text-fluid-base placeholder:text-xs"
                      style={{ padding: `${fluidSizing.space.sm} ${fluidSizing.space.md}`, fontSize: 16 }}
                      placeholder={t('contact.namePlaceholder')}
                    />
                  </div>

                  {/* Email Input */}
                  <div>
                    <label htmlFor="email" className="block font-mono text-white uppercase tracking-wider text-fluid-xs" style={{ marginBottom: fluidSizing.space.sm }}>
                      {t('contact.email')} *
                    </label>
                    <input
                      type="text"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full bg-background-elevated border border-white/20 rounded-lg focus:border-white focus:outline-none focus:ring-2 focus:ring-white/50 transition-all text-text-primary font-rajdhani text-fluid-base placeholder:text-xs"
                      style={{ padding: `${fluidSizing.space.sm} ${fluidSizing.space.md}`, fontSize: 16 }}
                      placeholder={t('contact.emailPlaceholder')}
                    />
                  </div>

                  {/* Subject Input */}
                  <div>
                    <label htmlFor="subject" className="block font-mono text-white uppercase tracking-wider text-fluid-xs" style={{ marginBottom: fluidSizing.space.sm }}>
                      {t('contact.subject')} *
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full bg-background-elevated border border-white/20 rounded-lg focus:border-white focus:outline-none focus:ring-2 focus:ring-white/50 transition-all text-text-primary font-rajdhani text-fluid-base placeholder:text-xs"
                      style={{ padding: `${fluidSizing.space.sm} ${fluidSizing.space.md}`, fontSize: 16 }}
                      placeholder={t('contact.subjectPlaceholder')}
                    />
                  </div>

                  {/* Message Textarea */}
                  <div className="flex-1 flex flex-col">
                    <label htmlFor="message" className="block font-mono text-white uppercase tracking-wider text-fluid-xs" style={{ marginBottom: fluidSizing.space.sm }}>
                      {t('contact.message')} *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      className="flex-1 w-full bg-background-elevated border border-white/20 rounded-lg focus:border-white focus:outline-none focus:ring-2 focus:ring-white/50 transition-all resize-none text-text-primary font-rajdhani text-fluid-base placeholder:text-xs"
                      style={{ padding: `${fluidSizing.space.sm} ${fluidSizing.space.md}`, minHeight: 'clamp(120px, 20vw, 180px)', fontSize: 16 }}
                      placeholder={t('contact.messagePlaceholder')}
                    />
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    variant="blue"
                    size="lg"
                    disabled={status === 'loading'}
                    className="w-full"
                  >
                    {status === 'loading' ? (
                      <span className="flex items-center justify-center gap-2">
                        <motion.div
                          className="w-5 h-5 border-2 border-background-dark border-t-transparent rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        />
                        {t('contact.sending')}
                      </span>
                    ) : (
                      t('contact.send')
                    )}
                  </Button>

                  {/* reCAPTCHA disclaimer - Required when hiding badge */}
                  <p className="text-text-muted text-center leading-relaxed font-mono text-fluid-xs">
                    {t('recaptcha.disclaimer')}{' '}
                    <a 
                      href="https://policies.google.com/privacy" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-cyber-blue-cyan hover:text-white underline transition-colors"
                    >
                      {t('recaptcha.privacy')}
                    </a>
                    {' '}{language === 'es' ? 'y los' : 'and'}{' '}
                    <a 
                      href="https://policies.google.com/terms" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-cyber-blue-cyan hover:text-white underline transition-colors"
                    >
                      {t('recaptcha.terms')}
                    </a>
                    {' '}{language === 'es' ? 'de Google se aplican' : 'apply'}.
                  </p>

                  {/* Error Message - Only show on error */}
                  {status === 'error' && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 bg-white/5 border border-white/20 rounded-lg backdrop-blur-sm"
                    >
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-white/70 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <div>
                          <p className="text-white/90 font-rajdhani font-medium text-sm">{t('contact.error')}</p>
                          <p className="text-white/50 text-xs mt-0.5">{errorMessage}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </form>
              )}

              {/* Corner accents */}
              <div className="absolute top-0 left-0 border-t-2 border-l-2 border-white" style={{ width: fluidSizing.space.lg, height: fluidSizing.space.lg }} />
              <div className="absolute bottom-0 right-0 border-b-2 border-r-2 border-white" style={{ width: fluidSizing.space.lg, height: fluidSizing.space.lg }} />
            </div>
          </motion.div>

          {/* Right side - Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="lg:col-span-2"
            style={{ display: 'flex', flexDirection: 'column', gap: fluidSizing.space.xl }}
          >
            {/* Contact Methods - Grid 3 */}
            <div className="grid grid-cols-2 sm:grid-cols-3" style={{ gap: fluidSizing.space.md }}>
              {contactMethods.map((method, index) => (
                <motion.div
                  key={method.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className={`relative group ${index === 2 ? 'col-span-2 sm:col-span-1' : ''}`}
                >
                  {method.href ? (
                    <a href={method.href} className="block h-full">
                      <div className="h-full bg-background-elevated border border-white/20 rounded-lg hover:border-white/40 transition-all duration-300" style={{ padding: fluidSizing.space.md }}>
                        <div className="flex flex-col items-center text-center" style={{ gap: fluidSizing.space.md }}>
                          <div className="text-white group-hover:scale-110 transition-transform">
                            {method.icon}
                          </div>
                          <div>
                            <div className="text-text-muted font-mono uppercase tracking-wider text-fluid-xs" style={{ marginBottom: fluidSizing.space.xs }}>
                              {method.label}
                            </div>
                            <div className="text-text-primary font-rajdhani font-semibold break-all text-fluid-xs">
                              {method.value}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 rounded-lg blur-lg transition-opacity pointer-events-none" />
                    </a>
                  ) : (
                    <div className="h-full bg-background-elevated border border-white/20 rounded-lg hover:border-white/40 transition-all duration-300" style={{ padding: fluidSizing.space.md }}>
                      <div className="flex flex-col items-center text-center" style={{ gap: fluidSizing.space.md }}>
                        <div className="text-white group-hover:scale-110 transition-transform">
                          {method.icon}
                        </div>
                        <div>
                          <div className="text-text-muted font-mono uppercase tracking-wider text-fluid-xs" style={{ marginBottom: fluidSizing.space.xs }}>
                            {method.label}
                          </div>
                          <div className="text-text-primary font-rajdhani font-semibold text-fluid-xs">
                            {method.value}
                          </div>
                        </div>
                      </div>
                      <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 rounded-lg blur-lg transition-opacity pointer-events-none" />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.6 }}
              className="bg-background-surface/50 backdrop-blur-sm border border-white/30 rounded-lg hover:border-white/50 transition-all duration-300"
              style={{ padding: fluidSizing.space.lg }}
            >
              <h3 className="font-orbitron font-bold text-white text-fluid-lg" style={{ marginBottom: fluidSizing.space.md }}>
                {t('contact.connect')}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: fluidSizing.space.md }}>
                {socialLinks.map((social, index) => (
                social.name === 'Newsletter' ? (
                  <motion.button
                    key={social.name}
                    type="button"
                    onClick={() => setShowNewsletterModal(true)}
                    className="flex items-center w-full bg-background-elevated/50 rounded-lg hover:bg-background-elevated transition-all duration-300 group text-left"
                    style={{ gap: fluidSizing.space.sm, padding: fluidSizing.space.sm }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1 + index * 0.1 }}
                    whileHover={{ x: 5 }}
                  >
                    <svg className="size-icon-md text-text-muted group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={social.icon} />
                    </svg>
                    <span className="text-text-secondary group-hover:text-text-primary font-rajdhani font-medium transition-colors text-fluid-base">
                      {social.name}
                    </span>
                    <svg className="size-icon-sm ml-auto text-text-muted group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </motion.button>
                ) : (
                  <motion.a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center bg-background-elevated/50 rounded-lg hover:bg-background-elevated transition-all duration-300 group"
                    style={{ gap: fluidSizing.space.sm, padding: fluidSizing.space.sm }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1 + index * 0.1 }}
                    whileHover={{ x: 5 }}
                  >
                    <svg className="size-icon-md text-text-muted group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                      <path d={social.icon} />
                    </svg>
                    <span className="text-text-secondary group-hover:text-text-primary font-rajdhani font-medium transition-colors text-fluid-base">
                      {social.name}
                    </span>
                    <svg className="size-icon-sm ml-auto text-text-muted group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </motion.a>
                )
              ))}
              </div>
            </motion.div>

            {/* Availability Status */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3, duration: 0.6 }}
              className="bg-gradient-to-br from-white/10 to-white/10 backdrop-blur-sm border border-white/30 rounded-lg"
              style={{ padding: fluidSizing.space.lg }}
            >
              <div className="flex items-center" style={{ gap: fluidSizing.space.sm, marginBottom: fluidSizing.space.sm }}>
                <div className="relative">
                  <div className="bg-cyber-red rounded-full" style={{ width: fluidSizing.space.md, height: fluidSizing.space.md }} />
                  <motion.div
                    className="absolute inset-0 bg-cyber-red rounded-full"
                    style={{ width: fluidSizing.space.md, height: fluidSizing.space.md }}
                    animate={{ scale: [1, 1.5, 1], opacity: [1, 0, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </div>
                <span className="font-orbitron font-bold text-white text-fluid-sm">
                  {t('contact.available')}
                </span>
              </div>
              <p className="text-text-secondary font-rajdhani leading-relaxed text-fluid-sm">
                {t('contact.availableMsg')}
              </p>
            </motion.div>
          </motion.div>
        </div>
      <DevTipsModal
        isOpen={showNewsletterModal}
        onClose={() => setShowNewsletterModal(false)}
        onSubmit={(email: string) => handleNewsletterSubmit(email)}
      />
      </div>
    </div>
  );
}