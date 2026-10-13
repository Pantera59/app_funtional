import type { Metadata } from 'next';
import { CoachTimer } from '@/components/coach/coach-timer';
import { PlanGate } from '@/components/workout/plan-gate';

export const metadata: Metadata = { title: 'Coach' };

export default function CoachPage() {
  return (
    <div className="mx-auto max-w-md px-4">
      <PlanGate
        emptyTitle="Aún no hay clase generada"
        emptyDescription="Genera un WOD en el planificador para controlar el tiempo y los bloques desde aquí."
      >
        <CoachTimer />
      </PlanGate>
    </div>
  );
}
