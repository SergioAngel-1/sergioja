'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { fluidSizing } from '@/lib/utils/fluidSizing';

interface DevTipsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (email: string) => void;
}

export default function DevTipsModal({ isOpen, onClose, onSubmit }: DevTipsModalProps) {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError(t('devTips.emailRequired'));
      return;
    }

    if (!validateEmail(email)) {
      setError(t('devTips.emailInvalid'));
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(email);
      setEmail('');
      onClose();
    } catch (err) {
      setError(t('devTips.submitError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-background-dark/90 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-background-surface border-2 border-cyber-blue-cyan/50 rounded-lg shadow-2xl max-w-md w-full overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-cyber-blue-cyan/20 to-cyber-purple/20 border-b border-cyber-blue-cyan/30" style={{ padding: `${fluidSizing.space.md} ${fluidSizing.space.lg}` }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center" style={{ gap: fluidSizing.space.md }}>
                  <svg className="size-icon-md text-cyber-blue-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <h2 className="font-orbitron font-bold text-cyber-blue-cyan text-fluid-lg">
                    {t('devTips.title')}
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="text-text-muted hover:text-cyber-red transition-colors"
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
                <p className="text-text-secondary text-fluid-sm">
                  {t('devTips.description')}
                </p>
                <div className="flex items-center" style={{ gap: fluidSizing.space.sm }}>
                  <svg className="size-icon-sm text-cyber-purple flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-text-secondary text-fluid-xs">{t('devTips.benefit1')}</span>
                </div>
                <div className="flex items-center" style={{ gap: fluidSizing.space.sm }}>
                  <svg className="size-icon-sm text-cyber-purple flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-text-secondary text-fluid-xs">{t('devTips.benefit2')}</span>
                </div>
                <div className="flex items-center" style={{ gap: fluidSizing.space.sm }}>
                  <svg className="size-icon-sm text-cyber-purple flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-text-secondary text-fluid-xs">{t('devTips.benefit3')}</span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: fluidSizing.space.sm }}>
                <label htmlFor="email" className="block font-mono text-cyber-blue-cyan text-fluid-sm">
                  {t('devTips.emailLabel')}
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('devTips.emailPlaceholder')}
                  className="w-full bg-background-dark border border-cyber-blue-cyan/30 rounded text-text-primary placeholder-text-muted focus:outline-none focus:border-cyber-blue-cyan focus:ring-1 focus:ring-cyber-blue-cyan transition-all font-mono text-fluid-sm"
                  style={{ padding: `${fluidSizing.space.sm} ${fluidSizing.space.md}` }}
                  disabled={isSubmitting}
                />
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-cyber-red flex items-center text-fluid-xs"
                    style={{ gap: fluidSizing.space.xs }}
                  >
                    <svg className="size-icon-xs" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  className="flex-1 rounded border border-text-muted/30 text-text-muted hover:bg-text-muted/10 transition-all duration-300 font-mono text-fluid-sm"
                  style={{ padding: `${fluidSizing.space.sm} ${fluidSizing.space.md}` }}
                  disabled={isSubmitting}
                >
                  {t('common.cancel')}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 rounded bg-gradient-to-r from-cyber-blue-cyan to-cyber-purple text-white hover:shadow-lg hover:shadow-cyber-blue-cyan/50 transition-all duration-300 font-mono font-bold disabled:opacity-50 disabled:cursor-not-allowed text-fluid-sm"
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
      )}
    </AnimatePresence>
  );
}
