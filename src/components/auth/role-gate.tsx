'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, type ReactNode } from 'react';
import { canAccess, homeFor, type Area } from '@/lib/auth/roles';
import { useAuth } from '@/providers/auth-provider';

const Pending = () => (
  <div className="flex min-h-[60vh] items-center justify-center" aria-busy="true" aria-label="Cargando">
    <span className="size-8 animate-spin rounded-full border-3 border-zinc-200 border-t-brand-500 dark:border-zinc-800 dark:border-t-brand-400" />
  </div>
);

/**
 * Shows `children` only to roles allowed in `area`; others are sent to the login or to their own home.
 * This is the UX layer: the data itself is protected by Row Level Security in Supabase.
 * In local mode (no Supabase configured) everything is open, as before accounts existed.
 */
export function RoleGate({ area, children }: { area: Area; children: ReactNode }) {
  const { auth } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const redirect =
    auth.status === 'signed-out'
      ? `/login?next=${encodeURIComponent(pathname)}`
      : auth.status === 'signed-in' && !canAccess(auth.profile.role, area)
        ? homeFor(auth.profile.role)
        : null;

  useEffect(() => {
    if (redirect) router.replace(redirect);
  }, [redirect, router]);

  if (auth.status === 'local') return children;
  if (auth.status !== 'signed-in' || redirect) return <Pending />;
  return children;
}
