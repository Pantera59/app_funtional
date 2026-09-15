import { Exercise, WorkoutPlan, WorkoutBlock, BlockType, MovementPattern, WorkoutFormat, RestrictionSwaps } from './types';

export const exerciseDatabase: Exercise[] = [
  {
    id: 16,
    name: 'Bodyweight Glute Bridge',
    pattern: 'Hinge',
    equipmentNeeded: 'Bodyweight',
    level: 'Beginner',
    regression: 'Glute Bridge Isometric',
    progression: 'Single-leg Glute Bridge',
    restrictionSwaps: {
      'Sin-Impacto': 'Bodyweight Glute Bridge',
      'Sin-Flexion-Profunda': 'Glute Bridge rango corto',
      'Sin-Empuje-Vertical': 'Bodyweight Glute Bridge'
    },
    videoUrl: 'https://www.youtube.com/embed/4XJCngiQp_8',
    imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 17,
    name: 'Prone Y-T-W Raises',
    pattern: 'Pull',
    equipmentNeeded: 'Bodyweight',
    level: 'Beginner',
    regression: 'Prone Cobra',
    progression: 'T-Raises sostenido',
    restrictionSwaps: {
      'Sin-Impacto': 'Prone Y-T-W Raises',
      'Sin-Flexion-Profunda': 'Prone Y-T-W Raises',
      'Sin-Empuje-Vertical': 'Prone Y-T-W Raises'
    },
    videoUrl: 'https://www.youtube.com/embed/-ZX1QMTdAC4',
    imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 18,
    name: 'Air Squat',
    pattern: 'Squat',
    equipmentNeeded: 'Bodyweight',
    level: 'Beginner',
    regression: 'Box Squat asistido',
    progression: 'Jump Squat',
    restrictionSwaps: {
      'Sin-Impacto': 'Air Squat',
      'Sin-Flexion-Profunda': 'Box Squat parcial',
      'Sin-Empuje-Vertical': 'Air Squat'
    },
    videoUrl: 'https://www.youtube.com/embed/L219ltL15zk',
    imageUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 1,
    name: 'Goblet Squat',
    pattern: 'Squat',
    equipmentNeeded: 'Kettlebell',
    level: 'Intermediate',
    regression: 'Air Squat',
    progression: 'Double KB Front Squat',
    restrictionSwaps: {
      'Sin-Impacto': 'Goblet Squat',
      'Sin-Flexion-Profunda': 'Box Squat parcial',
      'Sin-Empuje-Vertical': 'Goblet Squat'
    },
    videoUrl: 'https://www.youtube.com/embed/MhllRFE_KzQ',
    imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 2,
    name: 'Pull-ups',
    pattern: 'Pull',
    equipmentNeeded: 'Pull-up Bar',
    level: 'Advanced',
    regression: 'Ring Rows',
    progression: 'Weighted Pull-ups',
    restrictionSwaps: {
      'Sin-Impacto': 'Pull-ups',
      'Sin-Flexion-Profunda': 'Pull-ups',
      'Sin-Empuje-Vertical': 'Ring Rows'
    },
    videoUrl: 'https://www.youtube.com/embed/eGo4IYtl4hE',
    imageUrl: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 3,
    name: 'Push-ups',
    pattern: 'Push',
    equipmentNeeded: 'Bodyweight',
    level: 'Intermediate',
    regression: 'Knee Push-ups',
    progression: 'Clapping Push-ups',
    restrictionSwaps: {
      'Sin-Impacto': 'Push-ups',
      'Sin-Flexion-Profunda': 'Push-ups',
      'Sin-Empuje-Vertical': 'Push-ups'
    },
    videoUrl: 'https://www.youtube.com/embed/IODxDxX7oi4',
    imageUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 4,
    name: 'Kettlebell Swing',
    pattern: 'Hinge',
    equipmentNeeded: 'Kettlebell',
    level: 'Intermediate',
    regression: 'Kettlebell Deadlift',
    progression: 'Single-arm KB Swing',
    restrictionSwaps: {
      'Sin-Impacto': 'Kettlebell Swing',
      'Sin-Flexion-Profunda': 'Kettlebell Swing',
      'Sin-Empuje-Vertical': 'Kettlebell Swing'
    },
    videoUrl: 'https://www.youtube.com/embed/YSxHifyI6s8',
    imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 5,
    name: 'Burpees',
    pattern: 'Metabolic',
    equipmentNeeded: 'Bodyweight',
    level: 'Intermediate',
    regression: 'Sprawls (No push-up)',
    progression: 'Burpee Box Jump',
    restrictionSwaps: {
      'Sin-Impacto': 'Burpee Caminado (Step-back)',
      'Sin-Flexion-Profunda': 'Sprawls a banco',
      'Sin-Empuje-Vertical': 'Burpees'
    },
    videoUrl: 'https://www.youtube.com/embed/TU8QYVW0gDU',
    imageUrl: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 6,
    name: 'Dumbbell Overhead Press',
    pattern: 'Push',
    equipmentNeeded: 'Dumbbells',
    level: 'Intermediate',
    regression: 'Seated DB Press',
    progression: 'Barbell Push Press',
    restrictionSwaps: {
      'Sin-Impacto': 'Dumbbell Overhead Press',
      'Sin-Flexion-Profunda': 'Dumbbell Overhead Press',
      'Sin-Empuje-Vertical': 'DB Floor Press'
    },
    videoUrl: 'https://www.youtube.com/embed/QAQ64hK4Xxs',
    imageUrl: 'https://images.unsplash.com/photo-1605296867304-46d5465a25f1?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 7,
    name: 'Box Jumps',
    pattern: 'Metabolic',
    equipmentNeeded: 'Plyo Box',
    level: 'Intermediate',
    regression: 'Box Step-ups',
    progression: 'High Box Jumps',
    restrictionSwaps: {
      'Sin-Impacto': 'Box Step-ups',
      'Sin-Flexion-Profunda': 'Box Step-ups bajos',
      'Sin-Empuje-Vertical': 'Box Jumps'
    },
    videoUrl: 'https://www.youtube.com/embed/52r_Ul5k03g',
    imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 8,
    name: 'Deadbug',
    pattern: 'Core',
    equipmentNeeded: 'Bodyweight',
    level: 'Beginner',
    regression: 'Tabletop Hold',
    progression: 'Weighted Deadbug',
    restrictionSwaps: {
      'Sin-Impacto': 'Deadbug',
      'Sin-Flexion-Profunda': 'Deadbug',
      'Sin-Empuje-Vertical': 'Deadbug'
    },
    videoUrl: 'https://www.youtube.com/embed/4XJCngiQp_8',
    imageUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 9,
    name: 'Walking Lunges',
    pattern: 'Squat',
    equipmentNeeded: 'Bodyweight',
    level: 'Intermediate',
    regression: 'Reverse Lunges',
    progression: 'Weighted Walking Lunges',
    restrictionSwaps: {
      'Sin-Impacto': 'Walking Lunges',
      'Sin-Flexion-Profunda': 'Reverse Lunges superficiales',
      'Sin-Empuje-Vertical': 'Walking Lunges'
    },
    videoUrl: 'https://www.youtube.com/embed/L8fvypPrzzs',
    imageUrl: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 10,
    name: 'Thrusters',
    pattern: 'Metabolic',
    equipmentNeeded: 'Dumbbells',
    level: 'Advanced',
    regression: 'Front Squat',
    progression: 'Heavy Barbell Thrusters',
    restrictionSwaps: {
      'Sin-Impacto': 'Thrusters',
      'Sin-Flexion-Profunda': 'Push Press',
      'Sin-Empuje-Vertical': 'Front Squat'
    },
    videoUrl: 'https://www.youtube.com/embed/L219ltL15zk',
    imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 11,
    name: 'World\'s Greatest Stretch',
    pattern: 'Mobility',
    equipmentNeeded: 'Bodyweight',
    level: 'Beginner',
    regression: 'Kneeling Lunge Stretch',
    progression: 'World\'s Greatest Stretch with rotation',
    restrictionSwaps: {
      'Sin-Impacto': 'World\'s Greatest Stretch',
      'Sin-Flexion-Profunda': 'Standing Quad Stretch',
      'Sin-Empuje-Vertical': 'World\'s Greatest Stretch'
    },
    videoUrl: 'https://www.youtube.com/embed/-ZX1QMTdAC4',
    imageUrl: 'https://images.unsplash.com/photo-1607962837359-5e7e89f866ce?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 12,
    name: 'Sandbag Clean',
    pattern: 'Hinge',
    equipmentNeeded: 'Sandbag',
    level: 'Advanced',
    regression: 'Sandbag Deadlift',
    progression: 'Sandbag Clean & Press',
    restrictionSwaps: {
      'Sin-Impacto': 'Sandbag Clean',
      'Sin-Flexion-Profunda': 'Sandbag Deadlift',
      'Sin-Empuje-Vertical': 'Sandbag Clean'
    },
    videoUrl: 'https://www.youtube.com/embed/MhllRFE_KzQ',
    imageUrl: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 13,
    name: 'Medicine Ball Slam',
    pattern: 'Metabolic',
    equipmentNeeded: 'Medicine Ball',
    level: 'Intermediate',
    regression: 'Squat to overhead reach',
    progression: 'Jumping Medball Slam',
    restrictionSwaps: {
      'Sin-Impacto': 'Medicine Ball Slam',
      'Sin-Flexion-Profunda': 'Medball Slam superficial',
      'Sin-Empuje-Vertical': 'Medicine Ball Rotational Slam'
    },
    videoUrl: 'https://www.youtube.com/embed/YSxHifyI6s8',
    imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 14,
    name: 'Double Under (Jump Rope)',
    pattern: 'Metabolic',
    equipmentNeeded: 'Jump Rope',
    level: 'Advanced',
    regression: 'Single Unders',
    progression: 'Triple Unders',
    restrictionSwaps: {
      'Sin-Impacto': 'Fast High Knees (No jump)',
      'Sin-Flexion-Profunda': 'Double Under',
      'Sin-Empuje-Vertical': 'Double Under'
    },
    videoUrl: 'https://www.youtube.com/embed/eGo4IYtl4hE',
    imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 15,
    name: 'Barbell Deadlift',
    pattern: 'Hinge',
    equipmentNeeded: 'Barbell',
    level: 'Intermediate',
    regression: 'Kettlebell Deadlift',
    progression: 'Deficit Deadlift',
    restrictionSwaps: {
      'Sin-Impacto': 'Barbell Deadlift',
      'Sin-Flexion-Profunda': 'Block Deadlift (rango corto)',
      'Sin-Empuje-Vertical': 'Barbell Deadlift'
    },
    videoUrl: 'https://www.youtube.com/embed/QAQ64hK4Xxs',
    imageUrl: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=600&q=80'
  }
];

