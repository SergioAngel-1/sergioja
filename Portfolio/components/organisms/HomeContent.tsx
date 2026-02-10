'use client';

import { useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useLogger } from '@/shared/hooks/useLogger';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { alerts } from '@/shared/alertSystem';
import { api } from '@/lib/api-client';
import { getReCaptchaToken } from '@/shared/recaptchaHelpers';
import { trackNewsletterSubscribe } from '@/lib/analytics';
import { fluidSizing } from '@/lib/utils/fluidSizing';
import { usePageAnalytics } from '@/lib/hooks/usePageAnalytics';
import { useTypingAnimation } from '@/lib/hooks/useTypingAnimation';
import { useTerminal } from '@/lib/hooks/useTerminal';
import type { Profile } from '@/shared/types';

import CyberBackground from '@/components/molecules/CyberBackground';
import HeroTitle from '@/components/molecules/HeroTitle';
import HeroCTA from '@/components/molecules/HeroCTA';
import AvailabilityBadge from '@/components/atoms/AvailabilityBadge';
import FocusAreas from '@/components/molecules/FocusAreas';
import HomeTerminal from '@/components/molecules/HomeTerminal';
import DevTipsModal from '@/components/molecules/DevTipsModal';
import MatrixConfirmDialog from '@/components/molecules/MatrixConfirmDialog';
import MobileTerminalModal from '@/components/molecules/MobileTerminalModal';

type AvailabilityStatus = 'available' | 'busy' | 'unavailable';

interface HomeContentProps {
  initialProfile: Profile | null;
}

export default function HomeContent({ initialProfile }: HomeContentProps) {
  usePageAnalytics();

  const log = useLogger('Home');
  const { t, language } = useLanguage();

  const terminal = useTerminal();

  // Typing animation words — memoized per language
  const words = useMemo(
    () => [t('home.title'), t('home.developer'), t('home.automation'), t('home.scalability'), t('home.integration')],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [language]
  );
  const typedText = useTypingAnimation({ words });

  // Availability from server-fetched profile
  const availabilityStatus: AvailabilityStatus =
    initialProfile?.availability === 'busy' || initialProfile?.availability === 'unavailable'
      ? initialProfile.availability
      : 'available';

  // Newsletter submit handler
  const handleDevTipsSubmit = useCallback(async (email: string) => {
    try {
      const recaptchaToken = await getReCaptchaToken(
        process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '',
        'subscribe_newsletter'
      );

      const response = await api.subscribeNewsletter({
        email,
        recaptchaToken: recaptchaToken || undefined,
        recaptchaAction: 'subscribe_newsletter',
      });

      if (!response.success) {
        throw new Error(response.error?.message || 'Failed to subscribe');
      }

      log.info('Email subscribed:', email);
      alerts.success(t('alerts.success'), t('devTips.success'), 6000);
      trackNewsletterSubscribe('dev_tips_modal');
    } catch (error) {
      log.error('Error subscribing email:', error);
      alerts.error(t('alerts.sendError'), t('devTips.submitError'), 6000);
      throw error;
    }
  }, [log, t]);

  return (
    <>
      {/* Modals */}
      <DevTipsModal
        isOpen={terminal.showDevTipsModal}
        onClose={() => terminal.setShowDevTipsModal(false)}
        onSubmit={handleDevTipsSubmit}
      />
      <MatrixConfirmDialog
        isOpen={terminal.showMatrixDialog}
        onConfirm={terminal.handleMatrixConfirm}
        onCancel={terminal.handleMatrixCancel}
      />
      <MobileTerminalModal
        isOpen={terminal.showMobileTerminal}
        onClose={() => terminal.setShowMobileTerminal(false)}
        profileName={t('home.name')}
        currentView={terminal.currentView}
        onViewChange={terminal.setCurrentView}
        onCommandExecute={terminal.handleTerminalCommand}
        commandError={terminal.commandError}
        matrixMessage={terminal.matrixMessage}
      />

      <div
        className="relative min-h-screen flex items-center justify-center overflow-hidden pl-0 md:pl-20 with-bottom-nav-inset"
        style={{ paddingTop: `calc(${fluidSizing.header.height} - env(safe-area-inset-top, 0px))` }}
      >
        <CyberBackground />

        {/* Content */}
        <div
          className="relative z-10 mx-auto w-full"
          style={{ maxWidth: '1600px', padding: `${fluidSizing.space['2xl']} ${fluidSizing.space.lg}` }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center" style={{ gap: 'clamp(2rem, 4vw, 6rem)' }}>
            {/* Left side — Hero content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <HeroTitle typedText={typedText} />
              <HeroCTA />
              <AvailabilityBadge status={availabilityStatus} />
              <FocusAreas />
            </motion.div>

            {/* Right side — Desktop terminal */}
            <HomeTerminal
              currentView={terminal.currentView}
              setCurrentView={terminal.setCurrentView}
              terminalInput={terminal.terminalInput}
              setTerminalInput={terminal.setTerminalInput}
              commandError={terminal.commandError}
              matrixMessage={terminal.matrixMessage}
              onCommand={terminal.handleTerminalCommand}
            />
          </div>
        </div>
      </div>
    </>
  );
}
