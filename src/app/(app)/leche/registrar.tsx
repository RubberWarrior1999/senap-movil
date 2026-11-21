import { MilkFormView } from '../../../components/leche/MilkFormView';
import { useMilkForm } from '../../../hooks/useMilkForm';

export default function MilkFormPage() {
  const view = useMilkForm();
  return <MilkFormView {...view} />;
}
