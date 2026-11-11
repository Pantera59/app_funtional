import type { Metadata } from 'next';
import { RoleGate } from '@/components/auth/role-gate';
import { UsersManager } from '@/components/users/users-manager';

export const metadata: Metadata = { title: 'Usuarios y roles' };

export default function UsersPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 md:px-6">
      {/* The coach layout already admits admins; this page is superadmin only. */}
      <RoleGate area="users">
        <UsersManager />
      </RoleGate>
    </div>
  );
}
