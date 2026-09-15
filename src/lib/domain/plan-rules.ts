import { PLAN_B } from './constants';
import type { WorkoutPlan } from './types';

export const countExercises = (plan: WorkoutPlan) =>
  plan.blocks.reduce((total, block) => total + block.exercises.length, 0);

/** Plan B: shortens every metabolic block by PLAN_B.reduction. Applies once per plan. */
export function activatePlanB(plan: WorkoutPlan): WorkoutPlan {
  if (plan.planBActivated) return plan;

  return {
    ...plan,
    planBActivated: true,
    blocks: plan.blocks.map((block) =>
      block.type === 'Metabólico'
        ? { ...block, durationMinutes: Math.max(1, Math.floor(block.durationMinutes * (1 - PLAN_B.reduction))) }
        : block,
    ),
  };
}

export function updateBlockNote(plan: WorkoutPlan, blockId: string, coachNotes: string): WorkoutPlan {
  return {
    ...plan,
    blocks: plan.blocks.map((block) => (block.id === blockId ? { ...block, coachNotes } : block)),
  };
}
