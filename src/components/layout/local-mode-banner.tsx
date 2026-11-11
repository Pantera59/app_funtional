import { HardDrive } from 'lucide-react';
import { isSupabaseConfigured } from '@/lib/supabase/client';

/** Build-time notice: without Supabase there are no accounts and data stays in this browser. */
export function LocalModeBanner() {
  if (isSupabaseConfigured) return null;
  return (
    <div className="border-b border-brand-200/60 bg-brand-50 dark:border-brand-900/40 dark:bg-brand-950/30">
      <p className="mx-auto flex max-w-5xl items-center gap-2 px-4 py-2 text-[11px] font-bold text-brand-800 md:px-6 dark:text-brand-200">
        <HardDrive className="size-3.5 shrink-0" />
        Modo local: sin cuentas, los datos solo viven en este navegador. Configura Supabase para activar el inicio de
        sesión y los roles.
      </p>
    </div>
  );
}
