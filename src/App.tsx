/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { WorkoutPlan, Material } from './types';
import { PlanningPanel } from './components/PlanningPanel';
import { CoachTimer } from './components/CoachTimer';
import { StudentView } from './components/StudentView';
import { MaterialsPanel } from './components/MaterialsPanel';
import { KangarooIcon } from './components/KangarooIcon';
import { Settings, Timer, Smartphone, Moon, Sun, Dumbbell } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

type ViewMode = 'admin' | 'materials' | 'coach' | 'student';

const INITIAL_MATERIALS: Material[] = [
  { name: 'Kettlebell', category: 'Pesos Libres', desc: 'Pesas rusas de varios kilajes', quantity: 12, status: 'Excelente', active: true },
  { name: 'Dumbbells', category: 'Pesos Libres', desc: 'Mancuernas hexagonales o redondas', quantity: 20, status: 'Excelente', active: true },
  { name: 'Barbell', category: 'Pesos Libres', desc: 'Barra olímpica y discos', quantity: 6, status: 'Excelente', active: true },
  { name: 'Pull-up Bar', category: 'Estructuras', desc: 'Barra de dominadas o rack para colgarse', quantity: 8, status: 'Excelente', active: true },
  { name: 'Plyo Box', category: 'Accesorios', desc: 'Cajón pliométrico de madera o espuma', quantity: 5, status: 'Excelente', active: true },
  { name: 'Sandbag', category: 'Carga Funcional', desc: 'Saco de arena inestable', quantity: 4, status: 'Excelente', active: true },
  { name: 'Medicine Ball', category: 'Accesorios', desc: 'Balones medicinales pesados', quantity: 10, status: 'Excelente', active: true },
  { name: 'Jump Rope', category: 'Acondicionamiento', desc: 'Cuerdas de saltar individuales', quantity: 15, status: 'Excelente', active: true }
];

