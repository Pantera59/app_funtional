export const NAV_ITEMS = [
  { href: '/', label: 'Planificador', requiresPlan: false },
  { href: '/materiales', label: 'Materiales', requiresPlan: false },
  { href: '/reglas', label: 'Reglas', requiresPlan: false },
  { href: '/coach', label: 'Coach', requiresPlan: true },
  { href: '/alumno', label: 'Alumno', requiresPlan: true },
] as const;

export const CLASS_NAV_ITEMS = NAV_ITEMS.filter((item) => item.requiresPlan);
