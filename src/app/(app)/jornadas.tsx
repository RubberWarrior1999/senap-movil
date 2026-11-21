import { WorkView } from '../../components/jornadas/WorkView';
import { useWork } from '../../hooks/useWork';

export default function WorkPage() {
  const view = useWork();
  return <WorkView {...view} />;
}
