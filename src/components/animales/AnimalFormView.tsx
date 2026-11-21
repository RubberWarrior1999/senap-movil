import { View } from 'react-native';
import { Action, Card, ChoiceField, Feedback, Field, Screen, styles as ui } from '../ui';
import { animalStatuses, breedsBySpecies, lots, sexOptions, speciesOptions } from '../../features/animales/records';
import type { useAnimalForm } from '../../hooks/useAnimalForm';

export function AnimalFormView({
  editing, draft, errors, goBack, change, submit, changeSpecies,
}: ReturnType<typeof useAnimalForm>) {
  return <Screen title={editing ? 'Editar ficha' : 'Nuevo animal'} intro="Identificación y ubicación en el inventario." onBack={goBack}>
    <Card><View style={ui.form}>
      <Field label="Código del animal" value={draft.code} onChangeText={value => change('code', value)}
        error={errors.code} autoCapitalize="characters" autoCorrect={false} maxLength={15} placeholder="Ej. BOV-006" />
      <Field label="Nombre del animal" value={draft.name} onChangeText={value => change('name', value)} error={errors.name} maxLength={40} />
      <ChoiceField label="Sexo" options={sexOptions} value={draft.sex} onChange={value => change('sex', value)} />
      <ChoiceField label="Especie" options={speciesOptions} value={draft.species} onChange={changeSpecies} />
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
