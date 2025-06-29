'use client';

import { useEffect, useState } from 'react';

interface PerformanceMetrics {
  fps: number;
  memory?: {
    usedJSHeapSize: number;
    totalJSHeapSize: number;
    jsHeapSizeLimit: number;
  };
  renderTime: number;
}

export function PerformanceMonitor({ enabled = false }: { enabled?: boolean }) {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 0,
    renderTime: 0
  });

  useEffect(() => {
    if (!enabled) return;

    let frameCount = 0;
    let lastTime = performance.now();
    let animationId: number;

    const measureFPS = () => {
      frameCount++;
      const currentTime = performance.now();
      
      if (currentTime >= lastTime + 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        
        // Get memory info if available
        const memory = (performance as any).memory ? {
          usedJSHeapSize: (performance as any).memory.usedJSHeapSize,
          totalJSHeapSize: (performance as any).memory.totalJSHeapSize,
          jsHeapSizeLimit: (performance as any).memory.jsHeapSizeLimit
        } : undefined;

        setMetrics({
          fps,
          memory,
          renderTime: Math.round(currentTime - lastTime) / frameCount
        });

        frameCount = 0;
        lastTime = currentTime;
      }

      animationId = requestAnimationFrame(measureFPS);
    };

    animationId = requestAnimationFrame(measureFPS);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-4 rounded-lg text-xs font-mono z-50">
      <div>FPS: {metrics.fps}</div>
      <div>Render: {metrics.renderTime.toFixed(2)}ms</div>
      {metrics.memory && (
        <>
          <div>Memory: {(metrics.memory.usedJSHeapSize / 1048576).toFixed(2)}MB</div>
          <div>Total: {(metrics.memory.totalJSHeapSize / 1048576).toFixed(2)}MB</div>
        </>
      )}
    </div>
  );
}

// Performance optimization hooks
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export function useThrottle<T>(value: T, limit: number): T {
  const [throttledValue, setThrottledValue] = useState(value);
  const [lastRun, setLastRun] = useState(Date.now());

  useEffect(() => {
    const handler = setTimeout(() => {
      if (Date.now() - lastRun >= limit) {
        setThrottledValue(value);
        setLastRun(Date.now());
      }
    }, limit - (Date.now() - lastRun));

    return () => {
      clearTimeout(handler);
    };
  }, [value, limit, lastRun]);

  return throttledValue;
}