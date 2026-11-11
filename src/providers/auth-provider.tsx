'use client';

import type { Session } from '@supabase/supabase-js';
import { createContext, use, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { isRole, type Role } from '@/lib/auth/roles';
import { getSupabase, isSupabaseConfigured } from '@/lib/supabase/client';

export interface Profile {
  id: string;
  email: string;
  fullName: string;
  role: Role;
}

/**
 * - `local`: Supabase isn't configured; the app works as before, in this browser only, with no accounts.
 * - `loading`: waiting for the stored session and the profile.
 */
export type AuthState =
  | { status: 'local' }
  | { status: 'loading' }
  | { status: 'signed-out' }
  | { status: 'signed-in'; session: Session; profile: Profile };

interface AuthContextValue {
  auth: AuthState;
  signIn: (email: string, password: string) => Promise<string | null>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: string | null; needsConfirmation: boolean }>;
  signOut: () => Promise<void>;
  updateFullName: (fullName: string) => Promise<string | null>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

interface ProfileRow {
  id: string;
  email: string;
  full_name: string;
  role: string;
}

export const toProfile = (row: ProfileRow): Profile => ({
  id: row.id,
  email: row.email,
  fullName: row.full_name,
  role: isRole(row.role) ? row.role : 'usuario',
});

/** Supabase errors are in English; show the common ones in Spanish. */
export function authErrorMessage(message: string) {
  const lower = message.toLowerCase();
  if (lower.includes('invalid login credentials')) return 'Correo o contraseña incorrectos.';
  if (lower.includes('email not confirmed')) return 'Confirma tu correo antes de entrar (revisa tu bandeja).';
  if (lower.includes('already registered')) return 'Ya existe una cuenta con ese correo.';
  if (lower.includes('password should be at least')) return 'La contraseña debe tener al menos 6 caracteres.';
  if (lower.includes('rate limit')) return 'Demasiados intentos. Espera un momento y vuelve a intentar.';
  if (lower.includes('failed to fetch') || lower.includes('network')) return 'Sin conexión con el servidor.';
  return message;
}

async function fetchProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await getSupabase()
    .from('profiles')
    .select('id, email, full_name, role')
    .eq('id', userId)
    .single<ProfileRow>();
  return error || !data ? null : toProfile(data);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  // Same value on the server and on the first client render, so hydration matches.
  const [auth, setAuth] = useState<AuthState>(isSupabaseConfigured ? { status: 'loading' } : { status: 'local' });

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    const supabase = getSupabase();
    let cancelled = false;

    const apply = async (session: Session | null) => {
      if (!session) {
        if (!cancelled) setAuth({ status: 'signed-out' });
        return;
      }
      const profile = await fetchProfile(session.user.id);
      if (cancelled) return;
      // A user without a profile row (trigger missing) can't be authorised for anything.
      setAuth(profile ? { status: 'signed-in', session, profile } : { status: 'signed-out' });
    };

    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      // Token refreshes keep the same user; skip the extra profile request.
      if (event === 'TOKEN_REFRESHED') {
        setAuth((prev) => (prev.status === 'signed-in' && session ? { ...prev, session } : prev));
        return;
      }
      // Deferred: supabase-js warns against awaiting its own calls inside this callback.
      setTimeout(() => void apply(session), 0);
    });

    return () => {
      cancelled = true;
      data.subscription.unsubscribe();
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await getSupabase().auth.signInWithPassword({ email: email.trim(), password });
    return error ? authErrorMessage(error.message) : null;
  }, []);

  const signUp = useCallback(async (email: string, password: string, fullName: string) => {
    const { data, error } = await getSupabase().auth.signUp({
      email: email.trim(),
      password,
      options: { data: { full_name: fullName.trim() }, emailRedirectTo: `${window.location.origin}/login` },
    });
    if (error) return { error: authErrorMessage(error.message), needsConfirmation: false };
    // With email confirmation on, Supabase returns a user but no session.
    return { error: null, needsConfirmation: !data.session };
  }, []);

  const signOut = useCallback(async () => {
    await getSupabase().auth.signOut();
  }, []);

  const updateFullName = useCallback(
    async (fullName: string) => {
      if (auth.status !== 'signed-in') return 'No has iniciado sesión.';
      const { error } = await getSupabase()
        .from('profiles')
        .update({ full_name: fullName.trim() })
        .eq('id', auth.profile.id);
      if (error) return authErrorMessage(error.message);
      setAuth((prev) =>
        prev.status === 'signed-in' ? { ...prev, profile: { ...prev.profile, fullName: fullName.trim() } } : prev,
      );
      return null;
    },
    [auth],
  );

  const value = useMemo(
    () => ({ auth, signIn, signUp, signOut, updateFullName }),
    [auth, signIn, signUp, signOut, updateFullName],
  );

  return <AuthContext value={value}>{children}</AuthContext>;
}

export function useAuth() {
  const value = use(AuthContext);
  if (!value) throw new Error('useAuth must be used inside <AuthProvider>');
  return value;
}

/** The signed-in profile, or null (signed out, loading, or local mode). */
export function useProfile() {
  const { auth } = useAuth();
  return auth.status === 'signed-in' ? auth.profile : null;
}
