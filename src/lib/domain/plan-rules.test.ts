import { describe, expect, it } from 'vitest';
import { generateWorkout } from './generate-workout';
import { activatePlanB, countExercises, updateBlockNote } from './plan-rules';

const makePlan = () => {
  let id = 0;
  return generateWorkout(
    { focus: 'Full Body', limitedEquipment: false, restrictions: [], startTime: '07:00', availableMaterials: [] },
    { random: () => 0.5, createId: () => `id-${++id}` },
  );
};

describe('activatePlanB', () => {
  it('shortens only the metabolic block by 30%', () => {
    const plan = makePlan();
    const result = activatePlanB(plan);

    expect(result.planBActivated).toBe(true);
    expect(result.blocks.map((b) => b.durationMinutes)).toEqual([10, 20, 14, 10]);
    expect(plan.blocks[2].durationMinutes).toBe(20);
  });

  it('applies only once', () => {
    const once = activatePlanB(makePlan());
    expect(activatePlanB(once)).toBe(once);
  });
});

describe('updateBlockNote', () => {
  it('updates the note of the target block only', () => {
    const plan = makePlan();
    const target = plan.blocks[1].id;
    const result = updateBlockNote(plan, target, 'Cuidar la espalda');

    expect(result.blocks.map((b) => b.coachNotes)).toEqual(['', 'Cuidar la espalda', '', '']);
    expect(plan.blocks[1].coachNotes).toBe('');
  });
});

describe('countExercises', () => {
  it('counts exercises across all blocks', () => {
    expect(countExercises(makePlan())).toBe(12);
  });
});
