import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'expo-router';
import { useDemo } from './useDemo';
import { validEmail } from '../features/usuarios/records';

const demoCode = '482615';
const lifetimeMs = 15 * 60 * 1000;
const maxAttempts = 5;
type Challenge = { accountId?: string; expiresAt: number; failedAttempts: number; verified: boolean };
type Step = 'email' | 'code' | 'password';
const titles: Record<Step, string> = { email: 'Recuperar contraseña', code: 'Verificar código', password: 'Nueva contraseña' };

export function useRecovery() {
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

  function changeEmail(value: string) { setEmail(value); setError(''); }
  function changeCode(value: string) { setCode(value); setError(''); }
  function changePassword(value: string) { setPassword(value); setError(''); }
  function changeConfirmation(value: string) { setConfirmation(value); setError(''); }

  return {
    step, title: titles[step], progress, email, code, password, confirmation, pending, error,
    changeEmail, changeCode, changePassword, changeConfirmation, issue, restart, verify, save,
    backToLogin,
  };
}
