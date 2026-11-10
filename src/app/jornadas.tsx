import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Card, Chips, Icon, Screen, SectionTitle, styles as ui } from '../components/ui';
import { useDemo } from '../services/DemoProvider';
import { color } from '../theme';

const filters = ['Todas', 'Pendientes', 'Completadas'] as const;

export default function WorkScreen() {
  const { tasks, toggleTask } = useDemo();
  const [filter, setFilter] = useState<typeof filters[number]>('Todas');
  const done = tasks.filter(task => task.done).length;
  const progress = Math.round(done / tasks.length * 100);
  const visible = tasks.filter(task => filter === 'Todas' || task.done === (filter === 'Completadas'));

  return <Screen title="Jornadas" intro="Consulta las tareas de campo y registra tu avance.">
    <View style={styles.summary}>
      <Text style={ui.subtle}>JORNADA DE DEMOSTRACIÓN</Text>
      <View style={styles.top}><Text style={ui.sectionTitle}>{done} de {tasks.length} listas</Text><Text style={ui.label}>{progress}%</Text></View>
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
  summary: { padding: 16, gap: 10, backgroundColor: color.mint, borderRadius: 18, marginBottom: 14 },
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  track: { height: 9, backgroundColor: color.surface, borderRadius: 6, overflow: 'hidden' },
  fill: { height: '100%', backgroundColor: color.green, borderRadius: 6 },
  list: { gap: 8 },
  row: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  check: { width: 29, height: 29, borderWidth: 1, borderColor: color.green, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  checkDone: { backgroundColor: color.green },
  description: { flex: 1 },
});
