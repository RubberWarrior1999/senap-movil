import { HealthView } from '../../components/sanidad/HealthView';
import { useHealth } from '../../hooks/useHealth';

export default function HealthPage() {
  const view = useHealth();
  return <HealthView {...view} />;
}
