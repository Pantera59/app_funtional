import { format } from 'date-fns';
import { humanize } from '../format';
import type { WorkoutExercise, WorkoutPlan } from './types';

/** A generated class as plain lines, so the coach can edit it in Word or any text editor. */
export interface ClassDocument {
  title: string;
  details: string[];
  notices: string[];
  blocks: { heading: string; exercises: string[]; notes: string }[];
  coachNotes: string;
}

/** "Est. 2 · A/B · A · condicional" */
function stationLabel(exercise: WorkoutExercise) {
  const { station } = exercise;
  if (!station) return '';
  const parts = [`Est. ${station.number}`, station.kind, station.role, station.conditional && 'condicional'];
  return `[${parts.filter(Boolean).join(' · ')}] `;
}

const exerciseLine = (exercise: WorkoutExercise) =>
  `${stationLabel(exercise)}${exercise.actualName} — ${exercise.reps}` +
  (exercise.appliedRestriction ? ` (variante por ${humanize(exercise.appliedRestriction)})` : '');

export function buildClassDocument(plan: WorkoutPlan): ClassDocument {
  const totalMinutes = plan.blocks.reduce((total, block) => total + block.durationMinutes, 0);
  const title = plan.mode === 'funcional' ? `Clase ${plan.classNumber} · ${plan.focus}` : `WOD · ${plan.focus}`;

  return {
    title,
    details: [
      `Fecha: ${format(new Date(plan.date), 'yyyy-MM-dd')}`,
      `Inicio: ${plan.startTime}`,
      `Duración total: ${totalMinutes} min`,
      `Restricciones: ${plan.restrictions.map(humanize).join(', ') || 'ninguna'}`,
      ...(plan.planBActivated ? ['Plan B activado'] : []),
    ],
    notices: plan.notices ?? [],
    blocks: plan.blocks.map((block, index) => ({
      heading: `${index + 1}. ${block.name} · ${block.durationMinutes} min · ${block.format}`,
      exercises: block.exercises.map(exerciseLine),
      notes: block.coachNotes?.trim() ?? '',
    })),
    coachNotes: plan.coachNotes.trim(),
  };
}

/** Plain text version (.txt), editable on any device. */
export function buildClassText(plan: WorkoutPlan) {
  const doc = buildClassDocument(plan);
  const sections = [
    `${doc.title}\n${'='.repeat(doc.title.length)}`,
    doc.details.join('\n'),
    doc.notices.length > 0 ? `Avisos:\n${doc.notices.map((n) => `- ${n}`).join('\n')}` : '',
    ...doc.blocks.map(
      (block) =>
        `${block.heading}\n${block.exercises.map((e) => `- ${e}`).join('\n')}` +
        (block.notes ? `\nNotas: ${block.notes}` : ''),
    ),
    doc.coachNotes ? `Notas del coach:\n${doc.coachNotes}` : '',
  ];
  return `${sections.filter(Boolean).join('\n\n')}\n`;
}

/** "clase-12-2026-10-13.docx" / "wod-2026-10-13.txt" */
export const classFileName = (plan: WorkoutPlan, extension: string) =>
  `${plan.mode === 'funcional' ? `clase-${plan.classNumber}` : 'wod'}-${format(new Date(plan.date), 'yyyy-MM-dd')}.${extension}`;
