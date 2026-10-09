'use client';

import { Check, Plus, SlidersHorizontal } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { Button, ButtonLink } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Eyebrow } from '@/components/ui/eyebrow';
import { Field, Input, Select } from '@/components/ui/field';
import { PanelHeader } from '@/components/ui/panel-header';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { useIsClient } from '@/hooks/use-is-client';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { cn } from '@/lib/cn';
import { CLASS_DURATION_MINUTES, FOCUS_OPTIONS, RESTRICTIONS, STORAGE_KEYS } from '@/lib/domain/constants';
import { fitClassTime, validateProfile } from '@/lib/domain/functional/timing';
import type { Focus, Restriction } from '@/lib/domain/types';
import { humanize } from '@/lib/format';
import { useAppState } from '@/providers/app-state-provider';
import { KangarooDashboard } from './kangaroo-dashboard';
import { PlanOverview } from './plan-overview';

type PlannerMode = 'clasico' | 'funcional';

const PLANNER_MODES = [
  { value: 'clasico', label: 'Clásico' },
  { value: 'funcional', label: 'Funcional' },
] as const;

export function PlannerWorkspace({ welcome }: { welcome: ReactNode }) {
  const { plan, activeMaterialNames, generatePlan, generateFunctionalPlan, rulesProfile } = useAppState();
  const isClient = useIsClient();
  const [mode, setMode] = useLocalStorage<PlannerMode>(STORAGE_KEYS.plannerMode, 'clasico');
  const functional = mode === 'funcional';
  const timing = fitClassTime(rulesProfile);

  const [focus, setFocus] = useState<Focus>('Full Body');
  const [limitedEquipment, setLimitedEquipment] = useState(false);
  const [restrictions, setRestrictions] = useState<Restriction[]>([]);
  const [startTime, setStartTime] = useState('07:00');

  const toggleRestriction = (restriction: Restriction) =>
    setRestrictions((prev) =>
      prev.includes(restriction) ? prev.filter((r) => r !== restriction) : [...prev, restriction],
    );

  return (
    <>
      <KangarooDashboard
        welcome={welcome}
        focus={focus}
        restrictions={restrictions}
        materialCount={activeMaterialNames.length}
      />

      <Card accent>
        <PanelHeader
          title="Planificador inteligente"
          subtitle="Sistema de generación automática de WOD"
          actions={
            <SegmentedControl label="Modo de generación" items={PLANNER_MODES} value={mode} onChange={setMode} />
          }
        />

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
            {!functional && (
              <label className="flex cursor-pointer items-center gap-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 transition-all hover:bg-zinc-100/60 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-900/60">
                <input
                  type="checkbox"
                  checked={limitedEquipment}
                  onChange={(event) => setLimitedEquipment(event.target.checked)}
                  className="size-5 cursor-pointer accent-brand-500"
                />
                <span className="text-[10px] font-bold tracking-wider text-zinc-700 uppercase select-none dark:text-zinc-300">
                  ¿Equipamiento limitado hoy? (máx. 2 estaciones)
                </span>
              </label>
            )}
          </div>

          {functional ? (
            <FunctionalRulesSummary />
          ) : (
            <fieldset className="space-y-4">
              <legend className="mb-2">
                <Eyebrow>Restricciones y escalado automático</Eyebrow>
              </legend>
              <div className="flex flex-wrap gap-2.5">
                {RESTRICTIONS.map((restriction) => {
                  const active = restrictions.includes(restriction);
                  return (
                    <button
                      key={restriction}
                      type="button"
                      aria-pressed={active}
                      onClick={() => toggleRestriction(restriction)}
                      className={cn(
                        'flex items-center gap-2 rounded-2xl border px-4 py-3 text-[10px] font-bold tracking-wider uppercase transition-all',
                        active
                          ? 'border-brand-500 bg-brand-500 text-white shadow-md shadow-brand-500/10'
                          : 'border-zinc-200 bg-zinc-50 text-zinc-600 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-900',
                      )}
                    >
                      {active && <Check className="size-3.5" />}
                      {humanize(restriction)}
                    </button>
                  );
                })}
              </div>
              <p className="text-xs leading-relaxed text-zinc-400 dark:text-zinc-500">
                Selecciona restricciones para que el algoritmo reemplace automáticamente los movimientos afectados por
                alternativas seguras según el material de tu gimnasio.
              </p>
            </fieldset>
          )}
        </div>

        <div className="mt-8 border-t border-zinc-100 pt-6 dark:border-zinc-800/80">
          {functional ? (
            <Button variant="inverted" size="lg" onClick={() => generateFunctionalPlan({ focus, startTime })}>
              <Plus className="size-4" /> Generar clase funcional ({isClient ? timing.total : '50–55'} minutos)
            </Button>
          ) : (
            <Button
              variant="inverted"
              size="lg"
              onClick={() => generatePlan({ focus, limitedEquipment, restrictions, startTime })}
            >
              <Plus className="size-4" /> Generar clase completa ({CLASS_DURATION_MINUTES} minutos)
            </Button>
          )}
          <Eyebrow className="mt-4 text-center">
            {functional
              ? 'Usa tus reglas de planeación, tu banco de ejercicios, el material activo y el historial de clases.'
              : 'Rutina generada dinámicamente según el inventario de materiales activos.'}
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
