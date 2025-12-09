'use client';

import { motion } from 'framer-motion';
import Icon from '../atoms/Icon';
import TopItemCard from './TopItemCard';
import { fluidSizing } from '@/lib/fluidSizing';

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
      className="bg-admin-dark-elevated border border-admin-primary/20 rounded-lg"
      style={{ padding: fluidSizing.space.lg }}
    >
      {/* Header */}
      <div className="flex items-center" style={{ gap: fluidSizing.space.sm, marginBottom: fluidSizing.space.lg }}>
        <div className="rounded-lg bg-white/10 border border-white/20 flex items-center justify-center" style={{ width: fluidSizing.size.buttonMd, height: fluidSizing.size.buttonMd }}>
          <Icon name={icon} size={20} className="text-white" />
        </div>
        <div>
          <h3 className="font-orbitron font-bold text-admin-primary" style={{ fontSize: fluidSizing.text.lg }}>
            {title}
          </h3>
          <p className="text-text-muted" style={{ fontSize: fluidSizing.text.xs }}>{subtitle}</p>
        </div>
      </div>

      {/* Items List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: fluidSizing.space.sm }}>
        {items.length === 0 ? (
          <p className="text-text-muted text-center" style={{ padding: `${fluidSizing.space['2xl']} 0`, fontSize: fluidSizing.text.sm }}>{emptyMessage}</p>
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
