import { printToFileAsync } from 'expo-print';
import { isAvailableAsync, shareAsync } from 'expo-sharing';
import type { Report } from './reportData';
import { makeReportHtml } from './reportHtml';

export async function exportReport(report: Report) {
  if (!(await isAvailableAsync())) {
    throw new Error('Este dispositivo no tiene disponible la opción de guardar o compartir PDF.');
  }

  const { uri } = await printToFileAsync({ html: makeReportHtml(report), width: 595, height: 842 });
  await shareAsync(uri, { mimeType: 'application/pdf', UTI: 'com.adobe.pdf', dialogTitle: report.title });
}
