'use client';

import { memo } from 'react';
import FloatingParticles from '@/components/atoms/FloatingParticles';
import GlowEffect from '@/components/atoms/GlowEffect';
import ScanlineOverlay from '@/components/atoms/ScanlineOverlay';
import { useIsMobile } from '@/lib/hooks/useMediaQuery';

/**
 * Combines all decorative background layers for the home hero section:
 * cyber grid, glow effects, floating particles, and scanline overlay.
 */
function CyberBackgroundInner() {
  const isMobile = useIsMobile();

  return (
    <>
      {/* Cyber grid background */}
      <div className="absolute inset-0 cyber-grid opacity-15" />

      {/* Animated glow effects */}
      <GlowEffect
        color="white"
        size="xl"
        position={{ top: '30%', right: '20%' }}
        opacity={0.15}
        blur="lg"
        animationType="pulse"
        duration={4}
      />
      <GlowEffect
        color="white"
        size="lg"
        position={{ bottom: '30%', left: '20%' }}
        opacity={0.1}
        blur="lg"
        animationType="pulse"
        duration={5}
        delay={1}
      />

      {/* Floating particles — single instance, count adapts to viewport */}
      <FloatingParticles count={isMobile ? 8 : 15} color="bg-white" />

      {/* Scanline effect — CSS-only, respects lowPerformanceMode */}
      <ScanlineOverlay />
    </>
  );
}

const CyberBackground = memo(CyberBackgroundInner);
export default CyberBackground;
