'use client';

import { addMinutes, parse } from 'date-fns';
import { AlertTriangle, Clock, Pause, Play, RotateCcw, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';
import { KangarooIcon } from '@/components/brand/kangaroo-icon';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Eyebrow } from '@/components/ui/eyebrow';
import { IconTile } from '@/components/ui/icon-tile';
import { BlockHeader, BlockMetaBadge } from '@/components/workout/block-header';
import { CoachNotesField } from '@/components/workout/coach-notes-field';
import { CheckableExercise } from '@/components/workout/exercise-summary';
import { useChecklist } from '@/hooks/use-checklist';
import { useCountdown } from '@/hooks/use-countdown';
import { cn } from '@/lib/cn';
import { PLAN_B } from '@/lib/domain/constants';
import type { WorkoutBlock, WorkoutFormat, WorkoutPlan } from '@/lib/domain/types';
import { formatClock } from '@/lib/format';
import { useAppState, useCurrentPlan } from '@/providers/app-state-provider';

const TIMER_MODE: Partial<Record<WorkoutFormat, string>> = { AMRAP: 'AMRAP', EMOM: 'EMOM' };
const PLAN_B_PERCENT = Math.round(PLAN_B.reduction * 100);

export function CoachTimer() {
  const plan = useCurrentPlan();
  // A new plan or start time restarts the demo clock.
  return <CoachSession key={`${plan.id}-${plan.startTime}`} plan={plan} />;
}

