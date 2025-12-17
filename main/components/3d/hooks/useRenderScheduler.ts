import { useMemo, useEffect, useRef } from 'react';

export function useRenderScheduler(invalidate: () => void) {
  const smoothUntilRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const lastInvalidateRef = useRef(0);

  const schedule = useMemo(() => {
    return (ms: number) => {
      const now = performance.now();
      if (now + ms > smoothUntilRef.current) smoothUntilRef.current = now + ms;
      
      if (rafRef.current == null) {
        const pump = () => {
          const t = performance.now();
          if (t < smoothUntilRef.current) {
            // Throttle renders to ~30fps
            if (t - lastInvalidateRef.current >= 33) {
              lastInvalidateRef.current = t;
              invalidate();
            }
            rafRef.current = requestAnimationFrame(pump);
          } else {
            // Cleanup RAF when animation completes
            if (rafRef.current != null) {
              cancelAnimationFrame(rafRef.current);
            }
            rafRef.current = null;
          }
        };
        rafRef.current = requestAnimationFrame(pump);
      }
    };
  }, [invalidate]);

  // Cleanup RAF on unmount
  useEffect(() => {
    return () => {
      if (rafRef.current != null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      smoothUntilRef.current = 0;
    };
  }, []);

  return schedule;
}
