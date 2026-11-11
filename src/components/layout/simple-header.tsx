import type { ReactNode } from 'react';
import { KangarooIcon } from '@/components/brand/kangaroo-icon';
import { Eyebrow } from '@/components/ui/eyebrow';
import { IconTile } from '@/components/ui/icon-tile';
import { cn } from '@/lib/cn';
import { ThemeToggle } from './theme-toggle';

interface SimpleHeaderProps {
  subtitle: string;
  /** Extra controls next to the theme toggle (e.g. the account menu). */
  actions?: ReactNode;
  className?: string;
}

/** Header without the coach navigation: student views and the login. */
export function SimpleHeader({ subtitle, actions, className }: SimpleHeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-150 bg-white/80 backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-900/80">
      <div className={cn('mx-auto flex h-16 max-w-md items-center justify-between gap-3 px-4', className)}>
        <span className="flex items-center gap-3 select-none">
          <IconTile size="sm">
            <KangarooIcon />
          </IconTile>
          <span className="flex flex-col">
            <span className="text-sm font-extrabold tracking-tight text-zinc-950 dark:text-zinc-50">Kangaroo Coach</span>
            <Eyebrow tone="brand" className="mt-0.5">
              {subtitle}
            </Eyebrow>
          </span>
        </span>
        <span className="flex items-center gap-2">
          <ThemeToggle />
          {actions}
        </span>
      </div>
    </header>
  );
}
