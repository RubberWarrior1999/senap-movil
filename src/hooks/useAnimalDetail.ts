import { useLocalSearchParams, useRouter } from 'expo-router';
import { useDemo } from './useDemo';

export function useAnimalDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { animals, notice } = useDemo();
  const animal = animals.find(item => item.id === id);
  const back = () => router.dismissTo('/animales');

  const edit = (id: string) => router.push({ pathname: '/animales/[id]/editar', params: { id } });
  const registerMilk = (id: string) => router.push({ pathname: '/leche/registrar', params: { animalId: id } });

  return { animal, notice, back, edit, registerMilk };
}
