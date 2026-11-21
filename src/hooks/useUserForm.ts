import { useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import type { User, UserDraft, UserErrors } from '../features/usuarios/records';
import { useDemo } from './useDemo';

export function useUserFormTarget() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { canManageUsers, users } = useDemo();
  const user = users.find(item => item.id === id);
  const openList = () => router.dismissTo('/usuarios');

  return { id, user, canManageUsers, openList };
}

export function useUserForm(user?: User) {
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

  return { editing: !!user, draft, errors, goBack, change, submit };
}
