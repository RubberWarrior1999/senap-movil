import { useLocalSearchParams, useRouter } from 'expo-router';
import { Text, View } from 'react-native';
import { Action, Badge, Card, EmptyState, Feedback, Screen, styles as ui } from '../../components/ui';
import { useDemo } from '../../services/DemoProvider';
import { eligibleForMilk } from './records';

export default function AnimalDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { animals, notice } = useDemo();
  const animal = animals.find(item => item.id === id);
  const back = () => router.dismissTo('/animales');

  if (!animal) return <Screen title="Ficha animal" onBack={back}><EmptyState title="Animal no encontrado" /></Screen>;

  const attributes = [
    ['Especie', animal.species], ['Raza', animal.breed], ['Sexo', animal.sex], ['Lote', animal.lot],
  ];

  return <Screen title={`Ficha de ${animal.name}`} intro={animal.code} onBack={back}>
    <View style={ui.form}>
      {notice?.module === 'animales' && <Feedback>{notice.message}</Feedback>}
      <Card><View style={ui.list}>
        <Badge label={animal.status} warm={animal.status !== 'Activo'} />
        {attributes.map(([label, value]) => <View key={label}>
          <Text style={ui.label}>{label}</Text><Text style={ui.body}>{value}</Text>
        </View>)}
        {!!animal.notes && <View><Text style={ui.label}>Observaciones</Text><Text style={ui.body}>{animal.notes}</Text></View>}
      </View></Card>
      <Action label="Editar ficha" onPress={() => router.push({ pathname: '/animales/[id]/editar', params: { id: animal.id } })} />
      {eligibleForMilk(animal) && <Action label="Registrar ordeño" icon="drop" secondary
        onPress={() => router.push({ pathname: '/leche/registrar', params: { animalId: animal.id } })} />}
    </View>
  </Screen>;
}
