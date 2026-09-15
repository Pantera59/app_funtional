'use client';

import { Plus, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input, Select } from '@/components/ui/field';
import { PanelHeader } from '@/components/ui/panel-header';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { isDefaultMaterial, MATERIAL_CATEGORIES } from '@/lib/domain/constants';
import type { Material } from '@/lib/domain/types';
import { useAppState } from '@/providers/app-state-provider';
import { AddMaterialForm } from './add-material-form';
import { MaterialCard } from './material-card';

type ActiveFilter = 'todos' | 'activos' | 'inactivos';

const ACTIVE_FILTERS = [
  { value: 'todos', label: 'Todos' },
  { value: 'activos', label: 'Activos' },
  { value: 'inactivos', label: 'Inactivos' },
] as const;

const ALL_CATEGORIES = 'Todas';

export function MaterialsManager() {
  const { materials, setMaterials } = useAppState();
  const [showAddForm, setShowAddForm] = useState(false);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<ActiveFilter>('todos');
  const [category, setCategory] = useState<string>(ALL_CATEGORIES);

  const updateMaterial = (name: string, patch: Partial<Material>) =>
    setMaterials((prev) => prev.map((m) => (m.name === name ? { ...m, ...patch } : m)));
  const removeMaterial = (name: string) => setMaterials((prev) => prev.filter((m) => m.name !== name));
  const setAllActive = (active: boolean) => setMaterials((prev) => prev.map((m) => ({ ...m, active })));

  const query = search.trim().toLowerCase();
  const visibleMaterials = materials.filter(
    (m) =>
      (!query || m.name.toLowerCase().includes(query) || m.category.toLowerCase().includes(query)) &&
      (activeFilter === 'todos' || m.active === (activeFilter === 'activos')) &&
      (category === ALL_CATEGORIES || m.category === category),
  );

  return (
    <>
      <Card accent>
        <PanelHeader
          title="Inventario de materiales"
          subtitle="Disponibilidad para el motor de selección"
          actions={
            <>
              <Button className="flex-1 md:flex-initial" onClick={() => setShowAddForm(!showAddForm)}>
                <Plus className="size-4" /> Agregar material
              </Button>
              <Button variant="secondary" size="sm" onClick={() => setAllActive(true)}>
                Activar todo
              </Button>
              <Button variant="secondary" size="sm" onClick={() => setAllActive(false)}>
                Desactivar todo
              </Button>
            </>
          }
        />
        {showAddForm && (
          <AddMaterialForm
            existingNames={materials.map((m) => m.name)}
            onAdd={(material) => {
              setMaterials((prev) => [...prev, material]);
              setShowAddForm(false);
            }}
            onCancel={() => setShowAddForm(false)}
          />
        )}
      </Card>

      <Card variant="tile" className="flex flex-col items-center justify-between gap-4 md:flex-row">
        <div className="relative w-full md:w-72">
          <Input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar material..."
            aria-label="Buscar material"
            className="py-2.5 pr-10"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              aria-label="Limpiar búsqueda"
              className="absolute top-1/2 right-3 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>
        <div className="flex w-full flex-wrap gap-2 md:w-auto">
          <SegmentedControl
            label="Filtrar por estado"
            size="sm"
            items={ACTIVE_FILTERS}
            value={activeFilter}
            onChange={setActiveFilter}
          />
          <Select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            options={MATERIAL_CATEGORIES}
            aria-label="Filtrar por categoría"
            className="w-auto px-3 py-1.5 text-[10px] tracking-wider uppercase"
          >
            <option value={ALL_CATEGORIES}>Todas las categorías</option>
          </Select>
        </div>
      </Card>

      {visibleMaterials.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
          {visibleMaterials.map((material) => (
            <MaterialCard
              key={material.name}
              material={material}
              onChange={(patch) => updateMaterial(material.name, patch)}
              onDelete={isDefaultMaterial(material.name) ? undefined : () => removeMaterial(material.name)}
            />
          ))}
        </div>
      ) : (
        <Card className="py-12 text-center">
          <p className="text-xs font-bold text-zinc-400 dark:text-zinc-500">
            No se encontraron materiales con los filtros actuales.
          </p>
        </Card>
      )}
    </>
  );
}
