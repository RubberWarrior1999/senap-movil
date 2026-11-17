import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'expo-router';
import { Text, View } from 'react-native';
import { Action, Card, Feedback, Field, LoadingState, Screen, styles as ui } from '../../components/ui';
import { useDemo } from '../../services/DemoProvider';
import { validEmail } from '../usuarios/records';

const demoCode = '482615';
const lifetimeMs = 15 * 60 * 1000;
const maxAttempts = 5;
type Challenge = { accountId?: string; expiresAt: number; failedAttempts: number; verified: boolean };
type Step = 'email' | 'code' | 'password';
const titles: Record<Step, string> = { email: 'Recuperar contraseña', code: 'Verificar código', password: 'Nueva contraseña' };

export default function RecoveryScreen() {
  const router = useRouter();
  const { recoveryAccount, resetPassword } = useDemo();
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const challenge = useRef<Challenge | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current !== null) clearTimeout(timer.current);
  }, []);

  function issue() {
    if (timer.current !== null) return;
    if (!validEmail(email)) {
      setError('Introduce un correo válido.');
      return;
    }
    setError('');
    setPending(true);
    timer.current = setTimeout(() => {
      timer.current = null;
      challenge.current = { accountId: recoveryAccount(email), expiresAt: Date.now() + lifetimeMs, failedAttempts: 0, verified: false };
      setCode('');
      setPending(false);
      setStep('code');
    }, 280);
  }

  function restart() {
    challenge.current = null;
    setCode('');
    setPassword('');
    setConfirmation('');
    setError('');
    setStep('email');
  }

  function verify() {
    const current = challenge.current;
    if (!current || current.expiresAt <= Date.now() || current.failedAttempts >= maxAttempts) {
      setError('El código expiró o agotó los intentos. Solicita uno nuevo.');
      return;
    }
    if (!/^\d{6}$/.test(code.trim())) {
      setError('Escribe un código de seis dígitos.');
      return;
    }
    if (code.trim() !== demoCode || !current.accountId) {
      current.failedAttempts += 1;
      setError(current.failedAttempts === maxAttempts ? 'Agotaste los intentos. Solicita un código nuevo.' : 'El código no es válido.');
      return;
    }
    current.verified = true;
    setCode('');
    setError('');
    setStep('password');
  }

  function save() {
    const current = challenge.current;
    if (!current?.accountId || !current.verified || current.expiresAt <= Date.now()) {
      setError('La validación expiró. Solicita un código nuevo.');
      return;
    }
    if (password.trim().length < 6) {
      setError('Usa al menos 6 caracteres en la nueva contraseña.');
      return;
    }
    if (password !== confirmation) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    if (!resetPassword(current.accountId, password)) {
      setError('No se pudo completar la recuperación. Solicita un código nuevo.');
      return;
    }
    challenge.current = null;
    router.dismissTo({ pathname: '/login', params: { recuperada: '1' } });
  }

  const progress = { email: '1 de 3', code: '2 de 3', password: '3 de 3' }[step];
  const backToLogin = () => router.dismissTo('/login');

  return <Screen title={titles[step]} intro={`Paso ${progress}`} onBack={backToLogin}>
    <Card><View style={ui.form}>
      {step === 'email' && <>
        <Field label="Correo registrado" value={email} onChangeText={value => { setEmail(value); setError(''); }}
          autoCapitalize="none" autoCorrect={false} keyboardType="email-address" autoComplete="email"
          maxLength={254} editable={!pending} />
        {pending && <LoadingState label="Preparando código de prueba…" />}
        {!!error && <Feedback error>{error}</Feedback>}
        <Action label="Solicitar código" onPress={issue} disabled={pending} />
      </>}
      {step === 'code' && <>
        <Text style={ui.body}>Para una cuenta activa, el código simulado es <Text style={ui.label}>{demoCode}</Text>.
          Tiene 15 minutos de vigencia. Esta demostración no envía correo.</Text>
        <Field label="Código de verificación" keyboardType="number-pad" maxLength={6} value={code}
          onChangeText={value => { setCode(value); setError(''); }} />
        {!!error && <Feedback error>{error}</Feedback>}
        <Action label="Verificar código" onPress={verify} />
        <Action label="Solicitar un código nuevo" secondary onPress={restart} />
      </>}
      {step === 'password' && <>
        <Field label="Nueva contraseña" secureTextEntry value={password}
          onChangeText={value => { setPassword(value); setError(''); }} autoComplete="new-password" />
        <Field label="Confirmar contraseña" secureTextEntry value={confirmation}
          onChangeText={value => { setConfirmation(value); setError(''); }} autoComplete="new-password" />
        {!!error && <Feedback error>{error}</Feedback>}
        <Action label="Guardar contraseña" onPress={save} />
        <Action label="Solicitar un código nuevo" secondary onPress={restart} />
      </>}
    </View></Card>
  </Screen>;
}
