import { describe, expect, it } from 'vitest';
import { DEFAULT_MATERIALS } from '../constants';
import { DEFAULT_EXERCISE_BANK, missingSeedExercises } from './exercise-bank';

describe('exercise bank seed', () => {
  it('has unique ids, so edits and catalogue merges never collide', () => {
    const ids = DEFAULT_EXERCISE_BANK.map((exercise) => exercise.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('only references built-in materials', () => {
    const names = new Set(DEFAULT_MATERIALS.map((material) => material.name));
    const unknown = DEFAULT_EXERCISE_BANK.flatMap((exercise) => exercise.equipment.flat()).filter((name) => !names.has(name));
    expect(unknown).toEqual([]);
  });

  it('includes the exercises from the latest class sheets', () => {
    const names = DEFAULT_EXERCISE_BANK.map((exercise) => exercise.name);
    expect(names).toEqual(expect.arrayContaining(['Skullcrusher unilateral', '21 para bíceps', 'Kickback + side step + squat a 4 tiempos']));
  });
});

describe('missingSeedExercises', () => {
  it('returns seed exercises the saved bank lacks, ignoring edits to existing ones', () => {
    const [first, second, third] = DEFAULT_EXERCISE_BANK;
    const saved = [{ ...first, name: 'Renombrado por el coach', active: false }, second];
    expect(missingSeedExercises(saved, [first, second, third])).toEqual([third]);
  });

  it('returns nothing for an up-to-date bank', () => {
    expect(missingSeedExercises(DEFAULT_EXERCISE_BANK)).toEqual([]);
  });
});
