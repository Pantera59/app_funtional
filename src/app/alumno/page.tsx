import type { Metadata } from 'next';
import { KangarooIcon } from '@/components/brand/kangaroo-icon';
import { ThemeToggle } from '@/components/layout/theme-toggle';
import { StudentClassView } from '@/components/student/student-view';
import { Eyebrow } from '@/components/ui/eyebrow';
import { IconTile } from '@/components/ui/icon-tile';

export const metadata: Metadata = { title: 'Alumno' };

/** Outside the coach layout: no navigation, so the QR link only ever shows the class. */
export default function StudentPage() {
  return (
    <>
      <header className="sticky top-0 z-50 border-b border-zinc-150 bg-white/80 backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-900/80">
        <div className="mx-auto flex h-16 max-w-md items-center justify-between gap-3 px-4">
          <span className="flex items-center gap-3 select-none">
            <IconTile size="sm">
              <KangarooIcon />
            </IconTile>
            <span className="flex flex-col">
              <span className="text-sm font-extrabold tracking-tight text-zinc-950 dark:text-zinc-50">Kangaroo Coach</span>
              <Eyebrow tone="brand" className="mt-0.5">
                Tu clase de hoy
              </Eyebrow>
            </span>
          </span>
          <ThemeToggle />
        </div>
      </header>
      <main className="mx-auto max-w-md px-4 pt-6 pb-16">
        <StudentClassView />
      </main>
    </>
  );
}
