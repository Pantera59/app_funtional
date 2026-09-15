import { MUSCLE_FOCUS, MUSCLE_OVERLAYS, type MuscleRegion } from '@/lib/domain/muscles';
import type { MovementPattern } from '@/lib/domain/types';
import { Eyebrow } from '@/components/ui/eyebrow';

const REGIONS_IN_PAINT_ORDER = Object.keys(MUSCLE_OVERLAYS) as MuscleRegion[];

export function MuscleAnatomyVisualizer({ pattern }: { pattern: MovementPattern }) {
  const { muscles, description, regions } = MUSCLE_FOCUS[pattern];
  const highlighted = REGIONS_IN_PAINT_ORDER.filter((region) => regions.includes(region));

  return (
    <div className="relative flex flex-col items-center gap-4 overflow-hidden rounded-2xl border border-zinc-200/50 bg-zinc-100 p-4 shadow-inner sm:flex-row dark:border-zinc-800/80 dark:bg-zinc-950">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(#e4e4e7_1px,transparent_1px)] [background-size:16px_16px] opacity-60 dark:bg-[radial-gradient(#18181b_1px,transparent_1px)]"
      />

      <div className="relative flex h-56 w-36 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-zinc-200/60 bg-white p-2 shadow-sm dark:border-zinc-800/60 dark:bg-zinc-900">
        <svg
          viewBox="0 0 100 160"
          role="img"
          aria-label={`Músculos trabajados: ${muscles.join(', ')}`}
          className="size-full text-zinc-300 drop-shadow-md dark:text-zinc-700"
        >
          {/* Body silhouette */}
          <g fill="currentColor">
            <circle cx="50" cy="20" r="8" opacity="0.4" />
            <path d="M46,26 C46,26 44,32 50,32 C56,32 54,26 54,26 Z" opacity="0.5" />
            <path d="M38,36 C34,42 34,60 38,72 C42,76 58,76 62,72 C66,60 66,42 62,36 C57,33 43,33 38,36 Z" opacity="0.3" />
            <path d="M36,36 C33,38 29,48 29,56 C29,62 31,68 33,72 C34,72 36,66 36,56 Z" opacity="0.35" />
            <path d="M64,36 C67,38 71,48 71,56 C71,62 69,68 67,72 C66,72 64,66 64,56 Z" opacity="0.35" />
            <path d="M38,72 C38,72 36,88 41,92 C46,95 54,95 59,92 C64,88 62,72 62,72 Z" opacity="0.4" />
            <path d="M39,92 C36,104 35,116 39,124 C41,124 43,118 43,108 C43,98 44,94 44,92 Z" opacity="0.3" />
            <circle cx="41" cy="126" r="3" opacity="0.5" />
            <path d="M39,128 C36,134 37,144 41,152 C43,152 44,142 43,132 Z" opacity="0.3" />
            <path d="M61,92 C64,104 65,116 61,124 C59,124 57,118 57,108 C57,98 56,94 56,92 Z" opacity="0.3" />
            <circle cx="59" cy="126" r="3" opacity="0.5" />
            <path d="M61,128 C64,134 63,144 59,152 C57,152 56,142 57,132 Z" opacity="0.3" />
          </g>

          {highlighted.map((region) => (
            <g
              key={region}
              opacity={MUSCLE_OVERLAYS[region].opacity}
              className="animate-pulse fill-red-500 motion-reduce:animate-none dark:fill-red-600"
            >
              {MUSCLE_OVERLAYS[region].paths.map((d) => (
                <path key={d} d={d} />
              ))}
            </g>
          ))}
        </svg>
      </div>

      <div className="relative w-full flex-1 space-y-2 text-left">
        <Eyebrow tone="danger" size="xs" className="text-[8px] tracking-widest">
          Grupo muscular objetivo
        </Eyebrow>
        <ul className="flex flex-wrap gap-1.5">
          {muscles.map((muscle) => (
            <li
              key={muscle}
              className="rounded-md border border-red-500/20 bg-red-500/10 px-2 py-0.5 text-[9px] font-black tracking-wider text-red-600 uppercase dark:bg-red-500/15 dark:text-red-400"
            >
              {muscle}
            </li>
          ))}
        </ul>
        <p className="text-[11px] leading-relaxed font-medium text-zinc-600 dark:text-zinc-400">{description}</p>
      </div>
    </div>
  );
}
