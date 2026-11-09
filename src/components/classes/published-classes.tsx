'use client';

import { ArrowLeft, CalendarDays, ChevronRight, CloudOff, Eye, EyeOff, LayoutDashboard, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { StudentClassDetail } from '@/components/student/student-view';
import { Badge } from '@/components/ui/badge';
import { Button, ButtonLink } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { Eyebrow } from '@/components/ui/eyebrow';
import { cn } from '@/lib/cn';
import { canAccess } from '@/lib/auth/roles';
import { fromRow, localIsoDate, type PublishedClass, type PublishedClassRow } from '@/lib/classes/published-class';
import { classMinutes } from '@/lib/domain/student-class';
import { getSupabase, isSupabaseConfigured } from '@/lib/supabase/client';
import { authErrorMessage, useProfile } from '@/providers/auth-provider';

const longDate = new Intl.DateTimeFormat('es-MX', { weekday: 'long', day: 'numeric', month: 'long' });

/** `class_date` is a plain date: build it at local midnight so it never shifts a day. */
function formatClassDate(isoDate: string) {
  const [year, month, day] = isoDate.split('-').map(Number);
  const text = longDate.format(new Date(year, month - 1, day));
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function PublishedClasses() {
  if (!isSupabaseConfigured) {
    return (
      <EmptyState
        icon={<CloudOff />}
        title="Requiere Supabase"
        description="Las clases publicadas se guardan en la nube. En modo local comparte la clase con el QR."
        action={<ButtonLink href="/">Ir al planificador</ButtonLink>}
      />
    );
  }
  return <ClassesList />;
}

function ClassesList() {
  const profile = useProfile();
  const isCoach = profile ? canAccess(profile.role, 'coach') : false;
  const [classes, setClasses] = useState<PublishedClass[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    getSupabase()
      .from('published_classes')
      .select('id, title, class_date, published, payload, created_at')
      .order('class_date', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(60)
      .then(({ data, error: loadError }) => {
        if (cancelled) return;
        if (loadError) setError(authErrorMessage(loadError.message));
        else setClasses(((data ?? []) as PublishedClassRow[]).map(fromRow).filter((c): c is PublishedClass => c !== null));
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const togglePublished = async (item: PublishedClass) => {
    const { error: updateError } = await getSupabase()
      .from('published_classes')
      .update({ published: !item.published })
      .eq('id', item.id);
    if (updateError) setError(authErrorMessage(updateError.message));
    else setClasses((prev) => prev?.map((c) => (c.id === item.id ? { ...c, published: !c.published } : c)) ?? prev);
  };

  const remove = async (item: PublishedClass) => {
    if (!window.confirm(`¿Eliminar "${item.title}"? Los alumnos dejarán de verla.`)) return;
    const { error: deleteError } = await getSupabase().from('published_classes').delete().eq('id', item.id);
    if (deleteError) setError(authErrorMessage(deleteError.message));
    else {
      setClasses((prev) => prev?.filter((c) => c.id !== item.id) ?? prev);
      setSelectedId(null);
    }
  };

  const selected = classes?.find((c) => c.id === selectedId);

  if (selected) {
    return (
      <div className="space-y-4">
        <Button variant="secondary" size="sm" onClick={() => setSelectedId(null)}>
          <ArrowLeft className="size-3.5" /> Todas las clases
        </Button>
        <StudentClassDetail
          studentClass={selected.studentClass}
          eyebrow={`${selected.title} · ${formatClassDate(selected.classDate)}`}
        />
      </div>
    );
  }

  if (error) return <EmptyState icon={<CloudOff />} title="No se pudieron cargar las clases" description={error} />;
  if (!classes) return <div className="min-h-[40vh]" aria-busy="true" />;

  const today = localIsoDate(new Date());
  const firstName = profile?.fullName.split(' ')[0];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <Eyebrow tone="brand">{isCoach ? 'Publicadas para alumnos' : 'Tu entrenamiento'}</Eyebrow>
          <h1 className="mt-1 text-2xl font-black tracking-tight text-zinc-950 dark:text-zinc-50">
            {isCoach ? 'Clases publicadas' : firstName ? `Hola, ${firstName}` : 'Mis clases'}
          </h1>
        </div>
        {isCoach && (
          <ButtonLink href="/" size="sm" variant="secondary">
            <LayoutDashboard className="size-3.5" /> Panel del coach
          </ButtonLink>
        )}
      </div>

      {classes.length === 0 ? (
        <EmptyState
          icon={<CalendarDays />}
          title="Todavía no hay clases"
          description={
            isCoach
              ? 'Genera una clase en el planificador y usa "Compartir → Publicar en Mis clases".'
              : 'Cuando tu coach publique una clase, aparecerá aquí.'
          }
        />
      ) : (
        <ul className="space-y-3">
          {classes.map((item) => {
            const isToday = item.classDate === today;
            return (
              <li key={item.id}>
                <Card
                  variant="tile"
                  className={cn(
                    'flex items-center gap-3 p-0 transition-shadow hover:shadow-md',
                    isToday && 'border-brand-300 dark:border-brand-800',
                    !item.published && 'opacity-60',
                  )}
                >
                  <button
                    type="button"
                    onClick={() => setSelectedId(item.id)}
                    className="flex min-w-0 flex-1 items-center gap-4 p-4 text-left"
                  >
                    <span
                      className={cn(
                        'flex size-12 shrink-0 flex-col items-center justify-center rounded-2xl text-center',
                        isToday ? 'bg-brand-500 text-white' : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200',
                      )}
                    >
                      <span className="text-lg leading-none font-black">{Number(item.classDate.slice(8, 10))}</span>
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-center gap-2">
                        <span className="truncate text-sm font-black text-zinc-950 dark:text-zinc-50">{item.title}</span>
                        {isToday && (
                          <Badge size="sm" tone="solid">
                            Hoy
                          </Badge>
                        )}
                        {!item.published && <Badge size="sm">Oculta</Badge>}
                      </span>
                      <span className="mt-0.5 block truncate text-[11px] text-zinc-500 dark:text-zinc-400">
                        {formatClassDate(item.classDate)} · {item.studentClass.focus} · {classMinutes(item.studentClass)} min
                      </span>
                    </span>
                    <ChevronRight className="size-4 shrink-0 text-zinc-300 dark:text-zinc-600" />
                  </button>
                  {isCoach && (
                    <span className="flex shrink-0 gap-1 pr-3">
                      <button
                        type="button"
                        onClick={() => void togglePublished(item)}
                        aria-label={item.published ? `Ocultar ${item.title} a los alumnos` : `Mostrar ${item.title} a los alumnos`}
                        title={item.published ? 'Ocultar a los alumnos' : 'Mostrar a los alumnos'}
                        className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
                      >
                        {item.published ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
                      </button>
                      <button
                        type="button"
                        onClick={() => void remove(item)}
                        aria-label={`Eliminar ${item.title}`}
                        title="Eliminar"
                        className="rounded-lg p-2 text-zinc-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </span>
                  )}
                </Card>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
