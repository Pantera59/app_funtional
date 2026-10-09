'use client';

import { Plus, Trash2 } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Chip } from '@/components/ui/chip';
import { Eyebrow } from '@/components/ui/eyebrow';
import { Field, Input, Select, Textarea } from '@/components/ui/field';
import {
  BANK_FOCUSES,
  BLOCK_LABELS,
  DIFFICULTIES,
  FUNCTIONAL_BLOCK_KEYS,
  FUNCTIONAL_PATTERNS,
  MODALITIES,
} from '@/lib/domain/functional/constants';
import { createBankExerciseId } from '@/lib/domain/functional/exercise-bank';
import type { BankExercise, Difficulty, FunctionalPattern, Modality } from '@/lib/domain/functional/types';

const EMPTY_EXERCISE: BankExercise = {
  id: '',
  name: '',
  blocks: ['fuerza'],
  focus: ['full'],
  pattern: 'sentadilla',
  equipment: [],
  modality: 'reps',
  difficulty: 'Intermedio',
  notes: '',
  combo: false,
  active: true,
};

const toggleIn = <T,>(list: T[], value: T) => (list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);

interface ExerciseFormProps {
  /** Omitted when adding a new exercise. */
  initial?: BankExercise;
  existingIds: string[];
  materialNames: string[];
  onSave: (exercise: BankExercise) => void;
  onCancel: () => void;
}

export function ExerciseForm({ initial, existingIds, materialNames, onSave, onCancel }: ExerciseFormProps) {
  const [draft, setDraft] = useState<BankExercise>(initial ?? EMPTY_EXERCISE);
  const [error, setError] = useState('');
  const set = (patch: Partial<BankExercise>) => setDraft((prev) => ({ ...prev, ...patch }));

  // Materials named in the exercise stay selectable even if they were removed from the inventory.
  const materialOptions = [...new Set([...materialNames, ...draft.equipment.flat()])];

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const name = draft.name.trim();
    const id = initial?.id ?? createBankExerciseId(name);
    if (!name) return setError('Escribe un nombre.');
    if (!initial && existingIds.includes(id)) return setError('Ya existe un ejercicio con ese nombre.');
    if (draft.blocks.length === 0) return setError('Elige al menos un bloque.');
    if (draft.focus.length === 0) return setError('Elige al menos un enfoque.');
    onSave({ ...draft, id, name, equipment: draft.equipment.filter((group) => group.length > 0) });
  };

  return (
    <form onSubmit={submit} className="space-y-5">
      <h2 className="pr-8 text-base font-black tracking-tight text-zinc-950 dark:text-zinc-50">
        {initial ? 'Editar ejercicio' : 'Agregar ejercicio'}
      </h2>

      <Field label="Nombre">
        <Input value={draft.name} onChange={(event) => set({ name: event.target.value })} autoFocus />
      </Field>

      <div className="space-y-2">
        <Eyebrow>Bloques donde puede ir</Eyebrow>
        <div className="flex flex-wrap gap-2">
          {FUNCTIONAL_BLOCK_KEYS.map((key) => (
            <Chip key={key} selected={draft.blocks.includes(key)} onToggle={() => set({ blocks: toggleIn(draft.blocks, key) })}>
              {BLOCK_LABELS[key]}
            </Chip>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Eyebrow>Enfoque</Eyebrow>
        <div className="flex flex-wrap gap-2">
          {BANK_FOCUSES.map((focus) => (
            <Chip key={focus} selected={draft.focus.includes(focus)} onToggle={() => set({ focus: toggleIn(draft.focus, focus) })}>
              {focus}
            </Chip>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Field label="Patrón">
          <Select
            value={draft.pattern}
            onChange={(event) => set({ pattern: event.target.value as FunctionalPattern })}
            options={FUNCTIONAL_PATTERNS}
          />
        </Field>
        <Field label="Modalidad">
          <Select
            value={draft.modality}
            onChange={(event) => set({ modality: event.target.value as Modality })}
            options={MODALITIES}
          />
        </Field>
        <Field label="Dificultad">
          <Select
            value={draft.difficulty}
            onChange={(event) => set({ difficulty: event.target.value as Difficulty })}
            options={DIFFICULTIES}
          />
        </Field>
      </div>

      <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-950">
        <input
          type="checkbox"
          checked={draft.combo}
          onChange={(event) => set({ combo: event.target.checked })}
          className="size-4 cursor-pointer accent-brand-500"
        />
        <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
          Combo secuencial (A + B + C en un solo movimiento): ocupa una estación completa
        </span>
      </label>

      <div className="space-y-3">
        <Eyebrow>Material requerido</Eyebrow>
        {draft.equipment.length === 0 && (
          <p className="text-xs text-zinc-500 dark:text-zinc-400">Ninguno: siempre disponible.</p>
        )}
        {draft.equipment.map((group, index) => (
          <Card key={index} variant="inset" className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <Eyebrow size="xs">Requisito {index + 1}: basta con uno de estos</Eyebrow>
              <button
                type="button"
                aria-label={`Quitar requisito ${index + 1}`}
                onClick={() => set({ equipment: draft.equipment.filter((_, i) => i !== index) })}
                className="rounded-lg p-1.5 text-red-500 transition-colors hover:bg-red-50 dark:hover:bg-red-950/20"
              >
                <Trash2 className="size-3.5" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {materialOptions.map((material) => (
                <Chip
                  key={material}
                  selected={group.includes(material)}
                  onToggle={() =>
                    set({ equipment: draft.equipment.map((g, i) => (i === index ? toggleIn(g, material) : g)) })
                  }
                >
                  {material}
                </Chip>
              ))}
            </div>
          </Card>
        ))}
        <Button variant="secondary" size="sm" onClick={() => set({ equipment: [...draft.equipment, []] })}>
          <Plus className="size-3.5" /> Agregar requisito de material
        </Button>
      </div>

      <Field label="Notas técnicas o variantes más fáciles">
        <Textarea rows={3} value={draft.notes} onChange={(event) => set({ notes: event.target.value })} />
      </Field>

      {error && <p className="text-xs font-bold text-red-600 dark:text-red-400">{error}</p>}

      <div className="flex justify-end gap-3">
        <Button variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">Guardar</Button>
      </div>
    </form>
  );
}
