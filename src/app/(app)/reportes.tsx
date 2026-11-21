import { ReportsView } from '../../components/reportes/ReportsView';
import { useReports } from '../../hooks/useReports';

export default function ReportsPage() {
  const view = useReports();
  return <ReportsView {...view} />;
}
