import { View } from 'react-native';
import { Action, Card, ChoiceField, EmptyState, Field, Screen, styles as ui } from '../ui';
import { qualities, turns } from '../../features/leche/records';
import type { useMilkForm } from '../../hooks/useMilkForm';

export function MilkFormView({
  draft, errors, animalChoices, selectedAnimal, selectAnimal, change, submit, cancel,
}: ReturnType<typeof useMilkForm>) {
  return <Screen title="Registrar ordeño" intro="Selecciona una hembra activa y completa el registro." onBack={cancel}>
    <Card><View style={ui.form}>
      {animalChoices.length ? <ChoiceField label="Animal" options={animalChoices}
        value={selectedAnimal} onChange={selectAnimal}
        error={errors.animalId} /> : <EmptyState title="No hay hembras activas" detail="Puedes registrar una desde el módulo Animales." />}
      <Field label="Fecha" value={draft.date} onChangeText={value => change('date', value)}
        error={errors.date} hint="Formato AAAA-MM-DD." placeholder="AAAA-MM-DD" maxLength={10} autoCorrect={false} />
      <ChoiceField label="Turno" options={turns} value={draft.turn} onChange={value => change('turn', value)} />
      <Field label="Litros" value={draft.liters} onChangeText={value => change('liters', value)}
        error={errors.liters} placeholder="Ej. 8,5" keyboardType="decimal-pad" maxLength={9} />
      <ChoiceField label="Calidad" options={qualities} value={draft.quality} onChange={value => change('quality', value)} />
      <Field label="Observaciones" value={draft.notes} onChangeText={value => change('notes', value)} maxLength={300} multiline />
      <Action label="Guardar registro" onPress={submit} disabled={!animalChoices.length} />
      <Action label="Cancelar" secondary onPress={cancel} />
    </View></Card>
  </Screen>;
}
