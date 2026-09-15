import React, { useState } from 'react';
import { generateWorkout } from '../data';
import { WorkoutPlan } from '../types';
import { KangarooIcon } from './KangarooIcon';
import { Settings, Plus, QrCode, Share, X, Check, Smartphone, Copy } from 'lucide-react';
import { KangarooDashboard } from './KangarooDashboard';

interface Props {
  onGenerate: (plan: WorkoutPlan) => void;
  currentPlan: WorkoutPlan | null;
  onUpdateBlockNote: (blockId: string, note: string) => void;
  availableMaterials: string[];
  onSelectStudentView: () => void;
}

export const PlanningPanel: React.FC<Props> = ({ 
  onGenerate, 
  currentPlan, 
  onUpdateBlockNote,
  availableMaterials,
  onSelectStudentView
}) => {
  const [focus, setFocus] = useState('Full Body');
  const [limitedEquipment, setLimitedEquipment] = useState(false);
  const [restrictions, setRestrictions] = useState<string[]>([]);
  const [startTime, setStartTime] = useState('07:00');
  
  const [showShare, setShowShare] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const handleRestrictionToggle = (r: string) => {
    setRestrictions(prev => 
      prev.includes(r) ? prev.filter(x => x !== r) : [...prev, r]
    );
  };

  const handleGenerate = () => {
    const plan = generateWorkout(focus, limitedEquipment, restrictions, startTime, availableMaterials);
    onGenerate(plan);
  };

  const handleQRClick = () => {
    setShowQR(true);
    setCopiedCode(false);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText('WOD-709-KGR');
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const formatDuration = (mins: number) => {
    return `${mins.toString().padStart(2, '0')}:00`;
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-8 animate-in fade-in duration-500 relative">
      
      {/* Decorative Minimalist Kangaroo Accent Background Seal */}
      <div className="absolute right-8 top-12 opacity-[0.03] dark:opacity-[0.05] text-amber-500 pointer-events-none select-none hidden md:block">
        <KangarooIcon className="w-80 h-80" />
      </div>

      {/* Welcome & Interactive Suggestions Analytics Dashboard */}
      <KangarooDashboard
        focus={focus}
        availableMaterials={availableMaterials}
        restrictions={restrictions}
        startTime={startTime}
        limitedEquipment={limitedEquipment}
      />

      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-150 dark:border-zinc-800 p-6 md:p-8 relative overflow-hidden shadow-xl shadow-zinc-100 dark:shadow-none">
        
        {/* Decorative top accent gradient */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-orange-400 to-amber-600" />

        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-zinc-50 dark:bg-zinc-800/80 flex items-center justify-center text-amber-500 border border-zinc-100 dark:border-zinc-800 shadow-sm">
            <KangarooIcon className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-black text-zinc-950 dark:text-zinc-50 tracking-tight">Planificador Inteligente</h2>
            <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1 font-bold uppercase tracking-wider">SISTEMA DE GENERACIÓN AUTOMÁTICA DE WOD</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <div className="space-y-5">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-2">Enfoque del Día</label>
              <select 
                value={focus} 
                onChange={(e) => setFocus(e.target.value)}
                className="w-full rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 p-4 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-amber-500/20 dark:focus:ring-amber-500/30 tracking-wide cursor-pointer transition-all"
              >
                <option>Full Body</option>
                <option>Upper Body</option>
                <option>Lower Body</option>
              </select>
            </div>
            
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-2">Hora de Inicio de la Clase</label>
              <input 
                type="time" 
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 p-4 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-amber-500/20 dark:focus:ring-amber-500/30 tracking-widest transition-all"
              />
            </div>
            
            <div 
              className="flex items-center gap-4 bg-zinc-50 dark:bg-zinc-950 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 cursor-pointer hover:bg-zinc-100/60 dark:hover:bg-zinc-900/60 transition-all" 
              onClick={() => setLimitedEquipment(!limitedEquipment)}
            >
              <input 
                type="checkbox" 
                id="limitedEq" 
                checked={limitedEquipment} 
                onChange={(e) => setLimitedEquipment(e.target.checked)}
                className="w-5 h-5 rounded-lg border-zinc-300 dark:border-zinc-700 text-amber-500 focus:ring-0 cursor-pointer accent-amber-500"
              />
              <label htmlFor="limitedEq" className="font-bold text-[10px] uppercase text-zinc-700 dark:text-zinc-300 cursor-pointer select-none tracking-wider">
                ¿Equipamiento limitado hoy? (Máx 2 estaciones)
              </label>
            </div>
          </div>

          <div className="space-y-5">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">Restricciones y Escalado Automático</label>
            <div className="flex flex-wrap gap-2.5">
              {['Sin-Impacto', 'Sin-Empuje-Vertical', 'Sin-Flexion-Profunda'].map(res => {
                const isActive = restrictions.includes(res);
                return (
                  <button
                    key={res}
                    onClick={() => handleRestrictionToggle(res)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-2xl text-[10px] font-bold uppercase tracking-wider transition-all border ${
                      isActive 
                        ? 'bg-amber-500 border-amber-500 text-white shadow-md shadow-amber-500/10' 
                        : 'bg-zinc-50 border-zinc-200 text-zinc-600 dark:bg-zinc-950 dark:border-zinc-800 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900'
                    }`}
                  >
                    {isActive && <Check className="w-3.5 h-3.5" />}
                    {res.replace(/-/g, ' ')}
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-zinc-400 dark:text-zinc-500 leading-relaxed">
              Selecciona restricciones para que el algoritmo reemplace automáticamente los movimientos biomecánicos afectados por alternativas seguras según el material de tu gimnasio.
            </p>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-zinc-100 dark:border-zinc-800/80">
          <button 
            onClick={handleGenerate}
            className="w-full py-4 bg-zinc-950 dark:bg-zinc-50 hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-zinc-950 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all shadow-md flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" /> Generar Clase Completa (60 Minutos)
          </button>
          <p className="text-center text-[10px] text-zinc-400 dark:text-zinc-500 mt-4 uppercase tracking-wider">
            Rutina generada dinámicamente según el inventario de materiales activos.
          </p>
        </div>
      </div>

      {currentPlan && (
        <div className="space-y-6">
          
          {/* Dynamic UX Enhancement: Real-time WOD Volume & Muscle Focus Analytics Dashboard */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-150 dark:border-zinc-800 p-5 shadow-sm">
              <span className="text-[9px] font-extrabold uppercase tracking-wider text-amber-500">Volumen Total</span>
              <h4 className="text-2xl font-black text-zinc-900 dark:text-white mt-1">
                {currentPlan.blocks.reduce((acc, b) => acc + b.exercises.length, 0)} Movimientos
              </h4>
              <p className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-1">Distribuidos en {currentPlan.blocks.length} bloques estructurados</p>
            </div>
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-150 dark:border-zinc-800 p-5 shadow-sm">
              <span className="text-[9px] font-extrabold uppercase tracking-wider text-amber-500">Intensidad Estimada</span>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-2xl font-black text-zinc-900 dark:text-white">Media-Alta</span>
                <span className="px-2 py-0.5 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 text-[8px] font-bold rounded-lg uppercase">WOD Activo</span>
              </div>
              <p className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-1">Calorías promedio: 520 kcal / sesión</p>
            </div>
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-150 dark:border-zinc-800 p-5 shadow-sm">
              <span className="text-[9px] font-extrabold uppercase tracking-wider text-amber-500">Enfoque Primario</span>
              <h4 className="text-2xl font-black text-zinc-900 dark:text-white mt-1 uppercase tracking-wide">
                {currentPlan.focus}
              </h4>
              <p className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-1">Esquema biomecánico optimizado</p>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-150 dark:border-zinc-800 overflow-hidden shadow-xl shadow-zinc-100/50 dark:shadow-none animate-in slide-in-from-bottom-4 duration-500">
            <div className="p-6 md:p-8 border-b border-zinc-150 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-950/20 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[9px] font-extrabold uppercase tracking-wider text-white bg-amber-500 px-3 py-1 rounded-full shadow-md shadow-amber-500/10">WOD ACTIVO</span>
                  <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500">INICIO PROGRAMADO: {currentPlan.startTime}</span>
                </div>
                <h3 className="text-lg font-black text-zinc-950 dark:text-zinc-50 mt-3 tracking-tight uppercase">ENFOQUE: {currentPlan.focus}</h3>
              </div>
              <div className="flex gap-3.5 w-full sm:w-auto">
                <button 
                  onClick={handleQRClick}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3.5 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-wider transition-all shadow-md shadow-amber-500/10"
                >
                  <QrCode className="w-4 h-4" /> QR Alumnos
                </button>
                <button 
                  onClick={() => setShowShare(true)}
                  className="flex items-center justify-center gap-2 px-5 py-3.5 bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-950 dark:hover:bg-zinc-900 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-[11px] font-black uppercase tracking-wider transition-all"
                >
                  <Share className="w-4 h-4" /> Compartir
                </button>
              </div>
            </div>
            
            <div className="p-6 md:p-8 space-y-8">
              {currentPlan.blocks.map((block, idx) => (
                <div key={block.id} className="relative pl-8 before:absolute before:left-0 before:top-2 before:bottom-[-40px] last:before:bottom-0 before:w-px before:bg-zinc-100 dark:before:bg-zinc-800">
                  <div className="absolute left-[-3.5px] top-2.5 w-2.5 h-2.5 rounded-full bg-amber-500 border-2 border-white dark:border-zinc-900" />
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
                    <h4 className="font-extrabold text-sm text-zinc-950 dark:text-zinc-50 tracking-tight">{idx + 1}. {block.name}</h4>
                    <span className="self-start sm:self-auto px-3 py-1 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-full text-[9px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider whitespace-nowrap">
                      {formatDuration(block.durationMinutes)} MIN • {block.format}
                    </span>
                  </div>
                  <div className="space-y-3.5 mt-5">
                    {block.exercises.map((ex, i) => (
                      <div key={i} className="flex justify-between items-center p-4 bg-zinc-50/50 dark:bg-zinc-950/30 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/80 transition-all hover:border-amber-500/30">
                        <div>
                          <p className="font-bold text-xs text-zinc-900 dark:text-zinc-100">{ex.actualName}</p>
                          {ex.appliedRestriction && (
                            <p className="text-[10px] text-amber-600 dark:text-amber-400 font-bold mt-1.5 flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Escalado por: {ex.appliedRestriction.replace(/-/g, ' ')}
                            </p>
                          )}
                        </div>
                        <span className="font-bold text-xs bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-800 px-3 py-1.5 rounded-xl whitespace-nowrap ml-4">
                          {ex.reps}
                        </span>
                      </div>
                    ))}
                    
                    {/* Per-block notes */}
                    <div className="mt-4 bg-zinc-50/20 dark:bg-zinc-950/10 p-4.5 rounded-2xl border border-zinc-150 dark:border-zinc-800/50">
                      <label className="block text-[10px] font-bold text-zinc-400 dark:text-zinc-500 mb-2 uppercase tracking-wider">Anotaciones del Coach</label>
                      <textarea 
                        value={block.coachNotes || ''}
                        onChange={(e) => onUpdateBlockNote(block.id, e.target.value)}
                        placeholder="Instrucciones tácticas o aclaraciones para este bloque..."
                        className="w-full p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-xs font-medium text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500/20 resize-none min-h-[75px] leading-relaxed"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShare && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-zinc-900 p-6 md:p-8 rounded-3xl max-w-md w-full relative shadow-2xl border border-zinc-150 dark:border-zinc-800 animate-in zoom-in-95 duration-200">
            <button onClick={() => setShowShare(false)} className="absolute top-6 right-6 text-zinc-400 hover:text-zinc-900 dark:hover:text-white">
              <X className="w-5 h-5" />
            </button>
            <div className="text-left">
              <h3 className="text-base font-black tracking-tight mb-2">Compartir Enlace del WOD</h3>
              <p className="text-xs text-zinc-400 dark:text-zinc-500 mb-6 leading-relaxed">Copia este enlace para enviarlo rápidamente por WhatsApp a tus alumnos o a otros entrenadores.</p>
              
              <div className="flex items-center gap-3">
                <input 
                  readOnly 
                  value="https://app.kangaroo-coach.fit/wod/ab9f2-23k4" 
                  className="w-full p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-xs font-bold text-zinc-900 dark:text-zinc-100"
                />
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText("https://app.kangaroo-coach.fit/wod/ab9f2-23k4");
                    alert("Enlace copiado al portapapeles");
                  }}
                  className="px-5 py-4 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-2xl transition-all uppercase tracking-wider shrink-0 shadow-md shadow-amber-500/10"
                >
                  Copiar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Student QR & Access Code Modal */}
      {showQR && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/55 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white dark:bg-zinc-900 p-6 md:p-8 rounded-3xl max-w-sm w-full relative shadow-2xl border border-zinc-150 dark:border-zinc-800 text-center animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setShowQR(false)} 
              className="absolute top-5 right-5 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
              aria-label="Cerrar modal"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="flex flex-col items-center mt-2">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center mb-3 shadow-md shadow-amber-500/15">
                <QrCode className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-black uppercase tracking-wider text-zinc-900 dark:text-zinc-100">Acceso Alumnos</h3>
              <p className="text-[11px] text-zinc-400 dark:text-zinc-500 mt-1.5 max-w-[240px] leading-relaxed">
                Escanea el código QR o copia el PIN de abajo para que los alumnos carguen la rutina en sus dispositivos.
              </p>
              
              {/* Dynamic 100% Scannable QR Code */}
              <div className="my-6 p-4 bg-white dark:bg-white rounded-2xl border border-zinc-150 inline-block relative shadow-md">
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(`${window.location.origin}${window.location.pathname}?view=student`)}&color=000000`}
                  alt="Código QR de Acceso para Alumnos"
                  className="w-36 h-36 object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Clear and Beautiful Code Accessor */}
              <div className="w-full bg-zinc-50 dark:bg-zinc-950 p-4 rounded-2xl border border-zinc-150 dark:border-zinc-800/80 mb-5">
                <span className="block text-[8px] font-extrabold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">CÓDIGO DE ACCESO</span>
                <div className="flex items-center justify-between mt-1 px-1">
                  <span className="text-sm font-black tracking-widest text-zinc-900 dark:text-zinc-50">
                    WOD-709-KGR
                  </span>
                  <button 
                    onClick={handleCopyCode}
                    className={`p-2.5 rounded-xl transition-all ${
                      copiedCode 
                        ? 'bg-emerald-500/10 text-emerald-600' 
                        : 'bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-850 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-400'
                    }`}
                    title="Copiar código de acceso"
                  >
                    {copiedCode ? (
                      <span className="text-[10px] font-bold uppercase px-0.5">¡Copiado!</span>
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              <button
                onClick={() => {
                  setShowQR(false);
                  onSelectStudentView();
                }}
                className="w-full py-4 bg-amber-500 hover:bg-amber-600 text-white text-xs font-black uppercase tracking-wider rounded-2xl transition-all shadow-md shadow-amber-500/10 flex items-center justify-center gap-2"
              >
                <Smartphone className="w-4 h-4" /> Ir a Vista de Alumno
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
