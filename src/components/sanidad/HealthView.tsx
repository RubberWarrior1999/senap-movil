import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Action, Badge, Card, Chips, Icon, Screen, SectionTitle, Sheet, styles as ui } from '../ui';
import { color } from '../../theme';
import type { useHealth } from '../../hooks/useHealth';

export function HealthView({
  filters, filter, setFilter, setSelectedId, pending, selected, visible, goBack, close, complete,
}: ReturnType<typeof useHealth>) {
  return <Screen title="Sanidad" intro="Organiza los controles y el seguimiento del rebaño." onBack={goBack}>
    <View style={styles.summary}>
      <View style={styles.iconBox}><Icon name="health" /></View>
      <View style={styles.summaryText}><Text style={ui.sectionTitle}>{pending} {pending === 1 ? 'control pendiente' : 'controles pendientes'}</Text>
        <Text style={ui.body}>Agenda sanitaria de demostración</Text></View>
    </View>
    <Chips options={filters} value={filter} onChange={setFilter} />
    <SectionTitle hint={String(visible.length)}>Controles</SectionTitle>
    <View style={styles.list}>
      {visible.length === 0 && <Card><Text style={ui.body}>No hay controles en esta categoría.</Text></Card>}
      {visible.map(item => <Pressable key={item.id} accessibilityRole="button" onPress={() => setSelectedId(item.id)}
        style={({ pressed }) => [ui.card, styles.row, pressed && ui.pressed]}>
        <View style={styles.summaryText}>
          <Text style={ui.subtle}>{item.animal} · {item.due}</Text>
          <Text style={ui.label}>{item.title}</Text>
          <Badge label={item.done ? 'Realizado' : 'Pendiente'} warm={!item.done} />
        </View>
        <Icon name="arrow" size={18} />
      </Pressable>)}
    </View>
    {selected && <Sheet title={selected.title} onClose={close}>
      <Text style={ui.label}>{selected.animal} · {selected.due}</Text>
      <Text style={ui.body}>{selected.detail}</Text>
      {selected.done ? <Badge label="Realizado" /> : <Action label="Marcar como realizado" icon="check" onPress={complete} />}
    </Sheet>}
  </Screen>;
}

const styles = StyleSheet.create({
  summary: { flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: 18, backgroundColor: color.soft, padding: 14, marginBottom: 14 },
  iconBox: { width: 43, height: 43, borderRadius: 13, backgroundColor: color.surface, alignItems: 'center', justifyContent: 'center' },
  summaryText: { flex: 1, gap: 5 },
  list: { gap: 8 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
});
