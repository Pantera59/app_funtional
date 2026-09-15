import type { Focus, Restriction } from './types';

export interface Suggestion {
  title: string;
  text: string;
}

const FOCUS_TIPS: Record<Focus, Suggestion> = {
  'Full Body': {
    title: 'Distribución de Carga Bilateral',
    text: 'Al entrenar cuerpo completo, te sugerimos intercalar bloques de empuje con tracción para maximizar la recuperación de las fibras musculares durante la sesión.',
  },
  'Upper Body': {
    title: 'Estabilización Escapular Primaria',
    text: 'Para entrenamientos de tren superior, aconsejamos iniciar con un calentamiento enfocado en rotadores de hombro y movilidad de la columna torácica.',
  },
  'Lower Body': {
    title: 'Activación Glútea Previa',
    text: 'La dominancia de rodilla y cadera requiere una activación de glúteo medio para prevenir desviaciones de valgo dinámico en las sentadillas.',
  },
};

/** Below this many active materials the class is organised in shared stations. */
const FEW_MATERIALS = 3;

export function getSessionSuggestions({
  focus,
  restrictions,
  materialCount,
}: {
  focus: Focus;
  restrictions: Restriction[];
  materialCount: number;
}): Suggestion[] {
  const suggestions = [FOCUS_TIPS[focus]];

  if (restrictions.includes('Sin-Impacto')) {
    suggestions.push({
      title: 'Reemplazo Metabólico Seguro',
      text: 'La restricción de impacto está activa. Los saltos se escalan a variantes controladas (como subidas al cajón) para proteger las articulaciones.',
    });
  }

  suggestions.push(
    materialCount < FEW_MATERIALS
      ? {
          title: 'Optimización de Espacio',
          text: 'Detectamos pocos materiales activos. Organiza el box en estaciones compartidas o parejas para agilizar el flujo de atletas sin cuellos de botella.',
        }
      : {
          title: 'Variabilidad de Estímulos',
          text: '¡Excelente inventario! Tienes materiales diversos activos. Aprovecha el uso de kettlebells y barras para retar el agarre de los atletas.',
        },
  );

  return suggestions;
}
