'use client';

import { Eye, EyeOff, HardDrive, LogIn, MailCheck, UserPlus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState, type FormEvent } from 'react';
import { KangarooIcon } from '@/components/brand/kangaroo-icon';
import { Button, ButtonLink } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { Eyebrow } from '@/components/ui/eyebrow';
import { Field, Input } from '@/components/ui/field';
import { IconTile } from '@/components/ui/icon-tile';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { safeNextPath } from '@/lib/auth/roles';
import { useAuth } from '@/providers/auth-provider';

type Mode = 'entrar' | 'registro';

const MODES = [
  { value: 'entrar', label: 'Entrar' },
  { value: 'registro', label: 'Crear cuenta' },
] as const;

const MIN_PASSWORD = 6;

export function LoginScreen() {
  const { auth, signIn, signUp } = useAuth();
  const router = useRouter();
  const [mode, setMode] = useState<Mode>('entrar');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmationSentTo, setConfirmationSentTo] = useState<string | null>(null);

  // Already signed in (or just signed in): go where they were heading, if their role allows it.
  useEffect(() => {
    if (auth.status !== 'signed-in') return;
    const next = new URLSearchParams(window.location.search).get('next');
    router.replace(safeNextPath(next, auth.profile.role));
  }, [auth, router]);

  if (auth.status === 'local') {
    return (
      <EmptyState
        icon={<HardDrive />}
        title="Modo local"
        description="Esta instalación no tiene Supabase configurado, así que no hay cuentas: todo funciona en este navegador."
        action={<ButtonLink href="/">Ir al planificador</ButtonLink>}
      />
    );
  }

  if (confirmationSentTo) {
    return (
      <EmptyState
        icon={<MailCheck />}
        title="Revisa tu correo"
        description={`Enviamos un enlace de confirmación a ${confirmationSentTo}. Ábrelo y después entra con tu contraseña.`}
        action={
          <Button
            variant="secondary"
            onClick={() => {
              setConfirmationSentTo(null);
              setMode('entrar');
            }}
          >
            Volver a entrar
          </Button>
        }
      />
    );
  }

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    if (mode === 'registro' && password.length < MIN_PASSWORD) {
      setError(`La contraseña debe tener al menos ${MIN_PASSWORD} caracteres.`);
      return;
    }
    setBusy(true);
    if (mode === 'entrar') {
      const message = await signIn(email, password);
      if (message) setError(message);
    } else {
      const result = await signUp(email, password, fullName);
      if (result.error) setError(result.error);
      else if (result.needsConfirmation) setConfirmationSentTo(email.trim());
    }
    setBusy(false);
  };

  const pending = busy || auth.status === 'loading' || auth.status === 'signed-in';

  return (
    <Card accent className="space-y-6">
      <div className="flex flex-col items-center text-center">
        <IconTile size="lg" className="shadow-lg shadow-brand-500/20">
          <KangarooIcon />
        </IconTile>
        <h1 className="mt-4 text-xl font-black tracking-tight text-zinc-950 dark:text-zinc-50">
          {mode === 'entrar' ? 'Bienvenido de vuelta' : 'Crea tu cuenta'}
        </h1>
        <p className="mt-1.5 max-w-72 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
          {mode === 'entrar'
            ? 'Coaches entran al panel; alumnos ven las clases que su coach publica.'
            : 'Las cuentas nuevas empiezan como alumno. Tu coach o el superadmin te da acceso de coach.'}
        </p>
      </div>

      <SegmentedControl
        label="Entrar o crear cuenta"
        items={MODES}
        value={mode}
        onChange={(next) => {
          setMode(next);
          setError(null);
        }}
        className="w-full [&>button]:flex-1"
      />

      <form onSubmit={submit} className="space-y-4">
        {mode === 'registro' && (
          <Field label="Nombre">
            <Input
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              autoComplete="name"
              placeholder="Cómo te llamas"
              required
            />
          </Field>
        )}
        <Field label="Correo">
          <Input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            inputMode="email"
            placeholder="tu@correo.com"
            required
          />
        </Field>
        <Field label="Contraseña">
          <span className="relative block">
            <Input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete={mode === 'entrar' ? 'current-password' : 'new-password'}
              minLength={mode === 'registro' ? MIN_PASSWORD : undefined}
              placeholder={mode === 'registro' ? `Mínimo ${MIN_PASSWORD} caracteres` : '••••••••'}
              className="pr-11"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </span>
        </Field>

        {error && (
          <p role="alert" className="rounded-xl bg-red-50 p-3 text-xs font-bold text-red-700 dark:bg-red-950/30 dark:text-red-300">
            {error}
          </p>
        )}

        <Button type="submit" size="lg" disabled={pending}>
          {mode === 'entrar' ? <LogIn className="size-4" /> : <UserPlus className="size-4" />}
          {pending ? 'Un momento…' : mode === 'entrar' ? 'Entrar' : 'Crear cuenta'}
        </Button>
      </form>

      <Eyebrow size="xs" className="text-center">
        ¿Solo quieres ver la clase de hoy? Escanea el QR de tu coach, no necesitas cuenta.
      </Eyebrow>
    </Card>
  );
}
