import type { Area } from '@/lib/auth/roles';

export const NAV_ITEMS = [
  { href: '/', label: 'Planificador', requiresPlan: false, area: 'coach' },
  { href: '/materiales', label: 'Materiales', requiresPlan: false, area: 'coach' },
  { href: '/reglas', label: 'Reglas', requiresPlan: false, area: 'coach' },
  { href: '/coach', label: 'Coach', requiresPlan: true, area: 'coach' },
  { href: '/usuarios', label: 'Usuarios', requiresPlan: false, area: 'users' },
] as const satisfies readonly { href: string; label: string; requiresPlan: boolean; area: Area }[];

export const CLASS_NAV_ITEMS = NAV_ITEMS.filter((item) => item.requiresPlan);
