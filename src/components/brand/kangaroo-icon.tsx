import { cn } from '@/lib/cn';

/** Geometric, front-facing kangaroo head used as the brand mark. */
export function KangarooIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={cn('size-6', className)} fill="none" aria-hidden="true">
      <g fill="currentColor">
        {/* Forehead and snout */}
        <path d="M50 26 L42 29 L45 42 L46 56 L50 62 L54 56 L55 42 L58 29 Z" />
        {/* Ears: outer and inner blades */}
        <path d="M34 26 L5 1 L20 14 L30 22 Z" />
        <path d="M44 23 L23 8 L29 17 L36 21 Z" />
        <path d="M66 26 L95 1 L80 14 L70 22 Z" />
        <path d="M56 23 L77 8 L71 17 L64 21 Z" />
        {/* Brows */}
        <path d="M25 36 L36 41 L27 39 Z" />
        <path d="M75 36 L64 41 L73 39 Z" />
        {/* Cheeks */}
        <path d="M28 39 L38 42 L40 54 L35 52 Z" />
        <path d="M72 39 L62 42 L60 54 L65 52 Z" />
        {/* Chin */}
        <path d="M46 61 L50 66 L54 61 L50 62 Z" />
        {/* Chest and collar */}
        <path d="M50 74 L36 56 L15 80 L50 100 Z" />
        <path d="M50 74 L64 56 L85 80 L50 100 Z" />
      </g>
    </svg>
  );
}
