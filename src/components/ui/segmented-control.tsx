import { cva } from 'class-variance-authority';
import { cn } from '@/lib/cn';

export const segmentedTrackClass =
  'flex items-center gap-1 rounded-2xl border border-zinc-200/40 bg-zinc-100/80 p-1.5 dark:border-zinc-800/60 dark:bg-zinc-950/60';

/** Shared by button segments (filters) and link segments (navigation). */
export const segmentVariants = cva('rounded-xl font-bold whitespace-nowrap transition-all', {
  variants: {
    active: {
      true: 'font-extrabold',
      false: 'text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200',
    },
    tone: { neutral: '', brand: '' },
    size: {
      sm: 'px-3 py-1.5 text-[10px] uppercase tracking-wider',
      md: 'px-4.5 py-2 text-xs',
    },
  },
  compoundVariants: [
    { active: true, tone: 'neutral', class: 'bg-white text-zinc-950 shadow-sm dark:bg-zinc-800 dark:text-white' },
    { active: true, tone: 'brand', class: 'bg-brand-500 text-white shadow-md shadow-brand-500/10' },
  ],
  defaultVariants: { active: false, tone: 'neutral', size: 'md' },
});

interface SegmentedControlProps<T extends string> {
  items: readonly { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  size?: 'sm' | 'md';
  label: string;
  className?: string;
}

export function SegmentedControl<T extends string>({
  items,
  value,
  onChange,
  size = 'md',
  label,
  className,
}: SegmentedControlProps<T>) {
  return (
    <div role="radiogroup" aria-label={label} className={cn(segmentedTrackClass, size === 'sm' && 'rounded-xl p-1', className)}>
      {items.map((item) => (
        <button
          key={item.value}
          type="button"
          role="radio"
          aria-checked={item.value === value}
          onClick={() => onChange(item.value)}
          className={segmentVariants({ active: item.value === value, size })}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
