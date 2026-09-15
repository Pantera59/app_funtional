import { describe, expect, it } from 'vitest';
import { CLASS_DURATION_MINUTES, DEFAULT_MATERIALS, HISTORY_SIZE, isBodyweight } from './constants';
import { appendToHistory, generateWorkout, type GenerateWorkoutDeps } from './generate-workout';
import type { Focus, WorkoutOptions, WorkoutPlan } from './types';

const ALL_MATERIALS = DEFAULT_MATERIALS.map((m) => m.name);

const options = (overrides: Partial<WorkoutOptions> = {}): WorkoutOptions => ({
  focus: 'Full Body',
  limitedEquipment: false,
  restrictions: [],
  startTime: '07:00',
  availableMaterials: ALL_MATERIALS,
  ...overrides,
});

const deps = (overrides: Partial<GenerateWorkoutDeps> = {}): GenerateWorkoutDeps => {
  let id = 0;
  return {
    random: () => 0.3,
    createId: () => `id-${++id}`,
    now: () => new Date('2026-09-14T12:00:00Z'),
    ...overrides,
  };
};

const allExercises = (plan: WorkoutPlan) => plan.blocks.flatMap((b) => b.exercises);

describe('generateWorkout', () => {
  it('builds the four fixed blocks of a 60-minute class', () => {
    const plan = generateWorkout(options(), deps());

    expect(plan.blocks.map((b) => [b.type, b.durationMinutes])).toEqual([
      ['Calentamiento', 10],
      ['Fuerza', 20],
      ['Metabólico', 20],
      ['Cierre', 10],
    ]);
    expect(plan.blocks.reduce((sum, b) => sum + b.durationMinutes, 0)).toBe(CLASS_DURATION_MINUTES);
    expect(plan.blocks.map((b) => b.exercises.length)).toEqual([3, 4, 4, 1]);
    expect(plan.planBActivated).toBe(false);
  });

  it.each<[Focus, string]>([
    ['Lower Body', 'Squat'],
    ['Upper Body', 'Push'],
    ['Full Body', 'Hinge'],
  ])('uses the %s focus to pick a %s main lift', (focus, pattern) => {
    const plan = generateWorkout(options({ focus }), deps());
    expect(plan.blocks[1].exercises[0].baseExercise.pattern).toBe(pattern);
  });

  it('switches to A/B and partner formats when equipment is limited', () => {
    const plan = generateWorkout(options({ limitedEquipment: true }), deps());
    expect(plan.blocks[1].format).toBe('A/B');
    expect(plan.blocks[2].format).toBe('Parejas 1:1');
  });

  it('chooses AMRAP or EMOM for the metabolic block, with EMOM rep schemes', () => {
    const amrap = generateWorkout(options(), deps({ random: () => 0.9 }));
    const emom = generateWorkout(options(), deps({ random: () => 0.1 }));

    expect(amrap.blocks[2].format).toBe('AMRAP');
    expect(amrap.blocks[2].exercises.map((e) => e.reps)).toEqual(['15 reps', '20 reps', '12 reps', '15 reps']);
    expect(emom.blocks[2].format).toBe('EMOM');
    expect(emom.blocks[2].exercises.map((e) => e.reps)).toEqual(['12 reps', '12 reps', '10 reps', '15 reps']);
  });

  it('only uses bodyweight exercises when no material is active', () => {
    const plan = generateWorkout(options({ availableMaterials: [] }), deps());
    for (const exercise of allExercises(plan)) {
      expect(isBodyweight(exercise.baseExercise.equipmentNeeded)).toBe(true);
    }
  });

  it('never requires equipment that is not active', () => {
    const plan = generateWorkout(options({ availableMaterials: ['Kettlebell'] }), deps());
    for (const { baseExercise } of allExercises(plan)) {
      expect(isBodyweight(baseExercise.equipmentNeeded) || baseExercise.equipmentNeeded === 'Kettlebell').toBe(true);
    }
  });

  it('swaps exercises for active restrictions and records which one applied', () => {
    const plan = generateWorkout(options({ restrictions: ['Sin-Impacto'], availableMaterials: [] }), deps());
    const warmupCardio = plan.blocks[0].exercises[2];

    expect(warmupCardio.baseExercise.name).toBe('Burpees');
    expect(warmupCardio.actualName).toBe('Burpee Caminado (Step-back)');
    expect(warmupCardio.appliedRestriction).toBe('Sin-Impacto');
  });

  it('leaves exercises unchanged when a restriction does not affect them', () => {
    const plan = generateWorkout(options({ restrictions: ['Sin-Empuje-Vertical'], availableMaterials: [] }), deps());
    const pushUps = plan.blocks[2].exercises[3];

    expect(pushUps.actualName).toBe(pushUps.baseExercise.name);
    expect(pushUps.appliedRestriction).toBeUndefined();
  });

  it('avoids the main lift of recent classes when alternatives exist', () => {
    const first = generateWorkout(options({ focus: 'Lower Body' }), deps());
    const usedIds = new Set(allExercises(first).map((e) => e.baseExercise.id));

    const second = generateWorkout(options({ focus: 'Lower Body' }), deps({ history: [first] }));
    expect(usedIds.has(second.blocks[1].exercises[0].baseExercise.id)).toBe(false);
  });
});

describe('appendToHistory', () => {
  it(`keeps only the last ${HISTORY_SIZE} plans`, () => {
    const plans = Array.from({ length: HISTORY_SIZE + 2 }, () => generateWorkout(options(), deps()));
    const history = plans.reduce<WorkoutPlan[]>(appendToHistory, []);

    expect(history).toHaveLength(HISTORY_SIZE);
    expect(history.at(-1)).toBe(plans.at(-1));
  });
});
