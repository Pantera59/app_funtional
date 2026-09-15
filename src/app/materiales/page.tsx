import type { Metadata } from 'next';
import { MaterialsManager } from '@/components/materials/materials-manager';

export const metadata: Metadata = { title: 'Materiales' };

export default function MaterialsPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 md:px-6">
      <MaterialsManager />
      <aside className="flex items-center gap-4 rounded-2xl border border-zinc-150 bg-zinc-100/50 p-5 dark:border-zinc-800/80 dark:bg-zinc-900/40">
        <span className="size-2.5 shrink-0 rounded-full bg-brand-500" />
        <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
          <strong>Peso corporal (bodyweight):</strong> siempre está activo en el motor de generación para asegurar la
          máxima biomecánica funcional independientemente de la carga externa.
        </p>
      </aside>
    </div>
  );
}
