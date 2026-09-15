'use client';

import { Moon, Sun } from 'lucide-react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { STORAGE_KEYS } from '@/lib/domain/constants';

type Theme = 'light' | 'dark';

export function ThemeToggle() {
  const [theme, setTheme] = useLocalStorage<Theme>(STORAGE_KEYS.theme, 'light');
  const isDark = theme === 'dark';

  const toggle = () => {
    const next: Theme = isDark ? 'light' : 'dark';
    setTheme(next);
    // Applied here rather than in an effect so hydration never removes the class the inline script set.
    document.documentElement.classList.toggle('dark', next === 'dark');
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? 'Activar modo claro' : 'Activar modo oscuro'}
      className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-zinc-100/50 text-zinc-500 transition-all hover:bg-zinc-150 hover:text-brand-500 dark:bg-zinc-900/60 dark:text-zinc-400 dark:hover:bg-zinc-850 dark:hover:text-brand-400"
    >
      {isDark ? <Sun className="size-4.5" /> : <Moon className="size-4.5" />}
    </button>
  );
}