// Reglas de Negocio Estrictas: Generador de Clase
export function generateWorkout(
  focus: string,
  limitedEquipment: boolean,
  restrictions: string[],
  startTime: string,
  availableMaterials?: string[]
): WorkoutPlan {
  // 1. Regla de Sincronización Estricta de la BD
  // Obtenemos historial local para no repetir (últimos 3 entrenamientos)
  const historyRaw = localStorage.getItem('workout_history');
  let usedExerciseIds: number[] = [];
  if (historyRaw) {
    try {
      const history: WorkoutPlan[] = JSON.parse(historyRaw);
      const recent = history.slice(-3); // Últimos 3
      usedExerciseIds = recent.flatMap(plan => 
        plan.blocks.flatMap(b => b.exercises.map(e => e.baseExercise.id))
      );
    } catch (e) {
      console.error(e);
    }
  }

  // Helper para obtener un ejercicio de peso corporal puro de manera 150% infalible
  const getSafeFallbackExercise = (pattern: MovementPattern): Exercise => {
    const found = exerciseDatabase.find(e => 
      e.pattern === pattern && 
      (e.equipmentNeeded.toLowerCase() === 'bodyweight' || 
       e.equipmentNeeded.toLowerCase() === 'ninguno' || 
       e.equipmentNeeded.toLowerCase() === 'body weight')
    );
    if (found) return found;
    
    // Fallback general de peso corporal
    const anyBodyweight = exerciseDatabase.find(e => 
      e.equipmentNeeded.toLowerCase() === 'bodyweight' || 
      e.equipmentNeeded.toLowerCase() === 'ninguno' || 
      e.equipmentNeeded.toLowerCase() === 'body weight'
    );
    return anyBodyweight || exerciseDatabase[0];
  };

  // Filtramos la DB priorizando los que no estén en el historial y coincidan con el inventario de materiales
  const getAvailableExercises = (pattern: MovementPattern): Exercise[] => {
    let pool = exerciseDatabase.filter(e => e.pattern === pattern);

    if (availableMaterials && availableMaterials.length > 0) {
      pool = pool.filter(e => {
        const eq = e.equipmentNeeded.toLowerCase();
        if (eq === 'bodyweight' || eq === 'ninguno' || eq === 'body weight') return true;
        return availableMaterials.some(m => m.toLowerCase() === eq);
      });
    } else {
      pool = pool.filter(e => {
        const eq = e.equipmentNeeded.toLowerCase();
        return eq === 'bodyweight' || eq === 'ninguno' || eq === 'body weight';
      });
    }

    // Si por alguna razón está vacío, forzamos un ejercicio de peso corporal del patrón correspondiente
    if (pool.length === 0) {
      pool = [getSafeFallbackExercise(pattern)];
    }

    const nonRepeated = pool.filter(e => !usedExerciseIds.includes(e.id));
    return nonRepeated.length > 0 ? nonRepeated : pool;
  };

  const getUniqueRandom = (arr: Exercise[], count: number) => {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.max(1, Math.min(count, arr.length)));
  };

  // Helper para aplicar reglas de Escalado Biomecánico
  const applyRestrictions = (exercise: Exercise, activeRestrictions: string[]) => {
    let actualName = exercise.name;
    let appliedRestriction = undefined;

    for (const res of activeRestrictions) {
      if (exercise.restrictionSwaps[res as keyof RestrictionSwaps] && exercise.restrictionSwaps[res as keyof RestrictionSwaps] !== exercise.name) {
        actualName = exercise.restrictionSwaps[res as keyof RestrictionSwaps];
        appliedRestriction = res;
        break; // Solo aplicamos la primera restricción que afecte
      }
    }

    return {
      baseExercise: exercise,
      actualName,
      appliedRestriction,
      reps: '10' // Default
    };
  };

  // Bloque 1: Calentamiento (10 mins)
  const warmupPool = getAvailableExercises('Mobility');
  const warmupE = warmupPool[0] || getSafeFallbackExercise('Mobility');
  
  const warmupCorePool = getAvailableExercises('Core');
  const warmupCore = warmupCorePool[0] || getSafeFallbackExercise('Core');

  const warmupMetPool = getAvailableExercises('Metabolic');
  const warmupMet = warmupMetPool.find(e => e.equipmentNeeded.toLowerCase() === 'bodyweight') || getSafeFallbackExercise('Metabolic');

  const warmup: WorkoutBlock = {
    id: crypto.randomUUID(),
    type: 'Calentamiento',
    name: 'Movilidad y Activación',
    durationMinutes: 10,
    format: 'Circuit',
    exercises: [
      { ...applyRestrictions(warmupE, restrictions), reps: '1 min / lado' },
      { ...applyRestrictions(warmupCore, restrictions), reps: '30 seg' },
      { ...applyRestrictions(warmupMet, restrictions), reps: '10 reps (suave)' }
    ],
    started: false,
    completed: false,
    coachNotes: ''
  };

  // Bloque 2: Fuerza (20 mins)
  const strengthFormat: WorkoutFormat = limitedEquipment ? 'A/B' : 'Circuit';
  let strengthPattern: MovementPattern = focus === 'Lower Body' ? 'Squat' : focus === 'Upper Body' ? 'Push' : 'Hinge';
  
  const strengthPool = getAvailableExercises(strengthPattern);
  const corePool = getAvailableExercises('Core');
  const pullPool = getAvailableExercises('Pull');
  
  const strengthExercises = getUniqueRandom(strengthPool, 2);
  const strength1 = strengthExercises[0] || getSafeFallbackExercise(strengthPattern);
  const strength2 = strengthExercises[1] || getSafeFallbackExercise(strengthPattern);

  const coreExercise = corePool[0] || getSafeFallbackExercise('Core');
  const pullExercise = pullPool[0] || getSafeFallbackExercise('Pull');
  
  // Ejercicio accesorio que sea de peso corporal del patrón Squat o Push para evitar requerir equipamiento extra
  const accessoryExercise = getAvailableExercises('Squat').find(e => e.equipmentNeeded.toLowerCase() === 'bodyweight') || getSafeFallbackExercise('Squat');

  const strength: WorkoutBlock = {
    id: crypto.randomUUID(),
    type: 'Fuerza',
    name: `Fuerza Principal - ${focus}`,
    durationMinutes: 20,
    format: strengthFormat,
    exercises: [
      { ...applyRestrictions(strength1, restrictions), reps: '4 x 8' },
      { ...applyRestrictions(pullExercise, restrictions), reps: '4 x 8' },
      { ...applyRestrictions(coreExercise, restrictions), reps: '4 x 12' },
      { ...applyRestrictions(accessoryExercise, restrictions), reps: '4 x 10 / pierna' }
    ],
    started: false,
    completed: false,
    coachNotes: ''
  };

  // Bloque 3: Metabólico (20 mins)
  const metFormat: WorkoutFormat = limitedEquipment ? 'Parejas 1:1' : (Math.random() > 0.5 ? 'AMRAP' : 'EMOM');
  
  const metPool = getAvailableExercises('Metabolic');
  const metExercises = getUniqueRandom(metPool, 3);
  
  const met1 = metExercises[0] || getSafeFallbackExercise('Metabolic');
  const met2 = metExercises[1] || getSafeFallbackExercise('Metabolic');
  const met3 = metExercises[2] || getSafeFallbackExercise('Metabolic');
  
  // Cuarto ejercicio metabólico siempre de peso corporal puro (como Push-ups o Burpees) para volumen seguro
  const met4 = getAvailableExercises('Push').find(e => e.equipmentNeeded.toLowerCase() === 'bodyweight') || getSafeFallbackExercise('Push');

  const metabolic: WorkoutBlock = {
    id: crypto.randomUUID(),
    type: 'Metabólico',
    name: 'Acondicionamiento (WOD)',
    durationMinutes: 20,
    originalDurationMinutes: 20,
    format: metFormat,
    exercises: [
      { ...applyRestrictions(met1, restrictions), reps: metFormat === 'EMOM' ? '12 reps' : '15 reps' },
      { ...applyRestrictions(met2, restrictions), reps: metFormat === 'EMOM' ? '12 reps' : '20 reps' },
      { ...applyRestrictions(met3, restrictions), reps: metFormat === 'EMOM' ? '10 reps' : '12 reps' },
      { ...applyRestrictions(met4, restrictions), reps: '15 reps' }
    ],
    started: false,
    completed: false,
    coachNotes: ''
  };

  // Bloque 4: Cierre (10 mins)
  const cooldownStretch = getSafeFallbackExercise('Mobility');
  
  const cooldown: WorkoutBlock = {
    id: crypto.randomUUID(),
    type: 'Cierre',
    name: 'Vuelta a la Calma',
    durationMinutes: 10,
    format: 'Flow',
    exercises: [
      { baseExercise: cooldownStretch, actualName: 'Estiramientos Libres', reps: '10 mins', appliedRestriction: undefined }
    ],
    started: false,
    completed: false,
    coachNotes: ''
  };

  const newPlan: WorkoutPlan = {
    id: crypto.randomUUID(),
    date: new Date().toISOString(),
    startTime,
    focus,
    limitedEquipment,
    restrictions,
    blocks: [warmup, strength, metabolic, cooldown],
    coachNotes: 'Mantener buena técnica en las transiciones.',
    planBActivated: false
  };

  // Guardar en historial
  let newHistory = historyRaw ? JSON.parse(historyRaw) : [];
  newHistory.push(newPlan);
  if (newHistory.length > 3) newHistory.shift(); // Mantener solo últimos 3
  localStorage.setItem('workout_history', JSON.stringify(newHistory));

  return newPlan;
}
