import { useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { View } from 'react-native';
import { Action, Card, ChoiceField, EmptyState, Feedback, Field, Screen, styles as ui } from '../../components/ui';
import { useDemo } from '../../services/DemoProvider';
import { animalStatuses, breedsBySpecies, lots, sexOptions, speciesOptions, type Animal, type AnimalDraft, type AnimalErrors } from './records';

export default function AnimalFormScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { animals } = useDemo();
  const animal = animals.find(item => item.id === id);
  if (id && !animal) return <Screen title="Animales" onBack={() => router.dismissTo('/animales')}>
    <EmptyState title="Animal no encontrado" />
  </Screen>;
  return <AnimalForm key={id ?? 'new'} animal={animal} />;
}

function AnimalForm({ animal }: { animal?: Animal }) {
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

  return <Screen title={animal ? 'Editar ficha' : 'Nuevo animal'} intro="Identificación y ubicación en el inventario." onBack={goBack}>
    <Card><View style={ui.form}>
      <Field label="Código del animal" value={draft.code} onChangeText={value => change('code', value)}
        error={errors.code} autoCapitalize="characters" autoCorrect={false} maxLength={15} placeholder="Ej. BOV-006" />
      <Field label="Nombre del animal" value={draft.name} onChangeText={value => change('name', value)} error={errors.name} maxLength={40} />
      <ChoiceField label="Sexo" options={sexOptions} value={draft.sex} onChange={value => change('sex', value)} />
      <ChoiceField label="Especie" options={speciesOptions} value={draft.species} onChange={species => {
        if (species === draft.species) return;
        setDraft(item => ({ ...item, species, breed: '' }));
        setErrors(item => ({ ...item, breed: undefined }));
      }} />
      <ChoiceField<string> label="Raza" options={breedsBySpecies[draft.species]} value={draft.breed}
        onChange={value => change('breed', value)} error={errors.breed} />
      <ChoiceField label="Lote" options={lots} value={draft.lot} onChange={value => change('lot', value)} />
      <ChoiceField label="Estado" options={animalStatuses} value={draft.status} onChange={value => change('status', value)} />
      <Field label="Observaciones" value={draft.notes} onChangeText={value => change('notes', value)} maxLength={500} multiline />
      {errors.form && <Feedback error>{errors.form}</Feedback>}
      <Action label="Guardar ficha" onPress={submit} />
      <Action label="Cancelar" secondary onPress={goBack} />
    </View></Card>
  </Screen>;
}
