import React, { useState, useEffect } from 'react';
import { WorkoutPlan } from '../types';
import { KangarooIcon } from './KangarooIcon';
import { Play, Pause, RotateCcw, AlertTriangle, Clock, Zap, BookOpen } from 'lucide-react';
import { differenceInMinutes, parse, addMinutes } from 'date-fns';

interface Props {
  plan: WorkoutPlan;
  onActivatePlanB: () => void;
  onUpdateBlockNote: (blockId: string, note: string) => void;
}

export const CoachTimer: React.FC<Props> = ({ plan, onActivatePlanB, onUpdateBlockNote }) => {
  const [activeBlock, setActiveBlock] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isRunning, setIsRunning] = useState(false);
  const [timeAlert, setTimeAlert] = useState(false);
  
  // Dynamic checklist state for top-tier Coach UX
  const [checkedExercises, setCheckedExercises] = useState<Record<string, boolean>>({});

  // Simulated real time for demo purposes (starts at plan start time)
  const [simulatedTime, setSimulatedTime] = useState(new Date());
  
  useEffect(() => {
    // Initialize simulated time to the plan start time on mount
    const parsedStart = parse(plan.startTime, 'HH:mm', new Date());
    setSimulatedTime(parsedStart);
  }, [plan.startTime]);

  // Wall clock simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setSimulatedTime(prev => addMinutes(prev, 1)); // Advance 1 minute per second for demo purposes!
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Strict Business Rule: Real-Time Sync (Wall clock)
  useEffect(() => {
    const start = parse(plan.startTime, 'HH:mm', new Date());
    const minsPassed = differenceInMinutes(simulatedTime, start);
    
    // Check if 35 mins passed and metabolic block is not started/completed
    const metabolicBlock = plan.blocks.find(b => b.type === 'Metabólico');
    const metabolicStarted = activeBlock === metabolicBlock?.id; // Rough approx for demo
    
    if (minsPassed >= 35 && !metabolicStarted && !plan.planBActivated) {
      setTimeAlert(true);
    } else {
      setTimeAlert(false);
    }
  }, [simulatedTime, plan.startTime, activeBlock, plan.blocks, plan.planBActivated]);

  // Block timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000); // 1 real second per timer second
    } else if (timeLeft === 0) {
      setIsRunning(false);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const toggleTimer = (blockId: string, durationMins: number) => {
    if (activeBlock === blockId) {
      setIsRunning(!isRunning);
    } else {
      setActiveBlock(blockId);
      setTimeLeft(durationMins * 60);
      setIsRunning(true);
    }
  };

  const resetTimer = (durationMins: number) => {
    setTimeLeft(durationMins * 60);
    setIsRunning(false);
  };

  const adjustTimer = (secondsDelta: number) => {
    setTimeLeft(prev => Math.max(0, prev + secondsDelta));
  };

  const toggleExerciseCheck = (blockId: string, exerciseIdx: number) => {
    const key = `${blockId}-${exerciseIdx}`;
    setCheckedExercises(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 pb-24 font-sans">
      
      {/* Premium Dark Navigation Bar */}
      <div className="sticky top-0 z-20 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border-b border-zinc-150 dark:border-zinc-800 px-6 py-5 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-white shadow-md shadow-amber-500/10">
            <KangarooIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">Coach Control</h2>
            <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-wider mt-0.5">Mesa de Control</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100 text-xs font-bold px-3 py-2 bg-zinc-100 dark:bg-zinc-950 rounded-xl border border-zinc-200/50 dark:border-zinc-850">
          <Clock className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500" />
          {simulatedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </div>
      </div>

      <div className="p-4 space-y-6">
        
        {/* Urgent Time Warning Card */}
        {timeAlert && (
          <div className="p-5 bg-red-50 dark:bg-red-950/10 border border-red-200 dark:border-red-900/60 rounded-2xl flex items-start gap-4 animate-bounce">
            <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-red-800 dark:text-red-200 text-xs font-black uppercase tracking-wider">Atraso Crítico (&gt;35 min de clase)</p>
              <p className="text-red-600/90 dark:text-red-400/90 text-xs mt-2 leading-relaxed">
                El tiempo restante no es suficiente para la rutina planeada. Active la compresión automática del WOD.
              </p>
              <button 
                onClick={onActivatePlanB}
                className="mt-4 w-full py-3 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all uppercase tracking-wider shadow-md shadow-red-500/15"
              >
                <Zap className="w-4 h-4 fill-current animate-pulse" /> Activar Plan B (-30% Metabólico)
              </button>
            </div>
          </div>
        )}

        {/* Displaying Plan B Activation feedback inside blocks list */}
        {plan.planBActivated && (
          <div className="p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200/40 dark:border-amber-900/40 text-amber-800 dark:text-amber-300 rounded-2xl text-[10px] font-bold uppercase tracking-wider text-center">
            ⚡ Plan B Activo: Bloque metabólico reducido un 30% para asegurar salida a tiempo
          </div>
        )}

        {/* List of workout blocks */}
        {plan.blocks.map((block, idx) => {
          const isActive = activeBlock === block.id;
          const isAMRAP = block.format === 'AMRAP';
          const isEMOM = block.format === 'EMOM';
          
          return (
            <div 
              key={block.id} 
              className={`rounded-3xl border transition-all duration-300 overflow-hidden ${
                isActive 
                  ? 'bg-white dark:bg-zinc-900 border-amber-500/30 shadow-xl shadow-zinc-100 dark:shadow-none' 
                  : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800/85'
              }`}
            >
              <div className="p-5 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center bg-zinc-50/50 dark:bg-zinc-950/20">
                <div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${isActive ? 'text-amber-500' : 'text-zinc-400 dark:text-zinc-500'}`}>
                    Bloque {idx + 1} // {block.type}
                  </span>
                  <h3 className="font-extrabold text-sm uppercase tracking-tight mt-1 text-zinc-900 dark:text-zinc-150">{block.name}</h3>
                </div>
                <div className="text-right">
                  <span className="block text-xs font-bold tracking-wider text-zinc-900 dark:text-zinc-100">
                    {block.durationMinutes.toString().padStart(2, '0')}:00 MIN
                  </span>
                  <span className="block text-[10px] text-zinc-400 dark:text-zinc-500 font-bold tracking-wider mt-1 uppercase">{block.format}</span>
                </div>
              </div>

              {/* Active Block View Controls and Timer Display */}
              {isActive && (
                <div className="p-6 flex flex-col items-center justify-center border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/30 dark:bg-zinc-950/40">
                  <div className="text-5xl font-black tracking-tight tabular-nums text-zinc-950 dark:text-white flex items-center gap-1">
                    {formatTime(timeLeft)}
                  </div>
                  
                  {/* Dynamic formats badges */}
                  <div className="mt-3 text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 flex items-center gap-2">
                    <span className={`w-1.5 h-1.5 rounded-full ${isRunning ? 'bg-emerald-500 animate-ping' : 'bg-zinc-400'}`} />
                    {isRunning ? 'Corriendo' : 'Pausado'} • {isAMRAP ? 'AMRAP Mode' : isEMOM ? 'EMOM' : 'Contrarreloj'}
                  </div>

                  {/* Play, Pause, Reset and Dynamic Adjustment Controls */}
                  <div className="flex items-center gap-3 mt-6">
                    <button 
                      onClick={() => adjustTimer(-60)}
                      className="px-3.5 py-2.5 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 text-[11px] font-bold rounded-xl transition-all"
                      title="Quitar 1 Minuto"
                    >
                      -1 min
                    </button>

                    <button 
                      onClick={() => toggleTimer(block.id, block.durationMinutes)}
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-md ${
                        isRunning 
                          ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-500/10' 
                          : 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/10'
                      }`}
                    >
                      {isRunning ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
                    </button>
                    
                    <button 
                      onClick={() => resetTimer(block.durationMinutes)}
                      className="w-12 h-12 rounded-2xl bg-white dark:bg-zinc-850 border border-zinc-200 dark:border-zinc-750 text-zinc-900 dark:text-zinc-100 flex items-center justify-center hover:bg-zinc-50 transition-all shadow-xs"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>

                    <button 
                      onClick={() => adjustTimer(60)}
                      className="px-3.5 py-2.5 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 text-[11px] font-bold rounded-xl transition-all"
                      title="Agregar 1 Minuto"
                    >
                      +1 min
                    </button>
                  </div>
                </div>
              )}

              {/* List of Block Exercises */}
              <div className="p-5 space-y-4">
                {block.exercises.map((ex, i) => {
                  const isChecked = checkedExercises[`${block.id}-${i}`];
                  return (
                    <div 
                      key={i} 
                      onClick={() => toggleExerciseCheck(block.id, i)}
                      className="flex justify-between items-center cursor-pointer select-none group p-1.5 hover:bg-zinc-50/50 dark:hover:bg-zinc-950/20 rounded-xl transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-md border flex items-center justify-center text-[10px] font-black transition-all ${
                          isChecked 
                            ? 'bg-amber-500 border-amber-500 text-white' 
                            : 'border-zinc-200 dark:border-zinc-800 text-zinc-400 group-hover:border-amber-500/40 bg-zinc-50/40 dark:bg-zinc-950'
                        }`}>
                          {isChecked ? '✓' : i + 1}
                        </div>
                        <div>
                          <p className={`text-xs font-bold uppercase tracking-wide transition-all ${
                            isChecked 
                              ? 'line-through text-zinc-300 dark:text-zinc-600' 
                              : ex.appliedRestriction 
                                ? 'text-amber-600 dark:text-amber-400' 
                                : 'text-zinc-900 dark:text-zinc-100'
                          }`}>
                            {ex.actualName}
                          </p>
                          {ex.appliedRestriction && (
                            <p className="text-[9px] text-amber-600 dark:text-amber-500 font-bold uppercase tracking-wider mt-0.5">Variante</p>
                          )}
                        </div>
                      </div>
                      <span className={`text-[10px] font-bold bg-zinc-50 dark:bg-zinc-950 px-2.5 py-1 border border-zinc-200 dark:border-zinc-855 rounded-lg transition-all ${
                        isChecked ? 'opacity-30' : 'text-zinc-500'
                      }`}>
                        {ex.reps}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Real-time annotations of the coach inside this block */}
              <div className="px-5 pb-5 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                <div className="bg-zinc-50 dark:bg-zinc-950/40 p-4 rounded-2xl border border-zinc-150 dark:border-zinc-800/80 space-y-2">
                  <div className="flex items-center gap-1.5 text-zinc-400 dark:text-zinc-500">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span className="text-[9px] font-bold uppercase tracking-wider">Anotaciones del Coach</span>
                  </div>
                  <textarea
                    value={block.coachNotes || ''}
                    onChange={(e) => onUpdateBlockNote(block.id, e.target.value)}
                    placeholder="Escribe aclaraciones, tips de técnica o variaciones para este bloque..."
                    className="w-full bg-transparent text-xs text-zinc-600 dark:text-zinc-300 placeholder-zinc-400 font-medium focus:outline-none resize-none min-h-[55px] leading-relaxed"
                  />
                </div>
              </div>
              
              {!isActive && (
                <div className="p-5 pt-0">
                  <button 
                    onClick={() => toggleTimer(block.id, block.durationMinutes)}
                    className="w-full py-3.5 bg-zinc-950 dark:bg-zinc-50 hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-zinc-950 rounded-2xl text-[11px] font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" /> Iniciar Bloque
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
