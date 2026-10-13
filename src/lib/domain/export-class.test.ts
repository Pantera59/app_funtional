import { describe, expect, it } from 'vitest';
import { buildClassDocument, buildClassText, classFileName } from './export-class';
import { generateWorkout } from './generate-workout';
import { updateBlockNote } from './plan-rules';
import type { WorkoutPlan } from './types';

const makePlan = () => {
  let id = 0;
  return generateWorkout(
    { focus: 'Full Body', limitedEquipment: false, restrictions: [], startTime: '07:00', availableMaterials: [] },
    { random: () => 0.5, createId: () => `id-${++id}`, now: () => new Date('2026-10-13T12:00:00') },
  );
};

describe('buildClassDocument', () => {
  it('lists every block with its exercises and reps', () => {
    const plan = makePlan();
    const doc = buildClassDocument(plan);

    expect(doc.title).toBe('WOD · Full Body');
    expect(doc.details).toContain('Inicio: 07:00');
    expect(doc.details).toContain('Duración total: 60 min');
    expect(doc.blocks).toHaveLength(4);
    expect(doc.blocks[0].heading).toBe(`1. ${plan.blocks[0].name} · 10 min · ${plan.blocks[0].format}`);
    const first = plan.blocks[0].exercises[0];
    expect(doc.blocks[0].exercises[0]).toBe(`${first.actualName} — ${first.reps}`);
  });

  it('marks functional stations', () => {
    const plan = makePlan();
    const exercise = plan.blocks[1].exercises[0];
    const functional: WorkoutPlan = {
      ...plan,
      mode: 'funcional',
      classNumber: 12,
      blocks: plan.blocks.map((block, i) =>
        i === 1
          ? { ...block, exercises: [{ ...exercise, station: { number: 2, kind: 'A/B', role: 'A', conditional: true } }] }
          : block,
      ),
    };
    const doc = buildClassDocument(functional);

    expect(doc.title).toBe('Clase 12 · Full Body');
    expect(doc.blocks[1].exercises[0]).toMatch(/^\[Est\. 2 · A\/B · A · condicional\] /);
  });
});

describe('buildClassText', () => {
  it('includes block notes only when present', () => {
    const plan = makePlan();
    const text = buildClassText(updateBlockNote(plan, plan.blocks[1].id, 'Cuidar la espalda'));

    expect(text).toContain('Notas: Cuidar la espalda');
    expect(text.match(/Notas:/g)).toHaveLength(1);
  });
});

describe('classFileName', () => {
  it('uses the class number in functional mode', () => {
    const plan = makePlan();
    expect(classFileName(plan, 'txt')).toBe('wod-2026-10-13.txt');
    expect(classFileName({ ...plan, mode: 'funcional', classNumber: 3 }, 'docx')).toBe('clase-3-2026-10-13.docx');
  });
});
