import { useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { eligibleForMilk } from '../features/animales/records';
import { dateKey, type MilkDraft, type MilkErrors } from '../features/leche/records';
import { useDemo } from './useDemo';

export function useMilkForm() {
  const router = useRouter();
  const { animalId } = useLocalSearchParams<{ animalId?: string }>();
  const { animals, saveMilk } = useDemo();
  const [draft, setDraft] = useState<MilkDraft>({
    animalId: animalId ?? '', date: dateKey(), turn: 'Tarde', liters: '', quality: 'Normal', notes: '',
  });
  const [errors, setErrors] = useState<MilkErrors>({});
  const options = animals.filter(eligibleForMilk).map(animal => ({ id: animal.id, label: `${animal.name} · ${animal.code}` }));
  const selected = options.find(option => option.id === draft.animalId);
  const cancel = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/leche');
  };

  function change<K extends keyof MilkDraft>(field: K, value: MilkDraft[K]) {
    setDraft(item => ({ ...item, [field]: value }));
    setErrors(item => ({ ...item, [field]: undefined }));
  }

  function submit() {
    const next = saveMilk(draft);
    setErrors(next);
    if (!Object.keys(next).length) router.dismissTo('/leche');
  }

  const animalChoices = options.map(option => option.label);
  const selectAnimal = (label: string) => change('animalId', options.find(option => option.label === label)?.id ?? '');

  return {
    draft, errors, animalChoices, selectedAnimal: selected?.label ?? '', selectAnimal, change, submit,
    cancel,
  };
}
