import { useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import type { Animal, AnimalDraft, AnimalErrors } from '../features/animales/records';
import { useDemo } from './useDemo';

export function useAnimalFormTarget() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { animals } = useDemo();
  const animal = animals.find(item => item.id === id);
  const openList = () => router.dismissTo('/animales');

  return { id, animal, openList };
}

export function useAnimalForm(animal?: Animal) {
  const router = useRouter();
  const { saveAnimal } = useDemo();
  const [draft, setDraft] = useState<AnimalDraft>(animal ?? {
    code: '', name: '', species: 'Bovino', breed: '', lot: 'Sin lote', sex: 'Hembra', status: 'Activo', notes: '',
  });
  const [errors, setErrors] = useState<AnimalErrors>({});
  const goBack = () => {
    if (animal) router.dismissTo({ pathname: '/animales/[id]', params: { id: animal.id } });
    else router.dismissTo('/animales');
  };

  function change<K extends keyof AnimalDraft>(field: K, value: AnimalDraft[K]) {
    setDraft(item => ({ ...item, [field]: value }));
    setErrors(item => ({ ...item, [field]: undefined, form: undefined }));
  }

  function submit() {
    const result = saveAnimal(draft, animal?.id);
    setErrors(result.errors);
    if (!result.id) return;
    if (animal) goBack();
    else router.replace({ pathname: '/animales/[id]', params: { id: result.id } });
  }

  function changeSpecies(species: AnimalDraft['species']) {
    if (species === draft.species) return;
    setDraft(item => ({ ...item, species, breed: '' }));
    setErrors(item => ({ ...item, breed: undefined }));
  }

  return { editing: !!animal, draft, errors, goBack, change, submit, changeSpecies };
}
