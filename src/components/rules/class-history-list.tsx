'use client';

import { format } from 'date-fns';
import { History, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { Eyebrow } from '@/components/ui/eyebrow';
import { useAppState } from '@/providers/app-state-provider';

export function ClassHistoryList() {
  const { classHistory, clearClassHistory, rulesProfile } = useAppState();

  if (classHistory.length === 0) {
    return (
      <EmptyState
        icon={<History />}
        title="Sin clases registradas"
        description="Cada clase generada en modo funcional se guarda aquí para aplicar la regla de rotación."
      />
    );
  }

  const clear = () => {
    if (window.confirm('¿Borrar todo el historial de clases? La regla de rotación empezará de cero.')) clearClassHistory();
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
          {classHistory.length} clases guardadas. La rotación mira las últimas {rulesProfile.rotation.lookbackClasses}.
        </p>
        <Button variant="secondary" size="sm" onClick={clear}>
          <Trash2 className="size-3.5" /> Borrar historial
        </Button>
      </div>

      <ol className="space-y-4">
        {[...classHistory].reverse().map((record) => (
          <li key={record.id}>
            <Card variant="tile" className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone="solid">Clase {record.classNumber}</Badge>
                <Badge tone="brand">{record.focus}</Badge>
                <Eyebrow>{format(new Date(record.date), 'dd/MM/yyyy HH:mm')}</Eyebrow>
              </div>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                <strong>Material:</strong> {record.materials.join(', ') || 'solo peso corporal'}
              </p>
              <dl className="space-y-2">
                {record.blocks.map((block) => (
                  <div key={block.key} className="text-xs">
                    <dt className="font-extrabold text-zinc-900 dark:text-zinc-100">
                      {block.name} · {block.minutes}&apos;
                    </dt>
                    <dd className="mt-0.5 text-zinc-500 dark:text-zinc-400">{block.exercises.join(' · ')}</dd>
                  </div>
                ))}
              </dl>
            </Card>
          </li>
        ))}
      </ol>
    </div>
  );
}
