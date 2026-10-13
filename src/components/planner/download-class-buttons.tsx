'use client';

import { FileDown, FileText } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { download } from '@/lib/download';
import { buildClassText, classFileName } from '@/lib/domain/export-class';
import type { WorkoutPlan } from '@/lib/domain/types';

/** Downloads the class as an editable Word or text file, with the current notes. */
export function DownloadClassButtons({ plan }: { plan: WorkoutPlan }) {
  const [preparing, setPreparing] = useState(false);

  async function downloadWord() {
    setPreparing(true);
    try {
      const { buildClassDocx } = await import('@/lib/export/class-docx');
      download(classFileName(plan, 'docx'), await buildClassDocx(plan));
    } finally {
      setPreparing(false);
    }
  }

  return (
    <>
      <Button variant="secondary" className="w-full sm:w-auto" onClick={downloadWord} disabled={preparing}>
        <FileDown className="size-4" /> {preparing ? 'Preparando…' : 'Descargar Word'}
      </Button>
      <Button
        variant="secondary"
        className="w-full sm:w-auto"
        onClick={() => download(classFileName(plan, 'txt'), buildClassText(plan), 'text/plain;charset=utf-8')}
      >
        <FileText className="size-4" /> Descargar texto
      </Button>
    </>
  );
}
