'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { useLogger } from '@/shared/hooks/useLogger';
import { usePageAnalytics } from '@/shared/hooks/usePageAnalytics';
import PageHeader from '@/components/organisms/PageHeader';
import FloatingParticles from '@/components/atoms/FloatingParticles';
import GlowEffect from '@/components/atoms/GlowEffect';
import SearchBar from '@/components/molecules/SearchBar';
import Select from '@/components/molecules/Select';
import FAQCategory from '@/components/molecules/FAQCategory';
import Button from '@/components/atoms/Button';
import { fluidSizing } from '@/lib/utils/fluidSizing';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

export default function FAQPage() {
  const { t } = useLanguage();
  const log = useLogger('FAQPage');
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  usePageAnalytics(
    (depth: number) => log.interaction('scroll_depth', depth.toString()),
    (seconds: number) => log.interaction('time_on_page', seconds.toString())
  );

  const faqData = useMemo<FAQItem[]>(() => {
    const categories = ['general', 'services', 'process', 'technical', 'pricing', 'collaboration'];
    const items: FAQItem[] = [];

    categories.forEach(category => {
      for (let i = 1; i <= 10; i++) {
        const questionKey = `faq.${category}.q${i}`;
        const answerKey = `faq.${category}.a${i}`;
        const question = t(questionKey);
        const answer = t(answerKey);

        if (question !== questionKey && answer !== answerKey) {
          items.push({
            question,
            answer,
            category,
          });
        }
      }
    });

    return items;
  }, [t]);

  const categoryConfig = useMemo(() => ({
    general: { label: t('faq.category.general') },
    services: { label: t('faq.category.services') },
    process: { label: t('faq.category.process') },
    technical: { label: t('faq.category.technical') },
    pricing: { label: t('faq.category.pricing') },
    collaboration: { label: t('faq.category.collaboration') },
  }), [t]);

  const filteredFAQs = useMemo(() => {
    let filtered = faqData;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(faq => faq.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(faq => 
        faq.question.toLowerCase().includes(query) ||
        faq.answer.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [faqData, selectedCategory, searchQuery]);

  const groupedFAQs = useMemo(() => {
    const grouped: Record<string, FAQItem[]> = {};
    
    filteredFAQs.forEach(faq => {
      if (!grouped[faq.category]) {
        grouped[faq.category] = [];
      }
      grouped[faq.category].push(faq);
    });

    return grouped;
  }, [filteredFAQs]);

  const categories = useMemo(() => {
    const counts: Record<string, number> = { all: faqData.length };
    
    faqData.forEach(faq => {
      counts[faq.category] = (counts[faq.category] || 0) + 1;
    });

    return [
      { value: 'all', label: t('faq.allCategories'), count: counts.all },
      ...Object.entries(categoryConfig).map(([key, config]) => ({
        value: key,
        label: config.label,
        count: counts[key] || 0,
      })),
    ];
  }, [faqData, categoryConfig, t]);

  return (
    <div className="relative min-h-screen overflow-hidden pl-0 md:pl-20 with-bottom-nav-inset">
      <div className="absolute inset-0 cyber-grid opacity-10" />

      <GlowEffect
        color="white"
        size="lg"
        position={{ top: '10rem', right: '5rem' }}
        opacity={0.1}
        duration={4}
        animationType="pulse"
      />

      <GlowEffect
        color="white"
        size="lg"
        position={{ bottom: '10rem', left: '5rem' }}
        opacity={0.15}
        duration={3}
        delay={0.5}
        animationType="pulse"
      />

      <FloatingParticles count={50} color="bg-white" />

      <div 
        className="relative z-10 mx-auto w-full" 
        style={{ 
          maxWidth: '1600px', 
          padding: `${fluidSizing.space['2xl']} ${fluidSizing.space.lg}`, 
          paddingTop: `calc(${fluidSizing.header.height} + ${fluidSizing.space.md})` 
        }}
      >
        <div className="mb-8 md:mb-16">
          <PageHeader 
            title={t('faq.title')} 
            subtitle={t('faq.intro')} 
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mb-8 md:mb-12"
        >
          <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4">
            <SearchBar
              value={searchQuery}
              onSearch={(query) => {
                setSearchQuery(query);
                log.interaction('search_faq', query);
              }}
              placeholder={t('faq.searchPlaceholder')}
            />

            <Select
              value={selectedCategory}
              onChange={(value) => {
                setSelectedCategory(value);
                log.interaction('filter_faq_category', value);
              }}
              options={categories}
              showCount={true}
            />
          </div>

          {(searchQuery || selectedCategory !== 'all') && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 mt-4"
            >
              <span className="text-text-muted text-sm font-mono">
                {filteredFAQs.length} {filteredFAQs.length === 1 ? 'resultado' : 'resultados'}
              </span>
              {(searchQuery || selectedCategory !== 'all') && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                    log.interaction('clear_faq_filters');
                  }}
                  className="text-xs text-cyber-blue-cyan hover:text-white transition-colors font-mono underline"
                >
                  Limpiar filtros
                </button>
              )}
            </motion.div>
          )}
        </motion.div>

        {filteredFAQs.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center py-12 md:py-20"
          >
            <div className="inline-block p-8 bg-background-surface/50 border border-white/30 rounded-lg">
              <svg className="w-16 h-16 text-white mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-white text-lg font-orbitron font-bold mb-2">{t('faq.noResults')}</p>
              <p className="text-text-secondary text-sm font-rajdhani">{t('faq.noResultsDesc')}</p>
            </div>
          </motion.div>
        ) : (
          <div className="space-y-12 md:space-y-16">
            {Object.entries(groupedFAQs).map(([category, questions], index) => (
              <FAQCategory
                key={category}
                title={categoryConfig[category as keyof typeof categoryConfig]?.label || category}
                questions={questions.map(q => ({ question: q.question, answer: q.answer }))}
                categoryIndex={index}
              />
            ))}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-16 md:mt-24"
        >
          <div className="relative bg-background-surface/50 backdrop-blur-sm border border-white/30 rounded-lg p-8 md:p-12 text-center overflow-hidden">
            <div className="relative z-10">
              <h2 className="font-orbitron font-bold text-white text-2xl md:text-3xl mb-4">
                {t('faq.ctaTitle')}
              </h2>
              <p className="text-text-secondary font-rajdhani text-base md:text-lg mb-6 max-w-2xl mx-auto">
                {t('faq.ctaDescription')}
              </p>
              <Button
                variant="outline"
                size="lg"
                className="bg-white text-black border-white hover:bg-transparent hover:text-white"
                onClick={() => {
                  log.interaction('click_faq_cta', 'contact');
                  window.dispatchEvent(new Event('app:navigation-start'));
                  router.push('/contact');
                }}
              >
                <span className="flex items-center gap-2">
                  {t('faq.ctaButton')}
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </Button>
            </div>

            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-white" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-white" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
