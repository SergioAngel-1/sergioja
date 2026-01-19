import { useState, useEffect, useRef } from 'react';

interface UseModelAnimationOptions {
  duration?: number;
  lowPerformanceMode: boolean;
  onComplete?: () => void;
  invalidate?: () => void;
}

export function useModelAnimation({
  duration = 800,
  lowPerformanceMode,
  onComplete,
  invalidate,
}: UseModelAnimationOptions) {
  const [progress, setProgress] = useState(0);
  const calledRef = useRef(false);

  // Animación de entrada
  useEffect(() => {
    if (lowPerformanceMode) {
      setProgress(1);
      return;
    }

    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const rawProgress = Math.min(elapsed / duration, 1);

      // Easing function (ease-out cubic)
      const eased = 1 - Math.pow(1 - rawProgress, 3);
      setProgress(eased);
      invalidate?.();

      if (rawProgress < 1) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  }, [lowPerformanceMode, duration, invalidate]);

  // Callback cuando completa
  useEffect(() => {
    if (progress >= 1 && !calledRef.current) {
      calledRef.current = true;
      onComplete?.();
    }
  }, [progress, onComplete]);

  return progress;
}
