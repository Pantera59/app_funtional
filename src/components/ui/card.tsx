import { cva, type VariantProps } from 'class-variance-authority';
import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

export const cardVariants = cva('border border-zinc-150 bg-white dark:border-zinc-800 dark:bg-zinc-900', {
  variants: {
    variant: {
      /** Large page panel. */
      panel: 'rounded-3xl p-6 shadow-xl shadow-zinc-100 md:p-8 dark:shadow-none',
      /** Container whose children bring their own padding (headers, lists). */
      section: 'overflow-hidden rounded-3xl shadow-sm',
      /** Small stat or info tile. */
      tile: 'rounded-2xl p-5 shadow-sm',
      /** Muted box nested inside another card. */
      inset: 'rounded-2xl border-zinc-200/60 bg-zinc-50 p-4 dark:border-zinc-800/80 dark:bg-zinc-950/40',
    },
  },
  defaultVariants: { variant: 'panel' },
});

interface CardProps extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof cardVariants> {
  /** Brand gradient strip along the top edge. */
  accent?: boolean;
}

export function Card({ variant, accent, className, children, ...props }: CardProps) {
  return (
    <div className={cn(cardVariants({ variant }), accent && 'relative overflow-hidden', className)} {...props}>
      {accent && (
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-brand-500 via-orange-400 to-brand-600"
        />
      )}
      {children}
    </div>
  );
}
