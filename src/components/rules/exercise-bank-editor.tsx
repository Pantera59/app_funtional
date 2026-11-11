'use client';

import { Pencil, Plus, SearchX, Sparkles, X } from 'lucide-react';
import { useCallback, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/field';
import { Modal } from '@/components/ui/modal';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { Toggle } from '@/components/ui/toggle';
import { cn } from '@/lib/cn';
import { describeEquipment } from '@/lib/domain/functional/availability';
import { BLOCK_LABELS, FUNCTIONAL_BLOCK_KEYS } from '@/lib/domain/functional/constants';
import { missingSeedExercises } from '@/lib/domain/functional/exercise-bank';
import type { BankExercise, FunctionalBlockKey } from '@/lib/domain/functional/types';
import { useAppState } from '@/providers/app-state-provider';
import { ExerciseForm } from './exercise-form';

type BlockFilter = 'todos' | FunctionalBlockKey;

const BLOCK_FILTERS = [
  { value: 'todos', label: 'Todos' },
  ...FUNCTIONAL_BLOCK_KEYS.map((key) => ({ value: key, label: BLOCK_LABELS[key] })),
] as const satisfies readonly { value: BlockFilter; label: string }[];

/** `null` = closed, `'new'` = adding, otherwise the exercise being edited. */
type Editing = null | 'new' | BankExercise;

export function ExerciseBankEditor() {
  const { exerciseBank, setExerciseBank, materials } = useAppState();
  const [filter, setFilter] = useState<BlockFilter>('todos');
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<Editing>(null);
  const close = useCallback(() => setEditing(null), []);

  const query = search.trim().toLowerCase();
  const visible = exerciseBank.filter(
    (e) => (filter === 'todos' || e.blocks.includes(filter)) && (!query || e.name.toLowerCase().includes(query)),
  );
  const activeCount = exerciseBank.filter((e) => e.active).length;
  // The saved bank is the coach's copy: catalogue additions only reach it when they accept them here.
  const newFromCatalogue = missingSeedExercises(exerciseBank);
  const addFromCatalogue = () => setExerciseBank((prev) => [...prev, ...missingSeedExercises(prev)]);

  const save = (exercise: BankExercise) => {
    setExerciseBank((prev) =>
      prev.some((e) => e.id === exercise.id)
        ? prev.map((e) => (e.id === exercise.id ? exercise : e))
        : [...prev, exercise],
    );
    close();
  };

  const toggleActive = (id: string) =>
    setExerciseBank((prev) => prev.map((e) => (e.id === id ? { ...e, active: !e.active } : e)));

  return (
    <>
      <Card variant="tile" className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:w-64">
          <Input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar ejercicio..."
            aria-label="Buscar ejercicio"
            className="py-2.5 pr-10"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              aria-label="Limpiar búsqueda"
              className="absolute top-1/2 right-3 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>
        <SegmentedControl
          label="Filtrar por bloque"
          size="sm"
          items={BLOCK_FILTERS}
          value={filter}
          onChange={setFilter}
          className="overflow-x-auto"
        />
        <Button size="sm" onClick={() => setEditing('new')}>
          <Plus className="size-3.5" /> Agregar ejercicio
        </Button>
      </Card>

      <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
        {activeCount} de {exerciseBank.length} ejercicios activos. Los desactivados no entran al generador.
      </p>

      {newFromCatalogue.length > 0 && (
        <Card variant="inset" className="flex flex-col gap-3 border-brand-200 bg-brand-50/60 sm:flex-row sm:items-center sm:justify-between dark:border-brand-900/50 dark:bg-brand-950/20">
          <div className="min-w-0">
            <p className="flex items-center gap-2 text-xs font-black text-zinc-900 dark:text-zinc-100">
              <Sparkles className="size-4 text-brand-500" />
              {newFromCatalogue.length} ejercicios nuevos en el catálogo
            </p>
            <p className="mt-1 line-clamp-2 text-[11px] text-zinc-600 dark:text-zinc-400">
              {newFromCatalogue.map((e) => e.name).join(' · ')}
            </p>
          </div>
          <Button size="sm" onClick={addFromCatalogue} className="shrink-0">
            <Plus className="size-3.5" /> Añadir al banco
          </Button>
        </Card>
      )}

      {visible.length === 0 && (
        <Card variant="tile" className="flex flex-col items-center gap-2 py-10 text-center">
          <SearchX className="size-6 text-zinc-300 dark:text-zinc-600" />
          <p className="text-xs font-bold text-zinc-500 dark:text-zinc-400">Ningún ejercicio coincide con la búsqueda.</p>
        </Card>
      )}

      <ul className="space-y-3">
        {visible.map((exercise) => (
          <li
            key={exercise.id}
            className={cn(
              'flex items-start justify-between gap-4 rounded-2xl border p-4 transition-all',
              exercise.active
                ? 'border-zinc-150 bg-white dark:border-zinc-800 dark:bg-zinc-900'
                : 'border-zinc-200 bg-zinc-50 opacity-60 dark:border-zinc-800/80 dark:bg-zinc-950/40',
            )}
          >
            <div className="min-w-0 space-y-2">
              <h4 className="text-sm font-extrabold tracking-tight text-zinc-950 dark:text-zinc-50">{exercise.name}</h4>
              <div className="flex flex-wrap gap-1.5">
                {exercise.combo && (
                  <Badge size="sm" tone="solid">
                    Combo
                  </Badge>
                )}
                {exercise.blocks.map((block) => (
                  <Badge key={block} size="sm" tone="brand">
                    {BLOCK_LABELS[block]}
                  </Badge>
                ))}
                <Badge size="sm">{exercise.pattern}</Badge>
                <Badge size="sm">{exercise.focus.join(' / ')}</Badge>
                <Badge size="sm">{exercise.modality}</Badge>
                <Badge size="sm">{exercise.difficulty}</Badge>
              </div>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                <strong>Material:</strong> {describeEquipment(exercise)}
                {exercise.notes && <> · {exercise.notes}</>}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                onClick={() => setEditing(exercise)}
                aria-label={`Editar ${exercise.name}`}
                className="rounded-xl border border-zinc-200 bg-zinc-100 p-2 text-zinc-600 transition-all hover:bg-zinc-200 dark:border-zinc-800 dark:bg-zinc-850 dark:text-zinc-300"
              >
                <Pencil className="size-3.5" />
              </button>
              <Toggle
                checked={exercise.active}
                onToggle={() => toggleActive(exercise.id)}
                label={`Ejercicio activo: ${exercise.name}`}
              />
            </div>
          </li>
        ))}
      </ul>

      <Modal
        open={editing !== null}
        onClose={close}
        label={editing === 'new' ? 'Agregar ejercicio' : 'Editar ejercicio'}
        className="max-h-[90vh] max-w-2xl overflow-y-auto"
      >
        {editing !== null && (
          <ExerciseForm
            key={editing === 'new' ? 'new' : editing.id}
            initial={editing === 'new' ? undefined : editing}
            existingIds={exerciseBank.map((e) => e.id)}
            materialNames={materials.map((m) => m.name)}
            onSave={save}
            onCancel={close}
          />
        )}
      </Modal>
    </>
  );
}
