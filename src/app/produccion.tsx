import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { Action, Badge, Card, Chips, Screen, SectionTitle, Sheet, styles as ui } from '../components/ui';
import { animals, litersLabel, type MilkEntry } from '../services/demo';
import { useDemo } from '../services/DemoProvider';
import { color } from '../theme';
import { parseLiters } from '../utils/validateMilk';

const producers = animals.filter(animal => animal.sex === 'Hembra').map(animal => animal.name);
const turns = ['Mañana', 'Tarde'] as const;

export default function ProductionScreen() {
  const { milk, totalMilk, saveMilk } = useDemo();
  const [editorOpen, setEditorOpen] = useState(false);
  const [animal, setAnimal] = useState<typeof producers[number]>(producers[0]);
  const [turn, setTurn] = useState<MilkEntry['turn']>('Tarde');
  const [liters, setLiters] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const existing = milk.find(item => item.animal === animal && item.turn === turn);
  const days = [
    ['Lun', 37], ['Mar', 42], ['Mié', 40], ['Jue', 48], ['Vie', 45], ['Sáb', 41], ['Hoy', totalMilk],
  ] as const;
  const max = Math.max(...days.map(([, value]) => value));

  function chooseEntry(nextAnimal: typeof producers[number], nextTurn: MilkEntry['turn']) {
    setAnimal(nextAnimal);
    setTurn(nextTurn);
    const previous = milk.find(item => item.animal === nextAnimal && item.turn === nextTurn);
    setLiters(previous ? String(previous.liters).replace('.', ',') : '');
    setError('');
  }

  function submit() {
    const value = parseLiters(liters);
    if (value === null) {
      setError('Indica más de 0 y hasta 100 L, con hasta dos decimales.');
      return;
    }
    saveMilk({ animal, turn, liters: value });
    setNotice(existing ? 'Registro actualizado en la demo.' : 'Ordeño registrado en la demo.');
    setEditorOpen(false);
  }

  return <Screen title="Producción" intro="Registra el ordeño y consulta el total de la jornada.">
    <View style={styles.summary}>
      <Text style={styles.eyebrow}>LECHE DE LA JORNADA</Text>
      <Text style={styles.total}>{litersLabel(totalMilk)} <Text style={styles.unit}>L</Text></Text>
      <Text style={styles.summaryNote}>{milk.length} registros de ordeño</Text>
    </View>
    <View style={styles.actionWrap}><Action label="Registrar ordeño" icon="plus" onPress={() => {
      chooseEntry(producers[0], 'Tarde');
      setNotice('');
      setEditorOpen(true);
    }} /></View>
    {!!notice && <Text style={ui.body} accessibilityLiveRegion="polite">{notice}</Text>}
    <SectionTitle hint="LITROS">Últimas 7 jornadas</SectionTitle>
    <Card>
      <View style={styles.chart}>
        {days.map(([day, value]) => <View key={day} style={styles.column} accessibilityLabel={day + ': ' + litersLabel(value) + ' litros'}>
          <Text style={styles.chartNumber} numberOfLines={1} adjustsFontSizeToFit>{litersLabel(value)}</Text>
          <View style={[styles.bar, { height: Math.max(6, value / max * 76) }, day === 'Hoy' && styles.barToday]} />
          <Text style={styles.chartDay}>{day}</Text>
        </View>)}
      </View>
    </Card>
    <SectionTitle>Registros de hoy</SectionTitle>
    <View style={styles.list}>{milk.map(item => <Card key={item.id}>
      <View style={styles.row}><View style={styles.entry}><Text style={ui.label}>{item.animal}</Text><Text style={ui.body}>{item.turn}</Text></View>
        <Badge label={litersLabel(item.liters) + ' L'} /></View>
    </Card>)}</View>
    {editorOpen && <Sheet title="Registrar ordeño" onClose={() => setEditorOpen(false)}>
      <Text style={ui.label}>Animal</Text>
      <Chips options={producers} value={animal} onChange={value => chooseEntry(value, turn)} />
      <Text style={ui.label}>Turno</Text>
      <Chips options={turns} value={turn} onChange={value => chooseEntry(animal, value)} />
      <Text style={ui.label}>Litros</Text>
      <TextInput accessibilityLabel="Litros" value={liters} keyboardType="decimal-pad" onChangeText={value => {
        setLiters(value); setError('');
      }} placeholder="Ej. 8,5" placeholderTextColor={color.muted} style={ui.input} maxLength={9} />
      {!!error && <Text accessibilityRole="alert" style={styles.error}>{error}</Text>}
      {existing && <Text style={ui.body}>Ya hay un registro para este turno. Guardar actualizará sus litros.</Text>}
      <Action label={existing ? 'Actualizar registro' : 'Guardar registro'} onPress={submit} />
    </Sheet>}
  </Screen>;
}

const styles = StyleSheet.create({
  summary: { backgroundColor: color.forest, borderRadius: 21, padding: 17 },
  eyebrow: { color: color.lime, fontWeight: '800', fontSize: 11, letterSpacing: 1.2 },
  total: { fontSize: 45, color: color.surface, fontWeight: '800', letterSpacing: -1 },
  unit: { fontSize: 23, color: color.lime },
  summaryNote: { color: color.mint, fontSize: 13 },
  actionWrap: { marginTop: 10 },
  chart: { flexDirection: 'row', gap: 6, justifyContent: 'space-between', alignItems: 'flex-end' },
  column: { flex: 1, minWidth: 0, alignItems: 'center', gap: 4 },
  bar: { width: '68%', maxWidth: 34, borderRadius: 5, backgroundColor: '#BFDCC5' },
  barToday: { backgroundColor: color.green },
  chartDay: { fontSize: 10, color: color.muted, fontWeight: '700' },
  chartNumber: { color: color.muted, fontSize: 10, textAlign: 'center', width: '100%' },
  list: { gap: 8 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  entry: { flex: 1 },
  error: { color: '#A03428', fontSize: 13 },
});
