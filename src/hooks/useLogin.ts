import { useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useDemo } from './useDemo';

export function useLogin() {
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

  const openRecovery = () => router.push('/recuperar');
  function changeUsername(value: string) { setUsername(value); setError(''); }
  function changePassword(value: string) { setPassword(value); setError(''); }

  return { recuperada, username, password, error, changeUsername, changePassword, submit, openRecovery };
}
