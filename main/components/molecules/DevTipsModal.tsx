'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { fluidSizing } from '@/lib/fluidSizing';
import { createPortal } from 'react-dom';
import { useLogger } from '@/shared/hooks/useLogger';

interface DevTipsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (email: string) => Promise<void> | void;
}

export default function DevTipsModal({ isOpen, onClose, onSubmit }: DevTipsModalProps) {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const log = useLogger('DevTipsModal');

  useEffect(() => {
    if (isOpen) {
      log.interaction('open_modal', 'dev_tips');
    } else {
      log.interaction('close_modal', 'dev_tips');
    }
  }, [isOpen]);

  const validateEmail = (val: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(val);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    log.interaction('devtips_submit_click');

    if (!email.trim()) {
      setError(t('devTips.emailRequired'));
      log.warn('devtips_validation_error', { reason: 'email_required' });
      return;
    }
    if (!validateEmail(email)) {
      setError(t('devTips.emailInvalid'));
      log.warn('devtips_validation_error', { reason: 'email_invalid' });
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(email);
      setEmail('');
      log.info('devtips_subscribe_success');
      onClose();
    } catch (err) {
      setError(t('devTips.submitError'));
      log.error('devtips_subscribe_failed', err as any);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const handleClose = () => {
    log.interaction('devtips_close_click');
    onClose();
  };

  return createPortal(
    <AnimatePresence>
      {
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-xl backdrop-brightness-50 backdrop-contrast-75 backdrop-saturate-150 p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="relative bg-black/95 border-2 border-white/30 rounded-lg shadow-2xl max-w-md w-full overflow-hidden"
          >
            {/* Esquinas decorativas */}
            <div className="absolute top-0 left-0 border-t-2 border-l-2 border-white" style={{ width: fluidSizing.space.lg, height: fluidSizing.space.lg }} />
            <div className="absolute top-0 right-0 border-t-2 border-r-2 border-white" style={{ width: fluidSizing.space.lg, height: fluidSizing.space.lg }} />
            <div className="absolute bottom-0 left-0 border-b-2 border-l-2 border-white" style={{ width: fluidSizing.space.lg, height: fluidSizing.space.lg }} />
            <div className="absolute bottom-0 right-0 border-b-2 border-r-2 border-white" style={{ width: fluidSizing.space.lg, height: fluidSizing.space.lg }} />

            {/* Header */}
            <div className="relative border-b border-white/30 bg-white/5" style={{ padding: `${fluidSizing.space.md} ${fluidSizing.space.lg}` }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center" style={{ gap: fluidSizing.space.md }}>
                  <svg className="size-icon-md text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <h2 className="font-orbitron font-bold text-white text-fluid-lg">
                    {t('devTips.title')}
                  </h2>
                </div>
                <button
                  onClick={handleClose}
                  className="text-white/70 hover:text-white transition-colors"
                  aria-label="Close"
                >
                  <svg className="size-icon-md" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Content */}
            <form onSubmit={handleSubmit} style={{ padding: fluidSizing.space.lg, display: 'flex', flexDirection: 'column', gap: fluidSizing.space.md }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: fluidSizing.space.sm }}>
                <p className="text-white/80 text-fluid-base">
                  {t('devTips.description')}
                </p>
                <div className="flex items-center" style={{ gap: fluidSizing.space.sm }}>
                  <span className="text-white font-mono">{'>'}</span>
                  <span className="text-white/80 text-fluid-sm">{t('devTips.benefit1')}</span>
                </div>
                <div className="flex items-center" style={{ gap: fluidSizing.space.sm }}>
                  <span className="text-white font-mono">{'>'}</span>
                  <span className="text-white/80 text-fluid-sm">{t('devTips.benefit2')}</span>
                </div>
                <div className="flex items-center" style={{ gap: fluidSizing.space.sm }}>
                  <span className="text-white font-mono">{'>'}</span>
                  <span className="text-white/80 text-fluid-sm">{t('devTips.benefit3')}</span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: fluidSizing.space.sm }}>
                <label htmlFor="email" className="block font-mono text-white text-fluid-base">
                  {t('devTips.emailLabel')}
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('devTips.emailPlaceholder')}
                  className="w-full bg-black/40 border border-white/30 rounded text-white placeholder:text-white/40 placeholder:text-xs focus:outline-none focus:border-white focus:ring-1 focus:ring-white/40 transition-all font-mono text-fluid-base"
                  style={{ padding: `${fluidSizing.space.sm} ${fluidSizing.space.md}`, fontSize: 16 }}
                  disabled={isSubmitting}
                />
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-white flex items-center text-fluid-sm"
                    style={{ gap: fluidSizing.space.xs }}
                  >
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {error}
                  </motion.p>
                )}
              </div>

              <div className="flex" style={{ gap: fluidSizing.space.md, paddingTop: fluidSizing.space.sm }}>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 rounded border-2 border-white/30 text-white hover:bg-white/10 hover:border-white transition-all duration-300 font-mono text-fluid-base"
                  style={{ padding: `${fluidSizing.space.sm} ${fluidSizing.space.md}` }}
                  disabled={isSubmitting}
                >
                  {t('common.cancel')}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 rounded border-2 border-white bg-white/10 text-white hover:bg-white/20 transition-all duration-300 font-mono font-bold disabled:opacity-50 disabled:cursor-not-allowed text-fluid-base"
                  style={{ padding: `${fluidSizing.space.sm} ${fluidSizing.space.md}` }}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin size-icon-sm" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      {t('devTips.submitting')}
                    </span>
                  ) : (
                    t('devTips.subscribe')
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      }
    </AnimatePresence>
  , document.body);
}
