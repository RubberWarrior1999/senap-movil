import { MilkView } from '../../../components/leche/MilkView';
import { useMilk } from '../../../hooks/useMilk';

export default function MilkPage() {
  const view = useMilk();
  return <MilkView {...view} />;
}
