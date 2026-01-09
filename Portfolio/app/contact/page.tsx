'use client';

import { useState, FormEvent, useRef, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { useLogger } from '@/shared/hooks/useLogger';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { useCookieConsent } from '@/shared/contexts/CookieConsentContext';
import PageHeader from '@/components/organisms/PageHeader';
import FloatingParticles from '@/components/atoms/FloatingParticles';
import GlowEffect from '@/components/atoms/GlowEffect';
import ContactMethodCard from '@/components/molecules/ContactMethodCard';
import SocialLinkItem from '@/components/molecules/SocialLinkItem';
import AvailabilityBadge from '@/components/molecules/AvailabilityBadge';
import LegalLinksSection from '@/components/molecules/LegalLinksSection';
import ContactForm from '@/components/organisms/ContactForm';
import { api } from '@/lib/api-client';
import useProfile from '@/lib/hooks/useProfile';
const DevTipsModal = dynamic(() => import('@/components/molecules/DevTipsModal'), {
  ssr: false,
});
import { fluidSizing } from '@/lib/utils/fluidSizing';
import { alerts } from '@/shared/alertSystem';
import { validateContactForm, sanitizeContactForm, validateName, validateEmail, validateSubject, validateMessage } from '@/shared/formValidations';
import { getReCaptchaToken } from '@/shared/recaptchaHelpers';
import { trackContactSubmit, trackNewsletterSubscribe, trackOutboundLink } from '@/lib/analytics';
import { usePageAnalytics } from '@/lib/hooks/usePageAnalytics';
import { usePWAInstall } from '@/shared/hooks/usePWAInstall';

type AvailabilityStatus = 'available' | 'busy' | 'unavailable';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [showNewsletterModal, setShowNewsletterModal] = useState(false);
  const { t, language } = useLanguage();
  const log = useLogger('ContactPage');
  const router = useRouter();
  const { openPreferences } = useCookieConsent();
  const { profile } = useProfile();
  
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const [tokenExpiry, setTokenExpiry] = useState<number>(0);
  const formRef = useRef<HTMLFormElement>(null);
  
  const { isInstallable, isInstalled, install } = usePWAInstall();
  
  usePageAnalytics();

  const validateField = useCallback((field: keyof typeof formData, value: string) => {
    let validation;
    
    switch (field) {
      case 'name':
        validation = validateName(value, t);
        break;
      case 'email':
        validation = validateEmail(value, t);
        break;
      case 'subject':
        validation = validateSubject(value, t);
        break;
      case 'message':
        validation = validateMessage(value, t);
        break;
      default:
        return;
    }
    
    setFieldErrors(prev => ({
      ...prev,
      [field]: validation.isValid ? '' : (validation.error || '')
    }));
  }, [t]);

  const debouncedValidate = useCallback((field: keyof typeof formData, value: string) => {
    const timeoutId = setTimeout(() => {
      validateField(field, value);
    }, 500);
    
    return () => clearTimeout(timeoutId);
  }, [validateField]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const fieldName = name as keyof typeof formData;
    
    setFormData(prev => ({ ...prev, [fieldName]: value }));
    setFieldErrors(prev => ({ ...prev, [fieldName]: '' }));
    debouncedValidate(fieldName, value);
    setStatus('idle');
    setErrorMessage('');
  }, [debouncedValidate]);

  const handleNewsletterSubmit = async (email: string) => {
    let recaptchaToken: string | null | undefined = undefined;
    const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '';
    
    if (siteKey && process.env.NODE_ENV === 'production') {
      recaptchaToken = await getReCaptchaToken(siteKey, 'subscribe_newsletter');
      if (!recaptchaToken) {
        alerts.error(t('alerts.sendError'), t('contact.recaptchaRequired'), 6000);
        throw new Error('Missing reCAPTCHA token');
      }
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
      trackNewsletterSubscribe('contact_newsletter');
    } catch (err) {
      alerts.error(t('alerts.sendError'), t('devTips.submitError'), 6000);
      throw err;
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const validation = validateContactForm(formData, t);
    if (!validation.isValid) {
      const firstError = Object.values(validation.errors)[0];
      setStatus('error');
      setErrorMessage(firstError || t('alerts.checkForm'));
      
      setTimeout(() => {
        formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
      
      return;
    }

    setStatus('loading');
    
    let token: string | null | undefined = undefined;
    const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '';
    
    if (siteKey && process.env.NODE_ENV === 'production') {
      if (recaptchaToken && Date.now() < tokenExpiry) {
        token = recaptchaToken;
        log.info('Using cached reCAPTCHA token');
      } else {
        token = await getReCaptchaToken(siteKey, 'submit_contact');
        if (!token) {
          setStatus('error');
          setErrorMessage(t('contact.recaptchaRequired') || 'Por favor completa el reCAPTCHA');
          return;
        }
        setRecaptchaToken(token);
        setTokenExpiry(Date.now() + 120000);
        log.info('Generated and cached new reCAPTCHA token');
      }
    }
    log.interaction('submit_contact_form', 'contact_form', formData);

    const sanitizedData = sanitizeContactForm(formData);

    try {
      const response = await api.submitContact({ ...sanitizedData, recaptchaToken: token, recaptchaAction: 'submit_contact' });
      
      if (response.success) {
        setStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
        log.info('Contact form submitted successfully');
        if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(max-width: 640px)').matches) {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        
        alerts.success(
          t('alerts.messageSent'),
          t('alerts.messageSentDesc'),
          8000
        );
        trackContactSubmit('contact');
      } else {
        setStatus('error');
        const errorMsg = response.error?.message || t('contact.error');
        setErrorMessage(errorMsg);
        log.error('Contact form submission failed', response.error);
        
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
      
      alerts.error(
        t('alerts.connectionError'),
        t('alerts.connectionErrorDesc'),
        6000
      );
    }
  };

  const availabilityStatus: AvailabilityStatus =
    profile?.availability === 'busy' || profile?.availability === 'unavailable'
      ? profile.availability
      : 'available';

  const availabilityCopy = useMemo(() => {
    const map: Record<AvailabilityStatus, { title: string; description: string; color: string }> = {
      available: {
        title: t('contact.available') || 'OPEN TO TECH COLLABORATIONS',
        description: t('contact.availableMsg') || '',
        color: '#00F7C0',
      },
      busy: {
        title: t('contact.busy') || 'FOCUSED ON ACTIVE COLLABORATIONS',
        description: t('contact.busyMsg') || '',
        color: '#FACC15',
      },
      unavailable: {
        title: t('contact.unavailable') || 'NOT TAKING NEW PROJECTS',
        description: t('contact.unavailableMsg') || '',
        color: '#FE4C4C',
      },
    };
    return map[availabilityStatus];
  }, [availabilityStatus, t]);

  const contactMethods = [
    ...(profile?.email ? [{
      icon: (
        <svg className="size-icon-md" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      label: t('contact.emailLabel'),
      value: profile.email,
      href: `mailto:${profile.email}`,
    }] : []),
    ...(profile?.phone ? [{
      icon: (
        <svg className="size-icon-md" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.304-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
        </svg>
      ),
      label: 'WhatsApp',
      value: profile.phone,
      href: `https://wa.me/${profile.phone.replace(/[^0-9]/g, '')}`,
    }] : []),
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

  const handleInstallPWA = async () => {
    const result = await install();
    if (result.success) {
      alerts.success(
        t('contact.appInstalled'),
        t('contact.appInstalledDesc'),
        5000
      );
    } else if (result.reason === 'not-available') {
      alerts.info(
        'Instalación no disponible',
        'Tu navegador no soporta la instalación de PWA o ya está instalada.',
        5000
      );
    }
  };

  const socialLinks = [
    ...(profile?.githubUrl ? [{ 
      name: 'GitHub', 
      url: profile.githubUrl, 
      icon: 'M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z' 
    }] : []),
    ...(profile?.linkedinUrl ? [{ 
      name: 'LinkedIn', 
      url: profile.linkedinUrl, 
      icon: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' 
    }] : []),
    { 
      name: 'Blog', 
      url: '#blog', 
      icon: 'M7 7h10M7 11h10M7 15h6M5 5a2 2 0 00-2 2v10a2 2 0 002 2h14a2 2 0 002-2V9l-6-4H5z', 
      comingSoon: true 
    },
    { 
      name: 'Newsletter', 
      url: '#newsletter', 
      icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' 
    },
    ...((isInstallable && !isInstalled) ? [{
      name: t('contact.installApp'),
      url: '#install-pwa',
      icon: 'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4',
      isPWA: true,
    }] : []),
  ];

  return (
    <div className="relative min-h-screen overflow-hidden pl-0 md:pl-20 with-bottom-nav-inset">
      <div className="absolute inset-0 cyber-grid opacity-10" />

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

      <FloatingParticles count={50} color="bg-white" />

      <div className="relative z-10 mx-auto w-full pb-4 md:pb-24" style={{ maxWidth: '1600px', paddingLeft: fluidSizing.space.lg, paddingRight: fluidSizing.space.lg, paddingTop: `calc(${fluidSizing.header.height} + ${fluidSizing.space.md})` }}>
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
            <ContactForm
              formData={formData}
              status={status}
              errorMessage={errorMessage}
              fieldErrors={fieldErrors}
              language={language}
              formRef={formRef}
              onSubmit={handleSubmit}
              onChange={handleChange}
              onReset={() => setStatus('idle')}
              t={t}
            />
          </motion.div>

          {/* Right side - Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="lg:col-span-2"
            style={{ display: 'flex', flexDirection: 'column', gap: fluidSizing.space.xl }}
          >
            {/* Contact Methods */}
            <div className="grid grid-cols-2 sm:grid-cols-3" style={{ gap: fluidSizing.space.md }}>
              {contactMethods.map((method, index) => (
                <ContactMethodCard
                  key={method.label}
                  icon={method.icon}
                  label={method.label}
                  value={method.value}
                  href={method.href}
                  index={index}
                />
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
                  <SocialLinkItem
                    key={social.name}
                    name={social.name}
                    url={social.url}
                    icon={social.icon}
                    index={index}
                    variant={
                      social.comingSoon ? 'comingSoon' :
                      social.name === 'Newsletter' ? 'newsletter' :
                      social.isPWA ? 'pwa' :
                      'normal'
                    }
                    onNewsletterClick={() => setShowNewsletterModal(true)}
                    onPWAClick={handleInstallPWA}
                    onLinkClick={trackOutboundLink}
                    comingSoonText={t('performance.comingSoon')}
                  />
                ))}
              </div>
            </motion.div>

            {/* Availability Status */}
            <AvailabilityBadge
              title={availabilityCopy.title}
              description={availabilityCopy.description}
              color={availabilityCopy.color}
            />

            {/* Legal Links */}
            <LegalLinksSection
              title={t('contact.legalLinks')}
              links={[
                { 
                  key: 'faq', 
                  label: t('nav.faq'), 
                  path: '/faq',
                  icon: (
                    <svg className="size-icon-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )
                },
                { 
                  key: 'terms', 
                  label: t('nav.terms'), 
                  path: '/terms',
                  icon: (
                    <svg className="size-icon-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  )
                },
                { 
                  key: 'privacy', 
                  label: t('nav.privacy'), 
                  path: '/privacy',
                  icon: (
                    <svg className="size-icon-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  )
                },
                { 
                  key: 'cookies', 
                  label: t('nav.cookies'), 
                  path: '#',
                  icon: (
                    <svg className="size-icon-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )
                },
              ]}
              onLinkClick={(key) => {
                if (key === 'cookies') {
                  openPreferences();
                  log.interaction('click_cookie_preferences', 'opened');
                } else {
                  log.interaction('click_legal_link', key);
                }
              }}
            />
          </motion.div>
        </div>
      </div>

      <DevTipsModal
        isOpen={showNewsletterModal}
        onClose={() => setShowNewsletterModal(false)}
        onSubmit={(email: string) => handleNewsletterSubmit(email)}
      />
    </div>
  );
}
