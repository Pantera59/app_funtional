import type { Material } from './types';

export const RESTRICTIONS = ['Sin-Impacto', 'Sin-Empuje-Vertical', 'Sin-Flexion-Profunda'] as const;
export const FOCUS_OPTIONS = ['Full Body', 'Upper Body', 'Lower Body'] as const;
export const MATERIAL_STATUSES = ['Excelente', 'Desgastado', 'Mantenimiento'] as const;
export const MATERIAL_CATEGORIES = [
  'Pesos Libres',
  'Estructuras',
  'Accesorios',
  'Cardio',
  'Carga Funcional',
  'Acondicionamiento',
] as const;

/** Equipment values that mean "no material needed"; always allowed by the generator. */
export const BODYWEIGHT_EQUIPMENT = ['bodyweight', 'ninguno', 'body weight'];

export const CLASS_DURATION_MINUTES = 60;
/** How many past plans are remembered to avoid repeating exercises. */
export const HISTORY_SIZE = 3;
export const PLAN_B = {
  /** Share of the metabolic block removed when Plan B is activated. */
  reduction: 0.3,
  /** Minutes into the class after which the delay alert shows. */
  alertAfterMinutes: 35,
} as const;

/** Keys are unchanged from the Vite version so existing browser data carries over. */
export const STORAGE_KEYS = {
  materials: 'structured_materials',
  legacyMaterials: 'available_materials',
  history: 'workout_history',
  plan: 'kangaroo_current_plan',
  theme: 'kangaroo_theme',
  dashboardDefault: 'kangaroo_show_dashboard_default',
  rulesProfile: 'functional_rules_profile',
  exerciseBank: 'functional_exercise_bank',
  classHistory: 'functional_class_history',
  plannerMode: 'kangaroo_planner_mode',
} as const;

/** Material used by the functional-mode exercise bank. The classic generator ignores it. */
export const FUNCTIONAL_MATERIALS: Material[] = [
  { name: 'Mancuernas ligeras', category: 'Pesos Libres', desc: 'Mancuernas de carga ligera', quantity: 10, status: 'Excelente', active: true },
  { name: 'Mancuernas medias', category: 'Pesos Libres', desc: 'Mancuernas de carga media', quantity: 10, status: 'Excelente', active: true },
  { name: 'Liga elástica', category: 'Accesorios', desc: 'Liga larga con o sin asas', quantity: 10, status: 'Excelente', active: true },
  { name: 'Liga de resistencia', category: 'Accesorios', desc: 'Mini band de resistencia', quantity: 10, status: 'Excelente', active: true },
  { name: 'Polainas', category: 'Carga Funcional', desc: 'Pesas para tobillo o muñeca', quantity: 10, status: 'Excelente', active: true },
  { name: 'Pelota', category: 'Accesorios', desc: 'Pelota para core', quantity: 10, status: 'Excelente', active: true },
  { name: 'Discos', category: 'Pesos Libres', desc: 'Discos sueltos (también para elevar talones)', quantity: 10, status: 'Excelente', active: true },
];

export const DEFAULT_MATERIALS: Material[] = [
  { name: 'Kettlebell', category: 'Pesos Libres', desc: 'Pesas rusas de varios kilajes', quantity: 12, status: 'Excelente', active: true },
  { name: 'Dumbbells', category: 'Pesos Libres', desc: 'Mancuernas hexagonales o redondas', quantity: 20, status: 'Excelente', active: true },
  { name: 'Barbell', category: 'Pesos Libres', desc: 'Barra olímpica y discos', quantity: 6, status: 'Excelente', active: true },
  { name: 'Pull-up Bar', category: 'Estructuras', desc: 'Barra de dominadas o rack para colgarse', quantity: 8, status: 'Excelente', active: true },
  { name: 'Plyo Box', category: 'Accesorios', desc: 'Cajón pliométrico de madera o espuma', quantity: 5, status: 'Excelente', active: true },
  { name: 'Sandbag', category: 'Carga Funcional', desc: 'Saco de arena inestable', quantity: 4, status: 'Excelente', active: true },
  { name: 'Medicine Ball', category: 'Accesorios', desc: 'Balones medicinales pesados', quantity: 10, status: 'Excelente', active: true },
  { name: 'Jump Rope', category: 'Acondicionamiento', desc: 'Cuerdas de saltar individuales', quantity: 15, status: 'Excelente', active: true },
  ...FUNCTIONAL_MATERIALS,
];

const DEFAULT_MATERIAL_NAMES = new Set(DEFAULT_MATERIALS.map((m) => m.name));

/** Built-in materials can be deactivated but not deleted. */
export const isDefaultMaterial = (name: string) => DEFAULT_MATERIAL_NAMES.has(name);

export const isBodyweight = (equipment: string) =>
  BODYWEIGHT_EQUIPMENT.includes(equipment.toLowerCase());

/** Adds built-in materials missing from data saved before they existed. Returns the same array if nothing is missing. */
export function withDefaultMaterials(materials: Material[]): Material[] {
  const names = new Set(materials.map((m) => m.name));
  const missing = DEFAULT_MATERIALS.filter((m) => !names.has(m.name));
  return missing.length > 0 ? [...materials, ...missing] : materials;
}
