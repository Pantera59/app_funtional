'use client';

import { CalendarX, NotebookPen } from 'lucide-react';
import { KangarooIcon } from '@/components/brand/kangaroo-icon';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { Eyebrow } from '@/components/ui/eyebrow';
import { BlockHeader } from '@/components/workout/block-header';
import { useIsClient } from '@/hooks/use-is-client';
import { useSharedClass } from '@/hooks/use-student-class';
import { classMinutes, toStudentClass, type StudentClass } from '@/lib/domain/student-class';
import { formatMinutes } from '@/lib/format';
import { useAppState } from '@/providers/app-state-provider';

const Loading = () => <div className="min-h-[50vh]" aria-busy="true" />;

/**
 * The class from the QR link; without one, the plan saved on this device (the coach previewing it).
 * Students have no links to the coach screens.
 */
export function StudentClassView() {
  const isClient = useIsClient();
  const shared = useSharedClass();
  const { plan } = useAppState();

  if (!isClient || shared.status === 'loading') return <Loading />;
  if (shared.status === 'ready') return <StudentView studentClass={shared.studentClass} />;
  if (shared.status === 'none' && plan) return <StudentView studentClass={toStudentClass(plan)} />;

  return (
    <EmptyState
      icon={<CalendarX />}
      title={shared.status === 'invalid' ? 'El enlace de la clase no es válido' : 'Todavía no hay clase'}
      description="Escanea el código QR que te muestra tu coach para ver la clase de hoy."
    />
  );
}

/** Read only: students follow the class without tapping their phone. */
function StudentView({ studentClass }: { studentClass: StudentClass }) {
  return (
    <div className="space-y-6">
      <Card className="relative overflow-hidden">
        <KangarooIcon className="pointer-events-none absolute top-4 -right-5 size-48 text-brand-500 opacity-[0.03] dark:opacity-[0.05]" />
        <Eyebrow tone="brand">Kangaroo Athletic</Eyebrow>
        <h1 className="mt-3 text-xl leading-none font-black tracking-tight text-zinc-950 uppercase dark:text-zinc-50">
          {studentClass.focus}
        </h1>
        <Eyebrow className="mt-2">
          Inicio: {studentClass.startTime} · Clase de {classMinutes(studentClass)} minutos
        </Eyebrow>
      </Card>

      {studentClass.blocks.map((block, index) => (
        <Card key={index} variant="section">
          <BlockHeader
            label={`Bloque ${String(index + 1).padStart(2, '0')}`}
            title={block.name}
            aside={
              <Badge className="self-start sm:self-auto">
                {formatMinutes(block.durationMinutes)} min • {block.format}
              </Badge>
            }
          />
          <ol className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {block.exercises.map((exercise, exerciseIndex) => (
              <li key={exerciseIndex} className="space-y-3 p-5">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <span
                      aria-hidden="true"
                      className="flex size-6 shrink-0 items-center justify-center rounded-lg border border-zinc-200 bg-zinc-50/40 text-[10px] font-black text-zinc-400 dark:border-zinc-800 dark:bg-zinc-950"
                    >
                      {exerciseIndex + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{exercise.name}</p>
                      {exercise.station && (
                        <Badge size="sm" tone={exercise.station.includes('Combo') ? 'solid' : 'brand'} className="mt-1.5">
                          {exercise.station}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <span className="shrink-0 rounded-xl border border-zinc-200 bg-white px-3 py-1.5 text-[10px] font-bold whitespace-nowrap text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100">
                    {exercise.reps}
                  </span>
                </div>

                {exercise.note && (
                  <Card variant="inset">
                    <Eyebrow size="xs" className="mb-1.5 flex items-center gap-1">
                      <NotebookPen className="size-3.5" /> Notas técnicas
                    </Eyebrow>
                    <p className="text-xs leading-relaxed font-medium text-zinc-600 dark:text-zinc-400">{exercise.note}</p>
                  </Card>
                )}
              </li>
            ))}
          </ol>
        </Card>
      ))}
    </div>
  );
}
