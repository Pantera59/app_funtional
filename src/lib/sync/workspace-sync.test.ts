import { describe, expect, it } from 'vitest';
import { STORAGE_KEYS } from '@/lib/domain/constants';
import { changedSince, latestUpdate, planInitialSync, type RemoteRow } from './workspace-sync';

const row = (key: string, value: unknown, updated_at = '2026-11-01T10:00:00Z'): RemoteRow => ({ key, value, updated_at });

describe('planInitialSync', () => {
  it('lets the server copy win and uploads what the server lacks', () => {
    const local: Record<string, string> = {
      [STORAGE_KEYS.exerciseBank]: '[{"id":"local"}]',
      [STORAGE_KEYS.materials]: '[{"name":"Pelota"}]',
    };
    const plan = planInitialSync([row(STORAGE_KEYS.exerciseBank, [{ id: 'remote' }])], (key) => local[key] ?? null);

    expect(plan.apply).toEqual([{ key: STORAGE_KEYS.exerciseBank, value: [{ id: 'remote' }] }]);
    expect(plan.push).toEqual([{ key: STORAGE_KEYS.materials, value: [{ name: 'Pelota' }] }]);
  });

  it('never pushes null or corrupt local values', () => {
    const local: Record<string, string> = { [STORAGE_KEYS.plan]: 'null', [STORAGE_KEYS.rulesProfile]: '{oops' };
    const plan = planInitialSync([], (key) => local[key] ?? null);
    expect(plan.push).toEqual([]);
    expect(plan.apply).toEqual([]);
  });
});

describe('changedSince', () => {
  const rows = [
    row(STORAGE_KEYS.exerciseBank, [], '2026-11-02T00:00:00Z'),
    row(STORAGE_KEYS.materials, [], '2026-10-01T00:00:00Z'),
    row(STORAGE_KEYS.plan, {}, '2026-11-03T00:00:00Z'),
    row('unknown_key', {}, '2026-11-03T00:00:00Z'),
  ];

  it('returns only newer rows of known keys without a pending upload', () => {
    const changed = changedSince(rows, '2026-11-01T00:00:00Z', new Set([STORAGE_KEYS.plan]));
    expect(changed.map((r) => r.key)).toEqual([STORAGE_KEYS.exerciseBank]);
  });

  it('tracks the newest timestamp', () => {
    expect(latestUpdate(rows, null)).toBe('2026-11-03T00:00:00Z');
    expect(latestUpdate([], '2026-01-01T00:00:00Z')).toBe('2026-01-01T00:00:00Z');
  });
});
