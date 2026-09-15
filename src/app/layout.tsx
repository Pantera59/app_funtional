import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { AppHeader } from '@/components/layout/app-header';
import { WodActionBar } from '@/components/layout/wod-action-bar';
import { STORAGE_KEYS } from '@/lib/domain/constants';
import { AppStateProvider } from '@/providers/app-state-provider';
import './globals.css';

export const metadata: Metadata = {
  title: { default: 'Kangaroo Coach', template: '%s · Kangaroo Coach' },
  description: 'Planificador de rutinas y WODs con control de inventario de materiales para clases de entrenamiento funcional.',
  applicationName: 'Kangaroo Coach',
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fafafa' },
    { media: '(prefers-color-scheme: dark)', color: '#09090b' },
  ],
};

/** Runs before paint so a saved dark theme never flashes light. */
const themeScript = `try{if(JSON.parse(localStorage.getItem('${STORAGE_KEYS.theme}'))==='dark')document.documentElement.classList.add('dark')}catch(e){}`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <AppStateProvider>
          <AppHeader />
          <main className="pb-32">{children}</main>
          <WodActionBar />
        </AppStateProvider>
      </body>
    </html>
  );
}
