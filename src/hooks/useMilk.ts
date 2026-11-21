import { useState } from 'react';
import { useRouter } from 'expo-router';
import { dateKey } from '../features/leche/records';
import { useDemo } from './useDemo';

const periods = ['Hoy', 'Todas las fechas'] as const;

export function useMilk() {
  const router = useRouter();
  const { milk, animals, removeMilk, notice } = useDemo();
  const [period, setPeriod] = useState<typeof periods[number]>('Hoy');
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState('');
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const today = dateKey();
  const term = query.trim().toLocaleLowerCase();
  const animalInfo = (id: string) => animals.find(animal => animal.id === id);
  const visible = milk.filter(entry => (period !== 'Hoy' || entry.date === today) && (
    [animalInfo(entry.animalId)?.name ?? '', animalInfo(entry.animalId)?.code ?? ''].some(text => text.toLocaleLowerCase().includes(term))
  )).sort((left, right) => right.date.localeCompare(left.date));
  const total = visible.reduce((sum, entry) => sum + entry.liters, 0);
  const selected = milk.find(entry => entry.id === selectedId);
  const days = Array.from({ length: 7 }, (_, index) => {
    const day = new Date();
    day.setDate(day.getDate() - 6 + index);
    const key = dateKey(day);
    return { key, label: String(day.getDate()), value: milk.filter(entry => entry.date === key).reduce((sum, entry) => sum + entry.liters, 0) };
  });
  const addMilk = () => router.push('/leche/registrar');

  function closeMilk() {
    setConfirmingDelete(false);
    setSelectedId('');
  }

  function deleteSelected() {
    if (!selected) return;
    removeMilk(selected.id);
    closeMilk();
  }

  return {
    periods, period, setPeriod, query, setQuery, selected, setSelectedId,
    today, animalInfo, visible, total, days, notice, addMilk, closeMilk,
    confirmingDelete, setConfirmingDelete, deleteSelected,
  };
}
