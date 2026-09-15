'use client';

import { createContext, use, useCallback, useEffect, useMemo, type ReactNode } from 'react';
import { readStorage, useLocalStorage, writeStorage } from '@/hooks/use-local-storage';
import { DEFAULT_MATERIALS, STORAGE_KEYS } from '@/lib/domain/constants';
import { appendToHistory, generateWorkout } from '@/lib/domain/generate-workout';
import { activatePlanB as applyPlanB, updateBlockNote as applyBlockNote } from '@/lib/domain/plan-rules';
import type { Material, WorkoutOptions, WorkoutPlan } from '@/lib/domain/types';

interface AppState {
  plan: WorkoutPlan | null;
  materials: Material[];
  activeMaterialNames: string[];
  setMaterials: (next: Material[] | ((prev: Material[]) => Material[])) => void;
  generatePlan: (options: Omit<WorkoutOptions, 'availableMaterials'>) => WorkoutPlan;
  activatePlanB: () => void;
  updateBlockNote: (blockId: string, note: string) => void;
}

const AppStateContext = createContext<AppState | null>(null);

const NO_PLAN: WorkoutPlan | null = null;
const NO_HISTORY: WorkoutPlan[] = [];

/** The Vite version stored only the names of active materials; rebuild full records from them once. */
function migrateLegacyMaterials(): Material[] | null {
  try {
    if (localStorage.getItem(STORAGE_KEYS.materials) !== null) return null;
    const legacy = localStorage.getItem(STORAGE_KEYS.legacyMaterials);
    if (!legacy) return null;
    const names = JSON.parse(legacy) as string[];
    return DEFAULT_MATERIALS.map((m) => ({ ...m, active: names.includes(m.name) }));
  } catch {
    return null;
  }
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [plan, setPlan] = useLocalStorage(STORAGE_KEYS.plan, NO_PLAN);
  const [materials, setMaterials] = useLocalStorage(STORAGE_KEYS.materials, DEFAULT_MATERIALS);

  useEffect(() => {
    const migrated = migrateLegacyMaterials();
    if (migrated) setMaterials(migrated);
  }, [setMaterials]);

  const activeMaterialNames = useMemo(() => materials.filter((m) => m.active).map((m) => m.name), [materials]);

  const generatePlan = useCallback(
    (options: Omit<WorkoutOptions, 'availableMaterials'>) => {
      const history = readStorage(STORAGE_KEYS.history, NO_HISTORY);
      const next = generateWorkout({ ...options, availableMaterials: activeMaterialNames }, { history });
      writeStorage(STORAGE_KEYS.history, appendToHistory(history, next));
      setPlan(next);
      return next;
    },
    [activeMaterialNames, setPlan],
  );

  const activatePlanB = useCallback(() => setPlan((prev) => prev && applyPlanB(prev)), [setPlan]);

  const updateBlockNote = useCallback(
    (blockId: string, note: string) => setPlan((prev) => prev && applyBlockNote(prev, blockId, note)),
    [setPlan],
  );

  const value = useMemo(
    () => ({ plan, materials, activeMaterialNames, setMaterials, generatePlan, activatePlanB, updateBlockNote }),
    [plan, materials, activeMaterialNames, setMaterials, generatePlan, activatePlanB, updateBlockNote],
  );

  return <AppStateContext value={value}>{children}</AppStateContext>;
}

export function useAppState() {
  const state = use(AppStateContext);
  if (!state) throw new Error('useAppState must be used inside <AppStateProvider>');
  return state;
}

/** For components rendered inside <PlanGate>, where a plan is guaranteed. */
export function useCurrentPlan() {
  const { plan } = useAppState();
  if (!plan) throw new Error('useCurrentPlan must be used inside <PlanGate>');
  return plan;
}
