import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useDemo } from './useDemo';
import { animalStatuses } from '../features/animales/records';

const filters = ['Todos', ...animalStatuses] as const;

export function useAnimals() {
  const router = useRouter();
  const { animals, notice } = useDemo();
  const [filter, setFilter] = useState<typeof filters[number]>('Todos');
  const [query, setQuery] = useState('');
  const term = query.trim().toLocaleLowerCase();
  const visible = animals.filter(animal => (filter === 'Todos' || animal.status === filter) &&
    [animal.name, animal.code, animal.breed, animal.lot].some(value => value.toLocaleLowerCase().includes(term)));

  const newAnimal = () => router.push('/animales/nuevo');
  const openAnimal = (id: string) => router.push({ pathname: '/animales/[id]', params: { id } });

  return { visible, filters, filter, setFilter, query, setQuery, notice, newAnimal, openAnimal };
}
