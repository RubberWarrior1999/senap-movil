import { dateKey } from '../leche/records';
import type { Report } from './reportData';

const htmlEntities: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, character => htmlEntities[character]);
}

export function makeReportHtml(report: Report, generatedAt = new Date(), browser = false) {
  const metrics = report.metrics.map(metric =>
    `<div class="metric"><span>${escapeHtml(metric.label)}</span><strong>${escapeHtml(metric.value)}</strong></div>`,
  ).join('');
  const columns = report.columns.map(column => `<th scope="col">${escapeHtml(column)}</th>`).join('');
  const rows = report.rows.map(row =>
    '<tr>' + row.cells.map(cell => `<td>${escapeHtml(cell)}</td>`).join('') + '</tr>',
  ).join('');
  const table = rows
    ? `<table><thead><tr>${columns}</tr></thead><tbody>${rows}</tbody></table>`
    : '<p class="empty">No hay registros para el filtro seleccionado.</p>';
  const title = escapeHtml(report.title);
  const pageTitle = `SENAP - ${title} - ${dateKey(generatedAt)}`;

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${pageTitle}</title>
  <style>
    @page { size: A4 portrait; margin: 16mm 14mm; }
    * { box-sizing: border-box; }
    body { max-width: 860px; margin: 0 auto; color: #142543; background: #fff; font-family: Arial, sans-serif; font-size: 11pt; }
    header { margin-bottom: 16px; padding: 0 0 12px; border-bottom: 2px solid #12366d; }
    .brand { color: #12366d; font-weight: bold; margin-bottom: 8px; }
    h1 { font-size: 24pt; margin: 0 0 6px; line-height: 1.15; }
    h2 { font-size: 13pt; margin: 20px 0 8px; break-after: avoid; }
    p { margin: 5px 0; line-height: 1.35; }
    .meta { font-size: 10pt; color: #465a74; }
    .metrics { display: flex; flex-wrap: wrap; gap: 8px; break-inside: avoid; }
    .metric { flex: 1; min-width: 120px; border: 1px solid #cbd8e8; padding: 9px 12px; border-radius: 7px; }
    .metric span { display: block; color: #465a74; font-size: 9.5pt; }
    .metric strong { display: block; margin-top: 3px; color: #12366d; font-size: 17pt; }
    table { width: 100%; border-collapse: collapse; table-layout: fixed; font-size: 9.5pt; }
    thead { display: table-header-group; }
    th { text-align: left; color: #12366d; background: #eff6ff; border-bottom: 1px solid #b2c5db; }
    th, td { padding: 8px 6px; vertical-align: top; overflow-wrap: anywhere; }
    td { border-bottom: 1px solid #dce4ef; }
    tr { break-inside: avoid; }
    .empty { border: 1px solid #cbd8e8; padding: 12px; }
    footer { margin-top: 18px; color: #465a74; font-size: 9pt; }
    .print-tools { margin-bottom: 16px; }
    button { padding: 10px 14px; color: #fff; background: #12366d; border: 0; border-radius: 6px; font: inherit; cursor: pointer; }
    @media screen { body { padding: 22px; } }
    @media print {
      .print-tools { display: none; }
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    }
  </style>
</head>
<body>
  ${browser ? '<div class="print-tools"><button id="print-report" type="button">Guardar como PDF</button></div>' : ''}
  <header>
    <div class="brand">SENAP Móvil</div>
    <h1>${title}</h1>
    <p class="meta">Filtro aplicado: ${escapeHtml(report.filter)} · Generado el ${dateKey(generatedAt)}</p>
  </header>
  <section aria-label="Resumen">${'<div class="metrics">' + metrics + '</div>'}</section>
  <section aria-label="Detalle">
    <h2>Detalle del reporte</h2>
    ${table}
  </section>
  <footer>Datos de la sesión de demostración de SENAP Móvil.</footer>
</body>
</html>`;
}
