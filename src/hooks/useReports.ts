import { useState } from 'react';
import { exportReport } from '../features/reportes/exportReport';
import { buildReport, reportFilters, reportModules, type ReportModule } from '../features/reportes/reportData';
import { useDemo } from './useDemo';

export function useReports() {
  const source = useDemo();
  const [module, setModule] = useState<ReportModule>('Leche');
  const [filter, setFilter] = useState<string>(reportFilters.Leche[0]);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState('');
  const canReportUsers = source.canManageUsers;
  const selected = module === 'Usuarios' && !canReportUsers ? 'Leche' : module;
  const reports = reportModules.filter(item => item !== 'Usuarios' || canReportUsers);
  const report = buildReport(selected, filter, source);

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

  function changeModule(next: ReportModule) {
    setModule(next);
    setFilter(reportFilters[next][0]);
    setError('');
  }

  function changeFilter(next: string) {
    setFilter(next);
    setError('');
  }

  return {
    report, selected, reports, filters: reportFilters[selected], changeModule, changeFilter, exporting,
    download, error,
  };
}
