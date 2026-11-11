'use client';

import { CloudOff, Search, ShieldCheck, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { Eyebrow } from '@/components/ui/eyebrow';
import { Input } from '@/components/ui/field';
import { PanelHeader } from '@/components/ui/panel-header';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { cn } from '@/lib/cn';
import { initials, ROLE_DESCRIPTIONS, ROLE_LABELS, ROLES, type Role } from '@/lib/auth/roles';
import { getSupabase, isSupabaseConfigured } from '@/lib/supabase/client';
import { authErrorMessage, toProfile, useProfile, type Profile } from '@/providers/auth-provider';

type RoleFilter = 'todos' | Role;

const FILTERS = [
  { value: 'todos', label: 'Todos' },
  ...ROLES.map((role) => ({ value: role, label: ROLE_LABELS[role] })),
] as const satisfies readonly { value: RoleFilter; label: string }[];

interface Row extends Profile {
  createdAt: string;
}

const dateFormat = new Intl.DateTimeFormat('es-MX', { day: 'numeric', month: 'short', year: 'numeric' });

export function UsersManager() {
  if (!isSupabaseConfigured) {
    return (
      <EmptyState
        icon={<CloudOff />}
        title="Requiere Supabase"
        description="La gestión de usuarios necesita cuentas. Configura las variables de Supabase y vuelve a desplegar."
      />
    );
  }
  return <UsersList />;
}

function UsersList() {
  const me = useProfile();
  const [rows, setRows] = useState<Row[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [filter, setFilter] = useState<RoleFilter>('todos');
  const [search, setSearch] = useState('');
  const [savingId, setSavingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ tone: 'ok' | 'error'; text: string } | null>(null);

  useEffect(() => {
    let cancelled = false;
    getSupabase()
      .from('profiles')
      .select('id, email, full_name, role, created_at')
      .order('created_at', { ascending: true })
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error) setLoadError(authErrorMessage(error.message));
        else setRows((data ?? []).map((row) => ({ ...toProfile(row), createdAt: row.created_at as string })));
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const changeRole = async (row: Row, role: Role) => {
    if (role === row.role) return;
    setSavingId(row.id);
    setFeedback(null);
    const { error } = await getSupabase().from('profiles').update({ role }).eq('id', row.id);
    setSavingId(null);
    if (error) {
      setFeedback({ tone: 'error', text: authErrorMessage(error.message) });
      return;
    }
    setRows((prev) => prev?.map((r) => (r.id === row.id ? { ...r, role } : r)) ?? prev);
    setFeedback({ tone: 'ok', text: `${row.fullName || row.email} ahora es ${ROLE_LABELS[role]}.` });
  };

  const query = search.trim().toLowerCase();
  const visible = (rows ?? []).filter(
    (row) =>
      (filter === 'todos' || row.role === filter) &&
      (!query || row.email.toLowerCase().includes(query) || row.fullName.toLowerCase().includes(query)),
  );
  const counts = Object.fromEntries(ROLES.map((role) => [role, rows?.filter((r) => r.role === role).length ?? 0])) as Record<
    Role,
    number
  >;

  return (
    <>
      <Card accent>
        <PanelHeader title="Usuarios y roles" subtitle="Quién entra a la app y qué puede hacer" icon={<Users />} />
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {ROLES.map((role) => (
            <Card key={role} variant="inset" className="space-y-1">
              <div className="flex items-center justify-between">
                <Eyebrow>{ROLE_LABELS[role]}</Eyebrow>
                <span className="text-lg font-black text-zinc-950 dark:text-zinc-50">{rows ? counts[role] : '–'}</span>
              </div>
              <p className="text-[11px] leading-snug text-zinc-500 dark:text-zinc-400">{ROLE_DESCRIPTIONS[role]}</p>
            </Card>
          ))}
        </div>
        <p className="mt-4 flex items-start gap-2 text-[11px] leading-relaxed text-zinc-500 dark:text-zinc-400">
          <ShieldCheck className="mt-0.5 size-3.5 shrink-0 text-brand-500" />
          Las cuentas nuevas se registran desde /login y empiezan como alumno. Aquí las subes a coach o superadmin. Los
          permisos los aplica la base de datos, no solo esta pantalla.
        </p>
      </Card>

      <Card variant="tile" className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <label className="relative w-full md:w-72">
          <Search className="pointer-events-none absolute top-1/2 left-3.5 size-3.5 -translate-y-1/2 text-zinc-400" />
          <Input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar por nombre o correo..."
            aria-label="Buscar usuario"
            className="py-2.5 pl-9"
          />
        </label>
        <SegmentedControl label="Filtrar por rol" size="sm" items={FILTERS} value={filter} onChange={setFilter} className="overflow-x-auto" />
      </Card>

      {feedback && (
        <p
          role="status"
          className={cn(
            'rounded-xl p-3 text-xs font-bold',
            feedback.tone === 'ok'
              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300'
              : 'bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-300',
          )}
        >
          {feedback.text}
        </p>
      )}

      {loadError ? (
        <EmptyState icon={<CloudOff />} title="No se pudo cargar la lista" description={loadError} />
      ) : !rows ? (
        <div className="min-h-[30vh]" aria-busy="true" />
      ) : visible.length === 0 ? (
        <EmptyState icon={<Users />} title="Sin resultados" description="Ningún usuario coincide con el filtro." />
      ) : (
        <Card variant="section">
          <ul className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {visible.map((row) => {
              const isMe = row.id === me?.id;
              const name = row.fullName || row.email.split('@')[0];
              return (
                <li key={row.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between md:px-6">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-zinc-100 text-[11px] font-black text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                      {initials(name)}
                    </span>
                    <div className="min-w-0">
                      <p className="flex items-center gap-2 truncate text-sm font-bold text-zinc-900 dark:text-zinc-100">
                        {name}
                        {isMe && (
                          <Badge size="sm" tone="brand">
                            Tú
                          </Badge>
                        )}
                      </p>
                      <p className="truncate text-[11px] text-zinc-500 dark:text-zinc-400">
                        {row.email} · desde {dateFormat.format(new Date(row.createdAt))}
                      </p>
                    </div>
                  </div>
                  <SegmentedControl
                    label={`Rol de ${name}`}
                    size="sm"
                    items={ROLES.map((role) => ({ value: role, label: ROLE_LABELS[role] }))}
                    value={row.role}
                    onChange={(role) => void changeRole(row, role)}
                    // Changing your own role could lock you out; another superadmin has to do it.
                    disabled={isMe || savingId === row.id}
                    className="shrink-0 self-start sm:self-auto"
                  />
                </li>
              );
            })}
          </ul>
        </Card>
      )}
    </>
  );
}
