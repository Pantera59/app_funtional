import React, { useState, useEffect } from 'react';
import { KangarooIcon } from './KangarooIcon';
import { BookOpen, Sparkles, CheckCircle2, ShieldAlert, Award, Star, Settings, LayoutDashboard, ChevronDown, ChevronUp } from 'lucide-react';

interface Props {
  focus: string;
  availableMaterials: string[];
  restrictions: string[];
  startTime: string;
  limitedEquipment: boolean;
}

export const KangarooDashboard: React.FC<Props> = ({
  focus,
  availableMaterials,
  restrictions,
  startTime,
  limitedEquipment
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isDefault, setIsDefault] = useState(() => {
    const saved = localStorage.getItem('kangaroo_show_dashboard_default');
    return saved ? saved === 'true' : true; // Default to true so they see it first!
  });

  const handleToggleDefault = () => {
    const nextValue = !isDefault;
    setIsDefault(nextValue);
    localStorage.setItem('kangaroo_show_dashboard_default', String(nextValue));
  };

  // Smart coaching suggestions based on real-time plan configurations
  const getDynamicSuggestions = () => {
    const suggestions = [];

    if (focus === 'Full Body') {
      suggestions.push({
        title: 'Distribución de Carga Bilateral',
        text: 'Al entrenar cuerpo completo, te sugerimos intercalar bloques de empuje con tracción para maximizar la recuperación de las fibras musculares durante la sesión.'
      });
    } else if (focus === 'Upper Body') {
      suggestions.push({
        title: 'Estabilización Escapular Primaria',
        text: 'Para entrenamientos de tren superior, aconsejamos iniciar con un calentamiento enfocado en rotadores de hombro y movilidad de la columna torácica.'
      });
    } else {
      suggestions.push({
        title: 'Activación Glútea Previa',
        text: 'La dominancia de rodilla y cadera requiere una activación de glúteo medio para prevenir desviaciones de valgo dinámico en las sentadillas.'
      });
    }

    if (restrictions.includes('Sin-Impacto')) {
      suggestions.push({
        title: 'Reemplazo Metabólico Seguro',
        text: 'La restricción de impacto está activa. Hemos escalado saltos al cajón por subidas al cajón (Step-ups) controladas y remo para proteger articulaciones.'
      });
    }

    if (availableMaterials.length < 3) {
      suggestions.push({
        title: 'Optimización de Espacio',
        text: 'Detectamos pocos materiales activos. Organiza el box en estaciones compartidas o parejas para agilizar el flujo de atletas sin cuellos de botella.'
      });
    } else {
      suggestions.push({
        title: 'Variabilidad de Estímulos',
        text: '¡Excelente inventario! Tienes materiales diversos activos. Aprovecha el uso de kettlebells y barras para retar el agarre de los atletas.'
      });
    }

    return suggestions;
  };

  const suggestions = getDynamicSuggestions();

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-150 dark:border-zinc-800 overflow-hidden shadow-xl shadow-zinc-100/50 dark:shadow-none transition-all duration-300">
      
      {/* Header Bar */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="p-5 flex items-center justify-between cursor-pointer bg-zinc-50/50 dark:bg-zinc-950/20 border-b border-zinc-100 dark:border-zinc-800 select-none"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <LayoutDashboard className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-zinc-900 dark:text-zinc-50">
              Panel de Bienvenida y Sugerencias de Clase
            </h3>
            <p className="text-[9px] text-zinc-400 dark:text-zinc-500 font-extrabold uppercase tracking-widest mt-0.5">
              Kangaroo Coach Hub & Guía de Inicio
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {/* Default Start Switch Badge */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleToggleDefault();
            }}
            className={`px-3 py-1.5 rounded-xl text-[9px] font-bold uppercase tracking-wider border transition-all flex items-center gap-1.5 ${
              isDefault 
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400' 
                : 'bg-zinc-100 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-zinc-400'
            }`}
            title="Determina si este panel de bienvenida se muestra por defecto al cargar"
          >
            <span className={`w-1.5 h-1.5 rounded-full ${isDefault ? 'bg-amber-500' : 'bg-zinc-400'}`} />
            {isDefault ? 'Inicio Predeterminado' : 'Mostrar al Clicar'}
          </button>
          
          <div className="text-zinc-400 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-all">
            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="p-6 md:p-8 space-y-8 animate-in fade-in duration-300">
          
          {/* Welcome Message Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            
            {/* Visual Brand Welcome */}
            <div className="lg:col-span-5 bg-gradient-to-br from-amber-500 to-orange-600 p-6 rounded-2xl text-white relative overflow-hidden shadow-md">
              <div className="absolute right-[-15px] bottom-[-20px] opacity-[0.12] text-white">
                <KangarooIcon className="w-40 h-40" />
              </div>
              
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center text-white">
                  <Star className="w-4 h-4 fill-white" />
                </div>
                <span className="text-[9px] font-black tracking-widest uppercase">¡Hola Coach!</span>
              </div>
              
              <h4 className="text-base font-black tracking-tight leading-snug uppercase">
                Te damos la bienvenida a la plataforma inteligente de Kangaroo Athletic.
              </h4>
              
              <p className="text-[11px] text-white/90 leading-relaxed mt-3">
                Kangaroo Coach está diseñado para revolucionar la forma en que los entrenadores de boxes de Crossfit y acondicionamiento funcional planifican, controlan el tiempo y enseñan a sus alumnos.
              </p>

              <div className="mt-5 pt-4 border-t border-white/20 grid grid-cols-2 gap-3 text-center">
                <div className="bg-white/10 rounded-xl p-2.5">
                  <span className="block text-sm font-black">100%</span>
                  <span className="text-[7px] font-bold uppercase tracking-wider text-white/80">Adaptado al Box</span>
                </div>
                <div className="bg-white/10 rounded-xl p-2.5">
                  <span className="block text-sm font-black">Plan B</span>
                  <span className="text-[7px] font-bold uppercase tracking-wider text-white/80">Anti-Retrasos</span>
                </div>
              </div>
            </div>

            {/* How it works, Main Function, Deliverables and Benefits */}
            <div className="lg:col-span-7 space-y-5">
              
              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-black text-zinc-900 dark:text-zinc-50 uppercase tracking-wider flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-500" /> ¿Cómo funciona la app?
                  </h4>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1.5 leading-relaxed">
                    Nuestra app cruza en tiempo real el <strong>inventario activo de materiales</strong> con el <strong>enfoque del día</strong> y las <strong>restricciones de tus alumnos</strong>. Con un solo clic, genera una planeación de 60 minutos con calentamiento, bloques de fuerza y trabajo metabólico estructurados matemáticamente.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* What you obtain */}
                  <div className="p-4 bg-zinc-50 dark:bg-zinc-950 rounded-2xl border border-zinc-150 dark:border-zinc-800/80 space-y-1.5">
                    <h5 className="text-[10px] font-black text-zinc-900 dark:text-zinc-50 uppercase tracking-wider flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-amber-500" /> Lo que obtienes
                    </h5>
                    <ul className="text-[10.5px] text-zinc-500 dark:text-zinc-400 space-y-1 leading-snug">
                      <li className="flex items-center gap-1">✓ WODs adaptados al equipo</li>
                      <li className="flex items-center gap-1">✓ Cronómetro interactivo</li>
                      <li className="flex items-center gap-1">✓ Variantes de escalado</li>
                      <li className="flex items-center gap-1">✓ QR para vista de alumnos</li>
                    </ul>
                  </div>

                  {/* Benefits */}
                  <div className="p-4 bg-zinc-50 dark:bg-zinc-950 rounded-2xl border border-zinc-150 dark:border-zinc-800/80 space-y-1.5">
                    <h5 className="text-[10px] font-black text-zinc-900 dark:text-zinc-50 uppercase tracking-wider flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Beneficios Clave
                    </h5>
                    <ul className="text-[10.5px] text-zinc-500 dark:text-zinc-400 space-y-1 leading-snug">
                      <li className="flex items-center gap-1">✦ Clases que inician a tiempo</li>
                      <li className="flex items-center gap-1">✦ Alumnos autónomos (sin pizarra)</li>
                      <li className="flex items-center gap-1">✦ Seguridad articular guiada</li>
                      <li className="flex items-center gap-1">✦ Reducción de carga mental</li>
                    </ul>
                  </div>

                </div>
              </div>

            </div>
          </div>

          {/* Real-time Summary & Suggestions Widget */}
          <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xs font-black text-zinc-900 dark:text-zinc-50 uppercase tracking-wider flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-amber-500" /> Análisis de Sesión y Sugerencias Inteligentes
              </h4>
              <span className="text-[9px] bg-zinc-100 dark:bg-zinc-950 px-2.5 py-1 rounded-full text-zinc-500 dark:text-zinc-400 font-extrabold uppercase tracking-wider">
                Motor IA Activo
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
              
              {/* Configuration Summary Badge 1 */}
              <div className="p-4 bg-zinc-50 dark:bg-zinc-950/40 rounded-2xl border border-zinc-150 dark:border-zinc-800/60 text-center">
                <span className="block text-[8px] font-extrabold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">ENFOQUE SELECCIONADO</span>
                <span className="block text-xs font-black text-zinc-900 dark:text-zinc-100 mt-1 uppercase tracking-wider">{focus}</span>
              </div>

              {/* Configuration Summary Badge 2 */}
              <div className="p-4 bg-zinc-50 dark:bg-zinc-950/40 rounded-2xl border border-zinc-150 dark:border-zinc-800/60 text-center">
                <span className="block text-[8px] font-extrabold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">MATERIALES DISPONIBLES</span>
                <span className="block text-xs font-black text-amber-600 dark:text-amber-400 mt-1 uppercase tracking-wider">{availableMaterials.length} Activos</span>
              </div>

              {/* Configuration Summary Badge 3 */}
              <div className="p-4 bg-zinc-50 dark:bg-zinc-950/40 rounded-2xl border border-zinc-150 dark:border-zinc-800/60 text-center">
                <span className="block text-[8px] font-extrabold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">RESTRICCIONES ACTIVADAS</span>
                <span className="block text-xs font-black text-zinc-900 dark:text-zinc-100 mt-1 uppercase tracking-wider">{restrictions.length || 'Ninguna'}</span>
              </div>

            </div>

            {/* Render dynamically matched recommendations */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {suggestions.map((sug, i) => (
                <div 
                  key={i} 
                  className="p-4 bg-amber-500/[0.03] dark:bg-amber-500/[0.01] border border-amber-500/10 dark:border-amber-500/5 rounded-2xl space-y-1 transition-all hover:bg-amber-500/[0.05]"
                >
                  <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-black uppercase tracking-wider">{sug.title}</span>
                  </div>
                  <p className="text-[11px] text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium">
                    {sug.text}
                  </p>
                </div>
              ))}
            </div>

          </div>

        </div>
      )}
    </div>
  );
};
