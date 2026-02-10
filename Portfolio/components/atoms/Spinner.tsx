'use client';

import { memo } from 'react';
import { fluidSizing } from '@/lib/utils/fluidSizing';

interface SpinnerProps {
  /** Fluid size using clamp(), defaults to a medium spinner */
  size?: string;
  /** Show a third inner ring (used in full-page loader) */
  showInnerRing?: boolean;
}

/**
 * Pure-CSS spinner with counter-rotating rings.
 * No Framer Motion — zero JS animation overhead.
 */
function SpinnerInner({ size, showInnerRing = false }: SpinnerProps) {
  return (
    <div
      className="relative"
      style={{ width: size || fluidSizing.size.buttonLg, height: size || fluidSizing.size.buttonLg }}
    >
      {/* Outer ring */}
      <div className="absolute inset-0 border-4 border-white/30 border-t-white rounded-full animate-spin" />
      {/* Middle ring */}
      <div
        className="absolute inset-2 border-4 border-white/20 border-b-white rounded-full"
        style={{ animation: 'spin 1.5s linear infinite reverse' }}
      />
      {/* Inner ring — optional, red accent */}
      {showInnerRing && (
        <div
          className="absolute inset-4 border-4 border-cyber-red/30 border-r-cyber-red rounded-full"
          style={{ animation: 'spin 2s linear infinite' }}
        />
      )}
      {/* Center dot */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="bg-cyber-red rounded-full animate-pulse"
          style={{ width: fluidSizing.space.sm, height: fluidSizing.space.sm }}
        />
      </div>
    </div>
  );
}

const Spinner = memo(SpinnerInner);
export default Spinner;
