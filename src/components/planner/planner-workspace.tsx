'use client';

import { Plus, SlidersHorizontal } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { Button, ButtonLink } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Eyebrow } from '@/components/ui/eyebrow';
import { Field, Input, Select } from '@/components/ui/field';
import { PanelHeader } from '@/components/ui/panel-header';
import { useIsClient } from '@/hooks/use-is-client';
import { FOCUS_OPTIONS } from '@/lib/domain/constants';
import { fitClassTime, validateProfile } from '@/lib/domain/functional/timing';
import type { Focus } from '@/lib/domain/types';
import { useAppState } from '@/providers/app-state-provider';
import { KangarooDashboard } from './kangaroo-dashboard';
import { PlanOverview } from './plan-overview';

export function PlannerWorkspace({ welcome }: { welcome: ReactNode }) {
  const { plan, activeMaterialNames, generateFunctionalPlan, rulesProfile } = useAppState();
  const isClient = useIsClient();
  const timing = fitClassTime(rulesProfile);

  const [focus, setFocus] = useState<Focus>('Full Body');
  const [startTime, setStartTime] = useState('07:00');

  return (
    <>
      <KangarooDashboard welcome={welcome} focus={focus} materialCount={activeMaterialNames.length} />

      <Card accent>
        <PanelHeader title="Planificador inteligente" subtitle="Generación de clases de entrenamiento funcional" />

        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
          <div className="space-y-5">
            <Field label="Enfoque del día">
              <Select
                value={focus}
                onChange={(event) => setFocus(event.target.value as Focus)}
                options={FOCUS_OPTIONS}
                className="rounded-2xl p-4"
              />
            </Field>
            <Field label="Hora de inicio de la clase">
              <Input
                type="time"
                value={startTime}
                onChange={(event) => setStartTime(event.target.value)}
                className="rounded-2xl p-4 tracking-widest"
              />
            </Field>
          </div>

          <FunctionalRulesSummary />
        </div>

        <div className="mt-8 border-t border-zinc-100 pt-6 dark:border-zinc-800/80">
          <Button variant="inverted" size="lg" onClick={() => generateFunctionalPlan({ focus, startTime })}>
            <Plus className="size-4" /> Generar clase funcional ({isClient ? timing.total : '50–55'} minutos)
          </Button>
          <Eyebrow className="mt-4 text-center">
            Usa tus reglas de planeación, tu banco de ejercicios, el material activo y el historial de clases.
          </Eyebrow>
        </div>
      </Card>

      {isClient && plan && <PlanOverview plan={plan} />}
    </>
  );
}

/** Read-only view of the rules the functional generator will use. */
function FunctionalRulesSummary() {
  const { rulesProfile } = useAppState();
  const isClient = useIsClient();
  if (!isClient) return <div aria-busy="true" />;

  const timing = fitClassTime(rulesProfile);
  const issues = validateProfile(rulesProfile);

  return (
    <div className="space-y-4">
      <Eyebrow>Reglas de planeación activas</Eyebrow>
      <ul className="space-y-2">
        {rulesProfile.blocks.map((block) => (
          <li
            key={block.key}
            className="flex items-center justify-between gap-3 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-xs font-bold text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300"
          >
            <span>{block.name}</span>
            <span className="tabular-nums">{timing.minutes[block.key]}&apos;</span>
          </li>
        ))}
      </ul>
      <p className="text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
        Total: <strong>{timing.total} min</strong> (objetivo {rulesProfile.targetMinutes.min}–
        {rulesProfile.targetMinutes.max}). {timing.adjustments.join(' ')}
      </p>
      {issues.length > 0 && (
        <ul className="space-y-1 text-[11px] font-medium text-red-600 dark:text-red-400">
          {issues.map((issue) => (
            <li key={issue}>{issue}</li>
          ))}
        </ul>
      )}
      <ButtonLink href="/reglas" variant="secondary" size="sm">
        <SlidersHorizontal className="size-3.5" /> Editar reglas
      </ButtonLink>
    </div>
  );
}
