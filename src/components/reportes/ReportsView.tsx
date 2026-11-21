import { Platform, Text, View } from 'react-native';
import type { useReports } from '../../hooks/useReports';
import { Action, Card, ChoiceField, Feedback, Screen, styles as ui } from '../ui';
import { ReportPreview } from './ReportPreview';
import { ReportSummary } from './ReportSummary';

export function ReportsView({
  report, selected, reports, filters, changeModule, changeFilter, exporting, download, error,
}: ReturnType<typeof useReports>) {
  return <Screen title="Reportes" intro="Consulta y exporta los datos de cada módulo.">
    <View style={ui.form}>
      <Card><View style={ui.form}>
        <ChoiceField label="Módulo" options={reports} value={selected} onChange={changeModule} />
        <ChoiceField label={selected === 'Leche' ? 'Período' : 'Estado'} options={filters}
          value={report?.filter ?? ''} onChange={changeFilter} />
      </View></Card>
      {report && <>
        <ReportSummary title={report.title} metrics={report.metrics} />
        <Action label={exporting ? 'Generando PDF…' : 'Exportar PDF'} onPress={download} disabled={exporting} />
        {Platform.OS === 'web' && <Text style={ui.body}>En la vista del reporte, elige Guardar como PDF.</Text>}
        {error && <Feedback error>{error}</Feedback>}
        <ReportPreview columns={report.columns} rows={report.rows} />
      </>}
    </View>
  </Screen>;
}
