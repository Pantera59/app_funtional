'use client';

import { BookOpen, ChevronDown, LayoutDashboard, Sparkles } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Eyebrow } from '@/components/ui/eyebrow';
import { IconTile } from '@/components/ui/icon-tile';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { cn } from '@/lib/cn';
import { STORAGE_KEYS } from '@/lib/domain/constants';
import { getSessionSuggestions } from '@/lib/domain/suggestions';
import type { Focus, Restriction } from '@/lib/domain/types';

interface KangarooDashboardProps {
  /** Server-rendered welcome content. */
  welcome: ReactNode;
  focus: Focus;
  restrictions: Restriction[];
  materialCount: number;
}

export function KangarooDashboard({ welcome, focus, restrictions, materialCount }: KangarooDashboardProps) {
  const [openByDefault, setOpenByDefault] = useLocalStorage(STORAGE_KEYS.dashboardDefault, true);
  const [openOverride, setOpenOverride] = useState<boolean | null>(null);
  const isOpen = openOverride ?? openByDefault;

  const suggestions = getSessionSuggestions({ focus, restrictions, materialCount });
  const summary = [
    { label: 'Enfoque seleccionado', value: focus },
    { label: 'Materiales disponibles', value: `${materialCount} activos`, highlight: true },
    { label: 'Restricciones activadas', value: restrictions.length || 'Ninguna' },
  ];

  return (
    <Card variant="section" className="shadow-xl shadow-zinc-100/50 dark:shadow-none">
      <div className="flex items-center justify-between gap-4 border-b border-zinc-100 bg-zinc-50/50 p-5 dark:border-zinc-800 dark:bg-zinc-950/20">
        <button
          type="button"
          onClick={() => setOpenOverride(!isOpen)}
          aria-expanded={isOpen}
          className="flex min-w-0 flex-1 items-center gap-3 text-left"
        >
          <IconTile tone="tint">
            <LayoutDashboard />
          </IconTile>
          <span className="min-w-0">
            <span className="block text-xs font-black tracking-wider text-zinc-900 uppercase dark:text-zinc-50">
              Bienvenida y sugerencias de clase
            </span>
            <Eyebrow size="xs" className="mt-0.5 tracking-widest">
              Kangaroo Coach Hub y guía de inicio
            </Eyebrow>
          </span>
          <ChevronDown
            className={cn('ml-auto size-4 shrink-0 text-zinc-400 transition-transform', isOpen && 'rotate-180')}
          />
        </button>
        <button
          type="button"
          onClick={() => setOpenByDefault(!openByDefault)}
          aria-pressed={openByDefault}
          title="Define si este panel se muestra abierto al cargar la página"
          className={cn(
            'hidden items-center gap-1.5 rounded-xl border px-3 py-1.5 text-[9px] font-bold tracking-wider uppercase transition-all sm:flex',
            openByDefault
              ? 'border-brand-500/30 bg-brand-500/10 text-brand-600 dark:text-brand-400'
              : 'border-zinc-200 bg-zinc-100 text-zinc-400 dark:border-zinc-800 dark:bg-zinc-950',
          )}
        >
          <span className={cn('size-1.5 rounded-full', openByDefault ? 'bg-brand-500' : 'bg-zinc-400')} />
          {openByDefault ? 'Abierto al iniciar' : 'Cerrado al iniciar'}
        </button>
      </div>

      {isOpen && (
        <div className="space-y-8 p-6 md:p-8">
          {welcome}

          <div className="border-t border-zinc-100 pt-6 dark:border-zinc-800">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h4 className="flex items-center gap-2 text-xs font-black tracking-wider text-zinc-900 uppercase dark:text-zinc-50">
                <BookOpen className="size-4 text-brand-500" /> Análisis de sesión y sugerencias
              </h4>
              <Badge>Motor de reglas</Badge>
            </div>

            <div className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-3">
              {summary.map((item) => (
                <Card key={item.label} variant="inset" className="text-center">
                  <Eyebrow size="xs" className="text-[8px] tracking-widest">
                    {item.label}
                  </Eyebrow>
                  <span
                    className={cn(
                      'mt-1 block text-xs font-black tracking-wider uppercase',
                      item.highlight ? 'text-brand-600 dark:text-brand-400' : 'text-zinc-900 dark:text-zinc-100',
                    )}
                  >
                    {item.value}
                  </span>
                </Card>
              ))}
            </div>

            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {suggestions.map((suggestion) => (
                <li
                  key={suggestion.title}
                  className="space-y-1 rounded-2xl border border-brand-500/10 bg-brand-500/[0.03] p-4 dark:border-brand-500/5"
                >
                  <span className="flex items-center gap-1.5 text-[10px] font-black tracking-wider text-brand-600 uppercase dark:text-brand-400">
                    <Sparkles className="size-3.5" /> {suggestion.title}
                  </span>
                  <p className="text-[11px] leading-relaxed font-medium text-zinc-600 dark:text-zinc-400">
                    {suggestion.text}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </Card>
  );
}
