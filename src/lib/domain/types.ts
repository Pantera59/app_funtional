import type { FOCUS_OPTIONS, MATERIAL_STATUSES, RESTRICTIONS } from './constants';

export type Restriction = (typeof RESTRICTIONS)[number];
export type Focus = (typeof FOCUS_OPTIONS)[number];
export type MaterialStatus = (typeof MATERIAL_STATUSES)[number];

export type MovementPattern = 'Squat' | 'Pull' | 'Push' | 'Hinge' | 'Core' | 'Metabolic' | 'Mobility';

export interface Material {
  name: string;
  category: string;
  desc: string;
  quantity: number;
  status: MaterialStatus;
  active: boolean;
}

export type RestrictionSwaps = Record<Restriction, string>;

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
  /** Display name after restriction swaps are applied. */
  actualName: string;
  reps: string;
  appliedRestriction?: Restriction;
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
  /** HH:mm */
  startTime: string;
  focus: Focus;
  limitedEquipment: boolean;
  restrictions: Restriction[];
  blocks: WorkoutBlock[];
  coachNotes: string;
  planBActivated: boolean;
}

export interface WorkoutOptions {
  focus: Focus;
  limitedEquipment: boolean;
  restrictions: Restriction[];
  startTime: string;
  availableMaterials: string[];
}
