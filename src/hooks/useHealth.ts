import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useDemo } from './useDemo';

const filters = ['Todos', 'Pendientes', 'Realizados'] as const;

export function useHealth() {
  const router = useRouter();
  const { health, completeHealth } = useDemo();
  const [filter, setFilter] = useState<typeof filters[number]>('Todos');
  const [selectedId, setSelectedId] = useState<string>();
  const pending = health.filter(item => !item.done).length;
  const selected = health.find(item => item.id === selectedId);
  const visible = health.filter(item => filter === 'Todos' || item.done === (filter === 'Realizados'));

  const goBack = () => router.navigate('/');
  const close = () => setSelectedId(undefined);

  function complete() {
    if (!selected) return;
    completeHealth(selected.id);
    close();
  }

  return { filters, filter, setFilter, setSelectedId, pending, selected, visible, goBack, close, complete };
}
