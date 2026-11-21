import { Text, View } from 'react-native';
import type { Report } from '../../features/reportes/reportData';
import { Card, EmptyState, SectionTitle, styles as ui } from '../ui';

const previewLimit = 6;

export function ReportPreview({ columns, rows }: Pick<Report, 'columns' | 'rows'>) {
  return <View>
    <SectionTitle hint={String(rows.length)}>Detalle del reporte</SectionTitle>
    <View style={ui.list}>
      {!rows.length && <EmptyState title="Sin registros" detail="Cambia el filtro para consultar otros registros." />}
      {rows.slice(0, previewLimit).map(row => <Card key={row.id}>
        <Text style={ui.label}>{row.cells[0]}</Text>
        {row.cells.slice(1).map((value, index) =>
          <Text key={columns[index + 1]} style={ui.body}>{columns[index + 1]} · {value}</Text>,
        )}
      </Card>)}
      {rows.length > previewLimit && <Text style={ui.body}>
        Vista previa de {previewLimit} registros. El PDF incluye los {rows.length}.
      </Text>}
    </View>
  </View>;
}
