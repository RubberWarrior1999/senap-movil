import { UserFormView } from '../../components/usuarios/UserFormView';
import { EmptyState, Screen } from '../../components/ui';
import { useUserForm, useUserFormTarget } from '../../hooks/useUserForm';
import type { User } from './records';

export default function UserFormScreen() {
  const { id, user, canManageUsers, openList } = useUserFormTarget();
  if (!canManageUsers || (id && !user)) return <Screen title="Usuarios" onBack={openList}>
    <EmptyState title={canManageUsers ? 'Usuario no encontrado' : 'Acceso restringido'} />
  </Screen>;

  return <UserForm key={id ?? 'new'} user={user} />;
}

function UserForm({ user }: { user?: User }) {
  const form = useUserForm(user);
  return <UserFormView {...form} />;
}
