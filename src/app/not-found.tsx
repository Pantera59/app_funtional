import { Compass } from 'lucide-react';
import { ButtonLink } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';

export default function NotFound() {
  return (
    <div className="px-4">
      <EmptyState
        icon={<Compass />}
        title="Página no encontrada"
        description="La sección que buscas no existe."
        action={<ButtonLink href="/">Volver al planificador</ButtonLink>}
      />
    </div>
  );
}
