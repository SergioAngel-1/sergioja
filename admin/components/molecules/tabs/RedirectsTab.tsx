'use client';

import RedirectCreationTab from '@/components/molecules/RedirectCreationTab';

interface RedirectsTabProps {
  customRedirects: any[];
}

export default function RedirectsTab({ customRedirects }: RedirectsTabProps) {
  return <RedirectCreationTab customRedirects={customRedirects} />;
}
