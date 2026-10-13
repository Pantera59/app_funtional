import { describe, expect, it } from 'vitest';
import { DEFAULT_RULES_PROFILE } from './functional/default-profile';
import { DEFAULT_EXERCISE_BANK } from './functional/exercise-bank';
import { generateFunctionalClass } from './functional/generate-functional-class';
import { FOCUS_OPTIONS } from './constants';
import { decodeStudentClass, encodeStudentClass, toStudentClass } from './student-class';

const ALL_MATERIAL = ['Mancuernas ligeras', 'Mancuernas medias', 'Liga elástica', 'Liga de resistencia', 'Polainas', 'Pelota'];

const generate = (focus: (typeof FOCUS_OPTIONS)[number]) =>
  generateFunctionalClass(
    { focus, startTime: '07:00', availableMaterials: ALL_MATERIAL },
    DEFAULT_RULES_PROFILE,
    DEFAULT_EXERCISE_BANK,
    { history: [], random: () => 0.5, createId: () => 'id', now: () => new Date('2026-10-13T12:00:00Z') },
  ).plan;

describe('toStudentClass', () => {
  it('drops conditional stations and coach-only data', () => {
    const plan = generate('Lower Body');
    expect(plan.blocks.some((b) => b.exercises.some((e) => e.station?.conditional))).toBe(true);

    const studentClass = toStudentClass({ ...plan, coachNotes: 'secreto', notices: ['aviso'] });
    const json = JSON.stringify(studentClass);
    expect(json).not.toContain('secreto');
    expect(json).not.toContain('aviso');
    expect(json).not.toMatch(/condicional/i);
    const total = (p: typeof plan) => p.blocks.reduce((n, b) => n + b.exercises.filter((e) => !e.station?.conditional).length, 0);
    expect(studentClass.blocks.reduce((n, b) => n + b.exercises.length, 0)).toBe(total(plan));
  });
});

describe('encodeStudentClass', () => {
  it.each(FOCUS_OPTIONS)('round-trips a %s class and fits in a QR code', async (focus) => {
    const studentClass = toStudentClass(generate(focus));
    const encoded = await encodeStudentClass(studentClass);
    expect(await decodeStudentClass(encoded)).toEqual(studentClass);
    // Well under a QR code's ~2,950 bytes, so it stays scannable from a screen.
    expect(encoded.length).toBeLessThan(1500);
  });

  it('returns null for a broken link', async () => {
    expect(await decodeStudentClass('not-a-class')).toBeNull();
    expect(await decodeStudentClass('')).toBeNull();
  });
});
