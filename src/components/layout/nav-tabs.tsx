'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { segmentedTrackClass, segmentVariants } from '@/components/ui/segmented-control';
import { useIsClient } from '@/hooks/use-is-client';
import { cn } from '@/lib/cn';
import { useAppState } from '@/providers/app-state-provider';
import { NAV_ITEMS } from './nav-items';

export function NavTabs() {
  const pathname = usePathname();
  const { plan } = useAppState();
  const hasPlan = useIsClient() && plan !== null;

  return (
    <nav aria-label="Secciones" className={cn(segmentedTrackClass, 'min-w-0 overflow-x-auto')}>
      {NAV_ITEMS.map((item) => {
        const active = pathname === item.href;
        const disabled = item.requiresPlan && !hasPlan;
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? 'page' : undefined}
            aria-disabled={disabled || undefined}
            tabIndex={disabled ? -1 : undefined}
            className={cn(
              segmentVariants({ active, tone: item.requiresPlan ? 'brand' : 'neutral' }),
              'px-3 sm:px-4.5',
              disabled && 'pointer-events-none opacity-30',
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