/** Demo clock: starts at the class start time and advances one class minute per real second. */
function useSimulatedClock(startTime: string) {
  const [start] = useState(() => parse(startTime, 'HH:mm', new Date()));
  const [minutesElapsed, setMinutesElapsed] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setMinutesElapsed((m) => m + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  return { now: addMinutes(start, minutesElapsed), minutesElapsed };
}

function CoachSession({ plan }: { plan: WorkoutPlan }) {
  const { activatePlanB, updateBlockNote } = useAppState();
  const { now, minutesElapsed } = useSimulatedClock(plan.startTime);
  const countdown = useCountdown();
  const checklist = useChecklist();

  const metabolicBlock = plan.blocks.find((block) => block.type === 'Metabólico');
  const showDelayAlert =
    minutesElapsed >= PLAN_B.alertAfterMinutes && countdown.activeId !== metabolicBlock?.id && !plan.planBActivated;

  return (
    <div className="space-y-6">
      <Card
        variant="tile"
        className="sticky top-22 z-20 flex items-center justify-between bg-white/95 backdrop-blur-md dark:bg-zinc-900/95"
      >
        <div className="flex items-center gap-3">
          <IconTile>
            <KangarooIcon />
          </IconTile>
          <div>
            <h1 className="text-xs font-extrabold tracking-wider text-zinc-900 uppercase dark:text-zinc-100">
              Coach control
            </h1>
            <Eyebrow className="mt-0.5">Mesa de control</Eyebrow>
          </div>
        </div>
        <time className="flex items-center gap-2 rounded-xl border border-zinc-200/50 bg-zinc-100 px-3 py-2 text-xs font-bold tabular-nums dark:border-zinc-850 dark:bg-zinc-950">
          <Clock className="size-3.5 text-zinc-400 dark:text-zinc-500" />
          {now.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}
        </time>
      </Card>

      {showDelayAlert && (
        <div
          role="alert"
          className="flex items-start gap-4 rounded-2xl border border-red-200 bg-red-50 p-5 dark:border-red-900/60 dark:bg-red-950/10"
        >
          <AlertTriangle className="mt-0.5 size-5 shrink-0 text-red-600 dark:text-red-500" />
          <div className="flex-1">
            <p className="text-xs font-black tracking-wider text-red-800 uppercase dark:text-red-200">
              Atraso crítico (&gt;{PLAN_B.alertAfterMinutes} min de clase)
            </p>
            <p className="mt-2 text-xs leading-relaxed text-red-600/90 dark:text-red-400/90">
              El tiempo restante no es suficiente para la rutina planeada. Activa la compresión automática del WOD.
            </p>
            <Button variant="danger" size="sm" className="mt-4 w-full" onClick={activatePlanB}>
              <Zap className="size-4 animate-pulse fill-current" /> Activar Plan B (-{PLAN_B_PERCENT}% metabólico)
            </Button>
          </div>
        </div>
      )}

      {plan.planBActivated && (
        <p className="rounded-2xl border border-brand-200/40 bg-brand-50 p-4 text-center text-[10px] font-bold tracking-wider text-brand-800 uppercase dark:border-brand-900/40 dark:bg-brand-950/20 dark:text-brand-300">
          ⚡ Plan B activo: bloque metabólico reducido un {PLAN_B_PERCENT}% para asegurar la salida a tiempo
        </p>
      )}

      {plan.blocks.map((block, index) => {
        const isActive = countdown.activeId === block.id;
        const seconds = block.durationMinutes * 60;

        return (
          <Card
            key={block.id}
            variant="section"
            className={cn('transition-all duration-300', isActive && 'border-brand-500/30 shadow-xl shadow-zinc-100 dark:shadow-none')}
          >
            <BlockHeader
              label={`Bloque ${index + 1} · ${block.type}`}
              title={block.name}
              active={isActive}
              aside={<BlockMetaBadge block={block} />}
            />

            {isActive && <TimerPanel block={block} countdown={countdown} seconds={seconds} />}

            <div className="space-y-2 p-5">
              {block.exercises.map((exercise, exerciseIndex) => (
                <CheckableExercise
                  key={exerciseIndex}
                  exercise={exercise}
                  index={exerciseIndex}
                  checked={checklist.isChecked(block.id, exerciseIndex)}
                  onToggle={() => checklist.toggle(block.id, exerciseIndex)}
                />
              ))}
            </div>

            <div className="border-t border-zinc-100 px-5 pt-4 pb-5 dark:border-zinc-800">
              <CoachNotesField value={block.coachNotes ?? ''} onChange={(note) => updateBlockNote(block.id, note)} />
            </div>

            {!isActive && (
              <div className="px-5 pb-5">
                <Button variant="inverted" className="w-full" onClick={() => countdown.toggle(block.id, seconds)}>
                  <Play className="size-3.5 fill-current" /> Iniciar bloque
                </Button>
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
}

interface TimerPanelProps {
  block: WorkoutBlock;
  countdown: ReturnType<typeof useCountdown>;
  seconds: number;
}

function TimerPanel({ block, countdown, seconds }: TimerPanelProps) {
  return (
    <div className="flex flex-col items-center border-b border-zinc-100 bg-zinc-50/30 p-6 dark:border-zinc-800 dark:bg-zinc-950/40">
      <p className="text-5xl font-black tracking-tight text-zinc-950 tabular-nums dark:text-white">
        {formatClock(countdown.timeLeft)}
      </p>
      <Eyebrow className="mt-3 flex items-center gap-2">
        <span
          className={cn('size-1.5 rounded-full', countdown.isRunning ? 'animate-ping bg-emerald-500' : 'bg-zinc-400')}
        />
        {countdown.isRunning ? 'Corriendo' : 'Pausado'} · {TIMER_MODE[block.format] ?? 'Contrarreloj'}
      </Eyebrow>
      <div className="mt-6 flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => countdown.adjust(-60)} aria-label="Quitar 1 minuto">
          -1 min
        </Button>
        <Button
          size="icon"
          onClick={() => countdown.toggle(block.id, seconds)}
          aria-label={countdown.isRunning ? 'Pausar' : 'Reanudar'}
        >
          {countdown.isRunning ? <Pause className="size-5 fill-current" /> : <Play className="ml-0.5 size-5 fill-current" />}
        </Button>
        <Button variant="secondary" size="icon" onClick={() => countdown.reset(seconds)} aria-label="Reiniciar">
          <RotateCcw className="size-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={() => countdown.adjust(60)} aria-label="Agregar 1 minuto">
          +1 min
        </Button>
      </div>
    </div>
  );
}
