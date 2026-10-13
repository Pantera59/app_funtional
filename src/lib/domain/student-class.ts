import type { WorkoutExercise, WorkoutPlan } from './types';

/**
 * What students see of a class: no coach notes, notices, Plan B state or
 * conditional stations. Small enough to travel inside the QR link, so a phone
 * that never generated the plan can still open it.
 */
export interface StudentClass {
  focus: string;
  startTime: string;
  blocks: StudentBlock[];
}

export interface StudentBlock {
  name: string;
  durationMinutes: number;
  format: string;
  exercises: StudentExercise[];
}

export interface StudentExercise {
  name: string;
  reps: string;
  /** "Est. 2 · A/B · A" */
  station?: string;
  /** Technique cue from the exercise bank. */
  note?: string;
}

/** "Est. 2 · A/B · A", without the conditional flag, which is for the coach only. */
function stationLabel({ station }: WorkoutExercise) {
  if (!station) return undefined;
  return [`Est. ${station.number}`, station.kind, station.role].filter(Boolean).join(' · ');
}

export function toStudentClass(plan: WorkoutPlan): StudentClass {
  return {
    focus: plan.focus,
    startTime: plan.startTime,
    blocks: plan.blocks.map((block) => ({
      name: block.name,
      durationMinutes: block.durationMinutes,
      format: block.format,
      exercises: block.exercises
        .filter((exercise) => !exercise.station?.conditional)
        .map((exercise) => ({
          name: exercise.actualName,
          reps: exercise.reps,
          station: stationLabel(exercise),
          note: (plan.mode === 'funcional' && exercise.baseExercise.regression) || undefined,
        })),
    })),
  };
}

export const classMinutes = (studentClass: StudentClass) =>
  studentClass.blocks.reduce((total, block) => total + block.durationMinutes, 0);

/* Compact positional form for the URL: [focus, startTime, [[name, minutes, format, [[name, reps, station, note]]]]]. */
type PackedExercise = [string, string, string, string];
type PackedBlock = [string, number, string, PackedExercise[]];
type PackedClass = [string, string, PackedBlock[]];

function toBase64Url(bytes: Uint8Array) {
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(encoded: string) {
  const binary = atob(encoded.replace(/-/g, '+').replace(/_/g, '/'));
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

/** Deflate keeps the link around 1 KB, so the QR code stays easy to scan. */
async function pipe(bytes: Uint8Array, transform: CompressionStream | DecompressionStream) {
  const stream = new Blob([bytes as BlobPart]).stream().pipeThrough(transform);
  return new Uint8Array(await new Response(stream).arrayBuffer());
}

export async function encodeStudentClass(studentClass: StudentClass): Promise<string> {
  const packed: PackedClass = [
    studentClass.focus,
    studentClass.startTime,
    studentClass.blocks.map((block) => [
      block.name,
      block.durationMinutes,
      block.format,
      block.exercises.map((e) => [e.name, e.reps, e.station ?? '', e.note ?? '']),
    ]),
  ];
  const json = new TextEncoder().encode(JSON.stringify(packed));
  return toBase64Url(await pipe(json, new CompressionStream('deflate-raw')));
}

/** Returns null for anything that is not a class link, so a broken QR shows the empty state instead of crashing. */
export async function decodeStudentClass(encoded: string): Promise<StudentClass | null> {
  try {
    const json = await pipe(fromBase64Url(encoded), new DecompressionStream('deflate-raw'));
    const [focus, startTime, blocks] = JSON.parse(new TextDecoder().decode(json)) as PackedClass;
    if (typeof focus !== 'string' || typeof startTime !== 'string' || !Array.isArray(blocks)) return null;
    return {
      focus,
      startTime,
      blocks: blocks.map(([name, durationMinutes, format, exercises]) => ({
        name: String(name),
        durationMinutes: Number(durationMinutes) || 0,
        format: String(format),
        exercises: exercises.map(([exerciseName, reps, station, note]) => ({
          name: String(exerciseName),
          reps: String(reps),
          station: station ? String(station) : undefined,
          note: note ? String(note) : undefined,
        })),
      })),
    };
  } catch {
    return null;
  }
}

/** Hash parameter that carries the class, e.g. `/alumno#c=...`. The hash never reaches the server. */
export const STUDENT_CLASS_PARAM = 'c';
