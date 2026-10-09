'use client';

import { Check, Copy, FileJson, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Eyebrow } from '@/components/ui/eyebrow';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';
import { EXPORT_RECENT_CLASSES } from '@/lib/domain/functional/constants';
import { buildRulesJson, buildRulesMarkdown } from '@/lib/domain/functional/export-rules';
import { useAppState } from '@/providers/app-state-provider';

/** Saves text as a file on the device; nothing leaves the browser. */
function download(filename: string, content: string, type: string) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function RulesExportPanel() {
  const { rulesProfile, exerciseBank, classHistory, activeMaterialNames } = useAppState();
  const { copied, copy } = useCopyToClipboard();

  const markdown = buildRulesMarkdown(rulesProfile, exerciseBank, classHistory, activeMaterialNames);

  return (
    <Card variant="tile" className="space-y-5">
      <div>
        <h3 className="text-sm font-extrabold tracking-tight text-zinc-950 dark:text-zinc-50">Exportar contexto para IA</h3>
        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
          Incluye tu perfil de reglas, el banco de ejercicios activos y las últimas {EXPORT_RECENT_CLASSES} clases. Pégalo
          en un chat con Claude para pedir una clase más elaborada sin volver a explicar todo.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button onClick={() => copy(markdown)}>
          {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
          {copied ? 'Copiado' : 'Copiar Markdown'}
        </Button>
        <Button variant="secondary" onClick={() => download('reglas-planeacion.md', markdown, 'text/markdown')}>
          <FileText className="size-4" /> Descargar .md
        </Button>
        <Button
          variant="secondary"
          onClick={() =>
            download('reglas-planeacion.json', buildRulesJson(rulesProfile, exerciseBank, classHistory), 'application/json')
          }
        >
          <FileJson className="size-4" /> Descargar .json
        </Button>
      </div>

      <div>
        <Eyebrow className="mb-2">Vista previa</Eyebrow>
        <pre className="max-h-[60vh] overflow-auto rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-[11px] leading-relaxed whitespace-pre-wrap text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300">
          {markdown}
        </pre>
      </div>
    </Card>
  );
}
