import { useState } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { Action, Card, ChoiceField, EmptyState, Feedback, Screen, SectionTitle, styles as ui } from '../../components/ui';
import { useDemo } from '../../services/DemoProvider';
import { color } from '../../theme';
import { exportReport } from './exportReport';
import { buildReport, reportFilters, reportModules, type ReportModule } from './reportData';

const previewLimit = 6;

export default function ReportsScreen() {
  const source = useDemo();
  const [module, setModule] = useState<ReportModule>('Leche');
  const [filter, setFilter] = useState<string>(reportFilters.Leche[0]);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState('');
  const canReportUsers = source.canManageUsers;
  const selected = module === 'Usuarios' && !canReportUsers ? 'Leche' : module;
  const reports = reportModules.filter(item => item !== 'Usuarios' || canReportUsers);
  const report = buildReport(selected, filter, source);
  const web = Platform.OS === 'web';

  async function download() {
    if (!report || exporting) return;
    setError('');
    setExporting(true);
    try {
      await exportReport(report);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'No se pudo generar el reporte en PDF.');
    } finally {
      setExporting(false);
    }
  }

  return <Screen title="Reportes" intro="Consulta y exporta los datos de cada módulo.">
    <View style={ui.form}>
      <Card><View style={ui.form}>
        <ChoiceField label="Módulo" options={reports} value={selected} onChange={next => {
          setModule(next);
          setFilter(reportFilters[next][0]);
          setError('');
        }} />
        <ChoiceField label={selected === 'Leche' ? 'Período' : 'Estado'} options={reportFilters[selected]}
          value={report?.filter ?? ''} onChange={next => { setFilter(next); setError(''); }} />
      </View></Card>
      {report && <>
        <View style={styles.summary}>
          <Text accessibilityRole="header" style={styles.summaryTitle}>{report.title}</Text>
          <View style={styles.metrics}>
            {report.metrics.map(metric => <View key={metric.label} style={styles.metric}>
              <Text style={styles.metricValue}>{metric.value}</Text>
              <Text style={styles.metricLabel}>{metric.label}</Text>
            </View>)}
          </View>
        </View>
        <Action label={exporting ? 'Generando PDF…' : 'Exportar PDF'} onPress={download} disabled={exporting} />
        {web && <Text style={ui.body}>En la vista del reporte, elige Guardar como PDF.</Text>}
        {error && <Feedback error>{error}</Feedback>}
        <View>
          <SectionTitle hint={String(report.rows.length)}>Detalle del reporte</SectionTitle>
          <View style={ui.list}>
            {!report.rows.length && <EmptyState title="Sin registros" detail="Cambia el filtro para consultar otros registros." />}
            {report.rows.slice(0, previewLimit).map(row => <Card key={row.id}>
              <Text style={ui.label}>{row.cells[0]}</Text>
              {row.cells.slice(1).map((value, index) =>
                <Text key={report.columns[index + 1]} style={ui.body}>{report.columns[index + 1]} · {value}</Text>,
              )}
            </Card>)}
            {report.rows.length > previewLimit && <Text style={ui.body}>
              Vista previa de {previewLimit} registros. El PDF incluye los {report.rows.length}.
            </Text>}
          </View>
        </View>
      </>}
    </View>
  </Screen>;
}

const styles = StyleSheet.create({
  summary: { backgroundColor: color.dark, borderRadius: 16, padding: 16, gap: 12 },
  summaryTitle: { color: color.surface, fontSize: 20, fontWeight: '800' },
  metrics: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  metric: { flexGrow: 1, minWidth: 95, maxWidth: '100%', gap: 2 },
  metricValue: { color: color.surface, fontSize: 23, fontWeight: '800' },
  metricLabel: { color: color.soft, fontSize: 13, lineHeight: 19 },
});
