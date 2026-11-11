'use client';

import { createContext, use, useEffect, useState, type ReactNode } from 'react';
import { readRawStorage, subscribeStorage, writeStorage } from '@/hooks/use-local-storage';
import { canAccess } from '@/lib/auth/roles';
import { STORAGE_KEYS, withDefaultMaterials } from '@/lib/domain/constants';
import type { Material } from '@/lib/domain/types';
import { getSupabase } from '@/lib/supabase/client';
import {
  changedSince,
  latestUpdate,
  planInitialSync,
  SYNCED_KEYS,
  type RemoteRow,
  type SyncedKey,
} from '@/lib/sync/workspace-sync';
import { useAuth } from './auth-provider';

/** `off`: local mode, or nobody with coach access is signed in. */
export type SyncStatus = 'off' | 'syncing' | 'saved' | 'error';

const SyncStatusContext = createContext<SyncStatus>('off');

const PUSH_DELAY_MS = 800;

/** Materials saved before a built-in material existed get it appended, as the app state provider does locally. */
function normalise(key: SyncedKey, value: unknown) {
  return key === STORAGE_KEYS.materials && Array.isArray(value) ? withDefaultMaterials(value as Material[]) : value;
}

/**
 * Mirrors the coach workspace between localStorage and Supabase while an admin is signed in.
 * The rest of the app keeps reading localStorage exactly as before, so no component had to change.
 * Conflicts are last-write-wins per key; the server copy is pulled again when the tab regains focus.
 */
export function WorkspaceSyncProvider({ children }: { children: ReactNode }) {
  const { auth } = useAuth();
  const [status, setStatus] = useState<SyncStatus>('off');
  const userId = auth.status === 'signed-in' && canAccess(auth.profile.role, 'coach') ? auth.profile.id : null;

  useEffect(() => {
    if (!userId) return;
    const supabase = getSupabase();
    let disposed = false;
    /** Raw JSON last exchanged with the server per key: a local change equal to it isn't uploaded again. */
    const lastSynced = new Map<string, string>();
    const timers = new Map<string, ReturnType<typeof setTimeout>>();
    const pending = new Set<string>();
    let pulledAt: string | null = null;
    const unsubscribers: (() => void)[] = [];

    const applyRemote = (key: SyncedKey, value: unknown) => {
      const normalised = normalise(key, value);
      lastSynced.set(key, JSON.stringify(value));
      writeStorage(key, normalised);
    };

    const push = async (key: SyncedKey, value: unknown) => {
      const raw = JSON.stringify(value);
      const { data, error } = await supabase
        .from('workspace_state')
        .upsert({ key, value, updated_at: new Date().toISOString(), updated_by: userId })
        .select('updated_at')
        .single<{ updated_at: string }>();
      if (disposed) return;
      pending.delete(key);
      if (error) {
        setStatus('error');
        return;
      }
      lastSynced.set(key, raw);
      pulledAt = latestUpdate([{ key, value, updated_at: data.updated_at }], pulledAt);
      if (pending.size === 0) setStatus('saved');
    };

    const onLocalChange = (key: SyncedKey) => {
      const raw = readRawStorage(key);
      if (raw === null || raw === lastSynced.get(key)) return;
      let value: unknown;
      try {
        value = JSON.parse(raw);
      } catch {
        return;
      }
      if (value === null) return;
      pending.add(key);
      setStatus('syncing');
      clearTimeout(timers.get(key));
      timers.set(key, setTimeout(() => void push(key, value), PUSH_DELAY_MS));
    };

    const fetchRows = async () => {
      const { data, error } = await supabase.from('workspace_state').select('key, value, updated_at');
      return error ? null : ((data ?? []) as RemoteRow[]);
    };

    const pullChanges = async () => {
      const rows = await fetchRows();
      if (disposed || !rows) return;
      for (const row of changedSince(rows, pulledAt, pending)) applyRemote(row.key as SyncedKey, row.value);
      pulledAt = latestUpdate(rows, pulledAt);
    };

    const start = async () => {
      setStatus('syncing');
      const rows = await fetchRows();
      if (disposed) return;
      if (!rows) {
        setStatus('error');
        return;
      }
      const initial = planInitialSync(rows, readRawStorage);
      for (const { key, value } of initial.apply) applyRemote(key, value);
      pulledAt = latestUpdate(rows, null);
      await Promise.all(initial.push.map(({ key, value }) => push(key, value)));
      if (disposed) return;

      for (const key of SYNCED_KEYS) {
        unsubscribers.push(subscribeStorage(key, () => onLocalChange(key)));
        // Catches a normalisation (e.g. appended materials) made while applying the server copy.
        onLocalChange(key);
      }
      if (pending.size === 0) setStatus((prev) => (prev === 'error' ? prev : 'saved'));
    };

    const onVisible = () => {
      if (document.visibilityState === 'visible') void pullChanges();
    };
    document.addEventListener('visibilitychange', onVisible);
    void start();

    return () => {
      disposed = true;
      document.removeEventListener('visibilitychange', onVisible);
      unsubscribers.forEach((unsubscribe) => unsubscribe());
      timers.forEach((timer) => clearTimeout(timer));
      setStatus('off');
    };
  }, [userId]);

  return <SyncStatusContext value={userId ? status : 'off'}>{children}</SyncStatusContext>;
}

export const useSyncStatus = () => use(SyncStatusContext);
