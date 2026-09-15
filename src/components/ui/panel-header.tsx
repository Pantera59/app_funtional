import type { ReactNode } from 'react';
import { KangarooIcon } from '@/components/brand/kangaroo-icon';
import { Eyebrow } from './eyebrow';
import { IconTile } from './icon-tile';

interface PanelHeaderProps {
  title: string;
  subtitle: string;
  icon?: ReactNode;
  actions?: ReactNode;
}

export function PanelHeader({ title, subtitle, icon = <KangarooIcon />, actions }: PanelHeaderProps) {
  return (
    <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
      <div className="flex items-center gap-4">
        <IconTile tone="soft" size="lg">
          {icon}
        </IconTile>
        <div>
          <h2 className="text-lg font-black tracking-tight text-zinc-950 dark:text-zinc-50">{title}</h2>
          <Eyebrow className="mt-1 text-xs">{subtitle}</Eyebrow>
        </div>
      </div>
      {actions && <div className="flex w-full flex-wrap gap-3 md:w-auto">{actions}</div>}
    </div>
  );
}
