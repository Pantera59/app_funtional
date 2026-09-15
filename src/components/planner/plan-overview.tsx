'use client';

import { QrCode } from 'lucide-react';
import { useCallback, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Eyebrow } from '@/components/ui/eyebrow';
import { BlockMetaBadge } from '@/components/workout/block-header';
import { CoachNotesField } from '@/components/workout/coach-notes-field';
import { ExerciseSummary } from '@/components/workout/exercise-summary';
import { countExercises } from '@/lib/domain/plan-rules';
import type { WorkoutPlan } from '@/lib/domain/types';
import { useAppState } from '@/providers/app-state-provider';
import { ShareWodModal } from './share-wod-modal';

export function PlanOverview({ plan }: { plan: WorkoutPlan }) {
  const { updateBlockNote } = useAppState();
  const [shareOpen, setShareOpen] = useState(false);
  const closeShare = useCallback(() => setShareOpen(false), []);

  const stats = [
    {
      label: 'Volumen total',
      value: `${countExercises(plan)} movimientos`,
      hint: `Distribuidos en ${plan.blocks.length} bloques estructurados`,
    },
    { label: 'Intensidad estimada', value: 'Media-Alta', hint: 'Calorías promedio: 520 kcal / sesión' },
    { label: 'Enfoque primario', value: plan.focus, hint: 'Esquema biomecánico optimizado' },
  ];

  return (
    <section aria-label="Clase generada" className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label} variant="tile">
            <Eyebrow tone="brand" size="xs">
              {stat.label}
            </Eyebrow>
            <p className="mt-1 text-2xl font-black text-zinc-900 dark:text-white">{stat.value}</p>
            <p className="mt-1 text-[10px] text-zinc-400 dark:text-zinc-500">{stat.hint}</p>
          </Card>
        ))}
      </div>

      <Card variant="section" className="shadow-xl shadow-zinc-100/50 dark:shadow-none">
        <div className="flex flex-col items-start justify-between gap-6 border-b border-zinc-150 bg-zinc-50/60 p-6 sm:flex-row sm:items-center md:p-8 dark:border-zinc-800 dark:bg-zinc-950/20">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="solid">WOD activo</Badge>
              <Eyebrow>Inicio programado: {plan.startTime}</Eyebrow>
            </div>
            <h3 className="mt-3 text-lg font-black tracking-tight text-zinc-950 uppercase dark:text-zinc-50">
              Enfoque: {plan.focus}
            </h3>
          </div>
          <Button className="w-full sm:w-auto" onClick={() => setShareOpen(true)}>
            <QrCode className="size-4" /> Compartir con alumnos
          </Button>
        </div>

        <ol className="space-y-8 p-6 md:p-8">
          {plan.blocks.map((block, index) => (
            <li
              key={block.id}
              className="relative pl-8 before:absolute before:top-2 before:-bottom-10 before:left-0 before:w-px before:bg-zinc-100 last:before:bottom-0 dark:before:bg-zinc-800"
            >
              <span
                aria-hidden="true"
                className="absolute top-2.5 -left-[4.5px] size-2.5 rounded-full border-2 border-white bg-brand-500 dark:border-zinc-900"
              />
              <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h4 className="text-sm font-extrabold tracking-tight text-zinc-950 dark:text-zinc-50">
                  {index + 1}. {block.name}
                </h4>
                <BlockMetaBadge block={block} />
              </div>
              <div className="space-y-3.5">
                {block.exercises.map((exercise, exerciseIndex) => (
                  <ExerciseSummary
                    key={exerciseIndex}
                    exercise={exercise}
                    className="rounded-2xl border border-zinc-200/50 bg-zinc-50/50 p-4 transition-all hover:border-brand-500/30 dark:border-zinc-800/80 dark:bg-zinc-950/30"
                  />
                ))}
                <CoachNotesField
                  value={block.coachNotes ?? ''}
                  onChange={(note) => updateBlockNote(block.id, note)}
                  placeholder="Instrucciones tácticas o aclaraciones para este bloque..."
                />
              </div>
            </li>
          ))}
        </ol>
      </Card>

      <ShareWodModal open={shareOpen} onClose={closeShare} />
    </section>
  );
}
