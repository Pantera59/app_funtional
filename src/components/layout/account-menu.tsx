'use client';

import { BookOpenCheck, ChevronDown, CloudAlert, CloudCheck, LayoutDashboard, LogIn, LogOut, RefreshCw, Users } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useId, useRef, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { ButtonLink } from '@/components/ui/button';
import { cn } from '@/lib/cn';
import { canAccess, initials, ROLE_LABELS } from '@/lib/auth/roles';
import { useAuth } from '@/providers/auth-provider';
import { useSyncStatus, type SyncStatus } from '@/providers/workspace-sync-provider';

const SYNC_LABEL: Record<Exclude<SyncStatus, 'off'>, string> = {
  syncing: 'Guardando cambios…',
  saved: 'Todo guardado en la nube',
  error: 'No se pudo guardar. Se reintentará al volver a editar.',
};

function SyncDot({ status }: { status: SyncStatus }) {
  if (status === 'off') return null;
  return (
    <span
      title={SYNC_LABEL[status]}
      className={cn(
        'absolute -right-0.5 -bottom-0.5 size-3 rounded-full border-2 border-white dark:border-zinc-900',
        status === 'saved' && 'bg-emerald-500',
        status === 'syncing' && 'animate-pulse bg-brand-500',
        status === 'error' && 'bg-red-500',
      )}
    />
  );
}

const menuItemClass =
  'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-xs font-bold text-zinc-700 transition-colors hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-800';

export function AccountMenu() {
  const { auth, signOut } = useAuth();
  const sync = useSyncStatus();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  if (auth.status === 'local') return null;
  if (auth.status === 'loading') return <span className="size-10 shrink-0 animate-pulse rounded-xl bg-zinc-100 dark:bg-zinc-800" />;
  if (auth.status === 'signed-out') {
    return (
      <ButtonLink href={`/login?next=${encodeURIComponent(pathname)}`} size="sm" variant="secondary">
        <LogIn className="size-3.5" /> Entrar
      </ButtonLink>
    );
  }

  const { profile } = auth;
  const displayName = profile.fullName || profile.email.split('@')[0];
  const close = () => setOpen(false);

  const handleSignOut = async () => {
    close();
    await signOut();
    router.replace('/login');
  };

  return (
    <div ref={rootRef} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={`Cuenta de ${displayName}`}
        className="flex items-center gap-1.5 rounded-xl p-0.5 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800"
      >
        <span className="relative flex size-9 items-center justify-center rounded-xl bg-zinc-900 text-[11px] font-black text-white dark:bg-zinc-100 dark:text-zinc-900">
          {initials(displayName)}
          <SyncDot status={sync} />
        </span>
        <ChevronDown className={cn('hidden size-3.5 text-zinc-400 transition-transform sm:block', open && 'rotate-180')} />
      </button>

      {open && (
        <div
          id={menuId}
          className="absolute right-0 z-[60] mt-2 w-64 rounded-2xl border border-zinc-150 bg-white p-2 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900"
        >
          <div className="px-3 pt-2 pb-3">
            <p className="truncate text-sm font-black text-zinc-950 dark:text-zinc-50">{displayName}</p>
            <p className="truncate text-[11px] text-zinc-500 dark:text-zinc-400">{profile.email}</p>
            <Badge tone={profile.role === 'usuario' ? 'neutral' : 'brand'} size="sm" className="mt-2">
              {ROLE_LABELS[profile.role]}
            </Badge>
            {sync !== 'off' && (
              <p
                className={cn(
                  'mt-3 flex items-center gap-1.5 text-[10px] font-bold',
                  sync === 'error' ? 'text-red-500' : 'text-zinc-500 dark:text-zinc-400',
                )}
              >
                {sync === 'saved' && <CloudCheck className="size-3.5 text-emerald-500" />}
                {sync === 'syncing' && <RefreshCw className="size-3.5 animate-spin" />}
                {sync === 'error' && <CloudAlert className="size-3.5" />}
                {SYNC_LABEL[sync]}
              </p>
            )}
          </div>
          <div className="border-t border-zinc-100 pt-2 dark:border-zinc-800">
            {canAccess(profile.role, 'coach') && (
              <Link href="/" onClick={close} className={menuItemClass}>
                <LayoutDashboard className="size-4 text-zinc-400" /> Panel del coach
              </Link>
            )}
            <Link href="/mis-clases" onClick={close} className={menuItemClass}>
              <BookOpenCheck className="size-4 text-zinc-400" />
              {profile.role === 'usuario' ? 'Mis clases' : 'Clases publicadas'}
            </Link>
            {canAccess(profile.role, 'users') && (
              <Link href="/usuarios" onClick={close} className={menuItemClass}>
                <Users className="size-4 text-zinc-400" /> Usuarios y roles
              </Link>
            )}
            <button type="button" onClick={handleSignOut} className={cn(menuItemClass, 'text-red-600 dark:text-red-400')}>
              <LogOut className="size-4" /> Cerrar sesión
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
