import { Document, HeadingLevel, Packer, Paragraph, TextRun } from 'docx';
import { buildClassDocument } from '@/lib/domain/export-class';
import type { WorkoutPlan } from '@/lib/domain/types';

const labeled = (label: string, text: string) =>
  new Paragraph({ children: [new TextRun({ text: `${label}: `, bold: true }), new TextRun(text)] });

/** Word (.docx) version of the class. Loaded on demand, so `docx` stays out of the page bundle. */
export function buildClassDocx(plan: WorkoutPlan) {
  const doc = buildClassDocument(plan);

  const children = [
    new Paragraph({ text: doc.title, heading: HeadingLevel.TITLE }),
    ...doc.details.map((line) => new Paragraph(line)),
    ...(doc.notices.length > 0
      ? [
          new Paragraph({ text: 'Avisos', heading: HeadingLevel.HEADING_2 }),
          ...doc.notices.map((notice) => new Paragraph({ text: notice, bullet: { level: 0 } })),
        ]
      : []),
    ...doc.blocks.flatMap((block) => [
      new Paragraph({ text: block.heading, heading: HeadingLevel.HEADING_2 }),
      ...block.exercises.map((exercise) => new Paragraph({ text: exercise, bullet: { level: 0 } })),
      ...(block.notes ? [labeled('Notas', block.notes)] : []),
    ]),
    ...(doc.coachNotes ? [labeled('Notas del coach', doc.coachNotes)] : []),
  ];

  return Packer.toBlob(new Document({ title: doc.title, sections: [{ children }] }));
}
