import type { Metadata } from 'next';
import { LoginScreen } from '@/components/auth/login-screen';
import { SimpleHeader } from '@/components/layout/simple-header';

export const metadata: Metadata = { title: 'Entrar' };

export default function LoginPage() {
  return (
    <>
      <SimpleHeader subtitle="Acceso" />
      <main className="mx-auto max-w-md px-4 pt-10 pb-16">
        <LoginScreen />
      </main>
    </>
  );
}
