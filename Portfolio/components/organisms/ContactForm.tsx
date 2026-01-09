'use client';

import { FormEvent, RefObject } from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Textarea from '@/components/atoms/Textarea';
import { fluidSizing } from '@/lib/utils/fluidSizing';

interface ContactFormProps {
  formData: {
    name: string;
    email: string;
    subject: string;
    message: string;
  };
  status: 'idle' | 'loading' | 'success' | 'error';
  errorMessage: string;
  fieldErrors: Record<string, string>;
  language: string;
  formRef: RefObject<HTMLFormElement>;
  onSubmit: (e: FormEvent) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onReset: () => void;
  t: (key: string) => string;
}

export default function ContactForm({
  formData,
  status,
  errorMessage,
  fieldErrors,
  language,
  formRef,
  onSubmit,
  onChange,
  onReset,
  t,
}: ContactFormProps) {
  return (
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
            onClick={onReset}
            variant="blue"
            size="lg"
            className="w-full max-w-xs"
          >
            Enviar otro mensaje
          </Button>
        </motion.div>
      ) : (
        <form ref={formRef} onSubmit={onSubmit} className="flex-1 flex flex-col" style={{ display: 'flex', flexDirection: 'column', gap: fluidSizing.space.lg }} noValidate>
          <div>
            <Input
              type="text"
              id="name"
              name="name"
              label={t('contact.name')}
              value={formData.name}
              onChange={onChange}
              placeholder={t('contact.namePlaceholder')}
              required
            />
            {fieldErrors.name && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-cyber-red text-xs mt-1 font-mono"
              >
                {fieldErrors.name}
              </motion.p>
            )}
          </div>

          <div>
            <Input
              type="text"
              id="email"
              name="email"
              label={t('contact.email')}
              value={formData.email}
              onChange={onChange}
              placeholder={t('contact.emailPlaceholder')}
              required
            />
            {fieldErrors.email && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-cyber-red text-xs mt-1 font-mono"
              >
                {fieldErrors.email}
              </motion.p>
            )}
          </div>

          <div>
            <Input
              type="text"
              id="subject"
              name="subject"
              label={t('contact.subject')}
              value={formData.subject}
              onChange={onChange}
              placeholder={t('contact.subjectPlaceholder')}
              required
            />
            {fieldErrors.subject && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-cyber-red text-xs mt-1 font-mono"
              >
                {fieldErrors.subject}
              </motion.p>
            )}
          </div>

          <div>
            <Textarea
              id="message"
              name="message"
              label={t('contact.message')}
              value={formData.message}
              onChange={onChange}
              placeholder={t('contact.messagePlaceholder')}
              required
            />
            {fieldErrors.message && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-cyber-red text-xs mt-1 font-mono"
              >
                {fieldErrors.message}
              </motion.p>
            )}
          </div>

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

      <div className="absolute top-0 left-0 border-t-2 border-l-2 border-white" style={{ width: fluidSizing.space.lg, height: fluidSizing.space.lg }} />
      <div className="absolute bottom-0 right-0 border-b-2 border-r-2 border-white" style={{ width: fluidSizing.space.lg, height: fluidSizing.space.lg }} />
    </div>
  );
}
