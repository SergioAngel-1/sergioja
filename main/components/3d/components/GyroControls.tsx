import { fluidSizing } from '@/lib/fluidSizing';

interface GyroControlsProps {
  showButton: boolean;
  gyroEnabled: boolean;
  lowPerformanceMode: boolean;
  onEnableGyro: () => void;
  enableLabel: string;
  movePhoneLabel: string;
}

export function GyroControls({
  showButton,
  gyroEnabled,
  lowPerformanceMode,
  onEnableGyro,
  enableLabel,
  movePhoneLabel,
}: GyroControlsProps) {
  if (gyroEnabled && !lowPerformanceMode) {
    return (
      <div
        className="fixed left-1/2 -translate-x-1/2 z-10 pointer-events-none font-mono text-fluid-xs text-white/80 bg-black/40 border border-white/20 rounded-full backdrop-blur-sm whitespace-nowrap"
        style={{
          bottom: `calc(${fluidSizing.space.xl} + env(safe-area-inset-bottom))`,
          padding: `${fluidSizing.space.xs} ${fluidSizing.space.sm}`,
        }}
      >
        {movePhoneLabel}
      </div>
    );
  }

  if (showButton) {
    return (
      <button
        onClick={onEnableGyro}
        className="fixed left-1/2 -translate-x-1/2 bg-black text-white rounded-lg border-2 border-white shadow-lg hover:bg-white hover:text-black transition-colors duration-200 font-bold z-10 text-fluid-sm whitespace-nowrap"
        style={{
          bottom: `calc(${fluidSizing.space.xl} + env(safe-area-inset-bottom))`,
          padding: `${fluidSizing.space.sm} ${fluidSizing.space.md}`,
        }}
      >
        {enableLabel}
      </button>
    );
  }

  return null;
}