export default function App() {
  const [plan, setPlan] = useState<WorkoutPlan | null>(null);
  const [view, setView] = useState<ViewMode>('admin');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [materials, setMaterials] = useState<Material[]>(() => {
    const saved = localStorage.getItem('structured_materials');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    // Fallback support if they had previous string array
    const legacy = localStorage.getItem('available_materials');
    if (legacy) {
      try {
        const names: string[] = JSON.parse(legacy);
        return INITIAL_MATERIALS.map(m => ({
          ...m,
          active: names.includes(m.name)
        }));
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_MATERIALS;
  });

  useEffect(() => {
    localStorage.setItem('structured_materials', JSON.stringify(materials));
    // Also save simple name list for legacy fallback support
    const activeNames = materials.filter(m => m.active).map(m => m.name);
    localStorage.setItem('available_materials', JSON.stringify(activeNames));
  }, [materials]);


  const handleActivatePlanB = () => {
    if (!plan || plan.planBActivated) return;
    
    // Regla de Plan B Automatizado: Reduce metabólico 30%, bloquea el resto.
    const updatedBlocks = plan.blocks.map(b => {
      if (b.type === 'Metabólico') {
        const newDuration = Math.max(1, Math.floor(b.durationMinutes * 0.7)); // reduce by 30%
        return { ...b, durationMinutes: newDuration };
      }
      return b;
    });

    setPlan({ ...plan, blocks: updatedBlocks, planBActivated: true });
  };

  const handleUpdateBlockNote = (blockId: string, note: string) => {
    if (!plan) return;
    const updatedBlocks = plan.blocks.map(b => b.id === blockId ? { ...b, coachNotes: note } : b);
    setPlan({ ...plan, blocks: updatedBlocks });
  };

  return (
    <div className={`${isDarkMode ? 'dark' : ''}`}>
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans transition-colors duration-300 pb-20">
        
        {/* Premium Soft Curved Navigation Bar */}
        <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-zinc-150 dark:border-zinc-800/80 sticky top-0 z-50">
          <div className="max-w-5xl mx-auto px-6 flex justify-between items-center h-20">
            
            {/* Elegant Modern Branding */}
            <div className="flex items-center gap-3 shrink-0 select-none cursor-pointer" onClick={() => setView('admin')}>
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-lg shadow-amber-500/20 dark:shadow-amber-500/5 transition-transform hover:scale-105 duration-300">
                <KangarooIcon className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-sm tracking-tight text-zinc-950 dark:text-zinc-50">Kangaroo Coach</span>
                <span className="text-[10px] font-bold tracking-wider uppercase text-amber-500 mt-0.5">WOD Studio</span>
              </div>
            </div>

            {/* Rounded Tabs with Soft Highlight */}
            <div className="flex items-center gap-1 bg-zinc-100/80 dark:bg-zinc-950/60 p-1.5 rounded-2xl border border-zinc-200/40 dark:border-zinc-800/60">
              <button 
                onClick={() => setView('admin')}
                className={`px-4.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  view === 'admin' 
                    ? 'bg-white dark:bg-zinc-800 text-zinc-950 dark:text-white shadow-sm font-extrabold' 
                    : 'text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200'
                }`}
              >
                Planificador
              </button>
              <button 
                onClick={() => setView('materials')}
                className={`px-4.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  view === 'materials' 
                    ? 'bg-white dark:bg-zinc-800 text-zinc-950 dark:text-white shadow-sm font-extrabold' 
                    : 'text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200'
                }`}
              >
                Materiales
              </button>
              <button 
                onClick={() => { if(plan) setView('coach'); }}
                disabled={!plan}
                className={`px-4.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  !plan 
                    ? 'opacity-30 cursor-not-allowed' 
                    : view === 'coach' 
                      ? 'bg-amber-500 text-white shadow-md shadow-amber-500/10 font-extrabold' 
                      : 'text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200'
                }`}
              >
                Coach Web
              </button>
              <button 
                onClick={() => { if(plan) setView('student'); }}
                disabled={!plan}
                className={`px-4.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  !plan 
                    ? 'opacity-30 cursor-not-allowed' 
                    : view === 'student' 
                      ? 'bg-amber-500 text-white shadow-md shadow-amber-500/10 font-extrabold' 
                      : 'text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200'
                }`}
              >
                Student Web
              </button>
            </div>

            {/* Dark Mode Control */}
            <div className="flex items-center shrink-0">
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="w-10 h-10 rounded-xl bg-zinc-100/50 hover:bg-zinc-150 dark:bg-zinc-900/60 dark:hover:bg-zinc-850/80 flex items-center justify-center text-zinc-500 dark:text-zinc-400 hover:text-amber-500 dark:hover:text-amber-400 transition-all"
                aria-label="Toggle dark mode"
              >
                {isDarkMode ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Floating WOD Action Bar (Sleek UX for immediate view switching) */}
        {plan && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-zinc-900/90 dark:bg-white/95 text-white dark:text-zinc-950 px-6 py-3.5 rounded-full shadow-2xl backdrop-blur-md flex items-center gap-4 border border-white/10 dark:border-zinc-200/50 animate-in slide-in-from-bottom-12 duration-500">
            <span className="text-xs font-bold flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
              WOD de {plan.focus} Listo
            </span>
            <div className="h-4 w-[1px] bg-white/20 dark:bg-zinc-200" />
            <div className="flex gap-1.5">
              <button 
                onClick={() => setView('coach')} 
                className={`px-3.5 py-1.5 rounded-full text-[11px] font-black tracking-wide uppercase transition-all ${
                  view === 'coach' ? 'bg-amber-500 text-white' : 'hover:bg-white/10 dark:hover:bg-zinc-100 text-zinc-300 dark:text-zinc-700'
                }`}
              >
                Coach View
              </button>
              <button 
                onClick={() => setView('student')} 
                className={`px-3.5 py-1.5 rounded-full text-[11px] font-black tracking-wide uppercase transition-all ${
                  view === 'student' ? 'bg-amber-500 text-white' : 'hover:bg-white/10 dark:hover:bg-zinc-100 text-zinc-300 dark:text-zinc-700'
                }`}
              >
                Student View
              </button>
            </div>
          </div>
        )}

        <main className="pb-16 overflow-hidden">
          <AnimatePresence mode="wait">
            {view === 'admin' && (
              <motion.div
                key="admin"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="pt-8"
              >
                <PlanningPanel 
                  onGenerate={setPlan} 
                  currentPlan={plan} 
                  onUpdateBlockNote={handleUpdateBlockNote} 
                  availableMaterials={materials.filter(m => m.active).map(m => m.name)}
                  onSelectStudentView={() => setView('student')}
                />
              </motion.div>
            )}

            {view === 'materials' && (
              <motion.div
                key="materials"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="pt-8"
              >
                <MaterialsPanel 
                  materials={materials} 
                  onChangeMaterials={setMaterials} 
                />
              </motion.div>
            )}
            
            {view === 'coach' && plan && (
              <motion.div
                key="coach"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="pt-8"
              >
                 <CoachTimer 
                   plan={plan} 
                   onActivatePlanB={handleActivatePlanB} 
                   onUpdateBlockNote={handleUpdateBlockNote}
                 />
              </motion.div>
            )}
            
            {view === 'student' && plan && (
              <motion.div
                key="student"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="pt-8"
              >
                <StudentView plan={plan} />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
