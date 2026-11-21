import { UsersView } from '../../../components/usuarios/UsersView';
import { useUsers } from '../../../hooks/useUsers';

export default function UsersPage() {
  const view = useUsers();
  return <UsersView {...view} />;
}
