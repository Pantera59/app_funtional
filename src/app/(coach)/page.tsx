import { KangarooIcon } from '@/components/brand/kangaroo-icon';
import { DashboardWelcome } from '@/components/planner/dashboard-welcome';
import { PlannerWorkspace } from '@/components/planner/planner-workspace';

export default function PlannerPage() {
  return (
    <div className="relative mx-auto max-w-4xl space-y-8 px-4 md:px-6">
      <KangarooIcon className="pointer-events-none absolute top-12 right-8 hidden size-80 text-brand-500 opacity-[0.03] select-none md:block dark:opacity-[0.05]" />
      <PlannerWorkspace welcome={<DashboardWelcome />} />
    </div>
  );
}
