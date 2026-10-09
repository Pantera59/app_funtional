import type { RulesProfile } from './types';

/**
 * The coach's planning rules. Base blocks add up to 51 min; the conditional
 * station (4 min) brings the class to 55, the top of the 50–55 target.
 */
export const DEFAULT_RULES_PROFILE: RulesProfile = {
  targetMinutes: { min: 50, max: 55 },
  blocks: [
    { key: 'calentamiento', name: 'Calentamiento + subir BPM', minMinutes: 12, maxMinutes: 14, minutes: 13 },
    { key: 'fuerza', name: 'Fuerza funcional', minMinutes: 14, maxMinutes: 22, minutes: 18 },
    { key: 'cardio', name: 'Cardio', minMinutes: 12, maxMinutes: 15, minutes: 13 },
    { key: 'estiramiento', name: 'Estiramiento', minMinutes: 6, maxMinutes: 10, minutes: 7 },
  ],
  warmup: {
    fixedSequence: [
      { area: 'Cuello', detail: 'Círculo completo der/izq, decir "sí", decir "no"' },
      { area: 'Hombros', detail: 'Medios y completos adelante/atrás, liga lateral, liga arriba/abajo' },
      { area: 'Cadera', detail: 'Círculos der/izq, adelante/atrás, laterales' },
      {
        area: 'Piernas',
        detail: 'Desplante estático adelante/atrás c/pierna, desplantes de activación x5 c/pie',
      },
    ],
    activationCount: 3,
    activationSets: 2,
    activationReps: '8–10',
  },
  strength: {
    stations: 4,
    minStations: 3,
    maxStations: 5,
    schemes: [
      { label: '3 sets 10-8-6', active: true },
      { label: '2 sets 8-6', active: true },
      { label: '3 sets 8-6-5', active: true },
    ],
    conditionalStation: true,
    conditionalMinutes: 4,
  },
  cardio: {
    exercises: 5,
    minExercises: 4,
    maxExercises: 6,
    workSeconds: 30,
    restSeconds: 20,
    rounds: 2,
  },
  stretch: { exercises: 8 },
  rotation: { lookbackClasses: 2, balancePushPull: true },
};
