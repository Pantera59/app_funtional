import React from 'react';
import { MovementPattern } from '../types';

interface Props {
  pattern: MovementPattern;
  exerciseName: string;
}

export const MuscleAnatomyVisualizer: React.FC<Props> = ({ pattern, exerciseName }) => {
  // Get highlighted muscles and labels based on the movement pattern
  const getMuscleDetails = (pat: MovementPattern) => {
    switch (pat) {
      case 'Squat':
        return {
          muscles: ['Cuádriceps', 'Glúteos', 'Pantorrillas'],
          description: 'Enfoque en extensión de rodilla y empuje del tren inferior.',
          highlights: { quads: true, glutes: true, calves: true }
        };
      case 'Hinge':
        return {
          muscles: ['Glúteo Mayor', 'Isquiotibiales (Femorales)', 'Erectores Espinales'],
          description: 'Dominancia de cadera y activación de la cadena posterior.',
          highlights: { glutes: true, hamstrings: true, lowerBack: true }
        };
      case 'Push':
        return {
          muscles: ['Pectoral Mayor', 'Deltoides Anterior', 'Tríceps Branquial'],
          description: 'Fuerza de empuje del tren superior.',
          highlights: { chest: true, shoulders: true, triceps: true }
        };
      case 'Pull':
        return {
          muscles: ['Dorsal Ancho', 'Redondo Mayor', 'Bíceps Branquial', 'Trapecios'],
          description: 'Fuerza de tracción y estabilidad escapular.',
          highlights: { back: true, shoulders: true, biceps: true }
        };
      case 'Core':
        return {
          muscles: ['Recto Abdominal', 'Oblicuos', 'Transverso del Abdomen'],
          description: 'Estabilización lumbo-pélvica y resistencia del núcleo.',
          highlights: { abs: true, obliques: true }
        };
      case 'Metabolic':
        return {
          muscles: ['Sistema Cardiovascular', 'Cuádriceps', 'Deltoides', 'Núcleo Activo'],
          description: 'Acondicionamiento de alta intensidad de cuerpo completo.',
          highlights: { quads: true, glutes: true, shoulders: true, abs: true, cardio: true }
        };
      default:
        return {
          muscles: ['Flexores de Cadera', 'Isquiotibiales', 'Movilidad Articular'],
          description: 'Liberación miofascial, estiramiento dinámico y flexibilidad.',
          highlights: { joint: true, glutes: true, hamstrings: true }
        };
    }
  };

  const { muscles, description, highlights } = getMuscleDetails(pattern);

  return (
    <div className="bg-zinc-100 dark:bg-zinc-950 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/80 p-4 flex flex-col md:flex-row items-center gap-4 transition-all shadow-inner relative overflow-hidden">
      
      {/* Dynamic Grid Background for Biomechanical Look */}
      <div className="absolute inset-0 bg-[radial-gradient(#e4e4e7_1px,transparent_1px)] dark:bg-[radial-gradient(#18181b_1px,transparent_1px)] [background-size:16px_16px] opacity-60 pointer-events-none" />

      {/* Muscular Human Vector Visualization (Matches user reference) */}
      <div className="relative w-36 h-56 flex-shrink-0 flex items-center justify-center bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200/60 dark:border-zinc-800/60 shadow-sm overflow-hidden p-2">
        <svg viewBox="0 0 100 160" className="w-full h-full text-zinc-300 dark:text-zinc-700 filter drop-shadow-md">
          {/* Main Body Shadow Contour */}
          <g className="transition-all duration-500">
            {/* Head & Neck */}
            <circle cx="50" cy="20" r="8" fill="currentColor" opacity="0.4" />
            <path d="M46,26 C46,26 44,32 50,32 C56,32 54,26 54,26 Z" fill="currentColor" opacity="0.5" />
            
            {/* Ribcage / Torso Outline */}
            <path d="M38,36 C34,42 34,60 38,72 C42,76 58,76 62,72 C66,60 66,42 62,36 C57,33 43,33 38,36 Z" fill="currentColor" opacity="0.3" />

            {/* Left Arm & Shoulder */}
            <path d="M36,36 C33,38 29,48 29,56 C29,62 31,68 33,72 C34,72 36,66 36,56 Z" fill="currentColor" opacity="0.35" />
            {/* Right Arm & Shoulder */}
            <path d="M64,36 C67,38 71,48 71,56 C71,62 69,68 67,72 C66,72 64,66 64,56 Z" fill="currentColor" opacity="0.35" />

            {/* Pelvis & Hips */}
            <path d="M38,72 C38,72 36,88 41,92 C46,95 54,95 59,92 C64,88 62,72 62,72 Z" fill="currentColor" opacity="0.4" />

            {/* Left Leg (Thigh, Knee, Calf, Foot) */}
            <path d="M39,92 C36,104 35,116 39,124 C41,124 43,118 43,108 C43,98 44,94 44,92 Z" fill="currentColor" opacity="0.3" />
            <circle cx="41" cy="126" r="3" fill="currentColor" opacity="0.5" />
            <path d="M39,128 C36,134 37,144 41,152 C43,152 44,142 43,132 Z" fill="currentColor" opacity="0.3" />
            
            {/* Right Leg (Thigh, Knee, Calf, Foot) */}
            <path d="M61,92 C64,104 65,116 61,124 C59,124 57,118 57,108 C57,98 56,94 56,92 Z" fill="currentColor" opacity="0.3" />
            <circle cx="59" cy="126" r="3" fill="currentColor" opacity="0.5" />
            <path d="M61,128 C64,134 63,144 59,152 C57,152 56,142 57,132 Z" fill="currentColor" opacity="0.3" />
          </g>

          {/* ACTIVE BIOMECHANICAL ANATOMY MUSCLE OVERLAYS (Glowing red highlight loops) */}
          
          {/* 1. Chest / Pectorales */}
          {highlights.hasOwnProperty('chest') && (
            <path 
              d="M40,40 C43,39 50,42 50,46 C50,42 57,39 60,40 C61,45 56,52 50,54 C44,52 39,45 40,40 Z" 
              className="fill-red-500 dark:fill-red-600 animate-pulse" 
              opacity="0.85" 
            />
          )}

          {/* 2. Shoulders / Deltoides */}
          {highlights.hasOwnProperty('shoulders') && (
            <g className="fill-red-500 dark:fill-red-600 animate-pulse" opacity="0.85">
              {/* Left Shoulder */}
              <path d="M33,36 C35,36 38,39 37,44 C34,44 32,40 33,36 Z" />
              {/* Right Shoulder */}
              <path d="M67,36 C65,36 62,39 63,44 C66,44 68,40 67,36 Z" />
            </g>
          )}

          {/* 3. Back / Dorsales */}
          {highlights.hasOwnProperty('back') && (
            <path 
              d="M39,44 C42,48 44,58 44,68 C47,68 53,68 56,68 C56,58 58,48 61,44 C56,40 44,40 39,44 Z" 
              className="fill-red-500 dark:fill-red-600 animate-pulse" 
              opacity="0.8" 
            />
          )}

          {/* 4. Abdominals / Core */}
          {highlights.hasOwnProperty('abs') && (
            <path 
              d="M44,48 C48,47 52,47 56,48 C57,54 57,64 56,68 C52,70 48,70 44,68 C43,64 43,54 44,48 Z" 
              className="fill-red-500 dark:fill-red-600 animate-pulse" 
              opacity="0.8" 
            />
          )}

          {/* 5. Gluteus */}
          {highlights.hasOwnProperty('glutes') && (
            <g className="fill-red-500 dark:fill-red-600 animate-pulse" opacity="0.85">
              {/* Left Glute */}
              <path d="M39,74 C43,74 46,78 45,86 C40,86 37,82 39,74 Z" />
              {/* Right Glute */}
              <path d="M61,74 C57,74 54,78 55,86 C60,86 63,82 61,74 Z" />
            </g>
          )}

          {/* 6. Quadriceps */}
          {highlights.hasOwnProperty('quads') && (
            <g className="fill-red-500 dark:fill-red-600 animate-pulse" opacity="0.85">
              {/* Left Quad */}
              <path d="M38,92 C42,91 44,102 44,116 C41,118 38,106 38,92 Z" />
              {/* Right Quad */}
              <path d="M62,92 C58,91 56,102 56,116 C59,118 62,106 62,92 Z" />
            </g>
          )}

          {/* 7. Hamstrings / Femorales */}
          {highlights.hasOwnProperty('hamstrings') && (
            <g className="fill-red-500 dark:fill-red-600 animate-pulse" opacity="0.8">
              {/* Left Hamstring */}
              <path d="M39,94 C41,94 43,104 43,114 C40,114 38,104 39,94 Z" />
              {/* Right Hamstring */}
              <path d="M61,94 C59,94 57,104 57,114 C60,114 62,104 61,94 Z" />
            </g>
          )}

          {/* 8. Calves / Pantorrillas */}
          {highlights.hasOwnProperty('calves') && (
            <g className="fill-red-500 dark:fill-red-600 animate-pulse" opacity="0.85">
              {/* Left Calf */}
              <path d="M39,128 C41,128 42,136 41,146 C38,146 38,136 39,128 Z" />
              {/* Right Calf */}
              <path d="M61,128 C59,128 58,136 59,146 C62,146 62,136 61,128 Z" />
            </g>
          )}

          {/* 9. Triceps & Biceps */}
          {highlights.hasOwnProperty('triceps') && (
            <g className="fill-red-500 dark:fill-red-600 animate-pulse" opacity="0.8">
              <path d="M29,46 C31,46 32,54 31,60 C29,60 28,54 29,46 Z" />
              <path d="M71,46 C69,46 68,54 69,60 C71,60 72,54 71,46 Z" />
            </g>
          )}
          {highlights.hasOwnProperty('biceps') && (
            <g className="fill-red-500 dark:fill-red-600 animate-pulse" opacity="0.8">
              <path d="M34,46 C35,46 36,54 35,60 C33,60 33,54 34,46 Z" />
              <path d="M66,46 C65,46 64,54 65,60 C67,60 67,54 66,46 Z" />
            </g>
          )}
        </svg>

        {/* Heart Rate / Biometrics overlay indicator */}
        <div className="absolute top-2 left-2 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
          <span className="text-[7px] font-black uppercase text-zinc-400 dark:text-zinc-500">EMG ACTIVO</span>
        </div>
      </div>

      {/* Muscle Explanatory details panel */}
      <div className="flex-1 space-y-2 text-left w-full">
        <div>
          <span className="text-[8px] font-extrabold uppercase tracking-widest text-red-500 dark:text-red-400">
            Grupo Muscular Objetivo
          </span>
          <div className="flex flex-wrap gap-1.5 mt-1">
            {muscles.map((m, i) => (
              <span 
                key={i} 
                className="px-2 py-0.5 rounded-md bg-red-500/10 dark:bg-red-500/15 text-red-600 dark:text-red-400 text-[9px] font-black uppercase tracking-wider border border-red-500/20"
              >
                {m}
              </span>
            ))}
          </div>
        </div>

        <p className="text-[11px] font-medium text-zinc-600 dark:text-zinc-400 leading-relaxed">
          {description}
        </p>
      </div>

    </div>
  );
};
