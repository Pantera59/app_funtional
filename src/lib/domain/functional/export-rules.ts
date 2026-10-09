import { format } from 'date-fns';
import { describeEquipment } from './availability';
import { BLOCK_LABELS, EXPORT_RECENT_CLASSES } from './constants';
import type { BankExercise, ClassRecord, RulesProfile } from './types';

export interface RulesExport {
  profile: RulesProfile;
  bank: BankExercise[];
  recentClasses: ClassRecord[];
}

export const buildRulesExport = (profile: RulesProfile, bank: BankExercise[], history: ClassRecord[]): RulesExport => ({
  profile,
  bank: bank.filter((e) => e.active),
  recentClasses: history.slice(-EXPORT_RECENT_CLASSES),
});

const list = (items: string[]) => items.map((item) => `- ${item}`).join('\n');

function profileSection(profile: RulesProfile) {
  const { targetMinutes, blocks, warmup, strength, cardio, stretch, rotation } = profile;
  const activeSchemes = strength.schemes.filter((s) => s.active).map((s) => s.label);

  return `## Perfil de reglas

- Duración objetivo: ${targetMinutes.min}–${targetMinutes.max} min.
- 4 bloques fijos, en este orden:
${blocks.map((b, i) => `  ${i + 1}. ${b.name}: ${b.minMinutes}–${b.maxMinutes}' (planeado: ${b.minutes}')`).join('\n')}
- Si la suma se pasa del máximo: primero se quita la estación condicional, después una vuelta de cardio.

### Calentamiento (siempre al inicio)
${list(warmup.fixedSequence.map((s) => `**${s.area}:** ${s.detail}`))}
- Después: ${warmup.activationCount} ejercicios de activación según el enfoque, ${warmup.activationSets} sets de ${warmup.activationReps}.

### Fuerza
- ${strength.stations} estaciones (rango ${strength.minStations}–${strength.maxStations}).${
    strength.conditionalStation
      ? ` Más 1 estación **condicional** (${strength.conditionalMinutes} min), solo si alcanza el tiempo.`
      : ''
  }
- Esquemas de series permitidos: ${activeSchemes.join(' · ') || 'ninguno'}.
- Formato de estación (márcalo siempre):
  - **A/B**: ejercicio A y ejercicio B alternados.
  - **Combo**: A + B + C secuenciales en un solo movimiento.

### Cardio
- ${cardio.exercises} ejercicios (rango ${cardio.minExercises}–${cardio.maxExercises}), ${cardio.workSeconds}s trabajo / ${cardio.restSeconds}s descanso, ${cardio.rounds} vueltas.

### Estiramiento
- ${stretch.exercises} ejercicios.

### Rotación
- No repetir el ejercicio principal de una estación si apareció en las últimas ${rotation.lookbackClasses} clases.${
    rotation.balancePushPull ? '\n- En Upper body, equilibrar empuje y jalón.' : ''
  }`;
}

function bankSection(bank: BankExercise[]) {
  const header = '| Ejercicio | Bloques | Enfoque | Patrón | Material | Modalidad | Dificultad | Notas |\n|---|---|---|---|---|---|---|---|';
  const rows = bank.map((e) =>
    [
      e.combo ? `${e.name} (combo)` : e.name,
      e.blocks.map((b) => BLOCK_LABELS[b]).join(', '),
      e.focus.join(', '),
      e.pattern,
      describeEquipment(e),
      e.modality,
      e.difficulty,
      e.notes || '—',
    ]
      .map((cell) => cell.replace(/\|/g, '/'))
      .join(' | '),
  );
  return `## Banco de ejercicios (${bank.length} activos)\n\n${header}\n${rows.map((r) => `| ${r} |`).join('\n')}`;
}

function historySection(classes: ClassRecord[]) {
  if (classes.length === 0) return '## Últimas clases\n\nTodavía no hay clases registradas.';
  const items = [...classes].reverse().map(
    (c) =>
      `### Clase ${c.classNumber} · ${format(new Date(c.date), 'yyyy-MM-dd')} · ${c.focus}\n` +
      `Material: ${c.materials.join(', ') || 'ninguno'}\n\n` +
      c.blocks.map((b) => `- **${b.name}** (${b.minutes}'): ${b.exercises.join('; ')}`).join('\n'),
  );
  return `## Últimas ${classes.length} clases (de la más reciente a la más antigua)\n\n${items.join('\n\n')}`;
}

/** Markdown meant to be pasted into a chat with Claude as planning context. */
export function buildRulesMarkdown(profile: RulesProfile, bank: BankExercise[], history: ClassRecord[], activeMaterials: string[]) {
  const data = buildRulesExport(profile, bank, history);
  return `# Mis reglas de planeación de clases de funcional

Soy coach de clases grupales de entrenamiento funcional. Usa estas reglas, mi banco de ejercicios y mis últimas clases para planear la siguiente clase. Respeta el material disponible y la regla de rotación.

**Material disponible hoy:** ${activeMaterials.join(', ') || 'solo peso corporal'}

${profileSection(data.profile)}

${bankSection(data.bank)}

${historySection(data.recentClasses)}
`;
}

export const buildRulesJson = (profile: RulesProfile, bank: BankExercise[], history: ClassRecord[]) =>
  JSON.stringify(buildRulesExport(profile, bank, history), null, 2);
