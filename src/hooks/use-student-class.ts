'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';
import {
  decodeStudentClass,
  encodeStudentClass,
  STUDENT_CLASS_PARAM,
  toStudentClass,
  type StudentClass,
} from '@/lib/domain/student-class';
import type { WorkoutPlan } from '@/lib/domain/types';

const subscribeToHash = (onChange: () => void) => {
  window.addEventListener('hashchange', onChange);
  return () => window.removeEventListener('hashchange', onChange);
};

/** The class carried in `/alumno#c=...`, or undefined when the link has none. */
const useHashParam = () =>
  useSyncExternalStore(
    subscribeToHash,
    () => new URLSearchParams(window.location.hash.slice(1)).get(STUDENT_CLASS_PARAM) ?? undefined,
    () => undefined,
  );

export type SharedClassState =
  | { status: 'none' }
  | { status: 'loading' }
  | { status: 'invalid' }
  | { status: 'ready'; studentClass: StudentClass };

/** Decodes the class from the QR link, so it opens on phones that never generated it. */
export function useSharedClass(): SharedClassState {
  const encoded = useHashParam();
  const [decoded, setDecoded] = useState<{ encoded: string; studentClass: StudentClass | null } | null>(null);

  useEffect(() => {
    if (!encoded) return;
    let cancelled = false;
    decodeStudentClass(encoded).then((studentClass) => {
      if (!cancelled) setDecoded({ encoded, studentClass });
    });
    return () => {
      cancelled = true;
    };
  }, [encoded]);

  if (!encoded) return { status: 'none' };
  if (decoded?.encoded !== encoded) return { status: 'loading' };
  return decoded.studentClass ? { status: 'ready', studentClass: decoded.studentClass } : { status: 'invalid' };
}

/** Absolute `/alumno#c=...` link for the plan, or null while it is being encoded. */
export function useStudentLink(plan: WorkoutPlan) {
  const [link, setLink] = useState<{ plan: WorkoutPlan; url: string } | null>(null);

  useEffect(() => {
    let cancelled = false;
    encodeStudentClass(toStudentClass(plan)).then((encoded) => {
      const url = new URL('/alumno', window.location.origin);
      url.hash = `${STUDENT_CLASS_PARAM}=${encoded}`;
      if (!cancelled) setLink({ plan, url: url.toString() });
    });
    return () => {
      cancelled = true;
    };
  }, [plan]);

  return link?.plan === plan ? link.url : null;
}
