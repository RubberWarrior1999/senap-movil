import { StyleSheet, Text, View } from 'react-native';
import type { Report } from '../../features/reportes/reportData';
import { color } from '../../theme';

export function ReportSummary({ title, metrics }: Pick<Report, 'title' | 'metrics'>) {
  return <View style={styles.summary}>
    <Text accessibilityRole="header" style={styles.title}>{title}</Text>
    <View style={styles.metrics}>
      {metrics.map(metric => <View key={metric.label} style={styles.metric}>
        <Text style={styles.value}>{metric.value}</Text>
        <Text style={styles.label}>{metric.label}</Text>
      </View>)}
    </View>
  </View>;
}

const styles = StyleSheet.create({
  summary: { backgroundColor: color.dark, borderRadius: 16, padding: 16, gap: 12 },
  title: { color: color.surface, fontSize: 20, fontWeight: '800' },
  metrics: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  metric: { flexGrow: 1, minWidth: 95, maxWidth: '100%', gap: 2 },
  value: { color: color.surface, fontSize: 23, fontWeight: '800' },
  label: { color: color.soft, fontSize: 13, lineHeight: 19 },
});
