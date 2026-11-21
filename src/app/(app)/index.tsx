import { DashboardView } from '../../components/dashboard/DashboardView';
import { useDashboard } from '../../hooks/useDashboard';

export default function DashboardPage() {
  const view = useDashboard();
  return <DashboardView {...view} />;
}
