import type { Report } from './reportData';
import { makeReportHtml } from './reportHtml';

export async function exportReport(report: Report) {
  const preview = window.open('', '_blank');
  if (!preview) throw new Error('Permite las ventanas emergentes para abrir el PDF.');
  preview.opener = null;
  preview.document.open();
  preview.document.write(makeReportHtml(report, new Date(), true));
  preview.document.close();
  preview.document.getElementById('print-report')?.addEventListener('click', () => preview.print());
  preview.focus();
}
