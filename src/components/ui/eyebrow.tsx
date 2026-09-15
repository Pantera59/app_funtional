import { cva, type VariantProps } from 'class-variance-authority';
import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

const eyebrowVariants = cva('block font-bold uppercase tracking-wider', {
  variants: {
    tone: {
      muted: 'text-zinc-400 dark:text-zinc-500',
      brand: 'text-brand-500',
      danger: 'text-red-500 dark:text-red-400',
    },
    size: {
      xs: 'text-[9px]',
      sm: 'text-[10px]',
    },
  },
  defaultVariants: { tone: 'muted', size: 'sm' },
});

/** Small uppercase label used above titles, fields and stats. */
export function Eyebrow({
  tone,
  size,
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement> & VariantProps<typeof eyebrowVariants>) {
  return <span className={cn(eyebrowVariants({ tone, size }), className)} {...props} />;
}
