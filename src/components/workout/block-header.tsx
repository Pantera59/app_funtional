import type { ReactNode } from 'react';
import { Badge } from '@/components/ui/badge';
import { Eyebrow } from '@/components/ui/eyebrow';
import type { WorkoutBlock } from '@/lib/domain/types';
import { formatMinutes } from '@/lib/format';

interface BlockHeaderProps {
  label: string;
  title: string;
  active?: boolean;
  aside?: ReactNode;
}

export function BlockHeader({ label, title, active = false, aside }: BlockHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-zinc-100 bg-zinc-50/50 p-5 dark:border-zinc-800 dark:bg-zinc-950/20">
      <div className="min-w-0">
        <Eyebrow tone={active ? 'brand' : 'muted'}>{label}</Eyebrow>
        <h3 className="mt-1 text-sm font-extrabold tracking-tight text-zinc-900 uppercase dark:text-zinc-100">{title}</h3>
      </div>
      {aside}
    </div>
  );
}

/** "20:00 MIN • AMRAP" */
export function BlockMetaBadge({ block }: { block: WorkoutBlock }) {
  return (
    <Badge className="self-start sm:self-auto">
      {formatMinutes(block.durationMinutes)} min • {block.format}
    </Badge>
  );
}
