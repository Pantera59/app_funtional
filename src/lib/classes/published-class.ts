import type { StudentClass } from '@/lib/domain/student-class';

/** A class the coach published for students (`published_classes` table). */
export interface PublishedClass {
  id: string;
  title: string;
  /** YYYY-MM-DD */
  classDate: string;
  published: boolean;
  studentClass: StudentClass;
  createdAt: string;
}

export interface PublishedClassRow {
  id: string;
  title: string;
  class_date: string;
  published: boolean;
  payload: unknown;
  created_at: string;
}

/** Validates the JSON payload, since rows are data written by other clients. Null when it isn't a class. */
export function parseStudentClass(payload: unknown): StudentClass | null {
  if (!payload || typeof payload !== 'object') return null;
  const { focus, startTime, blocks } = payload as Record<string, unknown>;
  if (typeof focus !== 'string' || typeof startTime !== 'string' || !Array.isArray(blocks)) return null;
  return {
    focus,
    startTime,
    blocks: blocks.map((block: Record<string, unknown>) => ({
      name: String(block?.name ?? ''),
      durationMinutes: Number(block?.durationMinutes) || 0,
      format: String(block?.format ?? ''),
      exercises: (Array.isArray(block?.exercises) ? block.exercises : []).map((e: Record<string, unknown>) => ({
        name: String(e?.name ?? ''),
        reps: String(e?.reps ?? ''),
        station: e?.station ? String(e.station) : undefined,
        note: e?.note ? String(e.note) : undefined,
      })),
    })),
  };
}

export function fromRow(row: PublishedClassRow): PublishedClass | null {
  const studentClass = parseStudentClass(row.payload);
  if (!studentClass) return null;
  return {
    id: row.id,
    title: row.title,
    classDate: row.class_date,
    published: row.published,
    studentClass,
    createdAt: row.created_at,
  };
}

/** Local date as YYYY-MM-DD (not toISOString, which is UTC and can be tomorrow in the evening). */
export function localIsoDate(date: Date) {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export const defaultClassTitle = (studentClass: StudentClass) => `Clase ${studentClass.focus}`;
