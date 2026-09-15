# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Kangaroo Coach ("WOD Studio") is a Next.js 16 App Router app for planning group functional-training classes (WODs), managing an equipment inventory, and running a class from coach and student screens. The UI and most domain terms are in Spanish. The product context is in `docs/PRD.md`.

There is no backend: all state lives in the browser's `localStorage`. Hosting target is Vercel (Hobby).

## Commands (pnpm)

- `pnpm install`
- `pnpm dev`: dev server on :3000. Use `pnpm dev --hostname 0.0.0.0` to open it from a phone on the LAN (needed to test the QR code).
- `pnpm build` / `pnpm start`: production build and serve. Every route should report `○ (Static)`.
- `pnpm lint`: ESLint (flat config from `eslint-config-next`).
- `pnpm typecheck`: `tsc --noEmit`. Needs `next-env.d.ts`, which `next dev`/`next build` generate.
- `pnpm test`: Vitest, pure domain logic only (`src/**/*.test.ts`).
- Single test: `pnpm vitest run src/lib/domain/plan-rules.test.ts` or `pnpm vitest run -t "applies only once"`.
- `pnpm assets:exercises`: re-downloads exercise photos into `public/exercises/`. This is a one-off script; the images are committed.

## Architecture

- **Routes** (`src/app`): `/` planner, `/materiales` inventory, `/coach` timer, `/alumno` student view.
  - Pages and `layout.tsx` are server components that render static shells.
  - Interactive parts are client components under `src/components/<feature>`.
  - Static content is passed into client components as props or children (e.g. `DashboardWelcome` → `KangarooDashboard`'s `welcome` prop) so it stays out of the client bundle.
  - `template.tsx` gives page transitions with a CSS keyframe (`animate-page-in`), not JavaScript.
- **State** (`src/providers/app-state-provider.tsx`):
  - One context holds `plan`, `materials` and the actions (`generatePlan`, `activatePlanB`, `updateBlockNote`, `setMaterials`).
  - Persistence uses `useLocalStorage` (`src/hooks/use-local-storage.ts`), built on `useSyncExternalStore`. The server and hydration render the initial value, then the client swaps in stored data.
  - Anything that depends on stored data must wait for the client: use `useIsClient()` or render inside `<PlanGate>`. Otherwise saved data flashes as empty on the first render.
  - `useCurrentPlan()` is only valid under `<PlanGate>`.
  - The `STORAGE_KEYS` values are kept from the old Vite app, so existing browser data still loads. The provider migrates the legacy `available_materials` list.
- **Domain** (`src/lib/domain`) is pure TypeScript, has no React, and is unit-tested:
  - `generate-workout.ts`: `generateWorkout(options, deps)`. `deps` injects `history`, `random`, `createId` and `now`.
    - A plan always has 4 blocks: Calentamiento 10, Fuerza 20, Metabólico 20, Cierre 10.
    - `focus` picks the strength pattern (Lower → Squat, Upper → Push, Full → Hinge).
    - `limitedEquipment` switches formats to `A/B` and `Parejas 1:1`.
    - Exercises are filtered by active material names, matched case-insensitively against `equipmentNeeded`. Bodyweight is always allowed and is the fallback.
    - Exercises from the last `HISTORY_SIZE` (3) plans are avoided. The provider stores that history.
    - Only the first matching restriction swap is applied.
  - `exercises.ts`: the exercise catalogue.
    - **Order matters**, because the generator often takes the first match.
    - `swaps(name, overrides)` fills restriction swaps that keep the same exercise.
  - `plan-rules.ts`: Plan B (−30% on `Metabólico` blocks, once per plan) and note updates.
  - `constants.ts`: the single source for restrictions, focus options, material categories and statuses, default materials, Plan B thresholds and storage keys. Types in `types.ts` are derived from these `as const` arrays.
  - String unions are matched by exact value, including accents (`'Metabólico'`).
- **UI kit** (`src/components/ui`):
  - Components are built with `class-variance-authority` and `cn()` (`clsx` + `tailwind-merge`).
  - Reuse `Button`/`ButtonLink`, `Card` (`panel`/`section`/`tile`/`inset`), `Eyebrow`, `Field` + `Input`/`Select`/`Textarea`, `SegmentedControl` (its `segmentVariants` also style the nav links), `Modal`, `Badge`, `IconTile`, `PanelHeader`, `EmptyState`.
  - Don't reintroduce long inline class strings for these patterns.
  - Workout-specific shared pieces live in `src/components/workout` (`BlockHeader`, `BlockMetaBadge`, `ExerciseSummary`, `CheckableExercise`, `CoachNotesField`, `PlanGate`). They are used by the planner, coach and student views.
- **Styling**: Tailwind v4 via `@tailwindcss/postcss`, with no config file; everything is in `src/app/globals.css`.
  - `brand-*` colors alias amber, so the brand color can be changed in one place.
  - `zinc-150` and `zinc-850` are custom shades.
  - Dark mode is class-based (`@custom-variant dark`). An inline script in `layout.tsx` applies the saved theme before paint, and `ThemeToggle` toggles the class in its click handler, not in an effect.
- **Local assets only**: exercise images are served from `public/exercises/` through `next/image`, and the QR code is generated on the device with `qrcode.react`. Don't add runtime requests to external hosts. `videoUrl` values exist in the data but are not rendered.

## Known limitations

- A plan lives only on the device that generated it, so the student QR code does not share it with other phones. Cross-device sharing is Phase 2 in `docs/PRD.md`.
- The coach clock is a demo simulation that advances one class minute per real second.
