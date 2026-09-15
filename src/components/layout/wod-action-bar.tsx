'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useIsClient } from '@/hooks/use-is-client';
import { cn } from '@/lib/cn';
import { useAppState } from '@/providers/app-state-provider';
import { CLASS_NAV_ITEMS } from './nav-items';

/** Floating shortcut to the class views once a WOD exists. */
export function WodActionBar() {
  const { plan } = useAppState();
  const pathname = usePathname();
  const isClient = useIsClient();

  if (!isClient || !plan) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-[max(1.5rem,env(safe-area-inset-bottom))] z-50 flex justify-center px-4">
      <div className="pointer-events-auto flex items-center gap-4 rounded-full border border-white/10 bg-zinc-900/90 px-5 py-3 text-white shadow-2xl backdrop-blur-md dark:border-zinc-200/50 dark:bg-white/95 dark:text-zinc-950">
        <span className="flex items-center gap-2 text-xs font-bold">
          <span className="size-2.5 animate-pulse rounded-full bg-brand-500" />
          <span className="hidden sm:inline">WOD de {plan.focus} listo</span>
          <span className="sm:hidden">WOD listo</span>
        </span>
        <span aria-hidden="true" className="h-4 w-px bg-white/20 dark:bg-zinc-200" />
        <nav aria-label="Vistas de la clase" className="flex gap-1.5">
          {CLASS_NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={pathname === item.href ? 'page' : undefined}
              className={cn(
                'rounded-full px-3.5 py-1.5 text-[11px] font-black tracking-wide uppercase transition-all',
                pathname === item.href
                  ? 'bg-brand-500 text-white'
                  : 'text-zinc-300 hover:bg-white/10 dark:text-zinc-700 dark:hover:bg-zinc-100',
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
