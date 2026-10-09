export const FUNCTIONAL_BLOCK_KEYS = ['calentamiento', 'fuerza', 'cardio', 'estiramiento'] as const;
export const BANK_FOCUSES = ['upper', 'lower', 'full', 'core'] as const;
export const FUNCTIONAL_PATTERNS = [
  'empuje',
  'jalón',
  'hombro',
  'brazos',
  'sentadilla',
  'bisagra',
  'desplante',
  'core',
  'cardio',
  'movilidad',
] as const;
export const MODALITIES = ['reps', 'tiempo'] as const;
export const DIFFICULTIES = ['Básico', 'Intermedio', 'Avanzado'] as const;

export const BLOCK_LABELS = {
  calentamiento: 'Calentamiento',
  fuerza: 'Fuerza',
  cardio: 'Cardio',
  estiramiento: 'Estiramiento',
} as const;

/** How many finished classes the export includes. */
export const EXPORT_RECENT_CLASSES = 5;
/** Older functional classes are dropped from storage after this many. */
export const CLASS_HISTORY_LIMIT = 50;
