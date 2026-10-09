import { describe, expect, it } from 'vitest';
import { hasRequiredMaterial } from './availability';
import { DEFAULT_RULES_PROFILE } from './default-profile';
import { DEFAULT_EXERCISE_BANK } from './exercise-bank';
import {
  appendClassRecord,
  generateFunctionalClass,
  type GenerateFunctionalDeps,
} from './generate-functional-class';
import { recentMainIds } from './rotation';
import type { ClassRecord, FunctionalOptions, RulesProfile } from './types';

const DUMBBELLS_AND_BAND = ['Mancuernas ligeras', 'Mancuernas medias', 'Liga elástica'];
const bankById = new Map(DEFAULT_EXERCISE_BANK.map((e) => [e.id, e]));
const bankByName = new Map(DEFAULT_EXERCISE_BANK.map((e) => [e.name, e]));

const options = (overrides: Partial<FunctionalOptions> = {}): FunctionalOptions => ({
  focus: 'Upper Body',
  startTime: '07:00',
  availableMaterials: DUMBBELLS_AND_BAND,
  ...overrides,
});

/** Deterministic pseudo-random sequence so each run explores different picks. */
function seededRandom(seed: number) {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % 2 ** 32;
    return state / 2 ** 32;
  };
}

const deps = (overrides: Partial<GenerateFunctionalDeps> = {}): GenerateFunctionalDeps => {
  let id = 0;
  return {
    random: seededRandom(7),
    createId: () => `id-${++id}`,
    now: () => new Date('2026-10-09T12:00:00Z'),
    ...overrides,
  };
};

/** Generates `count` classes in a row, feeding each record into the history. */
function generateSeries(count: number, focus: FunctionalOptions['focus'], seed: number, profile = DEFAULT_RULES_PROFILE) {
  let history: ClassRecord[] = [];
  const random = seededRandom(seed);
  const classes = [];
  for (let i = 0; i < count; i++) {
    const result = generateFunctionalClass(options({ focus }), profile, DEFAULT_EXERCISE_BANK, deps({ history, random }));
    classes.push(result);
    history = appendClassRecord(history, result.record);
  }
  return classes;
}

