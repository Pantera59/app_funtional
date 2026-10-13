import type { Metadata } from 'next';
import { RulesManager } from '@/components/rules/rules-manager';

export const metadata: Metadata = { title: 'Reglas de planeación' };

export default function RulesPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 md:px-6">
      <RulesManager />
    </div>
  );
}
