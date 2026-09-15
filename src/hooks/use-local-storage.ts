'use client';

import { useCallback, useState, useSyncExternalStore } from 'react';

type Listener = () => void;

const listeners = new Map<string, Set<Listener>>();
/** Parsed values cached by raw string so snapshots stay referentially stable. */
const cache = new Map<string, { raw: string; value: unknown }>();

function readRaw(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function readStorage<T>(key: string, fallback: T): T {
  const raw = readRaw(key);
  if (raw === null) return fallback;

  const cached = cache.get(key);
  if (cached?.raw === raw) return cached.value as T;

  try {
    const value = JSON.parse(raw) as T;
    cache.set(key, { raw, value });
    return value;
  } catch {
    return fallback;
  }
}

export function writeStorage<T>(key: string, value: T) {
  const raw = JSON.stringify(value);
  try {
    window.localStorage.setItem(key, raw);
  } catch {
    // Storage full or blocked (private mode): keep working in memory for this session.
  }
  cache.set(key, { raw, value });
  listeners.get(key)?.forEach((listener) => listener());
}

function subscribe(key: string, listener: Listener) {
  const keyListeners = listeners.get(key) ?? new Set<Listener>();
  listeners.set(key, keyListeners);
  keyListeners.add(listener);

  const onStorage = (event: StorageEvent) => {
    if (event.key === key) listener();
  };
  window.addEventListener('storage', onStorage);

  return () => {
    keyListeners.delete(listener);
    window.removeEventListener('storage', onStorage);
  };
}

/**
 * JSON state persisted in localStorage and shared by every component using the same key.
 * The server render and hydration use `initialValue`, so markup never mismatches.
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [initial] = useState(initialValue);

  const value = useSyncExternalStore(
    useCallback((listener: Listener) => subscribe(key, listener), [key]),
    () => readStorage(key, initial),
    () => initial,
  );

  const setValue = useCallback(
    (next: T | ((prev: T) => T)) => {
      const prev = readStorage(key, initial);
      writeStorage(key, typeof next === 'function' ? (next as (prev: T) => T)(prev) : next);
    },
    [key, initial],
  );

  return [value, setValue] as const;
}
