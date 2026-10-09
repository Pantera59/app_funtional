import { describe, expect, it } from 'vitest';
import { availableExercises, describeEquipment, hasRequiredMaterial } from './availability';
import { DEFAULT_EXERCISE_BANK } from './exercise-bank';
import type { BankExercise } from './types';

const exercise = (equipment: string[][], active = true): BankExercise => ({
  id: 'x',
  name: 'X',
  blocks: ['fuerza'],
  focus: ['upper'],
  pattern: 'empuje',
  equipment,
  modality: 'reps',
  difficulty: 'Básico',
  notes: '',
  combo: false,
  active,
});

describe('hasRequiredMaterial', () => {
  it('always allows exercises without material', () => {
    expect(hasRequiredMaterial(exercise([]), [])).toBe(true);
  });

  it('accepts any material of a group, case-insensitively', () => {
    const dumbbells = exercise([['Mancuernas ligeras', 'Mancuernas medias']]);
    expect(hasRequiredMaterial(dumbbells, ['mancuernas MEDIAS'])).toBe(true);
    expect(hasRequiredMaterial(dumbbells, ['Liga elástica'])).toBe(false);
  });

  it('requires every group', () => {
    const heelsOnDiscs = exercise([['Mancuernas ligeras'], ['Discos']]);
    expect(hasRequiredMaterial(heelsOnDiscs, ['Mancuernas ligeras'])).toBe(false);
    expect(hasRequiredMaterial(heelsOnDiscs, ['Mancuernas ligeras', 'Discos'])).toBe(true);
  });
});

describe('availableExercises', () => {
  it('drops deactivated exercises', () => {
    expect(availableExercises([exercise([], false)], [])).toEqual([]);
  });

  it('with only dumbbells and band, never returns exercises that need other material', () => {
    const active = ['Mancuernas ligeras', 'Mancuernas medias', 'Liga elástica'];
    const result = availableExercises(DEFAULT_EXERCISE_BANK, active);
    const names = result.map((e) => e.name);

    expect(names).toContain('Remo inclinado a dos brazos');
    expect(names).toContain('Face pull con liga');
    expect(names).not.toContain('Giro ruso con pelota');
    expect(names).not.toContain('Squat frontal con talones en discos');
    expect(names).not.toContain('Jab + cross con polainas');
    for (const e of result) {
      expect(e.equipment.every((group) => group.some((m) => active.includes(m)))).toBe(true);
    }
  });
});

describe('describeEquipment', () => {
  it('joins alternatives with "o" and groups with "+"', () => {
    expect(describeEquipment(exercise([['Mancuernas ligeras', 'Mancuernas medias'], ['Discos']]))).toBe(
      'Mancuernas ligeras o Mancuernas medias + Discos',
    );
    expect(describeEquipment(exercise([]))).toBe('Ninguno');
  });
});

describe('DEFAULT_EXERCISE_BANK', () => {
  it('has unique ids', () => {
    const ids = DEFAULT_EXERCISE_BANK.map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
