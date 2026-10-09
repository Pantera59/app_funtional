'use client';

import { FileDown } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { PanelHeader } from '@/components/ui/panel-header';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { useIsClient } from '@/hooks/use-is-client';
import { ClassHistoryList } from './class-history-list';
import { ExerciseBankEditor } from './exercise-bank-editor';
import { ProfileEditor } from './profile-editor';
import { RulesExportPanel } from './rules-export-panel';

type RulesTab = 'perfil' | 'banco' | 'historial' | 'exportar';

const TABS = [
  { value: 'perfil', label: 'Perfil' },
  { value: 'banco', label: 'Banco' },
  { value: 'historial', label: 'Historial' },
  { value: 'exportar', label: 'Exportar' },
] as const;

export function RulesManager() {
  const [tab, setTab] = useState<RulesTab>('perfil');
  // Every tab reads stored data, so wait for the client instead of flashing the defaults.
  const isClient = useIsClient();

  return (
    <>
      <Card accent>
        <PanelHeader
          title="Reglas de planeación"
          subtitle="Lo que el modo funcional respeta en cada clase"
          actions={
            <Button onClick={() => setTab('exportar')}>
              <FileDown className="size-4" /> Exportar reglas
            </Button>
          }
        />
        <SegmentedControl
          label="Sección de reglas"
          items={TABS}
          value={tab}
          onChange={setTab}
          className="mt-6 w-full overflow-x-auto sm:w-fit"
        />
      </Card>

      {!isClient ? (
        <div className="min-h-[50vh]" aria-busy="true" />
      ) : (
        <>
          {tab === 'perfil' && <ProfileEditor />}
          {tab === 'banco' && <ExerciseBankEditor />}
          {tab === 'historial' && <ClassHistoryList />}
          {tab === 'exportar' && <RulesExportPanel />}
        </>
      )}
    </>
  );
}