describe('generateFunctionalClass', () => {
  it('builds the 4 blocks in order, within the 50–55 min target', () => {
    const { plan } = generateFunctionalClass(options(), DEFAULT_RULES_PROFILE, DEFAULT_EXERCISE_BANK, deps());

    expect(plan.mode).toBe('funcional');
    expect(plan.blocks.map((b) => [b.type, b.format])).toEqual([
      ['Calentamiento', 'Circuit'],
      ['Fuerza', 'Estaciones'],
      ['Metabólico', 'Intervalos'],
      ['Cierre', 'Flow'],
    ]);
    const total = plan.blocks.reduce((sum, b) => sum + b.durationMinutes, 0);
    expect(total).toBeGreaterThanOrEqual(50);
    expect(total).toBeLessThanOrEqual(55);
  });

  it('starts the warm-up with the fixed sequence, then the activation exercises', () => {
    const { plan } = generateFunctionalClass(options(), DEFAULT_RULES_PROFILE, DEFAULT_EXERCISE_BANK, deps());
    const warmup = plan.blocks[0].exercises;

    expect(warmup.slice(0, 4).map((e) => e.actualName.split(':')[0])).toEqual(['Cuello', 'Hombros', 'Cadera', 'Piernas']);
    expect(warmup.slice(4)).toHaveLength(3);
    for (const e of warmup.slice(4)) {
      expect(bankByName.get(e.actualName)?.blocks).toContain('calentamiento');
      expect(e.reps).toBe('2 x 8–10');
    }
  });

  it('marks stations as A/B or Combo, uses allowed schemes and flags the conditional station', () => {
    const { plan } = generateFunctionalClass(options(), DEFAULT_RULES_PROFILE, DEFAULT_EXERCISE_BANK, deps());
    const strength = plan.blocks[1].exercises;
    const schemes = DEFAULT_RULES_PROFILE.strength.schemes.map((s) => s.label);

    const stations = new Set(strength.map((e) => e.station?.number));
    expect(stations.size).toBe(5);
    for (const e of strength) {
      expect(e.station).toBeDefined();
      if (e.station?.kind === 'Combo') expect(bankByName.get(e.actualName)?.combo).toBe(true);
      if (bankByName.get(e.actualName)?.modality === 'reps') expect(schemes).toContain(e.reps);
    }
    expect(strength.filter((e) => e.station?.conditional).every((e) => e.station?.number === 5)).toBe(true);
  });

  it('drops the conditional station when the class would run over the target', () => {
    const profile: RulesProfile = {
      ...DEFAULT_RULES_PROFILE,
      blocks: DEFAULT_RULES_PROFILE.blocks.map((b) => (b.key === 'fuerza' ? { ...b, minutes: 21 } : b)),
    };
    const { plan } = generateFunctionalClass(options(), profile, DEFAULT_EXERCISE_BANK, deps());

    expect(plan.blocks[1].exercises.some((e) => e.station?.conditional)).toBe(false);
    expect(plan.blocks[1].durationMinutes).toBe(21);
    expect(plan.notices?.[0]).toMatch(/estación condicional/);
  });

  it('balances push and pull in Upper body', () => {
    for (const seed of [1, 2, 3, 4, 5]) {
      const [{ plan }] = generateSeries(1, 'Upper Body', seed);
      const patterns = plan.blocks[1].exercises.map((e) => bankByName.get(e.actualName)?.pattern);
      const push = patterns.filter((p) => p === 'empuje').length;
      const pull = patterns.filter((p) => p === 'jalón').length;
      expect(push).toBe(pull);
      expect(push).toBeGreaterThan(0);
    }
  });

  it('uses each exercise at most once per class', () => {
    const { plan } = generateFunctionalClass(options({ focus: 'Full Body' }), DEFAULT_RULES_PROFILE, DEFAULT_EXERCISE_BANK, deps());
    const names = plan.blocks.slice(1).flatMap((b) => b.exercises.map((e) => e.actualName));
    expect(new Set(names).size).toBe(names.length);
  });

  it('numbers classes after the last one in the history', () => {
    const [first, second] = generateSeries(2, 'Lower Body', 3);
    expect(first.record.classNumber).toBe(1);
    expect(second.record.classNumber).toBe(2);
    expect(second.plan.classNumber).toBe(2);
  });

  it('records date, focus, material, exercises per block and the station mains', () => {
    const { plan, record } = generateFunctionalClass(options(), DEFAULT_RULES_PROFILE, DEFAULT_EXERCISE_BANK, deps());

    expect(record.date).toBe('2026-10-09T12:00:00.000Z');
    expect(record.focus).toBe('Upper Body');
    expect(record.materials).toEqual(DUMBBELLS_AND_BAND);
    expect(record.blocks.map((b) => b.key)).toEqual(['calentamiento', 'fuerza', 'cardio', 'estiramiento']);
    expect(record.blocks[1].exercises).toEqual(plan.blocks[1].exercises.map((e) => e.actualName));
    const mains = plan.blocks[1].exercises.filter((e) => e.station?.role !== 'B').map((e) => e.actualName);
    expect(record.mainExerciseIds.map((id) => bankById.get(id)?.name)).toEqual(mains);
  });

  describe('acceptance: Upper with only dumbbells and band', () => {
    for (const seed of [11, 22, 33, 44, 55]) {
      it(`respects time, material and rotation (seed ${seed})`, () => {
        const classes = generateSeries(4, 'Upper Body', seed);

        classes.forEach(({ plan, record }, index) => {
          expect(plan.blocks).toHaveLength(4);
          const total = plan.blocks.reduce((sum, b) => sum + b.durationMinutes, 0);
          expect(total).toBeGreaterThanOrEqual(50);
          expect(total).toBeLessThanOrEqual(55);

          for (const block of plan.blocks.slice(0)) {
            for (const e of block.exercises) {
              const bankExercise = bankByName.get(e.actualName);
              if (bankExercise) expect(hasRequiredMaterial(bankExercise, DUMBBELLS_AND_BAND)).toBe(true);
            }
          }

          const previous = classes.slice(Math.max(0, index - 2), index).map((c) => c.record);
          const recent = recentMainIds(previous, 2);
          for (const id of record.mainExerciseIds) expect(recent.has(id)).toBe(false);
          expect(plan.notices).toEqual([]);
        });
      });
    }
  });
});

describe('recentMainIds', () => {
  const record = (classNumber: number, mainExerciseIds: string[]): ClassRecord => ({
    id: `c${classNumber}`,
    date: '2026-10-01T00:00:00Z',
    classNumber,
    focus: 'Upper Body',
    materials: [],
    blocks: [],
    mainExerciseIds,
  });

  it('only looks at the last N classes', () => {
    const history = [record(1, ['a']), record(2, ['b']), record(3, ['c'])];
    expect([...recentMainIds(history, 2)]).toEqual(['b', 'c']);
    expect(recentMainIds(history, 0).size).toBe(0);
  });
});
