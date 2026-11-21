import { StyleSheet, Text, View } from 'react-native';
import { litersLabel } from '../../features/leche/records';
import { color } from '../../theme';
import { Card, SectionTitle, styles as ui } from '../ui';

export function MilkWeekChart({ days, today }: {
  days: { key: string; label: string; value: number }[];
  today: string;
}) {
  const maximum = Math.max(1, ...days.map(day => day.value));

  return <>
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
  </>;
}

const styles = StyleSheet.create({
  chart: { flexDirection: 'row', alignItems: 'flex-end', gap: 6, minHeight: 80, marginBottom: 7 },
  column: { flex: 1, minWidth: 0, alignItems: 'center', gap: 4 },
  bar: { width: '75%', maxWidth: 32, borderRadius: 4, backgroundColor: color.light },
  barToday: { backgroundColor: color.primary },
});
