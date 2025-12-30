'use client';

import { motion } from 'framer-motion';
import StatCard from './StatCard';

interface WebVitalsStatsCardsProps {
  good: number;
  needsImprovement: number;
  poor: number;
}

export default function WebVitalsStatsCards({
  good,
  needsImprovement,
  poor,
}: WebVitalsStatsCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <StatCard
        title="Buenas"
        value={good.toLocaleString()}
        color="green-400"
        variant="simple"
        delay={0.1}
      />
      <StatCard
        title="Necesita Mejora"
        value={needsImprovement.toLocaleString()}
        color="yellow-400"
        variant="simple"
        delay={0.15}
      />
      <StatCard
        title="Pobres"
        value={poor.toLocaleString()}
        color="red-400"
        variant="simple"
        delay={0.2}
      />
    </div>
  );
}
