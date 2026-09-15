import React, { useState } from 'react';
import { WorkoutPlan } from '../types';
import { KangarooIcon } from './KangarooIcon';
import { PlayCircle, ArrowDown, ArrowUp, Info, CheckCircle2 } from 'lucide-react';
import { MuscleAnatomyVisualizer } from './MuscleAnatomyVisualizer';

interface Props {
  plan: WorkoutPlan;
}

export const StudentView: React.FC<Props> = ({ plan }) => {
  // Student task checklist for extreme interactive UX
  const [completedWorkouts, setCompletedWorkouts] = useState<Record<string, boolean>>({});

  const totalExercisesCount = plan.blocks.reduce((acc, b) => acc + b.exercises.length, 0);
  const completedExercisesCount = Object.values(completedWorkouts).filter(Boolean).length;
  const progressPercent = totalExercisesCount > 0 ? Math.round((completedExercisesCount / totalExercisesCount) * 100) : 0;

  const toggleExerciseCheck = (blockId: string, idx: number) => {
    const key = `${blockId}-${idx}`;
    setCompletedWorkouts(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans pb-24 transition-colors duration-300">
      
      {/* Editorial Kangaroo Studio Header */}
      <div className="bg-white dark:bg-zinc-900 px-6 py-10 rounded-b-3xl border-b border-zinc-150 dark:border-zinc-800/80 relative overflow-hidden shadow-sm">
        
        {/* Abstract watermark */}
        <div className="absolute right-[-20px] top-4 opacity-[0.03] dark:opacity-[0.05] text-amber-500 pointer-events-none select-none">
          <KangarooIcon className="w-48 h-48" />
        </div>

        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-xl bg-amber-500 flex items-center justify-center text-white shadow-md shadow-amber-500/10">
            <KangarooIcon className="w-4.5 h-4.5 text-white" />
          </div>
          <span className="text-[10px] font-bold tracking-wider uppercase text-amber-500">
            KANGAROO ATHLETIC
          </span>
        </div>

        <h1 className="text-xl font-black text-zinc-950 dark:text-zinc-50 tracking-tight leading-none uppercase">
          {plan.focus}
        </h1>
        <p className="text-zinc-400 dark:text-zinc-500 mt-2 font-bold text-[10px] uppercase tracking-wider block">
          INICIO: {plan.startTime} • Clase de 60 minutos
        </p>

        {/* Live student progress dashboard */}
        <div className="mt-6 pt-5 border-t border-zinc-100 dark:border-zinc-800/60">
          <div className="flex justify-between items-center text-xs mb-2">
            <span className="font-bold text-zinc-500 dark:text-zinc-400">Progreso de tu WOD</span>
            <span className="font-extrabold text-amber-500">{completedExercisesCount}/{totalExercisesCount} Completados ({progressPercent}%)</span>
          </div>
          <div className="w-full h-2.5 bg-zinc-100 dark:bg-zinc-950 rounded-full overflow-hidden border border-zinc-200/20">
            <div 
              className="h-full bg-amber-500 rounded-full transition-all duration-500 shadow-sm"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6 mt-4">
        {plan.blocks.map((block, bIdx) => (
          <div key={block.id} className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-150 dark:border-zinc-800 overflow-hidden shadow-sm">
            
            {/* Pure Architectural Header */}
            <div className="p-5 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center bg-zinc-50/50 dark:bg-zinc-950/20">
              <div>
                <span className="text-[9px] text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-wider block">
                  BLOQUE 0{bIdx + 1} • {block.durationMinutes} MIN
                </span>
                <h2 className="text-sm font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight uppercase mt-0.5">{block.name}</h2>
              </div>
              <span className="bg-zinc-100 dark:bg-zinc-950 px-3 py-1.5 rounded-full text-[9px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider border border-zinc-200/50 dark:border-zinc-800/80">
                {block.format}
              </span>
            </div>

            <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {block.exercises.map((ex, eIdx) => {
                const exerciseKey = `${block.id}-${eIdx}`;
                const isChecked = completedWorkouts[exerciseKey];
                
                return (
                  <div key={eIdx} className={`p-5 space-y-4 transition-all duration-300 ${isChecked ? 'bg-zinc-50/40 dark:bg-zinc-950/20 opacity-70' : ''}`}>
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex items-start gap-3">
                        <button 
                          onClick={() => toggleExerciseCheck(block.id, eIdx)}
                          className={`w-6 h-6 mt-0.5 rounded-lg border flex items-center justify-center transition-all ${
                            isChecked 
                              ? 'bg-amber-500 border-amber-500 text-white' 
                              : 'border-zinc-200 dark:border-zinc-700 hover:border-amber-500/40'
                          }`}
                        >
                          {isChecked && <span className="text-xs font-bold">✓</span>}
                        </button>
                        <div>
                          <h3 className={`font-extrabold text-zinc-950 dark:text-zinc-50 text-sm tracking-tight leading-snug transition-all ${isChecked ? 'line-through text-zinc-300 dark:text-zinc-600' : ''}`}>
                            {ex.actualName}
                          </h3>
                          {ex.appliedRestriction && (
                            <span className="inline-flex items-center gap-1 mt-1 px-2.5 py-0.5 rounded-full bg-amber-50/50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 text-[8px] font-bold uppercase tracking-wider">
                              <Info className="w-2.5 h-2.5" /> Variante de Escalado
                            </span>
                          )}
                        </div>
                      </div>
                      <span className={`shrink-0 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 border border-zinc-200/80 dark:border-zinc-800 px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider ${isChecked ? 'opacity-30' : ''}`}>
                        {ex.reps}
                      </span>
                    </div>

                     {/* Visual Supports: Demonstration Media & Biomechanical Muscle Highlighter */}
                    <div className="space-y-3">
                      <div className="aspect-[16/10] w-full rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-950 border border-zinc-200/50 dark:border-zinc-800 relative group shadow-inner">
                        <img 
                          src={ex.baseExercise.imageUrl} 
                          alt={ex.actualName}
                          className={`w-full h-full object-cover transition-all duration-700 ${isChecked ? 'grayscale contrast-75' : 'hover:scale-105'}`}
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      
                      <MuscleAnatomyVisualizer 
                        pattern={ex.baseExercise.pattern} 
                        exerciseName={ex.actualName} 
                      />
                    </div>

                    {/* Clean Editorial Regressions / Progressions Grid */}
                    <div className="grid grid-cols-2 gap-3 pt-1">
                      <div className="bg-zinc-50/80 dark:bg-zinc-950/40 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800/60">
                        <div className="flex items-center gap-1 text-zinc-400 dark:text-zinc-500 mb-1.5">
                          <ArrowDown className="w-3.5 h-3.5" />
                          <span className="text-[9px] font-bold uppercase tracking-wider">Regresión</span>
                        </div>
                        <p className="text-xs font-medium text-zinc-600 dark:text-zinc-400 leading-relaxed">
                          {ex.baseExercise.regression}
                        </p>
                      </div>
                      <div className="bg-zinc-50/80 dark:bg-zinc-950/40 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800/60">
                        <div className="flex items-center gap-1 text-zinc-400 dark:text-zinc-500 mb-1.5">
                          <ArrowUp className="w-3.5 h-3.5" />
                          <span className="text-[9px] font-bold uppercase tracking-wider">Progresión</span>
                        </div>
                        <p className="text-xs font-medium text-zinc-600 dark:text-zinc-400 leading-relaxed">
                          {ex.baseExercise.progression}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
