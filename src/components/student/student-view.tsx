'use client';

import { ArrowDown, ArrowUp, NotebookPen } from 'lucide-react';
import Image from 'next/image';
import { KangarooIcon } from '@/components/brand/kangaroo-icon';
import { Card } from '@/components/ui/card';
import { Eyebrow } from '@/components/ui/eyebrow';
import { IconTile } from '@/components/ui/icon-tile';
import { BlockHeader, BlockMetaBadge } from '@/components/workout/block-header';
import { CheckableExercise } from '@/components/workout/exercise-summary';
import { useChecklist } from '@/hooks/use-checklist';
import { cn } from '@/lib/cn';
import { CLASS_DURATION_MINUTES } from '@/lib/domain/constants';
import { countExercises } from '@/lib/domain/plan-rules';
import type { Exercise } from '@/lib/domain/types';
import { useCurrentPlan } from '@/providers/app-state-provider';
import { MuscleAnatomyVisualizer } from './muscle-anatomy-visualizer';

const SCALING_OPTIONS = [
  { label: 'Regresión', icon: ArrowDown, field: 'regression' },
  { label: 'Progresión', icon: ArrowUp, field: 'progression' },
] as const satisfies readonly { label: string; icon: unknown; field: keyof Exercise }[];

export function StudentView() {
  const plan = useCurrentPlan();
  const checklist = useChecklist();

  const total = countExercises(plan);
  // Functional classes are text only for now: no photo or muscle diagram.
  const textOnly = plan.mode === 'funcional';
  const classMinutes = textOnly
    ? plan.blocks.reduce((sum, block) => sum + block.durationMinutes, 0)
    : CLASS_DURATION_MINUTES;
  const progress = total > 0 ? Math.round((checklist.count / total) * 100) : 0;

  return (
    <div className="space-y-6">
      <Card className="relative overflow-hidden">
        <KangarooIcon className="pointer-events-none absolute top-4 -right-5 size-48 text-brand-500 opacity-[0.03] dark:opacity-[0.05]" />
        <div className="mb-4 flex items-center gap-2">
          <IconTile size="sm">
            <KangarooIcon />
          </IconTile>
          <Eyebrow tone="brand">Kangaroo Athletic</Eyebrow>
        </div>
        <h1 className="text-xl leading-none font-black tracking-tight text-zinc-950 uppercase dark:text-zinc-50">
          {plan.focus}
        </h1>
        <Eyebrow className="mt-2">
          Inicio: {plan.startTime} · Clase de {classMinutes} minutos
        </Eyebrow>

        <div className="mt-6 border-t border-zinc-100 pt-5 dark:border-zinc-800/60">
          <div className="mb-2 flex items-center justify-between text-xs">
            <span className="font-bold text-zinc-500 dark:text-zinc-400">Progreso de tu WOD</span>
            <span className="font-extrabold text-brand-500">
              {checklist.count}/{total} ({progress}%)
            </span>
          </div>
          <div
            role="progressbar"
            aria-label="Progreso del WOD"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progress}
            className="h-2.5 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-950"
          >
            <div className="h-full rounded-full bg-brand-500 transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </Card>

      {plan.blocks.map((block, index) => (
        <Card key={block.id} variant="section">
          <BlockHeader
            label={`Bloque ${String(index + 1).padStart(2, '0')}`}
            title={block.name}
            aside={<BlockMetaBadge block={block} />}
          />
          <ul className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {block.exercises.map((exercise, exerciseIndex) => {
              const checked = checklist.isChecked(block.id, exerciseIndex);
              return (
                <li
                  key={exerciseIndex}
                  className={cn('space-y-4 p-5 transition-all duration-300', checked && 'bg-zinc-50/40 opacity-70 dark:bg-zinc-950/20')}
                >
                  <CheckableExercise
                    exercise={exercise}
                    checked={checked}
                    onToggle={() => checklist.toggle(block.id, exerciseIndex)}
                  />

                  {textOnly ? (
                    exercise.baseExercise.regression && (
                      <Card variant="inset">
                        <Eyebrow size="xs" className="mb-1.5 flex items-center gap-1">
                          <NotebookPen className="size-3.5" /> Notas técnicas
                        </Eyebrow>
                        <p className="text-xs leading-relaxed font-medium text-zinc-600 dark:text-zinc-400">
                          {exercise.baseExercise.regression}
                        </p>
                      </Card>
                    )
                  ) : (
                    <>
                      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-zinc-200/50 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-950">
                        <Image
                          src={exercise.baseExercise.imageUrl}
                          alt={exercise.actualName}
                          fill
                          sizes="(max-width: 448px) 100vw, 448px"
                          className={cn(
                            'object-cover transition-all duration-700',
                            checked ? 'grayscale contrast-75' : 'hover:scale-105',
                          )}
                        />
                      </div>

                      <MuscleAnatomyVisualizer pattern={exercise.baseExercise.pattern} />

                      <div className="grid grid-cols-2 gap-3">
                        {SCALING_OPTIONS.map(({ label, icon: Icon, field }) => (
                          <Card key={field} variant="inset">
                            <Eyebrow size="xs" className="mb-1.5 flex items-center gap-1">
                              <Icon className="size-3.5" /> {label}
                            </Eyebrow>
                            <p className="text-xs leading-relaxed font-medium text-zinc-600 dark:text-zinc-400">
                              {exercise.baseExercise[field]}
                            </p>
                          </Card>
                        ))}
                      </div>
                    </>
                  )}
                </li>
              );
            })}
          </ul>
        </Card>
      ))}
    </div>
  );
}
