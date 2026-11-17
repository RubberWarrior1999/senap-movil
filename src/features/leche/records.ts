import { eligibleForMilk, type Animal } from '../animales/records';
import { parseLiters } from '../../utils/validateMilk';

export const turns = ['Mañana', 'Tarde', 'Noche', 'Único'] as const;
export const qualities = ['Normal', 'Buena', 'Excelente', 'Baja', 'Descartada'] as const;

export type MilkDraft = {
  animalId: string;
  date: string;
  turn: typeof turns[number];
  liters: string;
  quality: typeof qualities[number];
  notes: string;
};
export type MilkEntry = Omit<MilkDraft, 'liters'> & { id: string; liters: number };
export type MilkErrors = Partial<Record<'animalId' | 'date' | 'liters', string>>;

export function dateKey(date = new Date()) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('-');
}

function isDateKey(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(value + 'T12:00:00');
  return !Number.isNaN(date.getTime()) && dateKey(date) === value;
}

export function validateMilk(draft: MilkDraft, animals: Animal[], today = dateKey()): MilkErrors {
  const errors: MilkErrors = {};
  const animal = animals.find(item => item.id === draft.animalId);
  if (!animal || !eligibleForMilk(animal)) errors.animalId = 'Selecciona una hembra activa.';
  if (!isDateKey(draft.date) || draft.date < '2021-01-01') errors.date = 'Introduce una fecha válida desde 2021 en formato AAAA-MM-DD.';
  else if (draft.date > today) errors.date = 'La fecha no puede ser posterior a hoy.';
  if (parseLiters(draft.liters) === null) errors.liters = 'Introduce litros mayores que cero, con hasta dos decimales.';
  return errors;
}

export function initialMilk(): MilkEntry[] {
  const today = dateKey();
  const recent = new Date();
  recent.setDate(recent.getDate() - 1);
  return [
    { id: 'm1', animalId: 'a1', date: today, turn: 'Mañana', liters: 14.5, quality: 'Buena', notes: '' },
    { id: 'm2', animalId: 'a3', date: today, turn: 'Mañana', liters: 18, quality: 'Excelente', notes: '' },
    { id: 'm3', animalId: 'a2', date: today, turn: 'Mañana', liters: 12, quality: 'Normal', notes: '' },
    { id: 'm4', animalId: 'a1', date: dateKey(recent), turn: 'Tarde', liters: 11, quality: 'Normal', notes: '' },
  ];
}

export const litersLabel = (value: number) =>
  new Intl.NumberFormat('es-VE', { maximumFractionDigits: 2 }).format(value);
