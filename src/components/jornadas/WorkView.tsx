import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Card, Chips, Icon, Screen, SectionTitle, styles as ui } from '../ui';
import { color } from '../../theme';
import type { useWork } from '../../hooks/useWork';

export function WorkView({
  filters, filter, setFilter, total, done, progress, visible, toggleTask, goBack,
}: ReturnType<typeof useWork>) {
  return <Screen title="Jornadas" intro="Consulta las tareas de campo y registra tu avance." onBack={goBack}>
    <View style={styles.summary}>
      <Text style={ui.subtle}>JORNADA DE DEMOSTRACIÓN</Text>
      <View style={styles.top}><Text style={ui.sectionTitle}>{done} de {total} listas</Text><Text style={ui.label}>{progress}%</Text></View>
      <View accessibilityRole="progressbar" accessibilityLabel="Avance de la jornada"
        accessibilityValue={{ min: 0, max: 100, now: progress }} style={styles.track}>
        <View style={[styles.fill, { width: `${progress}%` }]} />
      </View>
    </View>
    <Chips options={filters} value={filter} onChange={setFilter} />
    <SectionTitle hint={String(visible.length)}>Tareas de campo</SectionTitle>
    <View style={styles.list}>
      {visible.length === 0 && <Card><Text style={ui.body}>No hay tareas en esta categoría.</Text></Card>}
      {visible.map(task => <Pressable key={task.id} accessibilityRole="checkbox"
        accessibilityLabel={task.title} aria-checked={task.done} onPress={() => toggleTask(task.id)}
        style={({ pressed }) => [ui.card, styles.row, pressed && ui.pressed]}>
        <View style={[styles.check, task.done && styles.checkDone]}>
          {task.done && <Icon name="check" size={17} tint={color.surface} />}
        </View>
        <View style={styles.description}><Text style={ui.label}>{task.title}</Text><Text style={ui.body}>{task.lot}</Text></View>
        <Text style={ui.subtle}>{task.time}</Text>
      </Pressable>)}
    </View>
  </Screen>;
}

const styles = StyleSheet.create({
  summary: { padding: 16, gap: 10, backgroundColor: color.soft, borderRadius: 18, marginBottom: 14 },
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  track: { height: 9, backgroundColor: color.surface, borderRadius: 6, overflow: 'hidden' },
  fill: { height: '100%', backgroundColor: color.primary, borderRadius: 6 },
  list: { gap: 8 },
  row: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  check: { width: 29, height: 29, borderWidth: 1, borderColor: color.primary, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  checkDone: { backgroundColor: color.primary },
  description: { flex: 1 },
});
