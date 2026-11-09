'use client';

import { CalendarX, Clock, Lightbulb } from 'lucide-react';
import { KangarooIcon } from '@/components/brand/kangaroo-icon';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { Eyebrow } from '@/components/ui/eyebrow';
import { useIsClient } from '@/hooks/use-is-client';
import { useSharedClass } from '@/hooks/use-student-class';
import { cn } from '@/lib/cn';
import { classMinutes, toStudentClass, type StudentClass } from '@/lib/domain/student-class';
import { formatShortMinutes } from '@/lib/format';
import { useAppState } from '@/providers/app-state-provider';

const Loading = () => <div className="min-h-[50vh]" aria-busy="true" />;

/** Same order and colours as the coach's printed class sheets: warm-up, strength, cardio, stretch. */
const BLOCK_TONES = [
  { bar: 'bg-sky-600', text: 'text-sky-700 dark:text-sky-400', ring: 'border-sky-600' },
  { bar: 'bg-emerald-600', text: 'text-emerald-700 dark:text-emerald-400', ring: 'border-emerald-600' },
  { bar: 'bg-orange-600', text: 'text-orange-700 dark:text-orange-400', ring: 'border-orange-600' },
  { bar: 'bg-slate-500', text: 'text-slate-600 dark:text-slate-400', ring: 'border-slate-500' },
] as const;

const toneFor = (index: number) => BLOCK_TONES[index % BLOCK_TONES.length];
const blockAnchor = (index: number) => `bloque-${index + 1}`;

/**
 * The class from the QR link; without one, the plan saved on this device (the coach previewing it).
 * Students have no links to the coach screens.
 */
export function StudentClassView() {
  const isClient = useIsClient();
  const shared = useSharedClass();
  const { plan } = useAppState();

  if (!isClient || shared.status === 'loading') return <Loading />;
  if (shared.status === 'ready') return <StudentClassDetail studentClass={shared.studentClass} />;
  if (shared.status === 'none' && plan) return <StudentClassDetail studentClass={toStudentClass(plan)} />;

  return (
    <EmptyState
      icon={<CalendarX />}
      title={shared.status === 'invalid' ? 'El enlace de la clase no es válido' : 'Todavía no hay clase'}
      description="Escanea el código QR que te muestra tu coach para ver la clase de hoy."
    />
  );
}

interface StudentClassDetailProps {
  studentClass: StudentClass;
  /** Shown above the focus, e.g. the published title and date. */
  eyebrow?: string;
}

/** Read only and sized for a phone propped up during the workout: big names, reps at a glance. */
export function StudentClassDetail({ studentClass, eyebrow = 'Kangaroo Athletic' }: StudentClassDetailProps) {
  const total = classMinutes(studentClass);

  return (
    <div className="space-y-5">
      <Card className="relative overflow-hidden">
        <KangarooIcon className="pointer-events-none absolute top-4 -right-5 size-48 text-brand-500 opacity-[0.04] dark:opacity-[0.06]" />
        <Eyebrow tone="brand">{eyebrow}</Eyebrow>
        <h1 className="mt-2 text-2xl leading-tight font-black tracking-tight text-zinc-950 uppercase dark:text-zinc-50">
          {studentClass.focus}
        </h1>
        <p className="mt-2 flex items-center gap-1.5 text-xs font-bold text-zinc-500 dark:text-zinc-400">
          <Clock className="size-3.5" /> Inicio {studentClass.startTime} · {formatShortMinutes(total)} min
        </p>

        {/* Proportional timeline of the class. */}
        <div className="mt-5 flex h-2.5 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800" aria-hidden="true">
          {studentClass.blocks.map((block, index) => (
            <span
              key={index}
              className={cn(toneFor(index).bar, 'h-full border-r-2 border-white last:border-r-0 dark:border-zinc-900')}
              style={{ width: `${total ? (block.durationMinutes / total) * 100 : 0}%` }}
            />
          ))}
        </div>
        <nav aria-label="Bloques de la clase" className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
          {studentClass.blocks.map((block, index) => (
            <a
              key={index}
              href={`#${blockAnchor(index)}`}
              className="flex items-center gap-1.5 text-[11px] font-bold text-zinc-600 hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-white"
            >
              <span className={cn('size-2 rounded-full', toneFor(index).bar)} />
              {block.name} · {formatShortMinutes(block.durationMinutes)}′
            </a>
          ))}
        </nav>
      </Card>

      {studentClass.blocks.map((block, index) => {
        const tone = toneFor(index);
        return (
          <Card key={index} variant="section" id={blockAnchor(index)} className="scroll-mt-20">
            <div className={cn('flex items-center justify-between gap-3 border-l-4 px-5 py-4', tone.ring)}>
              <div className="min-w-0">
                <Eyebrow size="xs" className={tone.text}>
                  Bloque {index + 1} de {studentClass.blocks.length}
                </Eyebrow>
                <h2 className="mt-0.5 truncate text-lg font-black tracking-tight text-zinc-950 dark:text-zinc-50">{block.name}</h2>
                {block.format && <p className="mt-0.5 text-[11px] font-medium text-zinc-500 dark:text-zinc-400">{block.format}</p>}
              </div>
              <span className="shrink-0 text-right">
                <span className="block text-2xl leading-none font-black text-zinc-950 dark:text-zinc-50">
                  {formatShortMinutes(block.durationMinutes)}
                </span>
                <Eyebrow size="xs">min</Eyebrow>
              </span>
            </div>
            <ol className="divide-y divide-zinc-100 border-t border-zinc-100 dark:divide-zinc-800 dark:border-zinc-800">
              {block.exercises.map((exercise, exerciseIndex) => (
                <li key={exerciseIndex} className="space-y-2.5 px-5 py-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex min-w-0 items-start gap-3">
                      <span
                        aria-hidden="true"
                        className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-[11px] font-black text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
                      >
                        {exerciseIndex + 1}
                      </span>
                      <div className="min-w-0">
                        <p className="text-[15px] leading-snug font-bold text-zinc-900 dark:text-zinc-100">{exercise.name}</p>
                        {exercise.station && (
                          <Badge size="sm" tone={exercise.station.includes('Combo') ? 'solid' : 'brand'} className="mt-1.5">
                            {exercise.station}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <span className="shrink-0 rounded-xl bg-zinc-900 px-3 py-1.5 text-xs font-black whitespace-nowrap text-white dark:bg-zinc-100 dark:text-zinc-900">
                      {exercise.reps}
                    </span>
                  </div>

                  {exercise.note && (
                    <p className="ml-9 flex gap-2 rounded-xl bg-brand-50/70 p-3 text-xs leading-relaxed font-medium text-zinc-700 dark:bg-brand-950/20 dark:text-zinc-300">
                      <Lightbulb className="mt-0.5 size-3.5 shrink-0 text-brand-500" />
                      {exercise.note}
                    </p>
                  )}
                </li>
              ))}
            </ol>
          </Card>
        );
      })}
    </div>
  );
}
