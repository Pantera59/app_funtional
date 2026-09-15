'use client';

import { useEffect, useState } from 'react';

/** One countdown shared by several blocks; starting another block restarts it. */
export function useCountdown() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [running, setRunning] = useState(false);

  const isRunning = running && timeLeft > 0;

  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => setTimeLeft((prev) => Math.max(0, prev - 1)), 1000);
    return () => clearInterval(interval);
  }, [isRunning]);

  const toggle = (id: string, seconds: number) => {
    if (id === activeId) {
      setRunning(!isRunning);
      return;
    }
    setActiveId(id);
    setTimeLeft(seconds);
    setRunning(true);
  };

  const reset = (seconds: number) => {
    setTimeLeft(seconds);
    setRunning(false);
  };

  const adjust = (deltaSeconds: number) => {
    setTimeLeft((prev) => Math.max(0, prev + deltaSeconds));
    if (!isRunning) setRunning(false);
  };

  return { activeId, timeLeft, isRunning, toggle, reset, adjust };
}
