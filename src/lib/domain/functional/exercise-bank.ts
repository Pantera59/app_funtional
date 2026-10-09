import type { BankExercise, BankFocus, Difficulty, FunctionalBlockKey, FunctionalPattern, Modality } from './types';

const DUMBBELLS = ['Mancuernas ligeras', 'Mancuernas medias'];
const NONE: string[][] = [];
const DB = [DUMBBELLS];
const BAND = [['Liga elástica']];
const MINI_BAND_OR_ANKLE = [['Liga de resistencia', 'Polainas']];
const BALL = [['Pelota']];
const ANKLE = [['Polainas']];

interface SeedOptions {
  equipment?: string[][];
  modality?: Modality;
  difficulty?: Difficulty;
  notes?: string;
  combo?: boolean;
}

const slug = (name: string) =>
  name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

function seed(
  name: string,
  blocks: FunctionalBlockKey[],
  focus: BankFocus[],
  pattern: FunctionalPattern,
  { equipment = NONE, modality = 'reps', difficulty = 'Intermedio', notes = '', combo = false }: SeedOptions = {},
): BankExercise {
  return { id: slug(name), name, blocks, focus, pattern, equipment, modality, difficulty, notes, combo, active: true };
}

/** The coach's own exercises. Editable from /reglas; this list is only the starting point. */
export const DEFAULT_EXERCISE_BANK: BankExercise[] = [
  // Activación
  seed('Squat 3 posiciones (cerrado/talones/abierto)', ['calentamiento'], ['lower'], 'sentadilla', {
    difficulty: 'Básico',
    notes: 'Cambiar de posición cada repetición. Fácil: rango corto.',
  }),
  seed('Jumping jack + squat', ['calentamiento'], ['full'], 'cardio', {
    difficulty: 'Básico',
    notes: 'Fácil: paso lateral en lugar de salto.',
  }),
  seed('Sentadilla + 5s isometría', ['calentamiento'], ['lower'], 'sentadilla', {
    difficulty: 'Básico',
    notes: 'Sostener 5 s abajo con el pecho arriba.',
  }),
  seed('Thruster con mancuerna', ['calentamiento'], ['full'], 'sentadilla', {
    equipment: DB,
    difficulty: 'Básico',
    notes: 'Mancuerna ligera, ritmo de activación.',
  }),
  seed('Push press leve + marcha con pesas arriba', ['calentamiento'], ['upper', 'full'], 'hombro', {
    equipment: DB,
    difficulty: 'Básico',
    notes: 'Core firme durante la marcha.',
  }),
  seed('Orugas + tocar hombros', ['calentamiento', 'cardio'], ['upper', 'full'], 'core', {
    notes: 'Fácil: tocar hombros con rodillas apoyadas.',
  }),
  seed('Liga pull apart', ['calentamiento'], ['upper'], 'jalón', {
    equipment: BAND,
    difficulty: 'Básico',
    notes: 'Juntar escápulas al abrir.',
  }),
  seed('Desplante unilateral + fijo', ['calentamiento'], ['lower'], 'desplante', {
    difficulty: 'Básico',
    notes: 'Fácil: apoyo en pared.',
  }),
  seed('High knees', ['calentamiento', 'cardio'], ['full'], 'cardio', {
    modality: 'tiempo',
    difficulty: 'Básico',
    notes: 'Fácil: marcha rápida sin salto.',
  }),

  // Fuerza lower
  seed('Goblet squat 3 posiciones', ['fuerza'], ['lower'], 'sentadilla', { equipment: DB }),
  seed('Squat frontal con mancuerna', ['fuerza'], ['lower'], 'sentadilla', { equipment: DB }),
  seed('Squat frontal con talones en discos', ['fuerza'], ['lower'], 'sentadilla', {
    equipment: [DUMBBELLS, ['Discos']],
    notes: 'Talones elevados para más profundidad y cuádriceps.',
  }),
  seed('Romanian deadlift (baja 3s)', ['fuerza'], ['lower'], 'bisagra', {
    equipment: DB,
    notes: 'Bajar en 3 s, espalda neutra.',
  }),
  seed('Desplante atrás + squat + desplante atrás', ['fuerza'], ['lower'], 'desplante', {
    combo: true,
    notes: 'Fácil: sin peso.',
  }),
  seed('Desplante + press', ['fuerza'], ['full'], 'desplante', { equipment: DB, combo: true }),
  seed('Combo deadlift + squat + desplante atrás', ['fuerza'], ['full', 'lower'], 'bisagra', {
    equipment: DB,
    combo: true,
    difficulty: 'Avanzado',
  }),
  seed('Sentadilla sumo en 3 tiempos', ['fuerza'], ['lower'], 'sentadilla', {
    equipment: DB,
    notes: 'Bajar en 3 tiempos, subir explosivo.',
  }),
  seed('Swing estilo pesa rusa', ['fuerza'], ['full', 'lower'], 'bisagra', {
    equipment: DB,
    notes: 'Empuje de cadera, no de brazos.',
  }),
  seed('Snatch con mancuerna', ['fuerza'], ['full'], 'bisagra', { equipment: DB, difficulty: 'Avanzado' }),
  seed('Clean and jerk unilateral', ['fuerza'], ['full'], 'bisagra', {
    equipment: DB,
    combo: true,
    difficulty: 'Avanzado',
  }),
  seed('Thruster unilateral', ['fuerza'], ['full'], 'sentadilla', { equipment: DB, combo: true }),
  seed('Patada de glúteo en cuatro puntos / patada lateral 45° / pulsos', ['fuerza'], ['lower'], 'bisagra', {
    equipment: MINI_BAND_OR_ANKLE,
    combo: true,
    notes: 'Con liga o polainas. Cadera estable.',
  }),

  // Fuerza upper
  seed('Lagartijas (+ isométrico 10s abajo)', ['fuerza'], ['upper'], 'empuje', {
    notes: 'Fácil: rodillas apoyadas.',
  }),
  seed('Press de pecho en piso', ['fuerza'], ['upper'], 'empuje', { equipment: DB, difficulty: 'Básico' }),
  seed('Peck fly', ['fuerza'], ['upper'], 'empuje', { equipment: DB, notes: 'Codos ligeramente flexionados.' }),
  seed('Pull over', ['fuerza'], ['upper'], 'jalón', { equipment: DB }),
  seed('Remo inclinado a dos brazos', ['fuerza'], ['upper'], 'jalón', {
    equipment: DB,
    notes: 'Espalda neutra, codos pegados.',
  }),
  seed('Remo unilateral en posición de lagartija', ['fuerza'], ['upper', 'core'], 'jalón', {
    equipment: DB,
    difficulty: 'Avanzado',
    notes: 'Fácil: rodillas apoyadas.',
  }),
  seed('Jalón unilateral de rodillas', ['fuerza'], ['upper'], 'jalón', { equipment: BAND }),
  seed('Face pull con liga', ['fuerza'], ['upper'], 'jalón', { equipment: BAND, difficulty: 'Básico' }),
  seed('Press militar unilateral + juntos', ['fuerza'], ['upper'], 'hombro', { equipment: DB }),
  seed('Press Arnold', ['fuerza'], ['upper'], 'hombro', { equipment: DB }),
  seed('Elevación lateral + frontal', ['fuerza'], ['upper'], 'hombro', {
    equipment: DB,
    combo: true,
    notes: 'Mancuerna ligera.',
  }),
  seed('Curl martillo', ['fuerza'], ['upper'], 'brazos', { equipment: DB, difficulty: 'Básico' }),
  seed('Bicep curl con brazos arriba', ['fuerza'], ['upper'], 'brazos', { equipment: DB }),
  seed('Curl martillo + press', ['fuerza'], ['upper'], 'brazos', { equipment: DB, combo: true }),
  seed('Patada de tríceps', ['fuerza'], ['upper'], 'brazos', { equipment: DB, difficulty: 'Básico' }),
  seed('Fondos de tríceps en el suelo', ['fuerza'], ['upper'], 'brazos', {
    difficulty: 'Básico',
    notes: 'Fácil: pies más cerca.',
  }),
  seed('Lagartija + pasar mancuerna por debajo de la cadera', ['fuerza'], ['upper', 'core'], 'empuje', {
    equipment: DB,
    combo: true,
    difficulty: 'Avanzado',
  }),

  // Cardio
  seed('Tocar hombros', ['cardio'], ['upper', 'core'], 'cardio', { modality: 'tiempo', difficulty: 'Básico' }),
  seed('Burpees', ['cardio'], ['full'], 'cardio', { modality: 'tiempo', notes: 'Fácil: sin salto ni lagartija.' }),
  seed('Mountain climbers', ['cardio'], ['full', 'core'], 'cardio', { modality: 'tiempo' }),
  seed('Plank jacks', ['cardio'], ['full', 'core'], 'cardio', { modality: 'tiempo' }),
  seed('Skater hops', ['cardio'], ['lower'], 'cardio', { modality: 'tiempo', notes: 'Fácil: paso lateral.' }),
  seed('Desplante lateral 2x2', ['cardio'], ['lower'], 'cardio', { modality: 'tiempo', difficulty: 'Básico' }),
  seed('Desplante lateral + brinco', ['cardio'], ['lower'], 'cardio', { modality: 'tiempo' }),
  seed('Sentadilla corta + brinco', ['cardio'], ['lower'], 'cardio', { modality: 'tiempo' }),
  seed('Squat tap', ['cardio'], ['lower'], 'cardio', { modality: 'tiempo', difficulty: 'Básico' }),
  seed('Jumping jacks', ['cardio'], ['full'], 'cardio', { modality: 'tiempo', difficulty: 'Básico' }),
  seed('Caminata de oso', ['cardio'], ['full', 'core'], 'cardio', { modality: 'tiempo' }),
  seed('Jab + cross con polainas', ['cardio'], ['upper'], 'cardio', {
    equipment: ANKLE,
    modality: 'tiempo',
    difficulty: 'Básico',
  }),
  seed('Orugas', ['cardio'], ['full'], 'cardio', { modality: 'tiempo' }),

  // Core: usable as a strength station or as a cardio interval
  seed('Plancha', ['fuerza', 'cardio'], ['core'], 'core', { modality: 'tiempo', difficulty: 'Básico' }),
  seed('Medias abdominales', ['fuerza', 'cardio'], ['core'], 'core', { difficulty: 'Básico' }),
  seed('Pasar pelota por debajo de los pies / sobre las piernas', ['fuerza', 'cardio'], ['core'], 'core', {
    equipment: BALL,
  }),
  seed('Giro ruso con pelota', ['fuerza', 'cardio'], ['core'], 'core', {
    equipment: BALL,
    notes: 'Fácil: pies apoyados.',
  }),
  seed('Bicicleta', ['fuerza', 'cardio'], ['core'], 'core', { modality: 'tiempo' }),
  seed('Codo a rodilla unilateral', ['fuerza', 'cardio'], ['core'], 'core'),
  seed('Patadas al aire comprimiendo abdomen', ['fuerza', 'cardio'], ['core'], 'core', {
    modality: 'tiempo',
    notes: 'Zona lumbar pegada al piso.',
  }),

  // Estiramiento
  seed('4 bajones con respiración', ['estiramiento'], ['full'], 'movilidad', { difficulty: 'Básico' }),
  seed('Estiramiento de brazos', ['estiramiento'], ['upper'], 'movilidad', { modality: 'tiempo', difficulty: 'Básico' }),
  seed('Hombro cruzado', ['estiramiento'], ['upper'], 'movilidad', { modality: 'tiempo', difficulty: 'Básico' }),
  seed('Tríceps detrás de la cabeza', ['estiramiento'], ['upper'], 'movilidad', {
    modality: 'tiempo',
    difficulty: 'Básico',
  }),
  seed('Pecho con manos atrás', ['estiramiento'], ['upper'], 'movilidad', { modality: 'tiempo', difficulty: 'Básico' }),
  seed('Estiramiento de cadera', ['estiramiento'], ['lower'], 'movilidad', { modality: 'tiempo', difficulty: 'Básico' }),
  seed('Estiramiento de piernas', ['estiramiento'], ['lower'], 'movilidad', { modality: 'tiempo', difficulty: 'Básico' }),
  seed('Desplante con rodilla en piso', ['estiramiento'], ['lower'], 'movilidad', {
    modality: 'tiempo',
    difficulty: 'Básico',
  }),
  seed('Postura del niño', ['estiramiento'], ['full'], 'movilidad', { modality: 'tiempo', difficulty: 'Básico' }),
  seed('Hilo de aguja', ['estiramiento'], ['upper'], 'movilidad', { modality: 'tiempo', difficulty: 'Básico' }),
  seed('Cobra', ['estiramiento'], ['core'], 'movilidad', { modality: 'tiempo', difficulty: 'Básico' }),
  seed('Respiraciones', ['estiramiento'], ['full'], 'movilidad', { modality: 'tiempo', difficulty: 'Básico' }),
];

export const createBankExerciseId = slug;
