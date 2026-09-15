'use client';

import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Field, Input, Select } from '@/components/ui/field';
import { MATERIAL_CATEGORIES, MATERIAL_STATUSES } from '@/lib/domain/constants';
import type { Material, MaterialStatus } from '@/lib/domain/types';

type Draft = Omit<Material, 'active'>;

const EMPTY_DRAFT: Draft = {
  name: '',
  category: MATERIAL_CATEGORIES[0],
  desc: '',
  quantity: 5,
  status: 'Excelente',
};

interface AddMaterialFormProps {
  existingNames: string[];
  onAdd: (material: Material) => void;
  onCancel: () => void;
}

export function AddMaterialForm({ existingNames, onAdd, onCancel }: AddMaterialFormProps) {
  const [draft, setDraft] = useState<Draft>(EMPTY_DRAFT);
  const update = (patch: Partial<Draft>) => setDraft((prev) => ({ ...prev, ...patch }));

  const name = draft.name.trim();
  // Materials are keyed by name, so duplicates would collide.
  const isDuplicate = existingNames.some((existing) => existing.toLowerCase() === name.toLowerCase());

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!name || isDuplicate) return;
    onAdd({ ...draft, name, desc: draft.desc.trim() || 'Material personalizado añadido', active: true });
    setDraft(EMPTY_DRAFT);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-8 space-y-5 rounded-2xl border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-950/60"
    >
      <h3 className="text-xs font-extrabold tracking-wider text-zinc-900 uppercase dark:text-zinc-100">
        Nuevo equipamiento
      </h3>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <Field label="Nombre del material">
          <Input
            value={draft.name}
            onChange={(event) => update({ name: event.target.value })}
            placeholder="Ej. Bandas elásticas, TRX..."
            aria-invalid={isDuplicate || undefined}
            className="bg-white dark:bg-zinc-900"
            required
          />
          {isDuplicate && (
            <span className="mt-1.5 block text-[10px] font-bold text-red-500">Ya existe un material con ese nombre.</span>
          )}
        </Field>
        <Field label="Categoría">
          <Select
            value={draft.category}
            onChange={(event) => update({ category: event.target.value })}
            options={MATERIAL_CATEGORIES}
            className="bg-white tracking-wider uppercase dark:bg-zinc-900"
          />
        </Field>
        <Field label="Descripción corta" className="md:col-span-2">
          <Input
            value={draft.desc}
            onChange={(event) => update({ desc: event.target.value })}
            placeholder="Ej. Kit de bandas de resistencia de látex"
            className="bg-white dark:bg-zinc-900"
          />
        </Field>
        <Field label="Cantidad disponible">
          <Input
            type="number"
            min={0}
            value={draft.quantity}
            onChange={(event) => update({ quantity: Math.max(0, Number.parseInt(event.target.value, 10) || 0) })}
            className="bg-white dark:bg-zinc-900"
          />
        </Field>
        <Field label="Estado físico">
          <Select
            value={draft.status}
            onChange={(event) => update({ status: event.target.value as MaterialStatus })}
            options={MATERIAL_STATUSES}
            className="bg-white tracking-wider uppercase dark:bg-zinc-900"
          />
        </Field>
      </div>
      <div className="flex justify-end gap-3 pt-3">
        <Button variant="ghost" size="sm" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" size="sm" disabled={!name || isDuplicate}>
          Añadir
        </Button>
      </div>
    </form>
  );
}
