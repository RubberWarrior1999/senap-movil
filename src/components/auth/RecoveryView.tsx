import { Text, View } from 'react-native';
import { Action, Card, Feedback, Field, LoadingState, Screen, styles as ui } from '../ui';
import type { useRecovery } from '../../hooks/useRecovery';

export function RecoveryView({
  step, title, progress, email, code, password, confirmation, pending, error, changeEmail,
  changeCode, changePassword, changeConfirmation, issue, restart, verify, save, backToLogin,
}: ReturnType<typeof useRecovery>) {
  return <Screen title={title} intro={`Paso ${progress}`} onBack={backToLogin}>
    <Card><View style={ui.form}>
      {step === 'email' && <>
        <Field label="Correo registrado" value={email} onChangeText={changeEmail}
          autoCapitalize="none" autoCorrect={false} keyboardType="email-address" autoComplete="email"
          maxLength={254} editable={!pending} />
        {pending && <LoadingState label="Preparando código de prueba…" />}
        {!!error && <Feedback error>{error}</Feedback>}
        <Action label="Solicitar código" onPress={issue} disabled={pending} />
      </>}
      {step === 'code' && <>
        <Text style={ui.body}>Introduce el código de prueba. Tiene 15 minutos de vigencia.
          La verificación es simulada.</Text>
        <Field label="Código de verificación" keyboardType="number-pad" maxLength={6} value={code}
          onChangeText={changeCode} />
        {!!error && <Feedback error>{error}</Feedback>}
        <Action label="Verificar código" onPress={verify} />
        <Action label="Solicitar un código nuevo" secondary onPress={restart} />
      </>}
      {step === 'password' && <>
        <Field label="Nueva contraseña" secureTextEntry value={password}
          onChangeText={changePassword} autoComplete="new-password" />
        <Field label="Confirmar contraseña" secureTextEntry value={confirmation}
          onChangeText={changeConfirmation} autoComplete="new-password" />
        {!!error && <Feedback error>{error}</Feedback>}
        <Action label="Guardar contraseña" onPress={save} />
        <Action label="Solicitar un código nuevo" secondary onPress={restart} />
      </>}
    </View></Card>
  </Screen>;
}
