import type { ReactNode } from 'react';
import { Card } from './card';
import { IconTile } from './icon-tile';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <Card className="mx-auto flex max-w-md flex-col items-center gap-4 text-center">
      {icon && <IconTile size="lg">{icon}</IconTile>}
      <h2 className="text-base font-black tracking-tight text-zinc-950 dark:text-zinc-50">{title}</h2>
      {description && <p className="text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">{description}</p>}
      {action}
    </Card>
  );
}
