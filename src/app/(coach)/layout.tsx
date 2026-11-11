import type { ReactNode } from 'react';
import { RoleGate } from '@/components/auth/role-gate';
import { AppHeader } from '@/components/layout/app-header';
import { LocalModeBanner } from '@/components/layout/local-mode-banner';
import { WodActionBar } from '@/components/layout/wod-action-bar';

/**
 * Coach screens: full navigation, only for coaches and the superadmin.
 * The student views sit outside this group, so students never see these links.
 */
export default function CoachLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <AppHeader />
      <LocalModeBanner />
      <RoleGate area="coach">
        <main className="pb-32">{children}</main>
        <WodActionBar />
      </RoleGate>
    </>
  );
}
