'use client';

import { Check, Copy, QrCode, Smartphone } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { ButtonLink, Button } from '@/components/ui/button';
import { Input } from '@/components/ui/field';
import { IconTile } from '@/components/ui/icon-tile';
import { Modal } from '@/components/ui/modal';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';

const LOCAL_HOSTNAMES = ['localhost', '127.0.0.1', '[::1]'];

export function ShareWodModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Modal open={open} onClose={onClose} label="Compartir WOD con alumnos" className="max-w-sm text-center">
      <ShareWodContent onNavigate={onClose} />
    </Modal>
  );
}

/** Separate component so `window` is only read once the modal is actually open. */
function ShareWodContent({ onNavigate }: { onNavigate: () => void }) {
  const { copied, copy } = useCopyToClipboard();
  const url = new URL('/alumno', window.location.origin).toString();
  const isLocalhost = LOCAL_HOSTNAMES.includes(window.location.hostname);

  return (
    <div className="mt-2 flex flex-col items-center">
      <IconTile className="mb-3">
        <QrCode />
      </IconTile>
      <h3 className="text-sm font-black tracking-wider text-zinc-900 uppercase dark:text-zinc-100">Acceso alumnos</h3>
      <p className="mt-1.5 max-w-60 text-[11px] leading-relaxed text-zinc-400 dark:text-zinc-500">
        Escanea el código QR o comparte el enlace para abrir la vista de alumno.
      </p>

      {/* Generated on the device: no external QR service. */}
      <div className="my-6 rounded-2xl border border-zinc-150 bg-white p-4 shadow-md">
        <QRCodeSVG value={url} size={144} marginSize={0} title="Código QR de la vista de alumno" />
      </div>

      {isLocalhost && (
        <p className="mb-4 rounded-xl bg-brand-50 p-3 text-[10px] font-bold text-brand-700 dark:bg-brand-950/30 dark:text-brand-300">
          Estás en localhost: abre la app con la IP de tu red (por ejemplo http://192.168.1.20:3000) para que el QR
          funcione en los celulares.
        </p>
      )}

      <div className="mb-5 flex w-full items-center gap-2">
        <Input
          readOnly
          value={url}
          aria-label="Enlace de la vista de alumno"
          onFocus={(event) => event.currentTarget.select()}
          className="truncate"
        />
        <Button size="sm" variant={copied ? 'secondary' : 'primary'} onClick={() => copy(url)}>
          {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
          <span aria-live="polite">{copied ? 'Copiado' : 'Copiar'}</span>
        </Button>
      </div>

      <ButtonLink href="/alumno" size="lg" onClick={onNavigate}>
        <Smartphone className="size-4" /> Ir a vista de alumno
      </ButtonLink>
    </div>
  );
}
