import type { Focus } from '../types';
import type {
  BANK_FOCUSES,
  DIFFICULTIES,
  FUNCTIONAL_BLOCK_KEYS,
  FUNCTIONAL_PATTERNS,
  MODALITIES,
} from './constants';

export type FunctionalBlockKey = (typeof FUNCTIONAL_BLOCK_KEYS)[number];
export type BankFocus = (typeof BANK_FOCUSES)[number];
export type FunctionalPattern = (typeof FUNCTIONAL_PATTERNS)[number];
export type Modality = (typeof MODALITIES)[number];
export type Difficulty = (typeof DIFFICULTIES)[number];

export interface BankExercise {
  id: string;
  name: string;
  /** Blocks where the exercise can be used. */
  blocks: FunctionalBlockKey[];
  focus: BankFocus[];
  pattern: FunctionalPattern;
  /**
   * Requirement groups: every group needs at least one active material from it.
   * `[['Mancuernas ligeras', 'Mancuernas medias'], ['Discos']]` = any dumbbell plus discs. Empty = no material.
   */
  equipment: string[][];
  modality: Modality;
  difficulty: Difficulty;
  /** Technique cues or easier variants. */
  notes: string;
  /** Sequential combo (A + B + C in one movement): fills a station on its own. */
  combo: boolean;
  active: boolean;
}

export interface BlockTiming {
  key: FunctionalBlockKey;
  name: string;
  minMinutes: number;
  maxMinutes: number;
  /** Minutes the coach plans for this block. Must stay within min/max. */
  minutes: number;
}

export interface StrengthScheme {
  label: string;
  active: boolean;
}

export interface RulesProfile {
  targetMinutes: { min: number; max: number };
  /** Always in FUNCTIONAL_BLOCK_KEYS order. */
  blocks: BlockTiming[];
  warmup: {
    /** Fixed mobility sequence, always at the start. One entry per body area. */
    fixedSequence: { area: string; detail: string }[];
    activationCount: number;
    activationSets: number;
    activationReps: string;
  };
  strength: {
    stations: number;
    minStations: number;
    maxStations: number;
    schemes: StrengthScheme[];
    /** Extra station kept only if the class still fits the target time. */
    conditionalStation: boolean;
    conditionalMinutes: number;
  };
  cardio: {
    exercises: number;
    minExercises: number;
    maxExercises: number;
    workSeconds: number;
    restSeconds: number;
    rounds: number;
  };
  stretch: { exercises: number };
  rotation: {
    /** A station's main exercise is not repeated if it appeared in the last N classes. */
    lookbackClasses: number;
    /** Upper body: pair push and pull so both appear equally. */
    balancePushPull: boolean;
  };
}

export interface ClassRecordBlock {
  key: FunctionalBlockKey;
  name: string;
  minutes: number;
  exercises: string[];
}

export interface ClassRecord {
  id: string;
  date: string;
  classNumber: number;
  focus: Focus;
  materials: string[];
  blocks: ClassRecordBlock[];
  /** Bank ids of each station's main exercise, used by the rotation rule. */
  mainExerciseIds: string[];
}

export interface FunctionalOptions {
  focus: Focus;
  startTime: string;
  availableMaterials: string[];
}
