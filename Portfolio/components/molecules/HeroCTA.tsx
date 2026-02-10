'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Button from '@/components/atoms/Button';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { fluidSizing } from '@/lib/utils/fluidSizing';

export default function HeroCTA() {
  const { t } = useLanguage();

  return (
    <motion.div
      className="flex flex-col sm:flex-row mb-fluid-xl"
      style={{ gap: fluidSizing.space.md }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.8 }}
    >
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto">
        <Link href="/projects" className="w-full sm:w-auto">
          <Button variant="outline" size="lg" className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-black">
            <span className="flex items-center justify-center gap-2">
              {t('home.viewProjects')}
              <svg className="size-icon-md" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </Button>
        </Link>
      </motion.div>
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto">
        <Link href="/contact" className="w-full sm:w-auto">
          <Button variant="outline" size="lg" className="w-full sm:w-auto bg-white text-black border-white hover:bg-transparent hover:text-white">
            {t('home.contact')}
          </Button>
        </Link>
      </motion.div>
    </motion.div>
  );
}
