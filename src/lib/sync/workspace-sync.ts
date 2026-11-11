import { STORAGE_KEYS } from '@/lib/domain/constants';

/** localStorage keys mirrored to the `workspace_state` table. Must match its CHECK constraint. */
export const SYNCED_KEYS = [
  STORAGE_KEYS.materials,
  STORAGE_KEYS.rulesProfile,
  STORAGE_KEYS.exerciseBank,
  STORAGE_KEYS.classHistory,
  STORAGE_KEYS.plan,
] as const;

export type SyncedKey = (typeof SYNCED_KEYS)[number];

export interface RemoteRow {
  key: string;
  value: unknown;
  updated_at: string;
}

export interface InitialSync {
  /** Remote values to write into localStorage (the shared copy wins). */
  apply: { key: SyncedKey; value: unknown }[];
  /** Local values the server doesn't have yet: the first coach to sign in uploads their browser's data. */
  push: { key: SyncedKey; value: unknown }[];
}

/**
 * First sync after an admin signs in. The server copy wins where it exists, so every coach sees the same bank;
 * keys the server lacks are seeded from this browser. JSON `null` is never pushed (the column is NOT NULL).
 */
export function planInitialSync(rows: RemoteRow[], readLocal: (key: SyncedKey) => string | null): InitialSync {
  const remote = new Map(rows.map((row) => [row.key, row]));
  const result: InitialSync = { apply: [], push: [] };

  for (const key of SYNCED_KEYS) {
    const row = remote.get(key);
    if (row && row.value !== null) {
      result.apply.push({ key, value: row.value });
      continue;
    }
    const raw = readLocal(key);
    if (raw === null) continue;
    try {
      const value: unknown = JSON.parse(raw);
      if (value !== null) result.push.push({ key, value });
    } catch {
      // Corrupt local data: nothing worth uploading.
    }
  }
  return result;
}

/** Rows changed on the server since the last pull, skipping keys with an upload still pending here. */
export function changedSince(rows: RemoteRow[], since: string | null, pending: ReadonlySet<string>): RemoteRow[] {
  return rows.filter(
    (row) =>
      (SYNCED_KEYS as readonly string[]).includes(row.key) &&
      row.value !== null &&
      !pending.has(row.key) &&
      (since === null || row.updated_at > since),
  );
}

export const latestUpdate = (rows: RemoteRow[], current: string | null) =>
  rows.reduce<string | null>((max, row) => (max === null || row.updated_at > max ? row.updated_at : max), current);
