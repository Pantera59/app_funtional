import type { MovementPattern } from './types';

export type MuscleRegion =
  | 'chest'
  | 'shoulders'
  | 'back'
  | 'abs'
  | 'glutes'
  | 'quads'
  | 'hamstrings'
  | 'calves'
  | 'triceps'
  | 'biceps';

export interface MuscleFocus {
  muscles: string[];
  description: string;
  regions: MuscleRegion[];
}

export const MUSCLE_FOCUS: Record<MovementPattern, MuscleFocus> = {
  Squat: {
    muscles: ['Cuádriceps', 'Glúteos', 'Pantorrillas'],
    description: 'Enfoque en extensión de rodilla y empuje del tren inferior.',
    regions: ['quads', 'glutes', 'calves'],
  },
  Hinge: {
    muscles: ['Glúteo Mayor', 'Isquiotibiales (Femorales)', 'Erectores Espinales'],
    description: 'Dominancia de cadera y activación de la cadena posterior.',
    regions: ['glutes', 'hamstrings'],
  },
  Push: {
    muscles: ['Pectoral Mayor', 'Deltoides Anterior', 'Tríceps Branquial'],
    description: 'Fuerza de empuje del tren superior.',
    regions: ['chest', 'shoulders', 'triceps'],
  },
  Pull: {
    muscles: ['Dorsal Ancho', 'Redondo Mayor', 'Bíceps Branquial', 'Trapecios'],
    description: 'Fuerza de tracción y estabilidad escapular.',
    regions: ['back', 'shoulders', 'biceps'],
  },
  Core: {
    muscles: ['Recto Abdominal', 'Oblicuos', 'Transverso del Abdomen'],
    description: 'Estabilización lumbo-pélvica y resistencia del núcleo.',
    regions: ['abs'],
  },
  Metabolic: {
    muscles: ['Sistema Cardiovascular', 'Cuádriceps', 'Deltoides', 'Núcleo Activo'],
    description: 'Acondicionamiento de alta intensidad de cuerpo completo.',
    regions: ['quads', 'glutes', 'shoulders', 'abs'],
  },
  Mobility: {
    muscles: ['Flexores de Cadera', 'Isquiotibiales', 'Movilidad Articular'],
    description: 'Liberación miofascial, estiramiento dinámico y flexibilidad.',
    regions: ['glutes', 'hamstrings'],
  },
};

/** Highlight overlays for the body silhouette (viewBox 0 0 100 160), listed in paint order. */
export const MUSCLE_OVERLAYS: Record<MuscleRegion, { opacity: number; paths: string[] }> = {
  chest: { opacity: 0.85, paths: ['M40,40 C43,39 50,42 50,46 C50,42 57,39 60,40 C61,45 56,52 50,54 C44,52 39,45 40,40 Z'] },
  shoulders: {
    opacity: 0.85,
    paths: ['M33,36 C35,36 38,39 37,44 C34,44 32,40 33,36 Z', 'M67,36 C65,36 62,39 63,44 C66,44 68,40 67,36 Z'],
  },
  back: { opacity: 0.8, paths: ['M39,44 C42,48 44,58 44,68 C47,68 53,68 56,68 C56,58 58,48 61,44 C56,40 44,40 39,44 Z'] },
  abs: { opacity: 0.8, paths: ['M44,48 C48,47 52,47 56,48 C57,54 57,64 56,68 C52,70 48,70 44,68 C43,64 43,54 44,48 Z'] },
  glutes: {
    opacity: 0.85,
    paths: ['M39,74 C43,74 46,78 45,86 C40,86 37,82 39,74 Z', 'M61,74 C57,74 54,78 55,86 C60,86 63,82 61,74 Z'],
  },
  quads: {
    opacity: 0.85,
    paths: ['M38,92 C42,91 44,102 44,116 C41,118 38,106 38,92 Z', 'M62,92 C58,91 56,102 56,116 C59,118 62,106 62,92 Z'],
  },
  hamstrings: {
    opacity: 0.8,
    paths: ['M39,94 C41,94 43,104 43,114 C40,114 38,104 39,94 Z', 'M61,94 C59,94 57,104 57,114 C60,114 62,104 61,94 Z'],
  },
  calves: {
    opacity: 0.85,
    paths: ['M39,128 C41,128 42,136 41,146 C38,146 38,136 39,128 Z', 'M61,128 C59,128 58,136 59,146 C62,146 62,136 61,128 Z'],
  },
  triceps: {
    opacity: 0.8,
    paths: ['M29,46 C31,46 32,54 31,60 C29,60 28,54 29,46 Z', 'M71,46 C69,46 68,54 69,60 C71,60 72,54 71,46 Z'],
  },
  biceps: {
    opacity: 0.8,
    paths: ['M34,46 C35,46 36,54 35,60 C33,60 33,54 34,46 Z', 'M66,46 C65,46 64,54 65,60 C67,60 67,54 66,46 Z'],
  },
};
