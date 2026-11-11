import { describe, expect, it } from 'vitest';
import { areaForPath, canAccess, homeFor, initials, isRole, safeNextPath } from './roles';

describe('roles', () => {
  it('gives each role only its areas', () => {
    expect(canAccess('superadmin', 'users')).toBe(true);
    expect(canAccess('admin', 'users')).toBe(false);
    expect(canAccess('admin', 'coach')).toBe(true);
    expect(canAccess('usuario', 'coach')).toBe(false);
    expect(canAccess('usuario', 'classes')).toBe(true);
  });

  it('sends students to their classes and coaches to the planner', () => {
    expect(homeFor('usuario')).toBe('/mis-clases');
    expect(homeFor('admin')).toBe('/');
    expect(homeFor('superadmin')).toBe('/');
  });

  it('maps paths to areas', () => {
    expect(areaForPath('/')).toBe('coach');
    expect(areaForPath('/reglas?tab=banco')).toBe('coach');
    expect(areaForPath('/usuarios')).toBe('users');
    expect(areaForPath('/mis-clases#x')).toBe('classes');
    expect(areaForPath('/alumno')).toBeNull();
    expect(areaForPath('/login')).toBeNull();
  });

  it('only follows internal next paths the role can open', () => {
    expect(safeNextPath('/reglas', 'admin')).toBe('/reglas');
    expect(safeNextPath('/reglas', 'usuario')).toBe('/mis-clases');
    expect(safeNextPath('/usuarios', 'admin')).toBe('/');
    expect(safeNextPath('https://evil.example', 'admin')).toBe('/');
    expect(safeNextPath('//evil.example', 'admin')).toBe('/');
    expect(safeNextPath('/\\evil.example', 'admin')).toBe('/');
    expect(safeNextPath(null, 'usuario')).toBe('/mis-clases');
  });

  it('validates role values', () => {
    expect(isRole('admin')).toBe(true);
    expect(isRole('owner')).toBe(false);
    expect(isRole(undefined)).toBe(false);
  });

  it('builds initials from a name or an email', () => {
    expect(initials('Ana López')).toBe('AL');
    expect(initials('coach.pepe@gym.mx')).toBe('CP');
    expect(initials('ana@gym.mx')).toBe('AN');
  });
});
