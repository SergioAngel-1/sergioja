'use client';

import { motion } from 'framer-motion';
import Icon from '../atoms/Icon';
import TopItemCard from './TopItemCard';

interface TopItem {
  title: string;
  count: number;
}

interface TopSectionProps {
  title: string;
  subtitle: string;
  icon: string;
  items: TopItem[];
  totalCount: number;
  emptyMessage?: string;
  delay?: number;
  itemColor?: string;
}

export default function TopSection({
  title,
  subtitle,
  icon,
  items,
  totalCount,
  emptyMessage = 'No hay datos disponibles',
  delay = 0.3,
  itemColor = '#60a5fa',
}: TopSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.23, 1, 0.32, 1] }}
      className="bg-admin-dark-elevated border border-admin-primary/20 rounded-lg p-6"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center">
          <Icon name={icon} size={20} className="text-white" />
        </div>
        <div>
          <h3 className="text-lg font-orbitron font-bold text-admin-primary">
            {title}
          </h3>
          <p className="text-text-muted text-xs">{subtitle}</p>
        </div>
      </div>

      {/* Items List */}
      <div className="space-y-3">
        {items.length === 0 ? (
          <p className="text-text-muted text-center py-8">{emptyMessage}</p>
        ) : (
          items.map((item, index) => (
            <TopItemCard
              key={item.title}
              rank={index + 1}
              title={item.title}
              value={item.count}
              total={totalCount}
              color={itemColor}
              delay={delay + 0.05 + index * 0.05}
            />
          ))
        )}
      </div>
    </motion.div>
  );
}
