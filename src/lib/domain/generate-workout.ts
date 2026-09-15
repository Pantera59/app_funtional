import { HISTORY_SIZE, isBodyweight } from './constants';
import { EXERCISES } from './exercises';
import type {
  BlockType,
  Exercise,
  Focus,
  MovementPattern,
  WorkoutBlock,
  WorkoutExercise,
  WorkoutFormat,
  WorkoutOptions,
  WorkoutPlan,
} from './types';

const STRENGTH_PATTERN: Record<Focus, MovementPattern> = {
  'Lower Body': 'Squat',
  'Upper Body': 'Push',
  'Full Body': 'Hinge',
};

export interface GenerateWorkoutDeps {
  exercises?: Exercise[];
  /** Previous plans; exercises from the last HISTORY_SIZE are avoided when possible. */
  history?: WorkoutPlan[];
  random?: () => number;
  createId?: () => string;
  now?: () => Date;
}

const bodyweightOnly = (exercise: Exercise) => isBodyweight(exercise.equipmentNeeded);

function shuffle<T>(items: T[], random: () => number): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Builds a 60-minute class: Calentamiento (10) → Fuerza (20) → Metabólico (20) → Cierre (10).
 * Pure: history, randomness, ids and time are injected so the rules are testable.
 */
export function generateWorkout(options: WorkoutOptions, deps: GenerateWorkoutDeps = {}): WorkoutPlan {
  const {
    exercises = EXERCISES,
    history = [],
    random = Math.random,
    createId = () => crypto.randomUUID(),
    now = () => new Date(),
  } = deps;
  const { focus, limitedEquipment, restrictions, startTime, availableMaterials } = options;

  const recentIds = new Set(
    history.slice(-HISTORY_SIZE).flatMap((plan) => plan.blocks.flatMap((b) => b.exercises.map((e) => e.baseExercise.id))),
  );
  const materials = availableMaterials.map((m) => m.toLowerCase());
  const hasEquipment = (e: Exercise) => bodyweightOnly(e) || materials.includes(e.equipmentNeeded.toLowerCase());

  const fallback = (pattern: MovementPattern): Exercise =>
    exercises.find((e) => e.pattern === pattern && bodyweightOnly(e)) ?? exercises.find(bodyweightOnly) ?? exercises[0];

  /** Exercises of a pattern the gym can do today, preferring ones not used recently. */
  const poolFor = (pattern: MovementPattern): Exercise[] => {
    const pool = exercises.filter((e) => e.pattern === pattern && hasEquipment(e));
    if (pool.length === 0) return [fallback(pattern)];
    const fresh = pool.filter((e) => !recentIds.has(e.id));
    return fresh.length > 0 ? fresh : pool;
  };

  const pick = (pattern: MovementPattern, predicate: (e: Exercise) => boolean = () => true) =>
    poolFor(pattern).find(predicate) ?? fallback(pattern);

  const pickRandom = (pattern: MovementPattern, count: number) => {
    const picked = shuffle(poolFor(pattern), random);
    return Array.from({ length: count }, (_, i) => picked[i] ?? fallback(pattern));
  };

  /** Applies the first active restriction that swaps this exercise for a safer variant. */
  const entry = (exercise: Exercise, reps: string): WorkoutExercise => {
    const applied = restrictions.find((r) => {
      const swap = exercise.restrictionSwaps[r];
      return Boolean(swap) && swap !== exercise.name;
    });
    return {
      baseExercise: exercise,
      actualName: applied ? exercise.restrictionSwaps[applied] : exercise.name,
      appliedRestriction: applied,
      reps,
    };
  };

  const block = (
    type: BlockType,
    name: string,
    durationMinutes: number,
    format: WorkoutFormat,
    blockExercises: WorkoutExercise[],
    extra: Partial<WorkoutBlock> = {},
  ): WorkoutBlock => ({
    id: createId(),
    type,
    name,
    durationMinutes,
    format,
    exercises: blockExercises,
    started: false,
    completed: false,
    coachNotes: '',
    ...extra,
  });

  const metabolicFormat: WorkoutFormat = limitedEquipment ? 'Parejas 1:1' : random() > 0.5 ? 'AMRAP' : 'EMOM';
  const isEmom = metabolicFormat === 'EMOM';
  const [strength] = pickRandom(STRENGTH_PATTERN[focus], 1);
  const [met1, met2, met3] = pickRandom('Metabolic', 3);

  return {
    id: createId(),
    date: now().toISOString(),
    startTime,
    focus,
    limitedEquipment,
    restrictions,
    coachNotes: 'Mantener buena técnica en las transiciones.',
    planBActivated: false,
    blocks: [
      block('Calentamiento', 'Movilidad y Activación', 10, 'Circuit', [
        entry(pick('Mobility'), '1 min / lado'),
        entry(pick('Core'), '30 seg'),
        entry(pick('Metabolic', bodyweightOnly), '10 reps (suave)'),
      ]),
      block('Fuerza', `Fuerza Principal - ${focus}`, 20, limitedEquipment ? 'A/B' : 'Circuit', [
        entry(strength, '4 x 8'),
        entry(pick('Pull'), '4 x 8'),
        entry(pick('Core'), '4 x 12'),
        entry(pick('Squat', bodyweightOnly), '4 x 10 / pierna'),
      ]),
      block(
        'Metabólico',
        'Acondicionamiento (WOD)',
        20,
        metabolicFormat,
        [
          entry(met1, isEmom ? '12 reps' : '15 reps'),
          entry(met2, isEmom ? '12 reps' : '20 reps'),
          entry(met3, isEmom ? '10 reps' : '12 reps'),
          entry(pick('Push', bodyweightOnly), '15 reps'),
        ],
        { originalDurationMinutes: 20 },
      ),
      block('Cierre', 'Vuelta a la Calma', 10, 'Flow', [
        { baseExercise: fallback('Mobility'), actualName: 'Estiramientos Libres', reps: '10 mins' },
      ]),
    ],
  };
}

export const appendToHistory = (history: WorkoutPlan[], plan: WorkoutPlan) =>
  [...history, plan].slice(-HISTORY_SIZE);
