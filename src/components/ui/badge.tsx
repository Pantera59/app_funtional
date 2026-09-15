import { cva, type VariantProps } from 'class-variance-authority';
import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-full border font-bold whitespace-nowrap uppercase tracking-wider',
  {
    variants: {
      tone: {
        neutral: 'border-zinc-200 bg-zinc-50 text-zinc-400 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-500',
        brand: 'border-transparent bg-brand-50 text-brand-600 dark:bg-brand-950/20 dark:text-brand-400',
        solid: 'border-brand-500 bg-brand-500 text-white shadow-md shadow-brand-500/10',
        danger: 'border-transparent bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400',
      },
      size: {
        sm: 'px-2.5 py-0.5 text-[8px]',
        md: 'px-3 py-1 text-[9px]',
      },
    },
    defaultVariants: { tone: 'neutral', size: 'md' },
  },
);

export function Badge({
  tone,
  size,
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ tone, size }), className)} {...props} />;
}
