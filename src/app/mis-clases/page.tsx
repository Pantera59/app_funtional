import type { Metadata } from 'next';
import { RoleGate } from '@/components/auth/role-gate';
import { PublishedClasses } from '@/components/classes/published-classes';
import { AccountMenu } from '@/components/layout/account-menu';
import { SimpleHeader } from '@/components/layout/simple-header';

export const metadata: Metadata = { title: 'Mis clases' };

/** Students' home: the classes their coach published. Coaches see the same list with management controls. */
export default function MyClassesPage() {
  return (
    <>
      <SimpleHeader subtitle="Mis clases" actions={<AccountMenu />} className="max-w-2xl" />
      <main className="mx-auto max-w-2xl px-4 pt-6 pb-16">
        <RoleGate area="classes">
          <PublishedClasses />
        </RoleGate>
      </main>
    </>
  );
}
