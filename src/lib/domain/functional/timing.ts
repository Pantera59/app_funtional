import type { FunctionalBlockKey, RulesProfile } from './types';

export interface ClassTiming {
  /** Minutes per block; `fuerza` includes the conditional station when it is kept. */
  minutes: Record<FunctionalBlockKey, number>;
  keepConditional: boolean;
  cardioRounds: number;
  total: number;
  withinTarget: boolean;
  /** Changes made to fit the target, in Spanish, for the coach. */
  adjustments: string[];
}

const sum = (values: number[]) => values.reduce((total, n) => total + n, 0);

const blockMinutes = (profile: RulesProfile, key: FunctionalBlockKey) =>
  profile.blocks.find((b) => b.key === key)?.minutes ?? 0;

/**
 * Uses the fixed minutes of each block and checks the total against the target.
 * Over the maximum, it first drops the conditional station, then one cardio round.
 */
export function fitClassTime(profile: RulesProfile): ClassTiming {
  const { min, max } = profile.targetMinutes;
  const adjustments: string[] = [];

  const minutes = Object.fromEntries(profile.blocks.map((b) => [b.key, b.minutes])) as Record<
    FunctionalBlockKey,
    number
  >;
  let keepConditional = profile.strength.conditionalStation && profile.strength.conditionalMinutes > 0;
  if (keepConditional) minutes.fuerza += profile.strength.conditionalMinutes;
  let cardioRounds = profile.cardio.rounds;

  const total = () => sum(Object.values(minutes));

  if (total() > max && keepConditional) {
    keepConditional = false;
    minutes.fuerza -= profile.strength.conditionalMinutes;
    adjustments.push(`Se quitó la estación condicional (−${profile.strength.conditionalMinutes} min).`);
  }
  if (total() > max && cardioRounds > 1) {
    const perRound = blockMinutes(profile, 'cardio') / cardioRounds;
    minutes.cardio = Math.round((minutes.cardio - perRound) * 2) / 2;
    cardioRounds -= 1;
    adjustments.push(`Se quitó una vuelta de cardio (−${Math.round(perRound * 2) / 2} min).`);
  }

  const finalTotal = total();
  const withinTarget = finalTotal >= min && finalTotal <= max;
  if (!withinTarget) {
    adjustments.push(`El total (${finalTotal} min) queda fuera del objetivo de ${min}–${max} min.`);
  }

  return { minutes, keepConditional, cardioRounds, total: finalTotal, withinTarget, adjustments };
}

/** Problems that make the profile inconsistent. Empty means valid. */
export function validateProfile(profile: RulesProfile): string[] {
  const issues: string[] = [];
  const { min, max } = profile.targetMinutes;
  if (min > max) issues.push('La duración mínima es mayor que la máxima.');

  for (const block of profile.blocks) {
    if (block.minMinutes > block.maxMinutes) {
      issues.push(`${block.name}: el mínimo es mayor que el máximo.`);
    } else if (block.minutes < block.minMinutes || block.minutes > block.maxMinutes) {
      issues.push(`${block.name}: ${block.minutes} min está fuera de su rango (${block.minMinutes}–${block.maxMinutes}).`);
    }
  }

  const { stations, minStations, maxStations, schemes } = profile.strength;
  if (stations < minStations || stations > maxStations) {
    issues.push(`Fuerza: ${stations} estaciones está fuera del rango ${minStations}–${maxStations}.`);
  }
  if (!schemes.some((s) => s.active && s.label.trim())) issues.push('Fuerza: activa al menos un esquema de series.');

  const { exercises, minExercises, maxExercises, rounds } = profile.cardio;
  if (exercises < minExercises || exercises > maxExercises) {
    issues.push(`Cardio: ${exercises} ejercicios está fuera del rango ${minExercises}–${maxExercises}.`);
  }
  if (rounds < 1) issues.push('Cardio: debe haber al menos una vuelta.');

  const timing = fitClassTime(profile);
  if (!timing.withinTarget) {
    issues.push(`La clase suma ${timing.total} min y el objetivo es ${min}–${max} min, incluso después de ajustar.`);
  }
  return issues;
}
