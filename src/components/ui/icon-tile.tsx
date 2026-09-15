import { cva, type VariantProps } from 'class-variance-authority';
import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

const iconTileVariants = cva('flex shrink-0 items-center justify-center', {
  variants: {
    tone: {
      brand: 'bg-brand-500 text-white shadow-md shadow-brand-500/10',
      soft: 'border border-zinc-100 bg-zinc-50 text-brand-500 shadow-sm dark:border-zinc-800 dark:bg-zinc-800/80',
      tint: 'bg-brand-500/10 text-brand-600 dark:text-brand-400',
    },
    size: {
      sm: 'size-8 rounded-xl [&_svg]:size-4',
      md: 'size-10 rounded-xl [&_svg]:size-5',
      lg: 'size-12 rounded-2xl [&_svg]:size-6',
    },
  },
  defaultVariants: { tone: 'brand', size: 'md' },
});

/** Rounded square holding an icon; sizes the icon to match the tile. */
export function IconTile({
  tone,
  size,
  className,
  children,
}: VariantProps<typeof iconTileVariants> & { className?: string; children: ReactNode }) {
  return <div className={cn(iconTileVariants({ tone, size }), className)}>{children}</div>;
}
