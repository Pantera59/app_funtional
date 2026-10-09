import type { ClassRecord } from './types';

/** Bank ids used as a station's main exercise in the last `lookback` classes (history is oldest first). */
export function recentMainIds(history: ClassRecord[], lookback: number): Set<string> {
  if (lookback <= 0) return new Set();
  return new Set(history.slice(-lookback).flatMap((record) => record.mainExerciseIds));
}

export const isFresh = (id: string, recent: Set<string>) => !recent.has(id);
