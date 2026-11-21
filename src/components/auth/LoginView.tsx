import { View } from 'react-native';
import { Action, Card, Feedback, Field, Screen, styles as ui } from '../ui';
import type { useLogin } from '../../hooks/useLogin';

export function LoginView({
  recuperada, username, password, error, changeUsername, changePassword, submit, openRecovery,
}: ReturnType<typeof useLogin>) {
  return <Screen title="Iniciar sesión" intro="Accede al panel de gestión agropecuaria.">
    <View style={ui.form}>
      {recuperada === '1' && <Feedback>Contraseña actualizada en la demostración.</Feedback>}
      <Card>
        <View style={ui.form}>
          <Field label="Usuario" value={username} onChangeText={changeUsername}
            autoCapitalize="none" autoCorrect={false} autoComplete="username" returnKeyType="next" maxLength={30} />
          <Field label="Contraseña" value={password} onChangeText={changePassword}
            autoComplete="current-password" secureTextEntry returnKeyType="go" onSubmitEditing={submit} />
          {!!error && <Feedback error>{error}</Feedback>}
          <Action label="Entrar" onPress={submit} />
          <Action label="Olvidé mi contraseña" secondary onPress={openRecovery} />
        </View>
      </Card>
    </View>
  </Screen>;
}
