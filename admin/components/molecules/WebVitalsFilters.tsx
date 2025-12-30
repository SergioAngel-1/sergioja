'use client';

import { motion } from 'framer-motion';
import CategoryFilter, { CategoryOption } from './CategoryFilter';

interface WebVitalsFiltersProps {
  selectedMetric: string;
  onMetricChange: (metric: string) => void;
  metricOptions: CategoryOption[];
}

export default function WebVitalsFilters({
  selectedMetric,
  onMetricChange,
  metricOptions,
}: WebVitalsFiltersProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.25 }}
    >
      <CategoryFilter
        categories={metricOptions}
        selectedCategory={selectedMetric}
        onCategoryChange={onMetricChange}
        label="Filtrar por métrica"
        showCount={false}
        animationDelay={0.3}
        maxVisible={7}
      />
    </motion.div>
  );
}
