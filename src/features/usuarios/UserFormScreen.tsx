import { useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { View } from 'react-native';
import { Action, Card, ChoiceField, EmptyState, Feedback, Field, Screen, styles as ui } from '../../components/ui';
import { useDemo } from '../../services/DemoProvider';
import { roles, type User, type UserDraft, type UserErrors } from './records';

export default function UserFormScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { canManageUsers, users } = useDemo();
  const user = users.find(item => item.id === id);
  if (!canManageUsers || (id && !user)) return <Screen title="Usuarios" onBack={() => router.dismissTo('/usuarios')}>
    <EmptyState title={canManageUsers ? 'Usuario no encontrado' : 'Acceso restringido'} />
  </Screen>;
  return <UserForm key={id ?? 'new'} user={user} />;
}

function UserForm({ user }: { user?: User }) {
  const router = useRouter();
  const { saveUser } = useDemo();
  const [draft, setDraft] = useState<UserDraft>({
    name: user?.name ?? '', username: user?.username ?? '', email: user?.email ?? '',
    role: user?.role ?? 'Usuario', active: user?.active ?? true, password: '',
  });
  const [errors, setErrors] = useState<UserErrors>({});
  const goBack = () => router.dismissTo('/usuarios');

  function change<K extends keyof UserDraft>(field: K, value: UserDraft[K]) {
    setDraft(item => ({ ...item, [field]: value }));
    setErrors(item => ({ ...item, [field]: undefined, form: undefined }));
  }

  function submit() {
    const next = saveUser(draft, user?.id);
    setErrors(next);
    if (!Object.keys(next).length) goBack();
  }

  return <Screen title={user ? 'Editar usuario' : 'Nuevo usuario'} intro="Completa los datos de la cuenta." onBack={goBack}>
    <Card><View style={ui.form}>
      <Field label="Nombre completo" value={draft.name} onChangeText={value => change('name', value)} error={errors.name} maxLength={60} />
      <Field label="Nombre de usuario" value={draft.username} onChangeText={value => change('username', value)}
        error={errors.username} autoCapitalize="none" autoCorrect={false} maxLength={30} />
      <Field label="Correo electrónico" value={draft.email} onChangeText={value => change('email', value)}
        error={errors.email} keyboardType="email-address" autoCapitalize="none" autoCorrect={false} maxLength={254} />
      <ChoiceField label="Rol" options={roles} value={draft.role} onChange={value => change('role', value)} error={errors.role} />
      <ChoiceField label="Estado de la cuenta" options={['Activa', 'Inactiva'] as const}
        value={draft.active ? 'Activa' : 'Inactiva'} onChange={value => change('active', value === 'Activa')} />
      <Field label="Contraseña de demostración" value={draft.password} onChangeText={value => change('password', value)}
        error={errors.password} secureTextEntry autoComplete="new-password"
        hint={user ? 'Déjala vacía para conservar la contraseña actual.' : 'Usa una contraseña ficticia de al menos 6 caracteres.'} />
      {errors.form && <Feedback error>{errors.form}</Feedback>}
      <Action label="Guardar usuario" onPress={submit} />
      <Action label="Cancelar" secondary onPress={goBack} />
    </View></Card>
  </Screen>;
}
