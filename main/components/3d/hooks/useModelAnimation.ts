import { useEffect, useRef, MutableRefObject } from 'react';

interface UseModelAnimationOptions {
  duration?: number;
  lowPerformanceMode: boolean;
  onComplete?: () => void;
  invalidate?: () => void;
}

// Returns a ref (not state) so reading progress in useFrame never triggers React re-renders
export function useModelAnimation({
  duration = 800,
  lowPerformanceMode,
  onComplete,
  invalidate,
}: UseModelAnimationOptions): MutableRefObject<number> {
  const progressRef = useRef(lowPerformanceMode ? 1 : 0);
  const calledRef = useRef(false);

  useEffect(() => {
    if (lowPerformanceMode) {
      progressRef.current = 1;
      if (!calledRef.current) {
        calledRef.current = true;
        onComplete?.();
      }
      return;
    }

    progressRef.current = 0;
    calledRef.current = false;
    const startTime = Date.now();
    let rafId: number;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const rawProgress = Math.min(elapsed / duration, 1);
      progressRef.current = 1 - Math.pow(1 - rawProgress, 3);
      invalidate?.();

      if (rawProgress < 1) {
        rafId = requestAnimationFrame(animate);
      } else if (!calledRef.current) {
        calledRef.current = true;
        onComplete?.();
      }
    };

    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [lowPerformanceMode, duration, invalidate]);

  return progressRef;
}
