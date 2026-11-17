import { useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { View } from 'react-native';
import { Action, Card, ChoiceField, EmptyState, Field, Screen, styles as ui } from '../../components/ui';
import { useDemo } from '../../services/DemoProvider';
import { eligibleForMilk } from '../animales/records';
import { dateKey, qualities, turns, type MilkDraft, type MilkErrors } from './records';

export default function MilkFormScreen() {
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

  return <Screen title="Registrar ordeño" intro="Selecciona una hembra activa y completa el registro." onBack={cancel}>
    <Card><View style={ui.form}>
      {options.length ? <ChoiceField label="Animal" options={options.map(option => option.label)}
        value={selected?.label ?? ''} onChange={label => change('animalId', options.find(option => option.label === label)?.id ?? '')}
        error={errors.animalId} /> : <EmptyState title="No hay hembras activas" detail="Puedes registrar una desde el módulo Animales." />}
      <Field label="Fecha" value={draft.date} onChangeText={value => change('date', value)}
        error={errors.date} hint="Formato AAAA-MM-DD." placeholder="AAAA-MM-DD" maxLength={10} autoCorrect={false} />
      <ChoiceField label="Turno" options={turns} value={draft.turn} onChange={value => change('turn', value)} />
      <Field label="Litros" value={draft.liters} onChangeText={value => change('liters', value)}
        error={errors.liters} placeholder="Ej. 8,5" keyboardType="decimal-pad" maxLength={9} />
      <ChoiceField label="Calidad" options={qualities} value={draft.quality} onChange={value => change('quality', value)} />
      <Field label="Observaciones" value={draft.notes} onChangeText={value => change('notes', value)} maxLength={300} multiline />
      <Action label="Guardar registro" onPress={submit} disabled={!options.length} />
      <Action label="Cancelar" secondary onPress={cancel} />
    </View></Card>
  </Screen>;
}
