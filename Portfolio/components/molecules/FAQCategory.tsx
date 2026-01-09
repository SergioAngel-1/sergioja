'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import FAQItem from '@/components/atoms/FAQItem';

interface FAQQuestion {
  question: string;
  answer: string;
}

interface FAQCategoryProps {
  title: string;
  questions: FAQQuestion[];
  categoryIndex: number;
  color?: string;
}

export default function FAQCategory({ 
  title, 
  questions, 
  categoryIndex,
  color = '#00F7C0' 
}: FAQCategoryProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: categoryIndex * 0.1, duration: 0.5 }}
      className="space-y-4"
    >
      {/* Category Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-1 h-8 rounded-full bg-white" />
        <h2 className="font-orbitron text-xl sm:text-2xl md:text-3xl font-bold text-white uppercase tracking-wider">
          {title}
        </h2>
        <div className="flex-1 h-px bg-gradient-to-r from-white/30 via-white/10 to-transparent" />
        <span className="text-xs text-text-muted font-mono bg-background-elevated px-3 py-1 rounded">
          {questions.length}
        </span>
      </div>

      {/* Questions */}
      <div className="space-y-3">
        {questions.map((faq, index) => (
          <FAQItem
            key={index}
            question={faq.question}
            answer={faq.answer}
            index={index}
            isOpen={openIndex === index}
            onToggle={() => setOpenIndex(openIndex === index ? null : index)}
          />
        ))}
      </div>
    </motion.div>
  );
}
