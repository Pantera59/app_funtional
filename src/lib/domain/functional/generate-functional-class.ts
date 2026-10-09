import { RESTRICTIONS } from '../constants';
import type {
  BlockType,
  Exercise,
  Focus,
  MovementPattern,
  RestrictionSwaps,
  WorkoutBlock,
  WorkoutExercise,
  WorkoutFormat,
  WorkoutPlan,
} from '../types';
import { availableExercises, describeEquipment } from './availability';
import { CLASS_HISTORY_LIMIT } from './constants';
import { recentMainIds } from './rotation';
import { fitClassTime } from './timing';
import type {
  BankExercise,
  BankFocus,
  ClassRecord,
  Difficulty,
  FunctionalBlockKey,
  FunctionalOptions,
  FunctionalPattern,
  RulesProfile,
} from './types';

/** Main pattern of each strength station, in order. Extra stations past the list repeat it. */
const STATION_PATTERNS: Record<Focus, FunctionalPattern[]> = {
  'Upper Body': ['empuje', 'jalón', 'hombro', 'brazos', 'empuje'],
  'Lower Body': ['sentadilla', 'bisagra', 'desplante', 'bisagra', 'sentadilla'],
  'Full Body': ['sentadilla', 'empuje', 'bisagra', 'jalón', 'desplante'],
};

/** Patterns a station may fall back to when its own pattern has no fresh exercise. */
const FOCUS_PATTERNS: Record<Focus, FunctionalPattern[]> = {
  'Upper Body': ['empuje', 'jalón', 'hombro', 'brazos'],
  'Lower Body': ['sentadilla', 'bisagra', 'desplante'],
  'Full Body': ['sentadilla', 'bisagra', 'desplante', 'empuje', 'jalón', 'hombro'],
};

const CONDITIONAL_PATTERN: FunctionalPattern = 'core';

/**
 * Exercise B of an A/B station. Push pairs with pull (and the other way round),
 * which keeps upper-body classes balanced by construction.
 */
const PARTNER_PATTERN: Record<FunctionalPattern, FunctionalPattern> = {
  empuje: 'jalón',
  jalón: 'empuje',
  hombro: 'brazos',
  brazos: 'hombro',
  sentadilla: 'bisagra',
  bisagra: 'sentadilla',
  desplante: 'core',
  core: 'core',
  cardio: 'cardio',
  movilidad: 'movilidad',
};

const ACTIVATION_FOCUS: Record<Focus, BankFocus> = {
  'Upper Body': 'upper',
  'Lower Body': 'lower',
  'Full Body': 'full',
};

const MOVEMENT_PATTERN: Record<FunctionalPattern, MovementPattern> = {
  empuje: 'Push',
  jalón: 'Pull',
  hombro: 'Push',
  brazos: 'Pull',
  sentadilla: 'Squat',
  bisagra: 'Hinge',
  desplante: 'Squat',
  core: 'Core',
  cardio: 'Metabolic',
  movilidad: 'Mobility',
};

const LEVEL: Record<Difficulty, Exercise['level']> = {
  Básico: 'Beginner',
  Intermedio: 'Intermediate',
  Avanzado: 'Advanced',
};

const isPushPull = (pattern: FunctionalPattern) => pattern === 'empuje' || pattern === 'jalón';

export interface GenerateFunctionalDeps {
  /** Previous functional classes, oldest first. */
  history?: ClassRecord[];
  random?: () => number;
  createId?: () => string;
  now?: () => Date;
}

export interface FunctionalClass {
  plan: WorkoutPlan;
  record: ClassRecord;
}

function shuffle<T>(items: T[], random: () => number): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/** Stable numeric id so bank exercises fit the classic `Exercise` shape. */
function numericId(id: string) {
  let hash = 0;
  for (const char of id) hash = (hash * 31 + char.charCodeAt(0)) | 0;
  return Math.abs(hash);
}

const noSwaps = (name: string) => Object.fromEntries(RESTRICTIONS.map((r) => [r, name])) as RestrictionSwaps;

/** Adapts a bank exercise to the shape the coach and student views already render. */
function toCatalogExercise(exercise: BankExercise): Exercise {
  return {
    id: numericId(exercise.id),
    name: exercise.name,
    pattern: MOVEMENT_PATTERN[exercise.pattern],
    equipmentNeeded: describeEquipment(exercise),
    level: LEVEL[exercise.difficulty],
    regression: exercise.notes,
    progression: '',
    restrictionSwaps: noSwaps(exercise.name),
    videoUrl: '',
    imageUrl: '',
  };
}

/** Text-only entry, used for the fixed warm-up sequence. */
function textEntry(name: string, reps: string): WorkoutExercise {
  return {
    baseExercise: {
      id: numericId(name),
      name,
      pattern: 'Mobility',
      equipmentNeeded: 'Ninguno',
      level: 'Beginner',
      regression: '',
      progression: '',
      restrictionSwaps: noSwaps(name),
      videoUrl: '',
      imageUrl: '',
    },
    actualName: name,
    reps,
  };
}

