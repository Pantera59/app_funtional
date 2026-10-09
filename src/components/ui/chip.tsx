import { Check } from 'lucide-react';
import type { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

interface ChipProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick' | 'onToggle'> {
  selected: boolean;
  onToggle: () => void;
}

/** Pressable pill for multi-select options. */
export function Chip({ selected, onToggle, className, children, ...props }: ChipProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onToggle}
      className={cn(
        'flex items-center gap-1.5 rounded-xl border px-3 py-2 text-[10px] font-bold tracking-wider uppercase transition-all',
        selected
          ? 'border-brand-500 bg-brand-500 text-white shadow-md shadow-brand-500/10'
          : 'border-zinc-200 bg-zinc-50 text-zinc-600 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-900',
        className,
      )}
      {...props}
    >
      {selected && <Check className="size-3" />}
      {children}
    </button>
  );
}
