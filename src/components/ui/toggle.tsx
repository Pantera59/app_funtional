import { cn } from '@/lib/cn';

export function Toggle({ checked, onToggle, label }: { checked: boolean; onToggle: () => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={onToggle}
      className={cn(
        'flex h-6 w-10 shrink-0 items-center rounded-full border p-1 transition-all duration-300',
        checked
          ? 'justify-end border-brand-500 bg-brand-500'
          : 'justify-start border-zinc-200 bg-zinc-150 dark:border-zinc-700 dark:bg-zinc-800',
      )}
    >
      <span className="size-4 rounded-full bg-white shadow-sm" />
    </button>
  );
}
