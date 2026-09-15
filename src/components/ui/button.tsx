import { cva, type VariantProps } from 'class-variance-authority';
import Link from 'next/link';
import type { ButtonHTMLAttributes, ComponentProps } from 'react';
import { cn } from '@/lib/cn';

export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 font-bold uppercase tracking-wider transition-all disabled:cursor-not-allowed disabled:opacity-30',
  {
    variants: {
      variant: {
        primary: 'bg-brand-500 text-white shadow-md shadow-brand-500/10 hover:bg-brand-600',
        inverted:
          'bg-zinc-950 text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200',
        secondary:
          'border border-zinc-200 bg-zinc-50 text-zinc-800 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:bg-zinc-900',
        ghost:
          'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700',
        danger: 'bg-red-600 text-white shadow-md shadow-red-500/15 hover:bg-red-500',
      },
      size: {
        sm: 'rounded-xl px-3.5 py-2.5 text-[10px]',
        md: 'rounded-2xl px-5 py-3.5 text-[11px]',
        lg: 'w-full rounded-2xl py-4 text-xs tracking-widest',
        icon: 'size-12 rounded-2xl',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
);

type ButtonVariantProps = VariantProps<typeof buttonVariants>;

export function Button({
  variant,
  size,
  className,
  type = 'button',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & ButtonVariantProps) {
  return <button type={type} className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}

export function ButtonLink({ variant, size, className, ...props }: ComponentProps<typeof Link> & ButtonVariantProps) {
  return <Link className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
