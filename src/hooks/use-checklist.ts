'use client';

import { useCallback, useState } from 'react';

/** Tracks which exercises of a plan are ticked, keyed by block id + exercise index. */
export function useChecklist() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const isChecked = (blockId: string, index: number) => Boolean(checked[`${blockId}-${index}`]);

  const toggle = useCallback((blockId: string, index: number) => {
    const key = `${blockId}-${index}`;
    setChecked((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const count = Object.values(checked).filter(Boolean).length;

  return { isChecked, toggle, count };
}
