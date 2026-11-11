import type { BankExercise, BankFocus, Difficulty, FunctionalBlockKey, FunctionalPattern, Modality } from './types';

const DUMBBELLS = ['Mancuernas ligeras', 'Mancuernas medias'];
const NONE: string[][] = [];
const DB = [DUMBBELLS];
const BAND = [['Liga elástica']];
const MINI_BAND_OR_ANKLE = [['Liga de resistencia', 'Polainas']];
const BALL = [['Pelota']];
const ANKLE = [['Polainas']];
const ANY_BAND = [['Liga elástica', 'Liga de resistencia']];
const MINI_BAND = [['Liga de resistencia']];
const BLOCK = [['Bloque']];

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

  // ---- Added from the coach's class sheets 5–11 (Sep–Nov 2026). Appended so existing picks keep their order.

  // Activación
  seed('Squat con pesa enfrente + high knees unilateral', ['calentamiento'], ['lower'], 'sentadilla', {
    equipment: DB,
    difficulty: 'Básico',
    notes: 'Mancuerna ligera al pecho. Alternar squat y rodillas arriba.',
  }),
  seed('Desplante frontal + apertura frontal cerrada', ['calentamiento'], ['full'], 'desplante', {
    equipment: BAND,
    difficulty: 'Básico',
    notes: 'Abre la liga al frente con brazos largos en cada desplante.',
  }),
  seed('Jumping jacks + high knees', ['calentamiento'], ['full'], 'cardio', {
    modality: 'tiempo',
    difficulty: 'Básico',
    notes: '8 y 8. Fácil: paso lateral y marcha.',
  }),
  seed('Liga curl de bíceps unilateral', ['calentamiento'], ['upper'], 'brazos', {
    equipment: BAND,
    difficulty: 'Básico',
    notes: 'Jalón de cadera a pecho, codo pegado.',
  }),
  seed('Liga patada de tríceps unilateral', ['calentamiento'], ['upper'], 'brazos', {
    equipment: BAND,
    difficulty: 'Básico',
    notes: 'De pecho a cadera, codo fijo.',
  }),
  seed('Liga del pecho arriba de la cabeza con apertura', ['calentamiento'], ['upper'], 'hombro', {
    equipment: BAND,
    difficulty: 'Básico',
    notes: 'Brazos largos, abrir la liga al llegar arriba.',
  }),
  seed('Caracoles', ['calentamiento'], ['upper'], 'hombro', {
    difficulty: 'Básico',
    notes: 'Círculos de brazos pequeños a grandes, adelante y atrás.',
  }),
  seed('Pull over con liga', ['calentamiento'], ['upper'], 'jalón', {
    equipment: BAND,
    difficulty: 'Básico',
    notes: 'Brazos largos, costillas abajo.',
  }),
  seed('Push press + marcha rodillas arriba con liga', ['calentamiento'], ['upper', 'full'], 'hombro', {
    equipment: BAND,
    difficulty: 'Básico',
    notes: 'Liga bajo los pies o en las manos; core firme en la marcha.',
  }),
  seed('Orugas + push up', ['calentamiento'], ['upper', 'full'], 'empuje', {
    notes: 'Fácil: lagartija con rodillas apoyadas.',
  }),
  seed('Desplante unilateral + squat', ['calentamiento'], ['lower'], 'desplante', {
    difficulty: 'Básico',
    notes: 'Sin peso. Rodilla sigue la línea del pie.',
  }),
  seed('Pies juntos con pelota: squat frontal + medio squat', ['calentamiento'], ['lower'], 'sentadilla', {
    equipment: BALL,
    difficulty: 'Básico',
    notes: 'Pelota entre los pies o al pecho.',
  }),
  seed('Mountain climber 10s + isométrico en squat 10s', ['calentamiento'], ['full'], 'cardio', {
    modality: 'tiempo',
    difficulty: 'Básico',
    notes: 'Por tiempo, no por reps. Fácil: climber lento.',
  }),
  seed('Squat + elevación de rodilla con polaina', ['calentamiento'], ['lower'], 'sentadilla', {
    equipment: ANKLE,
    difficulty: 'Básico',
    notes: 'Alternar pierna en cada elevación.',
  }),
  seed('Squat frontal + pulsos con bloque', ['calentamiento'], ['lower'], 'sentadilla', {
    equipment: BLOCK,
    difficulty: 'Básico',
    notes: '10 squats + 10 pulsos. Bloque entre rodillas; polainas opcionales.',
  }),
  seed('Patada lateral + squat chiquito en punta', ['calentamiento'], ['lower'], 'bisagra', {
    equipment: ANY_BAND,
    difficulty: 'Básico',
    notes: 'Liga sobre rodillas. Squat corto en puntas para rodilla.',
  }),

  // Fuerza lower
  seed('Squat con mancuernas en hombros + pulsos + abductores isométricos', ['fuerza'], ['lower'], 'sentadilla', {
    equipment: [DUMBBELLS, ['Liga de resistencia']],
    combo: true,
    notes: 'Pulsos sin mancuernas. Liga arriba de rodillas: empujar hacia afuera sin que se metan.',
  }),
  seed('Pies juntos en pelota: squat frontal + segunda posición + lunge fijo', ['fuerza'], ['lower'], 'sentadilla', {
    equipment: BALL,
    combo: true,
    notes: 'Peso corporal o polainas.',
  }),
  seed('Peso muerto + desplante atrás cruzado', ['fuerza'], ['lower'], 'bisagra', {
    equipment: DB,
    combo: true,
    notes: 'Completar un lado primero. Espalda neutra, mancuerna pegada a la pierna.',
  }),
  seed('Curl femoral con mancuerna', ['fuerza'], ['lower'], 'bisagra', {
    equipment: DB,
    notes: 'Boca abajo, mancuerna entre los pies. 8 a 3 tiempos + 8 a 1 tiempo.',
  }),
  seed('Goblet squat + squat sin peso + abductores con bloque', ['fuerza'], ['lower'], 'sentadilla', {
    equipment: [DUMBBELLS, ['Liga de resistencia'], ['Bloque']],
    combo: true,
    notes: 'Goblet al pecho; sin peso más rápido; abrir contra la liga con el bloque entre rodillas.',
  }),
  seed('Kickback + side step + squat a 4 tiempos', ['fuerza'], ['lower'], 'desplante', {
    equipment: MINI_BAND,
    combo: true,
    notes: 'Kickback c/pierna; side step con liga sobre rodillas; squat 2 bajando, 2 subiendo. Polainas opcionales.',
  }),
  seed('Medio burpee + mountain climber + sentadilla sumo en 3 tiempos', ['fuerza'], ['full', 'lower'], 'sentadilla', {
    equipment: DB,
    combo: true,
    difficulty: 'Avanzado',
    notes: 'Climber unilateral 1 y 1; bajada lenta en el sumo.',
  }),

  // Fuerza upper
  seed('Vuelos laterales + push press', ['fuerza'], ['upper'], 'hombro', {
    equipment: DB,
    combo: true,
    notes: 'Mancuerna ligera en los vuelos, sin balanceo.',
  }),
  seed('Remo unilateral de rodillas', ['fuerza'], ['upper'], 'jalón', {
    equipment: DB,
    notes: 'Espalda neutra, codo hacia la cadera.',
  }),
  seed('Skullcrusher unilateral', ['fuerza'], ['upper'], 'brazos', {
    equipment: DB,
    notes: 'Acostado boca arriba, codo al techo, mancuerna junto a la sien. 8 a 3 tiempos + 8 a 1 tiempo.',
  }),
  seed('Remo unilateral + curl de bíceps con liga + press militar', ['fuerza'], ['upper'], 'jalón', {
    equipment: [['Liga elástica'], DUMBBELLS],
    combo: true,
    notes: 'Remo y curl con liga en los pies; el press va con mancuerna.',
  }),
  seed('Lagartija + toque de hombros + bajar a codos', ['fuerza'], ['upper', 'core'], 'empuje', {
    combo: true,
    notes: 'Rodillas en piso si se necesita. Cadera quieta en los toques; espalda baja sin hundirse.',
  }),
  seed('21 para bíceps', ['fuerza'], ['upper'], 'brazos', {
    equipment: DB,
    notes: '7 medio rango abajo + 7 arriba + 7 completos. Peso más ligero que el curl normal.',
  }),
  seed('Remo (bajada) + Romanian deadlift + patada de tríceps', ['fuerza'], ['full'], 'bisagra', {
    equipment: DB,
    combo: true,
    notes: 'Remo al bajar, sube con el RDL y termina con patada de tríceps a dos manos.',
  }),

  // Cardio
  seed('Jumping desplantes', ['cardio'], ['lower'], 'cardio', {
    modality: 'tiempo',
    difficulty: 'Avanzado',
    notes: 'Fácil: desplante normal.',
  }),
  seed('Squat + jab', ['cardio'], ['full'], 'cardio', { modality: 'tiempo', difficulty: 'Básico' }),
  seed('Medio burpee', ['cardio'], ['full'], 'cardio', { modality: 'tiempo', difficulty: 'Básico' }),
  seed('Squat + vuelos de frente', ['cardio'], ['full'], 'cardio', {
    modality: 'tiempo',
    notes: 'Mancuerna opcional y ligera.',
  }),
  seed('Squat + jumping jack', ['cardio'], ['full'], 'cardio', {
    modality: 'tiempo',
    notes: 'Fácil: paso lateral si no puedes saltar.',
  }),
  seed('Pies de bailarina en zig zag', ['cardio'], ['lower'], 'cardio', { modality: 'tiempo' }),
  seed('Squat + desplante atrás', ['cardio'], ['lower'], 'cardio', { modality: 'tiempo', difficulty: 'Básico' }),
  seed('Push up + mountain climber', ['cardio'], ['full', 'upper'], 'cardio', {
    modality: 'tiempo',
    notes: 'Fácil: rodillas en piso.',
  }),
  seed('High knees con palmada debajo de las piernas', ['cardio'], ['full'], 'cardio', { modality: 'tiempo' }),
  seed('Desplante atrás con giro de cadera', ['cardio'], ['lower', 'core'], 'cardio', {
    modality: 'tiempo',
    difficulty: 'Básico',
  }),
  seed('Sentadilla con pulsos pequeños', ['cardio'], ['lower'], 'cardio', { modality: 'tiempo', difficulty: 'Básico' }),
  seed('Sentadilla talón arriba', ['cardio'], ['lower'], 'cardio', {
    modality: 'tiempo',
    difficulty: 'Básico',
    notes: '15 s por lado.',
  }),

  // Core
  seed('Plancha lateral', ['fuerza', 'cardio'], ['core'], 'core', {
    modality: 'tiempo',
    notes: '15–20 s por lado. Fácil: rodilla de abajo apoyada.',
  }),
  seed('Sit up completa con pies arriba', ['fuerza', 'cardio'], ['core'], 'core', {
    difficulty: 'Avanzado',
    notes: 'Con pelota opcional. Fácil: media abdominal.',
  }),
  seed('Media sit up + sit up', ['fuerza', 'cardio'], ['core'], 'core', { notes: 'Fácil: solo media sit up.' }),
  seed('Pasar pelota en 8 debajo de las piernas', ['fuerza', 'cardio'], ['core'], 'core', { equipment: BALL }),
  seed('Llevar pelota en mano a pie unilateral', ['fuerza', 'cardio'], ['core'], 'core', {
    equipment: BALL,
    difficulty: 'Básico',
  }),

  // Estiramiento
  seed('Cuádriceps de pie', ['estiramiento'], ['lower'], 'movilidad', { modality: 'tiempo', difficulty: 'Básico' }),
  seed('Isquios de pie', ['estiramiento'], ['lower'], 'movilidad', { modality: 'tiempo', difficulty: 'Básico' }),
  seed('Glúteo en figura 4', ['estiramiento'], ['lower'], 'movilidad', { modality: 'tiempo', difficulty: 'Básico' }),
  seed('Aductores en mariposa', ['estiramiento'], ['lower'], 'movilidad', { modality: 'tiempo', difficulty: 'Básico' }),
  seed('Pantorrilla', ['estiramiento'], ['lower'], 'movilidad', { modality: 'tiempo', difficulty: 'Básico' }),
  seed('Reverendos', ['estiramiento'], ['full'], 'movilidad', { modality: 'tiempo', difficulty: 'Básico' }),
];

export const createBankExerciseId = slug;

/** Seed exercises missing from a saved bank (matched by id), e.g. ones added to the catalogue after it was saved. */
export function missingSeedExercises(bank: BankExercise[], seedBank: BankExercise[] = DEFAULT_EXERCISE_BANK) {
  const ids = new Set(bank.map((exercise) => exercise.id));
  return seedBank.filter((exercise) => !ids.has(exercise.id));
}
