-- Kangaroo Coach: accounts, roles and shared data.
-- Run once in the Supabase SQL editor (or with `supabase db push`).
--
-- Roles:
--   superadmin  manages users and roles, plus everything an admin can do.
--   admin       the coach: exercise bank, rules, materials, classes.
--   usuario     a student: only reads the classes published for them.
--
-- The first account that signs up becomes superadmin. Everyone after that starts as `usuario`
-- and a superadmin promotes them from /usuarios.

create type public.app_role as enum ('superadmin', 'admin', 'usuario');

-- ---------------------------------------------------------------- profiles

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  full_name text not null default '',
  role public.app_role not null default 'usuario',
  created_at timestamptz not null default now()
);

-- Role helpers. SECURITY DEFINER so policies on `profiles` can call them without recursing into RLS.
create function public.my_role()
returns public.app_role
language sql stable security definer set search_path = public
as $$ select role from public.profiles where id = auth.uid() $$;

create function public.is_admin()
returns boolean
language sql stable security definer set search_path = public
as $$ select coalesce(public.my_role() in ('admin', 'superadmin'), false) $$;

create function public.is_superadmin()
returns boolean
language sql stable security definer set search_path = public
as $$ select coalesce(public.my_role() = 'superadmin', false) $$;

-- New auth user -> profile. The very first one is the superadmin.
create function public.handle_new_user()
returns trigger
language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    case when exists (select 1 from public.profiles) then 'usuario' else 'superadmin' end::public.app_role
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Only a superadmin changes roles, and the last superadmin can't be demoted (no lockout).
-- Statements from the SQL editor have no auth.uid() and are allowed, as an escape hatch.
create function public.guard_profile_update()
returns trigger
language plpgsql security definer set search_path = public
as $$
begin
  if new.id <> old.id or new.email <> old.email then
    raise exception 'El id y el correo del perfil no se pueden cambiar';
  end if;

  if new.role is distinct from old.role then
    if auth.uid() is not null and not public.is_superadmin() then
      raise exception 'Solo un superadmin puede cambiar roles';
    end if;
    if old.role = 'superadmin'
      and (select count(*) from public.profiles where role = 'superadmin') <= 1 then
      raise exception 'Debe quedar al menos un superadmin';
    end if;
  end if;
  return new;
end;
$$;

create trigger guard_profile_update
  before update on public.profiles
  for each row execute function public.guard_profile_update();

alter table public.profiles enable row level security;

create policy "profiles: read own, admins read all"
  on public.profiles for select to authenticated
  using (id = auth.uid() or public.is_admin());

create policy "profiles: update own name, superadmin updates any"
  on public.profiles for update to authenticated
  using (id = auth.uid() or public.is_superadmin())
  with check (id = auth.uid() or public.is_superadmin());

-- ---------------------------------------------------------------- workspace_state
-- The coach workspace that used to live only in one browser's localStorage.
-- One row per storage key; `value` is the same JSON the app keeps locally.

create table public.workspace_state (
  key text primary key check (key in (
    'structured_materials',
    'functional_rules_profile',
    'functional_exercise_bank',
    'functional_class_history',
    'kangaroo_current_plan'
  )),
  value jsonb not null,
  updated_at timestamptz not null default now(),
  updated_by uuid references public.profiles (id) on delete set null default auth.uid()
);

alter table public.workspace_state enable row level security;

create policy "workspace: admins read"
  on public.workspace_state for select to authenticated using (public.is_admin());
create policy "workspace: admins insert"
  on public.workspace_state for insert to authenticated with check (public.is_admin());
create policy "workspace: admins update"
  on public.workspace_state for update to authenticated using (public.is_admin()) with check (public.is_admin());

-- ---------------------------------------------------------------- published_classes
-- Classes the coach publishes for students. `payload` is the StudentClass JSON (no coach notes).

create table public.published_classes (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  class_date date not null default current_date,
  payload jsonb not null,
  published boolean not null default true,
  created_by uuid references public.profiles (id) on delete set null default auth.uid(),
  created_at timestamptz not null default now()
);

create index published_classes_date_idx on public.published_classes (class_date desc, created_at desc);

alter table public.published_classes enable row level security;

create policy "classes: students read published, admins read all"
  on public.published_classes for select to authenticated
  using (published or public.is_admin());
create policy "classes: admins insert"
  on public.published_classes for insert to authenticated with check (public.is_admin());
create policy "classes: admins update"
  on public.published_classes for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "classes: admins delete"
  on public.published_classes for delete to authenticated using (public.is_admin());
