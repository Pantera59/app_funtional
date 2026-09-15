import Link from 'next/link';
import { KangarooIcon } from '@/components/brand/kangaroo-icon';
import { Eyebrow } from '@/components/ui/eyebrow';
import { IconTile } from '@/components/ui/icon-tile';
import { NavTabs } from './nav-tabs';
import { ThemeToggle } from './theme-toggle';

export function AppHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-150 bg-white/80 backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-900/80">
      <div className="mx-auto flex h-20 max-w-5xl items-center justify-between gap-3 px-4 md:px-6">
        <Link href="/" className="flex shrink-0 items-center gap-3 select-none" aria-label="Kangaroo Coach, inicio">
          <IconTile className="shadow-lg shadow-brand-500/20 transition-transform duration-300 hover:scale-105">
            <KangarooIcon />
          </IconTile>
          <span className="hidden flex-col md:flex">
            <span className="text-sm font-extrabold tracking-tight text-zinc-950 dark:text-zinc-50">Kangaroo Coach</span>
            <Eyebrow tone="brand" className="mt-0.5">
              WOD Studio
            </Eyebrow>
          </span>
        </Link>
        <NavTabs />
        <ThemeToggle />
      </div>
    </header>
  );
}
