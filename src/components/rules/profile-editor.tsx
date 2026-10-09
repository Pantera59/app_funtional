'use client';

import { AlertTriangle, CheckCircle2, Plus, RotateCcw, Trash2 } from 'lucide-react';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Chip } from '@/components/ui/chip';
import { Eyebrow } from '@/components/ui/eyebrow';
import { Field, Input, Textarea } from '@/components/ui/field';
import { Toggle } from '@/components/ui/toggle';
import { cn } from '@/lib/cn';
import { DEFAULT_RULES_PROFILE } from '@/lib/domain/functional/default-profile';
import { fitClassTime, validateProfile } from '@/lib/domain/functional/timing';
import type { RulesProfile } from '@/lib/domain/functional/types';
import { useAppState } from '@/providers/app-state-provider';

function NumberField({
  label,
  value,
  onChange,
  min = 0,
  step = 1,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  step?: number;
}) {
  return (
    <Field label={label}>
      <Input
        type="number"
        inputMode="decimal"
        min={min}
        step={step}
        value={value}
        onChange={(event) => {
          const next = Number(event.target.value);
          if (!Number.isNaN(next)) onChange(next);
        }}
      />
    </Field>
  );
}

function Section({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  return (
    <Card variant="tile" className="space-y-5">
      <div>
        <h3 className="text-sm font-extrabold tracking-tight text-zinc-950 dark:text-zinc-50">{title}</h3>
        {description && <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">{description}</p>}
      </div>
      {children}
    </Card>
  );
}

function SwitchRow({ label, checked, onToggle }: { label: string; checked: boolean; onToggle: () => void }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-950">
      <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">{label}</span>
      <Toggle checked={checked} onToggle={onToggle} label={label} />
    </div>
  );
}

export function ProfileEditor() {
  const { rulesProfile: profile, setRulesProfile, materials, setMaterials } = useAppState();
  const timing = fitClassTime(profile);
  const issues = validateProfile(profile);

  /** Every change is saved right away. */
  const update = (change: (prev: RulesProfile) => RulesProfile) => setRulesProfile(change);
  const patch = <K extends keyof RulesProfile>(key: K, value: Partial<RulesProfile[K]>) =>
    update((prev) => ({ ...prev, [key]: { ...prev[key], ...value } }));

  const updateBlock = (index: number, value: Partial<RulesProfile['blocks'][number]>) =>
    update((prev) => ({ ...prev, blocks: prev.blocks.map((b, i) => (i === index ? { ...b, ...value } : b)) }));

  const updateWarmupStep = (index: number, value: Partial<RulesProfile['warmup']['fixedSequence'][number]>) =>
    patch('warmup', {
      fixedSequence: profile.warmup.fixedSequence.map((s, i) => (i === index ? { ...s, ...value } : s)),
    });

  const updateScheme = (index: number, value: Partial<RulesProfile['strength']['schemes'][number]>) =>
    patch('strength', { schemes: profile.strength.schemes.map((s, i) => (i === index ? { ...s, ...value } : s)) });

  const resetProfile = () => {
    if (window.confirm('¿Restaurar todas las reglas a los valores por defecto?')) setRulesProfile(DEFAULT_RULES_PROFILE);
  };

  return (
    <div className="space-y-6">
      <Card
        variant="tile"
        className={cn(
          'flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between',
          issues.length > 0 && 'border-red-300 dark:border-red-900',
        )}
      >
        <div className="space-y-2">
          <p className="flex items-center gap-2 text-sm font-extrabold text-zinc-950 dark:text-zinc-50">
            {issues.length === 0 ? (
              <CheckCircle2 className="size-4 text-emerald-500" />
            ) : (
              <AlertTriangle className="size-4 text-red-500" />
            )}
            Clase de {timing.total} min (objetivo {profile.targetMinutes.min}–{profile.targetMinutes.max})
          </p>
          {timing.adjustments.length > 0 && (
            <p className="text-xs text-zinc-500 dark:text-zinc-400">{timing.adjustments.join(' ')}</p>
          )}
          {issues.length > 0 && (
            <ul className="space-y-1 text-xs font-medium text-red-600 dark:text-red-400">
              {issues.map((issue) => (
                <li key={issue}>{issue}</li>
              ))}
            </ul>
          )}
        </div>
        <Button variant="secondary" size="sm" onClick={resetProfile}>
          <RotateCcw className="size-3.5" /> Restaurar valores
        </Button>
      </Card>

      <Section
        title="Duración y bloques"
        description="Los 4 bloques van siempre en este orden. Los minutos planeados deben quedar dentro de su rango."
      >
        <div className="grid grid-cols-2 gap-4">
          <NumberField
            label="Duración mínima (min)"
            value={profile.targetMinutes.min}
            onChange={(min) => patch('targetMinutes', { min })}
          />
          <NumberField
            label="Duración máxima (min)"
            value={profile.targetMinutes.max}
            onChange={(max) => patch('targetMinutes', { max })}
          />
        </div>
        <ol className="space-y-3">
          {profile.blocks.map((block, index) => (
            <li key={block.key}>
              <Card variant="inset" className="grid grid-cols-3 gap-3 sm:grid-cols-[2fr_1fr_1fr_1fr]">
                <Field label={`Bloque ${index + 1}`} className="col-span-3 sm:col-span-1">
                  <Input value={block.name} onChange={(event) => updateBlock(index, { name: event.target.value })} />
                </Field>
                <NumberField label="Mín." value={block.minMinutes} onChange={(minMinutes) => updateBlock(index, { minMinutes })} />
                <NumberField label="Máx." value={block.maxMinutes} onChange={(maxMinutes) => updateBlock(index, { maxMinutes })} />
                <NumberField
                  label="Planeado"
                  value={block.minutes}
                  step={0.5}
                  onChange={(minutes) => updateBlock(index, { minutes })}
                />
              </Card>
            </li>
          ))}
        </ol>
      </Section>

      <Section title="Calentamiento" description="La secuencia fija va siempre al inicio; después, la activación según el enfoque.">
        <ul className="space-y-3">
          {profile.warmup.fixedSequence.map((step, index) => (
            <li key={index}>
              <Card variant="inset" className="flex items-start gap-3">
                <div className="grid flex-1 gap-3 sm:grid-cols-[1fr_3fr]">
                  <Field label="Zona">
                    <Input value={step.area} onChange={(event) => updateWarmupStep(index, { area: event.target.value })} />
                  </Field>
                  <Field label="Movimientos">
                    <Textarea
                      rows={2}
                      value={step.detail}
                      onChange={(event) => updateWarmupStep(index, { detail: event.target.value })}
                    />
                  </Field>
                </div>
                <button
                  type="button"
                  aria-label={`Quitar ${step.area}`}
                  onClick={() =>
                    patch('warmup', { fixedSequence: profile.warmup.fixedSequence.filter((_, i) => i !== index) })
                  }
                  className="mt-7 rounded-xl p-2 text-red-500 transition-colors hover:bg-red-50 dark:hover:bg-red-950/20"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </Card>
            </li>
          ))}
        </ul>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => patch('warmup', { fixedSequence: [...profile.warmup.fixedSequence, { area: '', detail: '' }] })}
        >
          <Plus className="size-3.5" /> Agregar zona
        </Button>
        <div className="grid grid-cols-3 gap-4">
          <NumberField
            label="Ejercicios de activación"
            value={profile.warmup.activationCount}
            onChange={(activationCount) => patch('warmup', { activationCount })}
          />
          <NumberField
            label="Sets"
            value={profile.warmup.activationSets}
            onChange={(activationSets) => patch('warmup', { activationSets })}
          />
          <Field label="Reps">
            <Input
              value={profile.warmup.activationReps}
              onChange={(event) => patch('warmup', { activationReps: event.target.value })}
            />
          </Field>
        </div>
      </Section>

      <Section title="Fuerza" description="Cada estación es A/B (alternados) o Combo (A + B + C en un solo movimiento).">
        <div className="grid grid-cols-3 gap-4">
          <NumberField
            label="Estaciones"
            value={profile.strength.stations}
            onChange={(stations) => patch('strength', { stations })}
          />
          <NumberField
            label="Mínimo"
            value={profile.strength.minStations}
            onChange={(minStations) => patch('strength', { minStations })}
          />
          <NumberField
            label="Máximo"
            value={profile.strength.maxStations}
            onChange={(maxStations) => patch('strength', { maxStations })}
          />
        </div>
        <div className="space-y-3">
          <Eyebrow>Esquemas de series permitidos</Eyebrow>
          <ul className="space-y-2">
            {profile.strength.schemes.map((scheme, index) => (
              <li key={index} className="flex items-center gap-3">
                <Toggle
                  checked={scheme.active}
                  onToggle={() => updateScheme(index, { active: !scheme.active })}
                  label={`Usar esquema ${scheme.label}`}
                />
                <Input
                  value={scheme.label}
                  onChange={(event) => updateScheme(index, { label: event.target.value })}
                  aria-label="Esquema de series"
                  placeholder="3 sets 10-8-6"
                />
                <button
                  type="button"
                  aria-label={`Quitar esquema ${scheme.label}`}
                  onClick={() => patch('strength', { schemes: profile.strength.schemes.filter((_, i) => i !== index) })}
                  className="rounded-xl p-2 text-red-500 transition-colors hover:bg-red-50 dark:hover:bg-red-950/20"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </li>
            ))}
          </ul>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => patch('strength', { schemes: [...profile.strength.schemes, { label: '', active: true }] })}
          >
            <Plus className="size-3.5" /> Agregar esquema
          </Button>
        </div>
        <SwitchRow
          label="Estación condicional (solo si alcanza el tiempo)"
          checked={profile.strength.conditionalStation}
          onToggle={() => patch('strength', { conditionalStation: !profile.strength.conditionalStation })}
        />
        {profile.strength.conditionalStation && (
          <NumberField
            label="Minutos de la estación condicional"
            value={profile.strength.conditionalMinutes}
            step={0.5}
            onChange={(conditionalMinutes) => patch('strength', { conditionalMinutes })}
          />
        )}
      </Section>

      <Section title="Cardio" description="Formato por defecto: intervalos de trabajo y descanso por vueltas.">
        <div className="grid grid-cols-3 gap-4">
          <NumberField
            label="Ejercicios"
            value={profile.cardio.exercises}
            onChange={(exercises) => patch('cardio', { exercises })}
          />
          <NumberField
            label="Mínimo"
            value={profile.cardio.minExercises}
            onChange={(minExercises) => patch('cardio', { minExercises })}
          />
          <NumberField
            label="Máximo"
            value={profile.cardio.maxExercises}
            onChange={(maxExercises) => patch('cardio', { maxExercises })}
          />
          <NumberField
            label="Trabajo (s)"
            value={profile.cardio.workSeconds}
            onChange={(workSeconds) => patch('cardio', { workSeconds })}
          />
          <NumberField
            label="Descanso (s)"
            value={profile.cardio.restSeconds}
            onChange={(restSeconds) => patch('cardio', { restSeconds })}
          />
          <NumberField label="Vueltas" value={profile.cardio.rounds} onChange={(rounds) => patch('cardio', { rounds })} />
        </div>
      </Section>

      <Section title="Estiramiento">
        <NumberField
          label="Ejercicios de estiramiento"
          value={profile.stretch.exercises}
          onChange={(exercises) => patch('stretch', { exercises })}
        />
      </Section>

      <Section title="Rotación">
        <NumberField
          label="No repetir el ejercicio principal de las últimas N clases"
          value={profile.rotation.lookbackClasses}
          onChange={(lookbackClasses) => patch('rotation', { lookbackClasses })}
        />
        <SwitchRow
          label="Upper body: equilibrar empuje y jalón"
          checked={profile.rotation.balancePushPull}
          onToggle={() => patch('rotation', { balancePushPull: !profile.rotation.balancePushPull })}
        />
      </Section>

      <Section title="Material disponible" description="Solo el material activo entra al generador. Es el mismo inventario de Materiales.">
        <div className="flex flex-wrap gap-2">
          {materials.map((material) => (
            <Chip
              key={material.name}
              selected={material.active}
              onToggle={() =>
                setMaterials((prev) => prev.map((m) => (m.name === material.name ? { ...m, active: !m.active } : m)))
              }
            >
              {material.name}
            </Chip>
          ))}
        </div>
        <Link href="/materiales" className="text-xs font-bold text-brand-600 hover:underline dark:text-brand-400">
          Administrar inventario completo →
        </Link>
      </Section>
    </div>
  );
}
