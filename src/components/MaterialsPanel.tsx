import React, { useState } from 'react';
import { Material } from '../types';
import { KangarooIcon } from './KangarooIcon';
import { Dumbbell, Plus, Trash2, CheckCircle, HelpCircle, Activity, Shield, Hammer, ShieldAlert } from 'lucide-react';

interface Props {
  materials: Material[];
  onChangeMaterials: (materials: Material[]) => void;
}

const CATEGORIES = ['Pesos Libres', 'Estructuras', 'Accesorios', 'Cardio', 'Carga Funcional', 'Acondicionamiento'];
const STATUSES: ('Excelente' | 'Desgastado' | 'Mantenimiento')[] = ['Excelente', 'Desgastado', 'Mantenimiento'];

export const MaterialsPanel: React.FC<Props> = ({ materials, onChangeMaterials }) => {
  // Estado para el formulario de nuevo material
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState('Pesos Libres');
  const [newDesc, setNewDesc] = useState('');
  const [newQuantity, setNewQuantity] = useState(5);
  const [newStatus, setNewStatus] = useState<'Excelente' | 'Desgastado' | 'Mantenimiento'>('Excelente');

  // Advanced UX Filtering states
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<'todos' | 'activos' | 'inactivos'>('todos');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');

  const handleToggleActive = (index: number) => {
    const updated = [...materials];
    updated[index].active = !updated[index].active;
    onChangeMaterials(updated);
  };

  const handleUpdateQuantity = (index: number, delta: number) => {
    const updated = [...materials];
    updated[index].quantity = Math.max(0, updated[index].quantity + delta);
    onChangeMaterials(updated);
  };

  const handleUpdateStatus = (index: number, status: 'Excelente' | 'Desgastado' | 'Mantenimiento') => {
    const updated = [...materials];
    updated[index].status = status;
    onChangeMaterials(updated);
  };

  const handleDeleteMaterial = (index: number) => {
    const updated = materials.filter((_, i) => i !== index);
    onChangeMaterials(updated);
  };

  const handleAddMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const newMaterial: Material = {
      name: newName.trim(),
      category: newCategory,
      desc: newDesc.trim() || 'Material personalizado añadido',
      quantity: newQuantity,
      status: newStatus,
      active: true
    };

    onChangeMaterials([...materials, newMaterial]);

    // Resetear form
    setNewName('');
    setNewDesc('');
    setNewQuantity(5);
    setNewStatus('Excelente');
    setShowAddForm(false);
  };

  const handleSelectAll = () => {
    const updated = materials.map(m => ({ ...m, active: true }));
    onChangeMaterials(updated);
  };

  const handleSelectNone = () => {
    const updated = materials.map(m => ({ ...m, active: false }));
    onChangeMaterials(updated);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Excelente':
        return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      case 'Desgastado':
        return <ShieldAlert className="w-4 h-4 text-amber-500" />;
      case 'Mantenimiento':
        return <Hammer className="w-4 h-4 text-rose-500" />;
      default:
        return <HelpCircle className="w-4 h-4 text-zinc-400" />;
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'Excelente':
        return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900/50';
      case 'Desgastado':
        return 'bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-300 border-amber-200 dark:border-amber-900/50';
      case 'Mantenimiento':
        return 'bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-300 border-rose-200 dark:border-rose-900/50';
      default:
        return 'bg-zinc-50 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700';
    }
  };

  // Filter materials based on search & filters
  const filteredMaterials = materials.filter((m, idx) => {
    const matchesSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          m.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesActive = activeFilter === 'todos' ? true : 
                          activeFilter === 'activos' ? m.active : !m.active;

    const matchesCategory = selectedCategory === 'Todas' ? true : m.category === selectedCategory;

    return matchesSearch && matchesActive && matchesCategory;
  });

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-8 animate-in fade-in duration-500">
      
      {/* Header Panel */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-150 dark:border-zinc-800 p-6 md:p-8 relative overflow-hidden shadow-xl shadow-zinc-100 dark:shadow-none">
        
        {/* Decorative top accent gradient */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-orange-400 to-amber-600" />

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-zinc-50 dark:bg-zinc-800/80 flex items-center justify-center text-amber-500 border border-zinc-100 dark:border-zinc-800 shadow-sm">
              <KangarooIcon className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-black text-zinc-950 dark:text-zinc-50 tracking-tight">Inventario de Materiales</h2>
              <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1 font-bold uppercase tracking-wider">
                GESTIÓN DE DISPONIBILIDAD PARA EL MOTOR DE SELECCIÓN
              </p>
            </div>
          </div>
          <div className="flex gap-3 w-full md:w-auto flex-wrap">
            <button 
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-5 py-3.5 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-wider transition-all shadow-md shadow-amber-500/10"
            >
              <Plus className="w-4 h-4" /> Agregar Material
            </button>
            <button 
              onClick={handleSelectAll}
              className="px-4 py-3 bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-950 dark:hover:bg-zinc-905 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-800 text-[10px] font-bold rounded-2xl uppercase tracking-wider transition-all"
            >
              Activar Todo
            </button>
            <button 
              onClick={handleSelectNone}
              className="px-4 py-3 bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-950 dark:hover:bg-zinc-905 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-800 text-[10px] font-bold rounded-2xl uppercase tracking-wider transition-all"
            >
              Desactivar Todo
            </button>
          </div>
        </div>

        {/* Formulario Añadir Nuevo Material */}
        {showAddForm && (
          <form onSubmit={handleAddMaterial} className="mt-8 p-6 bg-zinc-50 dark:bg-zinc-950/60 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-5 animate-in slide-in-from-top-4 duration-300">
            <h3 className="font-extrabold text-xs text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">Nuevo Equipamiento</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-2">Nombre del Material</label>
                <input 
                  type="text" 
                  value={newName} 
                  onChange={(e) => setNewName(e.target.value)} 
                  placeholder="Ej. Bandas Elásticas, TRX..."
                  className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-bold text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-2">Categoría</label>
                <select 
                  value={newCategory} 
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-bold text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500/20 uppercase tracking-wider cursor-pointer"
                >
                  {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-2">Descripción corta</label>
                <input 
                  type="text" 
                  value={newDesc} 
                  onChange={(e) => setNewDesc(e.target.value)} 
                  placeholder="Ej. Kit de bandas de resistencia de látex"
                  className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-bold text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-2">Cantidad Disponible</label>
                <input 
                  type="number" 
                  value={newQuantity} 
                  onChange={(e) => setNewQuantity(parseInt(e.target.value) || 0)} 
                  min="0"
                  className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-bold text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-2">Estado Físico</label>
                <select 
                  value={newStatus} 
                  onChange={(e) => setNewStatus(e.target.value as any)}
                  className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-bold text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500/20 uppercase tracking-wider cursor-pointer"
                >
                  {STATUSES.map(st => <option key={st} value={st}>{st}</option>)}
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-3">
              <button 
                type="button" 
                onClick={() => setShowAddForm(false)}
                className="px-5 py-3 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-850 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-300 text-[10px] font-bold rounded-xl uppercase tracking-wider transition-all"
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                className="px-5 py-3 bg-amber-500 hover:bg-amber-600 text-white text-[10px] font-bold rounded-xl uppercase tracking-wider transition-all shadow-md shadow-amber-500/10"
              >
                Añadir
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Advanced UX search and category filters */}
      <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-zinc-150 dark:border-zinc-800 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-72">
          <input 
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar material..."
            className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-xs font-bold text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500/15"
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 font-extrabold text-xs">×</button>
          )}
        </div>

        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          {/* Active status filter */}
          <div className="flex bg-zinc-100 dark:bg-zinc-950 p-1 rounded-xl border border-zinc-200/50 dark:border-zinc-800">
            <button 
              onClick={() => setActiveFilter('todos')}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${activeFilter === 'todos' ? 'bg-white dark:bg-zinc-800 text-zinc-950 dark:text-white shadow-xs' : 'text-zinc-500'}`}
            >
              Todos
            </button>
            <button 
              onClick={() => setActiveFilter('activos')}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${activeFilter === 'activos' ? 'bg-white dark:bg-zinc-800 text-zinc-950 dark:text-white shadow-xs' : 'text-zinc-500'}`}
            >
              Activos
            </button>
            <button 
              onClick={() => setActiveFilter('inactivos')}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${activeFilter === 'inactivos' ? 'bg-white dark:bg-zinc-800 text-zinc-950 dark:text-white shadow-xs' : 'text-zinc-500'}`}
            >
              Inactivos
            </button>
          </div>

          {/* Category filter */}
          <select 
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-1.5 bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-[10px] font-bold text-zinc-800 dark:text-zinc-200 focus:outline-none cursor-pointer uppercase tracking-wider"
          >
            <option value="Todas">Todas las categorías</option>
            {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>
      </div>

      {/* Lista de Materiales */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 animate-in fade-in-50 duration-500">
        {filteredMaterials.map((m) => {
          // Find actual index in global materials array
          const originalIdx = materials.findIndex(mat => mat.name === m.name);
          if (originalIdx === -1) return null;

          return (
            <div 
              key={m.name}
              className={`p-6 rounded-2xl border transition-all flex flex-col justify-between gap-5 relative overflow-hidden ${
                m.active 
                  ? 'bg-white dark:bg-zinc-900 border-amber-500/30 shadow-md shadow-zinc-100 dark:shadow-none' 
                  : 'bg-zinc-50 dark:bg-zinc-950/40 border-zinc-200 dark:border-zinc-800/80 opacity-60 hover:opacity-85'
              }`}
            >
              <div className="flex justify-between items-start gap-4">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-extrabold text-sm text-zinc-950 dark:text-zinc-50 tracking-tight">{m.name}</h4>
                    <span className="px-2.5 py-0.5 bg-zinc-50 dark:bg-zinc-950 text-[9px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 border border-zinc-200/50 dark:border-zinc-800/60 rounded-full">
                      {m.category}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 font-medium leading-relaxed">{m.desc}</p>
                </div>

                {/* Minimalist Toggle Switch */}
                <button 
                  onClick={() => handleToggleActive(originalIdx)}
                  className={`w-10 h-6 flex items-center rounded-full p-1 transition-all duration-300 border ${
                    m.active 
                      ? 'bg-amber-500 border-amber-500 justify-end' 
                      : 'bg-zinc-150 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 justify-start'
                  }`}
                >
                  <div className="w-4 h-4 bg-white rounded-full shadow-sm" />
                </button>
              </div>

              {/* Controles de Estado y Cantidad */}
              <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800/60 flex justify-between items-center gap-4 flex-wrap">
                {/* Estado */}
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">Estado</span>
                  <select 
                    value={m.status} 
                    onChange={(e) => handleUpdateStatus(originalIdx, e.target.value as any)}
                    className="text-[10px] font-bold px-2.5 py-1.5 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 rounded-xl focus:outline-none uppercase tracking-wider cursor-pointer"
                  >
                    {STATUSES.map(st => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>

                {/* Cantidad y Eliminar */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 bg-zinc-50 dark:bg-zinc-950 px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800">
                    <span className="text-[9px] font-bold uppercase text-zinc-400 dark:text-zinc-500">Cant:</span>
                    <button 
                      onClick={() => handleUpdateQuantity(originalIdx, -1)}
                      className="w-5 h-5 bg-white dark:bg-zinc-900 hover:bg-zinc-100 text-xs font-black flex items-center justify-center text-zinc-900 dark:text-zinc-100 transition-colors border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-xs"
                    >
                      -
                    </button>
                    <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 min-w-[0.75rem] text-center">
                      {m.quantity}
                    </span>
                    <button 
                      onClick={() => handleUpdateQuantity(originalIdx, 1)}
                      className="w-5 h-5 bg-white dark:bg-zinc-900 hover:bg-zinc-100 text-xs font-black flex items-center justify-center text-zinc-900 dark:text-zinc-100 transition-colors border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-xs"
                    >
                      +
                    </button>
                  </div>

                  {/* Si es un material añadido manualmente, permitimos eliminarlo */}
                  {!['Kettlebell', 'Dumbbells', 'Barbell', 'Pull-up Bar', 'Plyo Box', 'Sandbag', 'Medicine Ball', 'Jump Rope'].includes(m.name) && (
                    <button 
                      onClick={() => handleDeleteMaterial(originalIdx)}
                      className="p-2 bg-zinc-100 hover:bg-red-50 dark:bg-zinc-850 dark:hover:bg-red-950/20 text-red-500 rounded-xl border border-zinc-200 dark:border-zinc-800 transition-all"
                      title="Eliminar del inventario"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredMaterials.length === 0 && (
        <div className="text-center py-12 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-150 dark:border-zinc-800">
          <p className="text-xs font-bold text-zinc-400 dark:text-zinc-500">No se encontraron materiales con los filtros actuales.</p>
        </div>
      )}

      {/* Info Box */}
      <div className="p-5 bg-zinc-100/50 dark:bg-zinc-900/40 rounded-2xl border border-zinc-150 dark:border-zinc-800/80 flex items-center gap-4">
        <div className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
          <strong>Peso Corporal (Bodyweight):</strong> Siempre está activo en el motor de generación para asegurar la máxima biomecánica funcional independientemente de la carga externa.
        </p>
      </div>
    </div>
  );
};
