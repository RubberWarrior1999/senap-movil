import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Action, Badge, Chips, EmptyState, Feedback, Field, Icon, Screen, SectionTitle, Sheet, styles as ui } from '../ui';
import { color } from '../../theme';
import { litersLabel } from '../../features/leche/records';
import { DeleteRecord } from './DeleteRecord';
import { MilkWeekChart } from './MilkWeekChart';
import type { useMilk } from '../../hooks/useMilk';

export function MilkView({
  periods, period, setPeriod, query, setQuery, selected, setSelectedId,
  today, animalInfo, visible, total, days, notice, addMilk, closeMilk,
  confirmingDelete, setConfirmingDelete, deleteSelected,
}: ReturnType<typeof useMilk>) {
  return <Screen title="Producción de leche" intro="Consulta y registra los ordeños del ganado.">
    <View style={ui.form}>
      <Action label="Registrar ordeño" icon="plus" onPress={addMilk} />
      {notice?.module === 'leche' && <Feedback>{notice.message}</Feedback>}
      <Field label="Buscar por animal" placeholder="Nombre o código" value={query} onChangeText={setQuery} />
      <Chips options={periods} value={period} onChange={setPeriod} />
      <View style={styles.summary}>
        <Text style={styles.summaryLabel}>Total de la consulta</Text>
        <Text style={styles.total}>{litersLabel(total)} L</Text>
        <Text style={styles.summaryLabel}>{visible.length} {visible.length === 1 ? 'ordeño' : 'ordeños'}</Text>
      </View>
    </View>
    <MilkWeekChart days={days} today={today} />
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
    {selected && <Sheet title="Detalle del ordeño" onClose={closeMilk}>
      <Text style={ui.label}>{animalInfo(selected.animalId)?.name} · {litersLabel(selected.liters)} L</Text>
      <Text style={ui.body}>{selected.date} · {selected.turn} · {selected.quality}</Text>
      {!!selected.notes && <Text style={ui.body}>{selected.notes}</Text>}
      <DeleteRecord confirming={confirmingDelete} onRequest={() => setConfirmingDelete(true)}
        onCancel={() => setConfirmingDelete(false)} onConfirm={deleteSelected} />
    </Sheet>}
  </Screen>;
}

const styles = StyleSheet.create({
  summary: { backgroundColor: color.dark, borderRadius: 18, padding: 18, gap: 3 },
  summaryLabel: { fontSize: 14, color: color.soft, fontWeight: '600' },
  total: { fontSize: 39, color: color.surface, fontWeight: '800', letterSpacing: -0.8 },
});
