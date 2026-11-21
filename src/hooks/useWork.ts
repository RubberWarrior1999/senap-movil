import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useDemo } from './useDemo';

const filters = ['Todas', 'Pendientes', 'Completadas'] as const;

export function useWork() {
  const router = useRouter();
  const { tasks, toggleTask } = useDemo();
  const [filter, setFilter] = useState<typeof filters[number]>('Todas');
  const done = tasks.filter(task => task.done).length;
  const progress = Math.round(done / tasks.length * 100);
  const visible = tasks.filter(task => filter === 'Todas' || task.done === (filter === 'Completadas'));

  const goBack = () => router.navigate('/');

  return { filters, filter, setFilter, total: tasks.length, done, progress, visible, toggleTask, goBack };
}
