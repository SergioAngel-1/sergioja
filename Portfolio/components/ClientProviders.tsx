'use client';

import { ReactNode } from 'react';
import ErrorBoundary from '@/components/ErrorBoundary';
import PageLoader from '@/components/molecules/PageLoader';
import HeaderWrapper from '@/components/organisms/HeaderWrapper';
import Navbar from '@/components/organisms/Navbar';
import NextPageButton from '@/components/molecules/NextPageButton';
import AlertContainer from '@/components/molecules/alerts/AlertContainer';
import { PerformanceProvider } from '@/lib/contexts/PerformanceContext';
import { LanguageProvider } from '@/lib/contexts/LanguageContext';
import { MatrixProvider } from '@/lib/contexts/MatrixContext';
import { ModalProvider } from '@/lib/contexts/ModalContext';

interface ClientProvidersProps {
  children: ReactNode;
}

export default function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <LanguageProvider>
      <PerformanceProvider>
        <MatrixProvider>
          <ModalProvider>
            <ErrorBoundary>
              <PageLoader />
              <HeaderWrapper />
              <Navbar />
              {children}
              <NextPageButton />
              <AlertContainer />
            </ErrorBoundary>
          </ModalProvider>
        </MatrixProvider>
      </PerformanceProvider>
    </LanguageProvider>
  );
}
