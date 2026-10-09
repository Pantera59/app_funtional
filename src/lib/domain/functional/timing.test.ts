import { describe, expect, it } from 'vitest';
import { DEFAULT_RULES_PROFILE } from './default-profile';
import { fitClassTime, validateProfile } from './timing';
import type { RulesProfile } from './types';

type Overrides = {
  minutes?: Partial<Record<'calentamiento' | 'fuerza' | 'cardio' | 'estiramiento', number>>;
  strength?: Partial<RulesProfile['strength']>;
  cardio?: Partial<RulesProfile['cardio']>;
};

const profile = ({ minutes = {}, strength = {}, cardio = {} }: Overrides = {}): RulesProfile => ({
  ...DEFAULT_RULES_PROFILE,
  blocks: DEFAULT_RULES_PROFILE.blocks.map((b) => ({ ...b, minutes: minutes[b.key] ?? b.minutes })),
  strength: { ...DEFAULT_RULES_PROFILE.strength, ...strength },
  cardio: { ...DEFAULT_RULES_PROFILE.cardio, ...cardio },
});

describe('fitClassTime', () => {
  it('keeps the default profile, conditional station included, within 50–55 min', () => {
    const timing = fitClassTime(DEFAULT_RULES_PROFILE);

    expect(timing.total).toBe(55);
    expect(timing.keepConditional).toBe(true);
    expect(timing.minutes).toEqual({ calentamiento: 13, fuerza: 22, cardio: 13, estiramiento: 7 });
    expect(timing.withinTarget).toBe(true);
    expect(timing.adjustments).toEqual([]);
  });

  it('drops the conditional station first when the class runs long', () => {
    const timing = fitClassTime(profile({ minutes: { fuerza: 20 } }));

    expect(timing.keepConditional).toBe(false);
    expect(timing.minutes.fuerza).toBe(20);
    expect(timing.total).toBe(53);
    expect(timing.cardioRounds).toBe(2);
    expect(timing.adjustments).toHaveLength(1);
  });

  it('then drops one cardio round if it still does not fit', () => {
    const timing = fitClassTime(profile({ minutes: { calentamiento: 14, fuerza: 22, cardio: 15, estiramiento: 10 } }));

    expect(timing.keepConditional).toBe(false);
    expect(timing.cardioRounds).toBe(1);
    expect(timing.minutes.cardio).toBe(7.5);
    expect(timing.total).toBe(53.5);
    expect(timing.withinTarget).toBe(true);
    expect(timing.adjustments).toHaveLength(2);
  });

  it('never drops the only cardio round and reports the class as out of target', () => {
    const timing = fitClassTime(
      profile({ minutes: { calentamiento: 14, fuerza: 22, cardio: 15, estiramiento: 10 }, cardio: { rounds: 1 } }),
    );

    expect(timing.cardioRounds).toBe(1);
    expect(timing.total).toBe(61);
    expect(timing.withinTarget).toBe(false);
  });

  it('flags a class that is too short', () => {
    const timing = fitClassTime(
      profile({ minutes: { calentamiento: 12, fuerza: 14, cardio: 12, estiramiento: 6 }, strength: { conditionalStation: false } }),
    );

    expect(timing.total).toBe(44);
    expect(timing.withinTarget).toBe(false);
  });
});

describe('validateProfile', () => {
  it('accepts the default profile', () => {
    expect(validateProfile(DEFAULT_RULES_PROFILE)).toEqual([]);
  });

  it('reports blocks outside their range and an out-of-target total', () => {
    const issues = validateProfile(profile({ minutes: { cardio: 25 }, cardio: { rounds: 1 } }));
    expect(issues.some((i) => i.startsWith('Cardio: 25 min'))).toBe(true);
    expect(issues.some((i) => i.includes('objetivo es 50–55'))).toBe(true);
  });

  it('requires at least one active strength scheme', () => {
    const issues = validateProfile(
      profile({ strength: { schemes: DEFAULT_RULES_PROFILE.strength.schemes.map((s) => ({ ...s, active: false })) } }),
    );
    expect(issues).toContain('Fuerza: activa al menos un esquema de series.');
  });
});
