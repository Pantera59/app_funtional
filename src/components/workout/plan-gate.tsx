'use client';

import { CalendarPlus } from 'lucide-react';
import type { ReactNode } from 'react';
import { ButtonLink } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { useIsClient } from '@/hooks/use-is-client';
import { useAppState } from '@/providers/app-state-provider';

interface PlanGateProps {
  emptyTitle: string;
  emptyDescription: string;
  children: ReactNode;
}

/** Renders children only when a plan exists; the plan lives in localStorage, so this waits for the client. */
export function PlanGate({ emptyTitle, emptyDescription, children }: PlanGateProps) {
  const { plan } = useAppState();
  const isClient = useIsClient();

  if (!isClient) return <div className="min-h-[50vh]" aria-busy="true" />;

  if (!plan) {
    return (
      <EmptyState
        icon={<CalendarPlus />}
        title={emptyTitle}
        description={emptyDescription}
        action={<ButtonLink href="/">Ir al planificador</ButtonLink>}
      />
    );
  }

  return children;
}
