import { useState } from 'react';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Action, Badge, Card, Chips, EmptyState, Feedback, Field, Icon, Screen, SectionTitle, Sheet, styles as ui } from '../../components/ui';
import { useDemo } from '../../services/DemoProvider';
import { color } from '../../theme';
import { dateKey, litersLabel } from './records';

const periods = ['Hoy', 'Todas las fechas'] as const;

export default function MilkScreen() {
  const router = useRouter();
  const { milk, animals, removeMilk, notice } = useDemo();
  const [period, setPeriod] = useState<typeof periods[number]>('Hoy');
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState('');
  const today = dateKey();
  const term = query.trim().toLocaleLowerCase();
  const animalInfo = (id: string) => animals.find(animal => animal.id === id);
  const visible = milk.filter(entry => (period !== 'Hoy' || entry.date === today) && (
    [animalInfo(entry.animalId)?.name ?? '', animalInfo(entry.animalId)?.code ?? ''].some(text => text.toLocaleLowerCase().includes(term))
  )).sort((left, right) => right.date.localeCompare(left.date));
  const total = visible.reduce((sum, entry) => sum + entry.liters, 0);
  const selected = milk.find(entry => entry.id === selectedId);
  const days = Array.from({ length: 7 }, (_, index) => {
    const day = new Date();
    day.setDate(day.getDate() - 6 + index);
    const key = dateKey(day);
    return { key, label: String(day.getDate()), value: milk.filter(entry => entry.date === key).reduce((sum, entry) => sum + entry.liters, 0) };
  });
  const maximum = Math.max(1, ...days.map(day => day.value));

  return <Screen title="Producción de leche" intro="Consulta y registra los ordeños del ganado.">
    <View style={ui.form}>
      <Action label="Registrar ordeño" icon="plus" onPress={() => router.push('/leche/registrar')} />
      {notice?.module === 'leche' && <Feedback>{notice.message}</Feedback>}
      <Field label="Buscar por animal" placeholder="Nombre o código" value={query} onChangeText={setQuery} />
      <Chips options={periods} value={period} onChange={setPeriod} />
      <View style={styles.summary}>
        <Text style={styles.summaryLabel}>Total de la consulta</Text>
        <Text style={styles.total}>{litersLabel(total)} L</Text>
        <Text style={styles.summaryLabel}>{visible.length} {visible.length === 1 ? 'ordeño' : 'ordeños'}</Text>
      </View>
    </View>
    <SectionTitle>Últimos siete días</SectionTitle>
    <Card>
      <View style={styles.chart}>
        {days.map(day => <View key={day.key} accessible accessibilityRole="image"
          accessibilityLabel={`${day.key}: ${litersLabel(day.value)} litros`} style={styles.column}>
          <View style={[styles.bar, { height: 4 + (day.value / maximum) * 56 }, day.key === today && styles.barToday]} />
          <Text style={ui.subtle}>{day.label}</Text>
        </View>)}
      </View>
      <Text style={ui.body}>Producción total por día, en litros.</Text>
    </Card>
    <SectionTitle hint={String(visible.length)}>Registros</SectionTitle>
    <View style={ui.list}>
      {!visible.length && <EmptyState title="Sin ordeños en esta consulta" detail="Cambia el filtro o registra un ordeño." />}
      {visible.map(entry => {
        const animal = animalInfo(entry.animalId);
        return <Pressable key={entry.id} accessibilityRole="button"
          accessibilityLabel={`Ver ordeño de ${animal?.name ?? 'animal'} · ${entry.date} · ${entry.turn} · ${litersLabel(entry.liters)} L`}
          onPress={() => setSelectedId(entry.id)} style={({ pressed }) => [ui.card, ui.row, pressed && ui.pressed]}>
          <View style={ui.grow}>
            <Text style={ui.label}>{animal?.name ?? 'Animal'} · {animal?.code}</Text>
            <Text style={ui.body}>{entry.date} · {entry.turn} · {entry.quality}</Text>
            <Badge label={litersLabel(entry.liters) + ' L'} />
          </View>
          <Icon name="arrow" size={18} />
        </Pressable>;
      })}
    </View>
    {selected && <Sheet title="Detalle del ordeño" onClose={() => setSelectedId('')}>
      <Text style={ui.label}>{animalInfo(selected.animalId)?.name} · {litersLabel(selected.liters)} L</Text>
      <Text style={ui.body}>{selected.date} · {selected.turn} · {selected.quality}</Text>
      {!!selected.notes && <Text style={ui.body}>{selected.notes}</Text>}
      <DeleteRecord onConfirm={() => { removeMilk(selected.id); setSelectedId(''); }} />
    </Sheet>}
  </Screen>;
}

function DeleteRecord({ onConfirm }: { onConfirm: () => void }) {
  const [confirm, setConfirm] = useState(false);
  if (!confirm) return <Action label="Eliminar registro" secondary onPress={() => setConfirm(true)} />;
  return <>
    <Text style={ui.body}>¿Eliminar este ordeño de la demostración?</Text>
    <Action label="Confirmar eliminación" onPress={onConfirm} />
    <Action label="Cancelar" secondary onPress={() => setConfirm(false)} />
  </>;
}

const styles = StyleSheet.create({
  summary: { backgroundColor: color.dark, borderRadius: 18, padding: 18, gap: 3 },
  summaryLabel: { fontSize: 14, color: color.soft, fontWeight: '600' },
  total: { fontSize: 39, color: color.surface, fontWeight: '800', letterSpacing: -0.8 },
  chart: { flexDirection: 'row', alignItems: 'flex-end', gap: 6, minHeight: 80, marginBottom: 7 },
  column: { flex: 1, minWidth: 0, alignItems: 'center', gap: 4 },
  bar: { width: '75%', maxWidth: 32, borderRadius: 4, backgroundColor: color.light },
  barToday: { backgroundColor: color.primary },
});