const setsOf = (scheme: string) => Number(/^\s*(\d+)/.exec(scheme)?.[1] ?? 3);

/**
 * Builds a class from the coach's rules profile and exercise bank.
 * Pure: history, randomness, ids and time are injected so the rules are testable.
 */
export function generateFunctionalClass(
  options: FunctionalOptions,
  profile: RulesProfile,
  bank: BankExercise[],
  deps: GenerateFunctionalDeps = {},
): FunctionalClass {
  const {
    history = [],
    random = Math.random,
    createId = () => crypto.randomUUID(),
    now = () => new Date(),
  } = deps;
  const { focus, startTime, availableMaterials } = options;

  const timing = fitClassTime(profile);
  const notices = [...timing.adjustments];
  const pool = availableExercises(bank, availableMaterials);
  const recent = recentMainIds(history, profile.rotation.lookbackClasses);
  const used = new Set<string>();

  const unusedIn = (block: FunctionalBlockKey) => pool.filter((e) => e.blocks.includes(block) && !used.has(e.id));
  const take = (exercise: BankExercise) => {
    used.add(exercise.id);
    return exercise;
  };
  const pickOne = (candidates: BankExercise[]) => (candidates.length > 0 ? shuffle(candidates, random)[0] : undefined);

  const entry = (exercise: BankExercise, reps: string, station?: WorkoutExercise['station']): WorkoutExercise => ({
    baseExercise: toCatalogExercise(exercise),
    actualName: exercise.name,
    reps,
    ...(station && { station }),
  });

  // Calentamiento: fixed sequence, then activation by focus.
  const activationFocus = ACTIVATION_FOCUS[focus];
  const activationPool = unusedIn('calentamiento');
  const byFocus = shuffle(
    activationPool.filter((e) => e.focus.includes(activationFocus)),
    random,
  );
  const others = shuffle(
    activationPool.filter((e) => !e.focus.includes(activationFocus)),
    random,
  ).sort((a, b) => Number(b.focus.includes('full')) - Number(a.focus.includes('full')));
  const activation = [...byFocus, ...others].slice(0, Math.max(0, profile.warmup.activationCount)).map(take);
  const activationReps = `${profile.warmup.activationSets} x ${profile.warmup.activationReps}`;

  const warmupExercises = [
    ...profile.warmup.fixedSequence.map(({ area, detail }) => textEntry(`${area}: ${detail}`, 'Fijo')),
    ...activation.map((e) => entry(e, activationReps)),
  ];

  // Fuerza: stations with a main exercise that respects rotation.
  const schemes = profile.strength.schemes.filter((s) => s.active && s.label.trim()).map((s) => s.label);
  const balance = focus === 'Upper Body' && profile.rotation.balancePushPull;
  const strengthCandidates = (pattern: FunctionalPattern) =>
    unusedIn('fuerza').filter((e) => e.pattern === pattern && !(balance && isPushPull(pattern) && e.combo));

  const pickMain = (pattern: FunctionalPattern, stationNumber: number) => {
    const fallbacks = FOCUS_PATTERNS[focus].filter((p) => p !== pattern);
    for (const patterns of [[pattern], fallbacks]) {
      const fresh = patterns.flatMap(strengthCandidates).filter((e) => !recent.has(e.id));
      const choice = pickOne(fresh);
      if (choice) return take(choice);
    }
    const repeat = pickOne([pattern, ...fallbacks].flatMap(strengthCandidates));
    if (repeat) {
      notices.push(
        `Estación ${stationNumber}: se repite "${repeat.name}" de las últimas ${profile.rotation.lookbackClasses} clases porque no hay alternativa con el material activo.`,
      );
      return take(repeat);
    }
    return undefined;
  };

  const pickPartner = (main: BankExercise) => {
    const candidates = unusedIn('fuerza').filter((e) => e.pattern === PARTNER_PATTERN[main.pattern] && !e.combo);
    const fresh = candidates.filter((e) => !recent.has(e.id));
    const choice = pickOne(fresh.length > 0 ? fresh : candidates);
    return choice && take(choice);
  };

  const mainExerciseIds: string[] = [];
  const strengthExercises: WorkoutExercise[] = [];

  const addStation = (number: number, pattern: FunctionalPattern, conditional: boolean) => {
    const main = pickMain(pattern, number);
    if (!main) {
      notices.push(`Estación ${number}: no hay ejercicios disponibles con el material activo.`);
      return;
    }
    mainExerciseIds.push(main.id);
    const scheme = schemes.length > 0 ? schemes[Math.floor(random() * schemes.length)] : '3 sets 10-8-6';
    const dose = (e: BankExercise) => (e.modality === 'tiempo' ? `${setsOf(scheme)} sets × 30 s` : scheme);

    if (main.combo) {
      strengthExercises.push(entry(main, dose(main), { number, kind: 'Combo', conditional }));
      return;
    }
    const partner = pickPartner(main);
    if (!partner) {
      strengthExercises.push(entry(main, dose(main), { number, kind: 'Simple', conditional }));
      return;
    }
    strengthExercises.push(
      entry(main, dose(main), { number, kind: 'A/B', role: 'A', conditional }),
      entry(partner, dose(partner), { number, kind: 'A/B', role: 'B', conditional }),
    );
  };

  const { stations, minStations, maxStations } = profile.strength;
  const stationCount = Math.min(Math.max(stations, minStations), maxStations);
  const patterns = STATION_PATTERNS[focus];
  for (let i = 0; i < stationCount; i++) addStation(i + 1, patterns[i % patterns.length], false);
  if (timing.keepConditional) addStation(stationCount + 1, CONDITIONAL_PATTERN, true);

  // Cardio: work/rest intervals, at most one core exercise.
  const cardioPool = unusedIn('cardio');
  const cardioCount = Math.max(0, profile.cardio.exercises);
  const coreSlots = cardioCount >= 4 ? 1 : 0;
  const core = shuffle(
    cardioPool.filter((e) => e.pattern === 'core'),
    random,
  );
  const conditioning = shuffle(
    cardioPool.filter((e) => e.pattern !== 'core'),
    random,
  );
  // Core fills the last slot, or more slots if there is not enough conditioning.
  const cardio = [
    ...conditioning.slice(0, cardioCount - coreSlots),
    ...core,
    ...conditioning.slice(cardioCount - coreSlots),
  ]
    .slice(0, cardioCount)
    .map(take);
  const { workSeconds, restSeconds } = profile.cardio;
  const cardioReps = `${workSeconds}s trabajo / ${restSeconds}s descanso`;

  // Estiramiento: a subset in bank order (breathing first and last stays in place).
  const stretchPool = unusedIn('estiramiento');
  const stretchCount = Math.min(Math.max(0, profile.stretch.exercises), stretchPool.length);
  const chosenStretches = new Set(shuffle(stretchPool, random).slice(0, stretchCount).map((e) => e.id));
  const stretches = stretchPool.filter((e) => chosenStretches.has(e.id)).map(take);

  const blockName = (key: FunctionalBlockKey) => profile.blocks.find((b) => b.key === key)?.name ?? key;
  const rounds = timing.cardioRounds;

  const makeBlock = (
    key: FunctionalBlockKey,
    type: BlockType,
    format: WorkoutFormat,
    exercises: WorkoutExercise[],
    name = blockName(key),
  ): WorkoutBlock => ({
    id: createId(),
    type,
    name,
    durationMinutes: timing.minutes[key],
    format,
    exercises,
    started: false,
    completed: false,
    coachNotes: '',
    ...(type === 'Metabólico' && { originalDurationMinutes: timing.minutes[key] }),
  });

  const blocks: WorkoutBlock[] = [
    makeBlock('calentamiento', 'Calentamiento', 'Circuit', warmupExercises),
    makeBlock('fuerza', 'Fuerza', 'Estaciones', strengthExercises),
    makeBlock(
      'cardio',
      'Metabólico',
      'Intervalos',
      cardio.map((e) => entry(e, cardioReps)),
      `${blockName('cardio')} · ${rounds} ${rounds === 1 ? 'vuelta' : 'vueltas'}`,
    ),
    makeBlock(
      'estiramiento',
      'Cierre',
      'Flow',
      stretches.map((e) => entry(e, e.modality === 'tiempo' ? '30 s' : '1 serie')),
    ),
  ];

  const classNumber = (history.at(-1)?.classNumber ?? history.length) + 1;
  const date = now().toISOString();
  const id = createId();

  const plan: WorkoutPlan = {
    id,
    date,
    startTime,
    focus,
    limitedEquipment: false,
    restrictions: [],
    blocks,
    coachNotes: 'Clase generada con tus reglas de planeación.',
    planBActivated: false,
    mode: 'funcional',
    classNumber,
    notices,
  };

  const keys: FunctionalBlockKey[] = ['calentamiento', 'fuerza', 'cardio', 'estiramiento'];
  const record: ClassRecord = {
    id,
    date,
    classNumber,
    focus,
    materials: availableMaterials,
    blocks: blocks.map((block, index) => ({
      key: keys[index],
      name: block.name,
      minutes: block.durationMinutes,
      exercises: block.exercises.map((e) => e.actualName),
    })),
    mainExerciseIds,
  };

  return { plan, record };
}

export const appendClassRecord = (history: ClassRecord[], record: ClassRecord) =>
  [...history, record].slice(-CLASS_HISTORY_LIMIT);
