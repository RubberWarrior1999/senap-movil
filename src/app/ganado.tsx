import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Badge, Card, Chips, Icon, Screen, SectionTitle, Sheet, styles as ui } from '../components/ui';
import { animals } from '../services/demo';
import { color } from '../theme';

const filters = ['Todos', 'Estable', 'Seguimiento'] as const;
type Animal = typeof animals[number];

export default function HerdScreen() {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<typeof filters[number]>('Todos');
  const [selected, setSelected] = useState<Animal>();
  const term = query.trim().toLocaleLowerCase();
  const found = animals.filter(item =>
    (filter === 'Todos' || item.state === filter) &&
    [item.name, item.id, item.breed, item.lot].some(value => value.toLocaleLowerCase().includes(term)),
  );

  return <Screen title="Ganado" intro="Consulta el inventario y la ficha de cada animal.">
    <View style={styles.search}><Icon name="search" size={19} />
      <TextInput accessibilityLabel="Buscar animal" placeholder="Nombre, código o potrero" placeholderTextColor={color.muted}
        style={styles.searchInput} value={query} onChangeText={setQuery} />
    </View>
    <Chips options={filters} value={filter} onChange={setFilter} />
    <SectionTitle hint={String(found.length)}>Inventario</SectionTitle>
    <View style={styles.list}>
      {found.length === 0 && <Card><Text style={ui.body}>No encontramos animales con esos filtros.</Text></Card>}
      {found.map(item => <Pressable key={item.id} accessibilityRole="button" accessibilityLabel={'Ver ficha de ' + item.name}
        onPress={() => setSelected(item)} style={({ pressed }) => [styles.row, pressed && ui.pressed]}>
        <View style={styles.avatar}><Icon name="herd" size={25} /></View>
        <View style={styles.info}>
          <Text style={ui.label}>{item.name} <Text style={ui.subtle}>· {item.id}</Text></Text>
          <Text style={ui.body}>{item.breed} · {item.lot}</Text>
          <Badge label={item.state} warm={item.state === 'Seguimiento'} />
        </View>
        <Icon name="arrow" size={18} />
      </Pressable>)}
    </View>
    {selected && <Sheet title={'Ficha de ' + selected.name} onClose={() => setSelected(undefined)}>
      <Badge label={selected.state} warm={selected.state === 'Seguimiento'} />
      <Text style={ui.label}>{selected.id} · {selected.breed}</Text>
      <Text style={ui.body}>{selected.sex} · {selected.weight} kg</Text>
      <Text style={ui.body}>Ubicación: {selected.lot}</Text>
    </Sheet>}
  </Screen>;
}

const styles = StyleSheet.create({
  search: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 13, backgroundColor: color.surface, borderWidth: 1, borderColor: color.border, borderRadius: 13, marginBottom: 10 },
  searchInput: { flex: 1, color: color.ink, fontSize: 15, minHeight: 47 },
  list: { gap: 8 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 11, backgroundColor: color.surface, borderWidth: 1, borderColor: color.border, borderRadius: 17, padding: 12 },
  avatar: { width: 45, height: 45, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: color.mint },
  info: { flex: 1, gap: 2 },
});
