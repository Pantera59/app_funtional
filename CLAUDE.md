# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Kangaroo Coach ("WOD Studio") is a Next.js 16 App Router app for planning group functional-training classes (WODs), managing an equipment inventory, and running a class from coach and student screens. The UI and most domain terms are in Spanish. The product context is in `docs/PRD.md`.

Accounts, roles and shared data use Supabase (auth + Postgres with Row Level Security), called from the browser. Without `NEXT_PUBLIC_SUPABASE_URL`/`NEXT_PUBLIC_SUPABASE_ANON_KEY` the app runs in **local mode**: no accounts, everything in `localStorage`, as before. Setup steps are in `docs/SUPABASE.md`; the schema is `supabase/migrations/0001_auth_roles.sql`. Hosting target is Vercel (Hobby).

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

- **Routes** (`src/app`): `/` planner, `/materiales` inventory, `/reglas` planning rules, `/coach` timer, `/usuarios` users and roles, `/alumno` QR student view, `/mis-clases` published classes, `/login`.
  - The coach routes live in the `(coach)` route group, whose layout adds the header, nav and `WodActionBar`, and wraps the page in `<RoleGate area="coach">`. `/alumno`, `/mis-clases` and `/login` sit outside it with `SimpleHeader` and no coach links.
  - Pages and `layout.tsx` are server components that render static shells.
  - Interactive parts are client components under `src/components/<feature>`.
  - Static content is passed into client components as props or children (e.g. `DashboardWelcome` → `KangarooDashboard`'s `welcome` prop) so it stays out of the client bundle.
  - `template.tsx` gives page transitions with a CSS keyframe (`animate-page-in`), not JavaScript.
- **Auth and roles**:
  - Roles (`src/lib/auth/roles.ts`, same values as the `app_role` enum): `superadmin` (users + everything), `admin` (shown as "Coach": the whole coach area), `usuario` (shown as "Alumno": only `/mis-clases`). `canAccess(role, area)` is the single permission table.
  - `AuthProvider` (`src/providers/auth-provider.tsx`) holds the session and the `profiles` row. Its status is `local` when Supabase isn't configured.
  - `RoleGate` is UX only: it redirects to `/login?next=` or the role's home. The real protection is RLS in the migration. Any new table needs RLS policies.
  - The first account to sign up becomes superadmin (DB trigger). Only a superadmin changes roles, and the last superadmin can't be demoted.
  - Auth runs on the client, so every route stays `○ (Static)`. Don't add `proxy.ts` or server-side session reads without a reason.
- **Cloud sync** (`src/providers/workspace-sync-provider.tsx`, pure logic in `src/lib/sync/workspace-sync.ts`): while a coach is signed in, the `SYNCED_KEYS` (materials, rules profile, exercise bank, class history, current plan) are mirrored to the `workspace_state` table, one row per storage key. Components keep reading `localStorage`. On sign-in the server copy wins, and keys it lacks are uploaded. Local edits are pushed debounced, and the server is pulled again when the tab regains focus (last write wins). A new synced key must also be added to the table's CHECK constraint.
- **Published classes** (`published_classes` table, `src/lib/classes/published-class.ts`): the share modal's `PublishClassPanel` saves `toStudentClass(plan)`, and `/mis-clases` lists the classes. Payloads are validated with `parseStudentClass` because other clients write them.
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
- **Functional mode** (`src/lib/domain/functional`) is the generator the planner uses. The classic generator (`generate-workout.ts`) is no longer reachable from the UI but is kept, with its tests.
  - `generateFunctionalClass(options, profile, bank, deps)` returns a regular `WorkoutPlan` (with `mode: 'funcional'`) plus a `ClassRecord` for history, so coach, student and Plan B work unchanged.
    - Block mapping: Cardio → `'Metabólico'` and Estiramiento → `'Cierre'`. The coach's block names go in `block.name`.
  - The rules profile (`default-profile.ts`), exercise bank (`exercise-bank.ts`) and class history are persisted under `STORAGE_KEYS.rulesProfile`, `exerciseBank` and `classHistory`. They are edited in `/reglas` (`src/components/rules`).
  - Time uses fixed minutes per block (`timing.ts`). Over the target it drops the conditional station, then one cardio round.
  - Material: `equipment` is a list of requirement groups, matched case-insensitively. Each group needs any one of its materials, and every group must be met (`availability.ts`). The functional material is part of `DEFAULT_MATERIALS`; `withDefaultMaterials` appends it to inventories saved earlier.
  - Rotation (`rotation.ts`): a station's main exercise (A, or the combo) is skipped if it was a main in the last N classes. Stations fall back to other patterns of the focus, and repeat only as a last resort, with a notice.
  - Upper body pairs push with pull in A/B stations. Push and pull mains never use combos, so the balance holds.
  - Stations are tagged with `WorkoutExercise.station` (`A/B`, `Combo`, `Simple`, `conditional`).
  - `export-rules.ts` builds the Markdown/JSON context (profile, active bank, last 5 classes) for pasting into a chat.
  - The stored bank is the user's copy: changes to the seed in code do not reach banks that are already saved. The bank editor shows "N ejercicios nuevos en el catálogo" (`missingSeedExercises`, matched by id) so the coach can add them. New seeds go at the end of the list so existing picks keep their order, and seed ids must stay unique (tested).
  - `constants.ts`: the single source for restrictions, focus options, material categories and statuses, default materials, Plan B thresholds and storage keys. Types in `types.ts` are derived from these `as const` arrays.
  - String unions are matched by exact value, including accents (`'Metabólico'`).
- **Student view** (`student-class.ts`): `toStudentClass(plan)` keeps only what students see (no coach notes, notices or conditional stations). The share modal deflates it into the link hash (`/alumno#c=...`, ~1 KB), so any phone opens the class with no account and no shared storage. Without a hash, `/alumno` falls back to the plan on this device. The view is text only and read only (no checkboxes).
- **UI kit** (`src/components/ui`):
  - Components are built with `class-variance-authority` and `cn()` (`clsx` + `tailwind-merge`).
  - Reuse `Button`/`ButtonLink`, `Card` (`panel`/`section`/`tile`/`inset`), `Eyebrow`, `Field` + `Input`/`Select`/`Textarea`, `SegmentedControl` (its `segmentVariants` also style the nav links), `Modal`, `Badge`, `IconTile`, `PanelHeader`, `EmptyState`.
  - Don't reintroduce long inline class strings for these patterns.
  - Workout-specific shared pieces live in `src/components/workout` (`BlockHeader`, `BlockMetaBadge`, `ExerciseSummary`, `CheckableExercise`, `CoachNotesField`, `PlanGate`). They are used by the planner, coach and student views.
- **Styling**: Tailwind v4 via `@tailwindcss/postcss`, with no config file; everything is in `src/app/globals.css`.
  - `brand-*` colors alias amber, so the brand color can be changed in one place.
  - `zinc-150` and `zinc-850` are custom shades.
  - Dark mode is class-based (`@custom-variant dark`). An inline script in `layout.tsx` applies the saved theme before paint, and `ThemeToggle` toggles the class in its click handler, not in an effect.
- **Local assets only**: exercise images are served from `public/exercises/` through `next/image`, and the QR code is generated on the device with `qrcode.react`. The only external host allowed at runtime is the configured Supabase project. Don't add others. `videoUrl` values exist in the data but are not rendered.

## Known limitations

- The QR link is a snapshot: edits or Plan B made after sharing need a new QR. The same applies to a published class: publish it again after changes.
- Sync is last-write-wins per key: two coaches editing the bank at the same moment can overwrite each other.
- There is no password-reset screen yet. A superadmin can't create accounts directly: people sign up at `/login` and get promoted.
- The coach clock is a demo simulation that advances one class minute per real second.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
