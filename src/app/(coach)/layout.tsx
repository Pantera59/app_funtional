import type { ReactNode } from 'react';
import { AppHeader } from '@/components/layout/app-header';
import { WodActionBar } from '@/components/layout/wod-action-bar';

/** Coach screens: full navigation. The student view sits outside this group, so students only see their class. */
export default function CoachLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <AppHeader />
      <main className="pb-32">{children}</main>
      <WodActionBar />
    </>
  );
}
