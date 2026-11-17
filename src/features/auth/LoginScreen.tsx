import { useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Text, View } from 'react-native';
import { Action, Card, Feedback, Field, Screen, styles as ui } from '../../components/ui';
import { useDemo } from '../../services/DemoProvider';
import { demoLogin } from '../usuarios/records';

export default function LoginScreen() {
  const router = useRouter();
  const { recuperada } = useLocalSearchParams<{ recuperada?: string }>();
  const { signIn } = useDemo();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  function submit() {
    if (!username.trim() || !password) {
      setError('Completa el usuario y la contraseña.');
    } else if (!signIn(username, password)) {
      setError('El usuario o la contraseña no son válidos.');
    }
  }

  return <Screen title="Iniciar sesión" intro="Accede al panel de gestión agropecuaria.">
    <View style={ui.form}>
      {recuperada === '1' && <Feedback>Contraseña actualizada en la demostración.</Feedback>}
      <Card>
        <View style={ui.form}>
          <Field label="Usuario" value={username} onChangeText={value => { setUsername(value); setError(''); }}
            autoCapitalize="none" autoCorrect={false} autoComplete="username" returnKeyType="next" maxLength={30} />
          <Field label="Contraseña" value={password} onChangeText={value => { setPassword(value); setError(''); }}
            autoComplete="current-password" secureTextEntry returnKeyType="go" onSubmitEditing={submit} />
          {!!error && <Feedback error>{error}</Feedback>}
          <Action label="Entrar" onPress={submit} />
          <Action label="Olvidé mi contraseña" secondary onPress={() => router.push('/recuperar')} />
        </View>
      </Card>
      <Card>
        <View style={ui.grow}>
          <Text style={ui.label}>Cuenta de demostración</Text>
          <Text selectable style={ui.body}>Usuario: {demoLogin.username}</Text>
          <Text selectable style={ui.body}>Contraseña inicial: {demoLogin.password}</Text>
          <Text selectable style={ui.body}>Correo: {demoLogin.email}</Text>
        </View>
      </Card>
    </View>
  </Screen>;
}
