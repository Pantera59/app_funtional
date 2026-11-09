import type { Metadata } from 'next';
import { SimpleHeader } from '@/components/layout/simple-header';
import { StudentClassView } from '@/components/student/student-view';

export const metadata: Metadata = { title: 'Alumno' };

/**
 * Outside the coach layout and public: the QR link opens the class with no account.
 * No navigation, so the link only ever shows the class.
 */
export default function StudentPage() {
  return (
    <>
      <SimpleHeader subtitle="Tu clase de hoy" />
      <main className="mx-auto max-w-md px-4 pt-6 pb-16">
        <StudentClassView />
      </main>
    </>
  );
}
