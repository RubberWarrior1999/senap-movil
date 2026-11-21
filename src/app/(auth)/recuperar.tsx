import { RecoveryView } from '../../components/auth/RecoveryView';
import { useRecovery } from '../../hooks/useRecovery';

export default function RecoveryPage() {
  const view = useRecovery();
  return <RecoveryView {...view} />;
}
