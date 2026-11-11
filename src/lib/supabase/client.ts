import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// Read with literal names so Next inlines them into the client bundle at build time.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * Without the env vars the app runs in local mode: no accounts, data only in this browser (the old behaviour).
 * The anon key is public by design; Row Level Security in supabase/migrations is what protects the data.
 */
export const isSupabaseConfigured = Boolean(url && anonKey);

let client: SupabaseClient | null = null;

/** Browser-only singleton. Call it from effects and event handlers, never during a server render. */
export function getSupabase(): SupabaseClient {
  if (!isSupabaseConfigured) throw new Error('Supabase no está configurado (NEXT_PUBLIC_SUPABASE_URL / ANON_KEY)');
  client ??= createClient(url!, anonKey!, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
  });
  return client;
}
