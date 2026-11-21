import { AnimalFormView } from '../../components/animales/AnimalFormView';
import { EmptyState, Screen } from '../../components/ui';
import { useAnimalForm, useAnimalFormTarget } from '../../hooks/useAnimalForm';
import type { Animal } from './records';

export default function AnimalFormScreen() {
  const { id, animal, openList } = useAnimalFormTarget();
  if (id && !animal) return <Screen title="Animales" onBack={openList}>
    <EmptyState title="Animal no encontrado" />
  </Screen>;

  return <AnimalForm key={id ?? 'new'} animal={animal} />;
}

function AnimalForm({ animal }: { animal?: Animal }) {
  const form = useAnimalForm(animal);
  return <AnimalFormView {...form} />;
}
