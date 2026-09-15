export type MovementPattern = 'Squat' | 'Pull' | 'Push' | 'Hinge' | 'Core' | 'Metabolic' | 'Mobility';

export interface Material {
  name: string;
  category: string;
  desc: string;
  quantity: number;
  status: 'Excelente' | 'Desgastado' | 'Mantenimiento';
  active: boolean;
}


export interface RestrictionSwaps {
  'Sin-Impacto': string;
  'Sin-Flexion-Profunda': string;
  'Sin-Empuje-Vertical': string;
}

export interface Exercise {
  id: number;
  name: string;
  pattern: MovementPattern;
  equipmentNeeded: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  regression: string;
  progression: string;
  restrictionSwaps: RestrictionSwaps;
  videoUrl: string;
  imageUrl: string;
}

export type BlockType = 'Calentamiento' | 'Fuerza' | 'Metabólico' | 'Cierre';
export type WorkoutFormat = 'Circuit' | 'AMRAP' | 'EMOM' | 'A/B' | 'Parejas 1:1' | 'Flow';

export interface WorkoutExercise {
  baseExercise: Exercise;
  actualName: string; // Resolves restrictions
  reps: string;
  appliedRestriction?: string;
}

export interface WorkoutBlock {
  id: string;
  type: BlockType;
  name: string;
  durationMinutes: number;
  originalDurationMinutes?: number;
  format: WorkoutFormat;
  exercises: WorkoutExercise[];
  started: boolean;
  completed: boolean;
  coachNotes?: string;
}

export interface WorkoutPlan {
  id: string;
  date: string;
  startTime: string; // HH:MM
  focus: string;
  limitedEquipment: boolean;
  restrictions: string[];
  blocks: WorkoutBlock[];
  coachNotes: string;
  planBActivated: boolean;
}
