import { Minus, Plus, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Eyebrow } from '@/components/ui/eyebrow';
import { Select } from '@/components/ui/field';
import { Toggle } from '@/components/ui/toggle';
import { cn } from '@/lib/cn';
import { MATERIAL_STATUSES } from '@/lib/domain/constants';
import type { Material, MaterialStatus } from '@/lib/domain/types';

const STATUS_TONE: Record<MaterialStatus, string> = {
  Excelente: 'text-emerald-600 dark:text-emerald-400',
  Desgastado: 'text-brand-600 dark:text-brand-400',
  Mantenimiento: 'text-rose-600 dark:text-rose-400',
};

const QUANTITY_STEPS = [
  { delta: -1, icon: Minus, label: 'Restar uno' },
  { delta: 1, icon: Plus, label: 'Sumar uno' },
];

interface MaterialCardProps {
  material: Material;
  onChange: (patch: Partial<Material>) => void;
  /** Omitted for built-in materials, which cannot be deleted. */
  onDelete?: () => void;
}

export function MaterialCard({ material, onChange, onDelete }: MaterialCardProps) {
  const stepButtons = QUANTITY_STEPS.map(({ delta, icon: Icon, label }) => (
    <button
      key={delta}
      type="button"
      aria-label={`${label}: ${material.name}`}
      onClick={() => onChange({ quantity: Math.max(0, material.quantity + delta) })}
      className="flex size-6 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-900 shadow-xs transition-colors hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
    >
      <Icon className="size-3" strokeWidth={3} />
    </button>
  ));

  return (
    <article
      className={cn(
        'flex flex-col justify-between gap-5 rounded-2xl border p-6 transition-all',
        material.active
          ? 'border-brand-500/30 bg-white shadow-md shadow-zinc-100 dark:bg-zinc-900 dark:shadow-none'
          : 'border-zinc-200 bg-zinc-50 opacity-60 hover:opacity-85 dark:border-zinc-800/80 dark:bg-zinc-950/40',
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="text-sm font-extrabold tracking-tight text-zinc-950 dark:text-zinc-50">{material.name}</h4>
            <Badge size="sm">{material.category}</Badge>
          </div>
          <p className="mt-2 text-xs leading-relaxed font-medium text-zinc-500 dark:text-zinc-400">{material.desc}</p>
        </div>
        <Toggle
          checked={material.active}
          onToggle={() => onChange({ active: !material.active })}
          label={`Disponible hoy: ${material.name}`}
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-zinc-100 pt-4 dark:border-zinc-800/60">
        <label className="flex items-center gap-2">
          <Eyebrow>Estado</Eyebrow>
          <Select
            value={material.status}
            onChange={(event) => onChange({ status: event.target.value as MaterialStatus })}
            options={MATERIAL_STATUSES}
            className={cn('w-auto px-2.5 py-1.5 text-[10px] tracking-wider uppercase', STATUS_TONE[material.status])}
          />
        </label>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-1.5 dark:border-zinc-800 dark:bg-zinc-950">
            <Eyebrow size="xs">Cant.</Eyebrow>
            {stepButtons[0]}
            <span className="min-w-5 text-center text-xs font-bold tabular-nums text-zinc-900 dark:text-zinc-100">
              {material.quantity}
            </span>
            {stepButtons[1]}
          </div>
          {onDelete && (
            <button
              type="button"
              onClick={onDelete}
              aria-label={`Eliminar ${material.name} del inventario`}
              className="rounded-xl border border-zinc-200 bg-zinc-100 p-2 text-red-500 transition-all hover:bg-red-50 dark:border-zinc-800 dark:bg-zinc-850 dark:hover:bg-red-950/20"
            >
              <Trash2 className="size-3.5" />
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
