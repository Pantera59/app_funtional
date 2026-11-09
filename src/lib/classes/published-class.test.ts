import { describe, expect, it } from 'vitest';
import { fromRow, localIsoDate, parseStudentClass } from './published-class';

const payload = {
  focus: 'Lower Body',
  startTime: '07:00',
  blocks: [{ name: 'Fuerza', durationMinutes: 20, format: 'Estaciones', exercises: [{ name: 'Goblet squat', reps: '10-8-6', station: 'Est. 1' }] }],
};

describe('published classes', () => {
  it('parses a valid payload and drops empty optional fields', () => {
    const parsed = parseStudentClass(payload);
    expect(parsed?.blocks[0].exercises[0]).toEqual({ name: 'Goblet squat', reps: '10-8-6', station: 'Est. 1', note: undefined });
  });

  it('rejects payloads that are not classes', () => {
    expect(parseStudentClass(null)).toBeNull();
    expect(parseStudentClass({ focus: 1 })).toBeNull();
    expect(parseStudentClass('hola')).toBeNull();
    expect(fromRow({ id: '1', title: 't', class_date: '2026-11-09', published: true, payload: {}, created_at: '' })).toBeNull();
  });

  it('formats the local date', () => {
    expect(localIsoDate(new Date(2026, 0, 5, 23, 30))).toBe('2026-01-05');
  });
});
