import { View } from 'react-native';
import { Action, Card, ChoiceField, Feedback, Field, Screen, styles as ui } from '../ui';
import { roles } from '../../features/usuarios/records';
import type { useUserForm } from '../../hooks/useUserForm';

export function UserFormView({ editing, draft, errors, goBack, change, submit }: ReturnType<typeof useUserForm>) {
  return <Screen title={editing ? 'Editar usuario' : 'Nuevo usuario'} intro="Completa los datos de la cuenta." onBack={goBack}>
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
        hint={editing ? 'Déjala vacía para conservar la contraseña actual.' : 'Usa una contraseña ficticia de al menos 6 caracteres.'} />
      {errors.form && <Feedback error>{errors.form}</Feedback>}
      <Action label="Guardar usuario" onPress={submit} />
      <Action label="Cancelar" secondary onPress={goBack} />
    </View></Card>
  </Screen>;
}
