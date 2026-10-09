import { describe, expect, it } from 'vitest';
import { DEFAULT_RULES_PROFILE } from './default-profile';
import { DEFAULT_EXERCISE_BANK } from './exercise-bank';
import { buildRulesExport, buildRulesJson, buildRulesMarkdown } from './export-rules';
import type { ClassRecord } from './types';

const record = (classNumber: number): ClassRecord => ({
  id: `c${classNumber}`,
  date: `2026-10-0${classNumber}T12:00:00Z`,
  classNumber,
  focus: 'Upper Body',
  materials: ['Liga elástica'],
  blocks: [{ key: 'fuerza', name: 'Fuerza funcional', minutes: 22, exercises: [`Ejercicio ${classNumber}`] }],
  mainExerciseIds: [],
});

const history = [1, 2, 3, 4, 5, 6, 7].map(record);

describe('buildRulesExport', () => {
  it('keeps only active exercises and the last 5 classes', () => {
    const bank = DEFAULT_EXERCISE_BANK.map((e, i) => (i === 0 ? { ...e, active: false } : e));
    const data = buildRulesExport(DEFAULT_RULES_PROFILE, bank, history);

    expect(data.bank).toHaveLength(DEFAULT_EXERCISE_BANK.length - 1);
    expect(data.recentClasses.map((c) => c.classNumber)).toEqual([3, 4, 5, 6, 7]);
  });
});

describe('buildRulesMarkdown', () => {
  const markdown = buildRulesMarkdown(DEFAULT_RULES_PROFILE, DEFAULT_EXERCISE_BANK, history, ['Liga elástica']);

  it('includes the profile, the bank and the recent classes, newest first', () => {
    expect(markdown).toContain('Duración objetivo: 50–55 min.');
    expect(markdown).toContain('Calentamiento + subir BPM: 12–14');
    expect(markdown).toContain('3 sets 10-8-6 · 2 sets 8-6 · 3 sets 8-6-5');
    expect(markdown).toContain('**Combo**');
    expect(markdown).toContain('| Remo inclinado a dos brazos |');
    expect(markdown).toContain('**Material disponible hoy:** Liga elástica');
    expect(markdown.indexOf('Clase 7')).toBeLessThan(markdown.indexOf('Clase 3'));
    expect(markdown).not.toContain('Clase 2 ·');
  });
});

describe('buildRulesJson', () => {
  it('is valid JSON with the same data', () => {
    const parsed = JSON.parse(buildRulesJson(DEFAULT_RULES_PROFILE, DEFAULT_EXERCISE_BANK, history));
    expect(parsed.profile.targetMinutes).toEqual({ min: 50, max: 55 });
    expect(parsed.recentClasses).toHaveLength(5);
  });
});
