import { dateKey, litersLabel } from '../leche/records';
import type { useDemo } from '../../services/DemoProvider';

export const reportModules = ['Leche', 'Animales', 'Usuarios', 'Sanidad', 'Jornadas'] as const;

export type ReportModule = typeof reportModules[number];
type ReportSource = Pick<ReturnType<typeof useDemo>, 'milk' | 'animals' | 'users' | 'health' | 'tasks' | 'canManageUsers'>;

export const reportFilters = {
  Leche: ['Hoy', 'Últimos 7 días', 'Todos'],
  Animales: ['Todos', 'Activos', 'Otros estados'],
  Usuarios: ['Todos', 'Activos', 'Inactivos'],
  Sanidad: ['Todos', 'Pendientes', 'Realizados'],
  Jornadas: ['Todos', 'Pendientes', 'Completadas'],
} as const satisfies Record<ReportModule, readonly string[]>;

export type Report = {
  module: ReportModule;
  title: string;
  filter: string;
  columns: readonly string[];
  rows: { id: string; cells: string[] }[];
  metrics: { label: string; value: string }[];
};

function reportRow(id: string, ...cells: string[]) {
  return { id, cells };
}

function metric(label: string, value: number | string) {
  return { label, value: String(value) };
}

function orderedByDate<T extends { date: string }>(records: T[]) {
  return [...records].sort((left, right) => right.date.localeCompare(left.date));
}

export function buildReport(module: ReportModule, filter: string, source: ReportSource, today = new Date()): Report | null {
  if (module === 'Usuarios' && !source.canManageUsers) return null;
  const filters: readonly string[] = reportFilters[module];
  const scope = filters.includes(filter) ? filter : filters[0];
  const base = { module, filter: scope };

  switch (module) {
    case 'Leche': {
      const end = dateKey(today);
      const weekStart = new Date(today);
      weekStart.setDate(weekStart.getDate() - 6);
      const start = scope === 'Hoy' ? end : dateKey(weekStart);
      const entries = orderedByDate(source.milk.filter(record =>
        scope === 'Todos' || (record.date >= start && record.date <= end),
      ));
      const animalNames = new Map(source.animals.map(animal => [animal.id, animal.name]));
      const total = entries.reduce((sum, record) => sum + record.liters, 0);
      return {
        ...base,
        title: 'Producción de leche',
        columns: ['Animal', 'Fecha', 'Turno', 'Litros', 'Calidad'],
        metrics: [metric('Ordeños', entries.length), metric('Litros registrados', litersLabel(total) + ' L')],
        rows: entries.map(record => reportRow(record.id, animalNames.get(record.animalId) ?? 'Animal no disponible',
          record.date, record.turn, litersLabel(record.liters), record.quality)),
      };
    }
    case 'Animales': {
      const entries = source.animals.filter(animal => scope === 'Todos' || (animal.status === 'Activo') === (scope === 'Activos'));
      const active = entries.filter(animal => animal.status === 'Activo').length;
      return {
        ...base,
        title: 'Inventario de animales',
        columns: ['Animal', 'Código', 'Especie', 'Raza', 'Lote', 'Estado'],
        metrics: [metric('Animales', entries.length), metric('Activos', active), metric('Otros estados', entries.length - active)],
        rows: entries.map(animal => reportRow(animal.id, animal.name, animal.code, animal.species,
          animal.breed, animal.lot, animal.status)),
      };
    }
    case 'Usuarios': {
      const entries = source.users.filter(user => scope === 'Todos' || user.active === (scope === 'Activos'));
      const active = entries.filter(user => user.active).length;
      return {
        ...base,
        title: 'Usuarios y roles',
        columns: ['Nombre', 'Rol', 'Estado'],
        metrics: [metric('Cuentas', entries.length), metric('Activas', active), metric('Inactivas', entries.length - active)],
        rows: entries.map(user => reportRow(user.id, user.name, user.role, user.active ? 'Activa' : 'Inactiva')),
      };
    }
    case 'Sanidad': {
      const entries = source.health.filter(control => scope === 'Todos' || control.done === (scope === 'Realizados'));
      const completed = entries.filter(control => control.done).length;
      return {
        ...base,
        title: 'Controles sanitarios',
        columns: ['Control', 'Animal', 'Fecha prevista', 'Estado'],
        metrics: [metric('Controles', entries.length), metric('Realizados', completed), metric('Pendientes', entries.length - completed)],
        rows: entries.map(control => reportRow(control.id, control.title, control.animal,
          control.due, control.done ? 'Realizado' : 'Pendiente')),
      };
    }
    case 'Jornadas': {
      const entries = source.tasks.filter(task => scope === 'Todos' || task.done === (scope === 'Completadas'));
      const completed = entries.filter(task => task.done).length;
      return {
        ...base,
        title: 'Tareas de la jornada',
        columns: ['Tarea', 'Hora', 'Lugar', 'Estado'],
        metrics: [metric('Tareas', entries.length), metric('Completadas', completed), metric('Pendientes', entries.length - completed)],
        rows: entries.map(task => reportRow(task.id, task.title, task.time, task.lot, task.done ? 'Completada' : 'Pendiente')),
      };
    }
  }
}
