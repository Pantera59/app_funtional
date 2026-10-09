'use client';

import { createContext, use, useCallback, useEffect, useMemo, type ReactNode } from 'react';
import { readStorage, useLocalStorage, writeStorage } from '@/hooks/use-local-storage';
import { DEFAULT_MATERIALS, STORAGE_KEYS, withDefaultMaterials } from '@/lib/domain/constants';
import { DEFAULT_RULES_PROFILE } from '@/lib/domain/functional/default-profile';
import { DEFAULT_EXERCISE_BANK } from '@/lib/domain/functional/exercise-bank';
import { appendClassRecord, generateFunctionalClass } from '@/lib/domain/functional/generate-functional-class';
import type { BankExercise, ClassRecord, FunctionalOptions, RulesProfile } from '@/lib/domain/functional/types';
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
  rulesProfile: RulesProfile;
  setRulesProfile: (next: RulesProfile | ((prev: RulesProfile) => RulesProfile)) => void;
  exerciseBank: BankExercise[];
  setExerciseBank: (next: BankExercise[] | ((prev: BankExercise[]) => BankExercise[])) => void;
  classHistory: ClassRecord[];
  clearClassHistory: () => void;
  /** Functional mode: uses the rules profile, the bank filtered by active material, and the class history. */
  generateFunctionalPlan: (options: Omit<FunctionalOptions, 'availableMaterials'>) => WorkoutPlan;
}

const AppStateContext = createContext<AppState | null>(null);

const NO_PLAN: WorkoutPlan | null = null;
const NO_HISTORY: WorkoutPlan[] = [];
const NO_CLASSES: ClassRecord[] = [];

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

  const [rulesProfile, setRulesProfile] = useLocalStorage(STORAGE_KEYS.rulesProfile, DEFAULT_RULES_PROFILE);
  const [exerciseBank, setExerciseBank] = useLocalStorage(STORAGE_KEYS.exerciseBank, DEFAULT_EXERCISE_BANK);
  const [classHistory, setClassHistory] = useLocalStorage(STORAGE_KEYS.classHistory, NO_CLASSES);

  useEffect(() => {
    const migrated = migrateLegacyMaterials();
    if (migrated) setMaterials(migrated);
    // Data saved before the functional material existed gets it appended once.
    setMaterials((prev) => withDefaultMaterials(prev));
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

  const generateFunctionalPlan = useCallback(
    (options: Omit<FunctionalOptions, 'availableMaterials'>) => {
      const history = readStorage(STORAGE_KEYS.classHistory, NO_CLASSES);
      const { plan: next, record } = generateFunctionalClass(
        { ...options, availableMaterials: activeMaterialNames },
        rulesProfile,
        exerciseBank,
        { history },
      );
      setClassHistory(appendClassRecord(history, record));
      setPlan(next);
      return next;
    },
    [activeMaterialNames, rulesProfile, exerciseBank, setClassHistory, setPlan],
  );

  const clearClassHistory = useCallback(() => setClassHistory(NO_CLASSES), [setClassHistory]);

  const activatePlanB = useCallback(() => setPlan((prev) => prev && applyPlanB(prev)), [setPlan]);

  const updateBlockNote = useCallback(
    (blockId: string, note: string) => setPlan((prev) => prev && applyBlockNote(prev, blockId, note)),
    [setPlan],
  );

  const value = useMemo(
    () => ({
      plan,
      materials,
      activeMaterialNames,
      setMaterials,
      generatePlan,
      activatePlanB,
      updateBlockNote,
      rulesProfile,
      setRulesProfile,
      exerciseBank,
      setExerciseBank,
      classHistory,
      clearClassHistory,
      generateFunctionalPlan,
    }),
    [
      plan,
      materials,
      activeMaterialNames,
      setMaterials,
      generatePlan,
      activatePlanB,
      updateBlockNote,
      rulesProfile,
      setRulesProfile,
      exerciseBank,
      setExerciseBank,
      classHistory,
      clearClassHistory,
      generateFunctionalPlan,
    ],
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
