import { Award, CheckCircle2, Sparkles, Star, type LucideIcon } from 'lucide-react';
import { KangarooIcon } from '@/components/brand/kangaroo-icon';
import { Card } from '@/components/ui/card';

const HIGHLIGHTS = [
  { value: '100%', label: 'Adaptado al box' },
  { value: 'Plan B', label: 'Anti-retrasos' },
];

const FEATURE_LISTS: { title: string; icon: LucideIcon; iconClass: string; marker: string; items: string[] }[] = [
  {
    title: 'Lo que obtienes',
    icon: Award,
    iconClass: 'text-brand-500',
    marker: '✓',
    items: ['WODs adaptados al equipo', 'Cronómetro interactivo', 'Variantes de escalado', 'QR para vista de alumnos'],
  },
  {
    title: 'Beneficios clave',
    icon: CheckCircle2,
    iconClass: 'text-emerald-500',
    marker: '✦',
    items: [
      'Clases que inician a tiempo',
      'Alumnos autónomos (sin pizarra)',
      'Seguridad articular guiada',
      'Reducción de carga mental',
    ],
  },
];

/** Static welcome content: rendered on the server and slotted into the client dashboard. */
export function DashboardWelcome() {
  return (
    <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12 lg:gap-8">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-500 to-orange-600 p-6 text-white shadow-md lg:col-span-5">
        <KangarooIcon className="absolute -right-4 -bottom-5 size-40 opacity-[0.12]" />
        <div className="mb-4 flex items-center gap-2">
          <span className="flex size-7 items-center justify-center rounded-lg bg-white/20">
            <Star className="size-4 fill-white" />
          </span>
          <span className="text-[9px] font-black tracking-widest uppercase">¡Hola coach!</span>
        </div>
        <h4 className="text-base leading-snug font-black tracking-tight uppercase">
          Te damos la bienvenida a la plataforma de Kangaroo Athletic.
        </h4>
        <p className="mt-3 text-[11px] leading-relaxed text-white/90">
          Kangaroo Coach está diseñado para que los entrenadores de acondicionamiento funcional planifiquen, controlen el
          tiempo y enseñen a sus alumnos.
        </p>
        <div className="mt-5 grid grid-cols-2 gap-3 border-t border-white/20 pt-4 text-center">
          {HIGHLIGHTS.map((item) => (
            <div key={item.label} className="rounded-xl bg-white/10 p-2.5">
              <span className="block text-sm font-black">{item.value}</span>
              <span className="text-[8px] font-bold tracking-wider text-white/80 uppercase">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4 lg:col-span-7">
        <div>
          <h4 className="flex items-center gap-2 text-xs font-black tracking-wider text-zinc-900 uppercase dark:text-zinc-50">
            <Sparkles className="size-4 text-brand-500" /> ¿Cómo funciona la app?
          </h4>
          <p className="mt-1.5 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
            La app cruza el <strong>inventario activo de materiales</strong> con el <strong>enfoque del día</strong> y
            las <strong>restricciones de tus alumnos</strong>. Con un solo clic genera una clase de 60 minutos con
            calentamiento, fuerza, trabajo metabólico y vuelta a la calma.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {FEATURE_LISTS.map(({ title, icon: Icon, iconClass, marker, items }) => (
            <Card key={title} variant="inset" className="space-y-1.5">
              <h5 className="flex items-center gap-1.5 text-[10px] font-black tracking-wider text-zinc-900 uppercase dark:text-zinc-50">
                <Icon className={`size-3.5 ${iconClass}`} /> {title}
              </h5>
              <ul className="space-y-1 text-[11px] leading-snug text-zinc-500 dark:text-zinc-400">
                {items.map((item) => (
                  <li key={item}>
                    {marker} {item}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
