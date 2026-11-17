import { useState } from 'react';
import { useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { Action, Badge, Chips, EmptyState, Feedback, Field, Icon, Screen, SectionTitle, styles as ui } from '../../components/ui';
import { useDemo } from '../../services/DemoProvider';
import { animalStatuses } from './records';

const filters = ['Todos', ...animalStatuses] as const;

export default function AnimalsScreen() {
  const router = useRouter();
  const { animals, notice } = useDemo();
  const [filter, setFilter] = useState<typeof filters[number]>('Todos');
  const [query, setQuery] = useState('');
  const term = query.trim().toLocaleLowerCase();
  const visible = animals.filter(animal => (filter === 'Todos' || animal.status === filter) &&
    [animal.name, animal.code, animal.breed, animal.lot].some(value => value.toLocaleLowerCase().includes(term)));

  return <Screen title="Animales" intro="Consulta el inventario y actualiza la ficha del ganado.">
    <View style={ui.form}>
      <Action label="Nuevo animal" icon="plus" onPress={() => router.push('/animales/nuevo')} />
      {notice?.module === 'animales' && <Feedback>{notice.message}</Feedback>}
      <Field label="Buscar animales" placeholder="Nombre, código, raza o lote" value={query} onChangeText={setQuery} />
      <Chips options={filters} value={filter} onChange={setFilter} />
    </View>
    <SectionTitle hint={String(visible.length)}>Inventario</SectionTitle>
    <View style={ui.list}>
      {!visible.length && <EmptyState title="Sin animales para esta búsqueda" detail="Prueba otro código o selecciona Todos." />}
      {visible.map(animal => <Pressable key={animal.id} accessibilityRole="button" accessibilityLabel={`Ver ficha de ${animal.name}`}
        accessibilityHint={`${animal.code}, ${animal.breed}, ${animal.lot}, ${animal.status}`}
        onPress={() => router.push({ pathname: '/animales/[id]', params: { id: animal.id } })}
        style={({ pressed }) => [ui.card, ui.row, pressed && ui.pressed]}>
        <Icon name="herd" size={26} />
        <View style={ui.grow}>
          <Text style={ui.label}>{animal.name} · {animal.code}</Text>
          <Text style={ui.body}>{animal.breed} · {animal.lot}</Text>
          <Badge label={animal.status} warm={animal.status !== 'Activo'} />
        </View>
        <Icon name="arrow" size={18} />
      </Pressable>)}
    </View>
  </Screen>;
}
