import type { Metadata } from 'next';
import { StudentView } from '@/components/student/student-view';
import { PlanGate } from '@/components/workout/plan-gate';

export const metadata: Metadata = { title: 'Alumno' };

export default function StudentPage() {
  return (
    <div className="mx-auto max-w-md px-4">
      <PlanGate
        emptyTitle="Todavía no hay WOD en este dispositivo"
        emptyDescription="La clase se guarda en el dispositivo donde se generó. Pide a tu coach que la muestre en su pantalla o genérala desde el planificador."
      >
        <StudentView />
      </PlanGate>
    </div>
  );
}
