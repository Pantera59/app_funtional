'use client';

import { BookOpenCheck, Check, Send } from 'lucide-react';
import Link from 'next/link';
import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Field, Input } from '@/components/ui/field';
import { canAccess } from '@/lib/auth/roles';
import { defaultClassTitle, localIsoDate } from '@/lib/classes/published-class';
import { toStudentClass } from '@/lib/domain/student-class';
import type { WorkoutPlan } from '@/lib/domain/types';
import { getSupabase } from '@/lib/supabase/client';
import { authErrorMessage, useProfile } from '@/providers/auth-provider';

/** Saves the student version of the plan to `published_classes`, so signed-in students find it in /mis-clases. */
export function PublishClassPanel({ plan }: { plan: WorkoutPlan }) {
  const profile = useProfile();
  const [title, setTitle] = useState(() => defaultClassTitle(toStudentClass(plan)));
  const [date, setDate] = useState(() => localIsoDate(new Date()));
  const [state, setState] = useState<{ status: 'idle' | 'saving' | 'done' } | { status: 'error'; message: string }>({
    status: 'idle',
  });

  // Only coaches publish; local mode has no cloud to publish to.
  if (!profile || !canAccess(profile.role, 'coach')) return null;

  const publish = async (event: FormEvent) => {
    event.preventDefault();
    setState({ status: 'saving' });
    const { error } = await getSupabase()
      .from('published_classes')
      .insert({ title: title.trim() || defaultClassTitle(toStudentClass(plan)), class_date: date, payload: toStudentClass(plan) });
    setState(error ? { status: 'error', message: authErrorMessage(error.message) } : { status: 'done' });
  };

  if (state.status === 'done') {
    return (
      <div className="mt-6 flex w-full flex-col items-center gap-2 rounded-2xl bg-emerald-50 p-4 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-200">
        <Check className="size-5" />
        <p className="text-xs font-bold">Publicada. Tus alumnos la ven al entrar a Mis clases.</p>
        <Link href="/mis-clases" className="text-[11px] font-black tracking-wide uppercase underline underline-offset-4">
          Ver clases publicadas
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={publish} className="mt-6 w-full space-y-3 border-t border-zinc-100 pt-5 text-left dark:border-zinc-800">
      <p className="flex items-center gap-2 text-xs font-black tracking-wider text-zinc-900 uppercase dark:text-zinc-100">
        <BookOpenCheck className="size-4 text-brand-500" /> Publicar en Mis clases
      </p>
      <p className="text-[11px] leading-relaxed text-zinc-500 dark:text-zinc-400">
        Queda guardada para los alumnos con cuenta, sin necesidad del QR.
      </p>
      <div className="grid grid-cols-[1fr_auto] gap-2">
        <Field label="Título">
          <Input value={title} onChange={(event) => setTitle(event.target.value)} maxLength={80} required />
        </Field>
        <Field label="Fecha">
          <Input type="date" value={date} onChange={(event) => setDate(event.target.value)} required />
        </Field>
      </div>
      {state.status === 'error' && (
        <p role="alert" className="text-[11px] font-bold text-red-600 dark:text-red-400">
          {state.message}
        </p>
      )}
      <Button type="submit" size="lg" variant="inverted" disabled={state.status === 'saving'}>
        <Send className="size-4" /> {state.status === 'saving' ? 'Publicando…' : 'Publicar'}
      </Button>
    </form>
  );
}
