/** Same values as the `app_role` enum in supabase/migrations. */
export const ROLES = ['superadmin', 'admin', 'usuario'] as const;
export type Role = (typeof ROLES)[number];

export const ROLE_LABELS: Record<Role, string> = {
  superadmin: 'Superadmin',
  admin: 'Coach',
  usuario: 'Alumno',
};

export const ROLE_DESCRIPTIONS: Record<Role, string> = {
  superadmin: 'Gestiona usuarios y roles, y todo lo que hace un coach.',
  admin: 'Planea clases y edita banco de ejercicios, reglas y materiales.',
  usuario: 'Solo ve las clases que su coach publica.',
};

/** Areas of the app a role may open. */
export type Area = 'coach' | 'users' | 'classes';

const ACCESS: Record<Role, readonly Area[]> = {
  superadmin: ['coach', 'users', 'classes'],
  admin: ['coach', 'classes'],
  usuario: ['classes'],
};

export const canAccess = (role: Role, area: Area) => ACCESS[role].includes(area);

export const isRole = (value: unknown): value is Role => ROLES.includes(value as Role);

/** Where a role lands after signing in, or when it opens a page it can't use. */
export const homeFor = (role: Role) => (canAccess(role, 'coach') ? '/' : '/mis-clases');

/**
 * Only internal paths are allowed as the post-login target, so `?next=` can't send people to another site.
 * Falls back to the role's home when the path is missing, external, or not allowed for that role.
 */
export function safeNextPath(next: string | null | undefined, role: Role): string {
  if (!next || !next.startsWith('/') || next.startsWith('//') || next.startsWith('/\\')) return homeFor(role);
  const area = areaForPath(next);
  return area && !canAccess(role, area) ? homeFor(role) : next;
}

/** Which area a path belongs to; null for public pages (login, the QR student view). */
export function areaForPath(path: string): Area | null {
  const pathname = path.split(/[?#]/)[0];
  if (pathname === '/login' || pathname === '/alumno') return null;
  if (pathname === '/usuarios') return 'users';
  if (pathname === '/mis-clases') return 'classes';
  return 'coach';
}

export function initials(nameOrEmail: string) {
  const words = nameOrEmail.split('@')[0].split(/[\s._-]+/).filter(Boolean);
  return (words.length > 1 ? words[0][0] + words[1][0] : (words[0] ?? '?').slice(0, 2)).toUpperCase();
}
