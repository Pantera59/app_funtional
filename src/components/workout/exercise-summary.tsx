import { Check } from 'lucide-react';
import type { ReactNode } from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/cn';
import type { StationInfo, WorkoutExercise } from '@/lib/domain/types';
import { humanize } from '@/lib/format';

interface ExerciseSummaryProps {
  exercise: WorkoutExercise;
  checked?: boolean;
  leading?: ReactNode;
  className?: string;
}

/** Name, scaling note and reps of one exercise. Uses only inline elements so it can live inside a button. */
export function ExerciseSummary({ exercise, checked = false, leading, className }: ExerciseSummaryProps) {
  return (
    <span className={cn('flex items-center justify-between gap-4', className)}>
      <span className="flex min-w-0 items-center gap-3">
        {leading}
        <span className="min-w-0">
          <span
            className={cn(
              'block text-xs font-bold text-zinc-900 transition-all dark:text-zinc-100',
              checked && 'text-zinc-300 line-through dark:text-zinc-600',
            )}
          >
            {exercise.actualName}
          </span>
          {exercise.appliedRestriction && (
            <span className="mt-1 flex items-center gap-1.5 text-[10px] font-bold text-brand-600 dark:text-brand-400">
              <span className="size-1.5 shrink-0 rounded-full bg-brand-500" />
              Variante por {humanize(exercise.appliedRestriction)}
            </span>
          )}
          {exercise.station && <StationBadges station={exercise.station} />}
        </span>
      </span>
      <span
        className={cn(
          'shrink-0 rounded-xl border border-zinc-200 bg-white px-3 py-1.5 text-[10px] font-bold whitespace-nowrap text-zinc-900 transition-opacity dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100',
          checked && 'opacity-30',
        )}
      >
        {exercise.reps}
      </span>
    </span>
  );
}

/** "Est. 2 · A/B · A", "Est. 3 · Combo" and the conditional flag, so station formats are never confused. */
function StationBadges({ station }: { station: StationInfo }) {
  const label = [`Est. ${station.number}`, station.kind, station.role].filter(Boolean).join(' · ');
  return (
    <span className="mt-1.5 flex flex-wrap items-center gap-1.5">
      <Badge size="sm" tone={station.kind === 'Combo' ? 'solid' : 'brand'}>
        {label}
      </Badge>
      {station.conditional && (
        <Badge size="sm" tone="danger">
          Condicional · si alcanza el tiempo
        </Badge>
      )}
    </span>
  );
}

export function CheckMark({ checked, fallback }: { checked: boolean; fallback?: ReactNode }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'flex size-6 shrink-0 items-center justify-center rounded-lg border text-[10px] font-black transition-all',
        checked
          ? 'border-brand-500 bg-brand-500 text-white'
          : 'border-zinc-200 bg-zinc-50/40 text-zinc-400 group-hover:border-brand-500/40 dark:border-zinc-800 dark:bg-zinc-950',
      )}
    >
      {checked ? <Check className="size-3.5" strokeWidth={3} /> : fallback}
    </span>
  );
}

interface CheckableExerciseProps {
  exercise: WorkoutExercise;
  checked: boolean;
  onToggle: () => void;
  /** Shows the exercise number inside the empty checkbox. */
  index?: number;
}

export function CheckableExercise({ exercise, checked, onToggle, index }: CheckableExerciseProps) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={onToggle}
      className="group block w-full rounded-xl p-1.5 text-left transition-colors hover:bg-zinc-50/50 dark:hover:bg-zinc-950/20"
    >
      <ExerciseSummary
        exercise={exercise}
        checked={checked}
        leading={<CheckMark checked={checked} fallback={index === undefined ? null : index + 1} />}
      />
    </button>
  );
}
