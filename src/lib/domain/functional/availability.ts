import type { BankExercise } from './types';

/** True when every requirement group has at least one active material (names compared case-insensitively). */
export function hasRequiredMaterial(exercise: BankExercise, activeMaterials: string[]): boolean {
  const active = new Set(activeMaterials.map((m) => m.toLowerCase()));
  return exercise.equipment.every((group) => group.some((material) => active.has(material.toLowerCase())));
}

/** Active bank exercises the gym can do with today's material. */
export const availableExercises = (bank: BankExercise[], activeMaterials: string[]) =>
  bank.filter((exercise) => exercise.active && hasRequiredMaterial(exercise, activeMaterials));

/** "Mancuernas ligeras o Mancuernas medias + Discos", or "Ninguno". */
export const describeEquipment = (exercise: BankExercise) =>
  exercise.equipment.length > 0 ? exercise.equipment.map((group) => group.join(' o ')).join(' + ') : 'Ninguno';
