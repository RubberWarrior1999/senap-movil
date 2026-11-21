import { useState } from 'react';
import { useRouter } from 'expo-router';
import { normalized } from '../features/usuarios/records';
import { useDemo } from './useDemo';

const filters = ['Todos', 'Activos', 'Inactivos'] as const;

export function useUsers() {
  const router = useRouter();
  const { canManageUsers, session, users, removeUser, notice } = useDemo();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<typeof filters[number]>('Todos');
  const [deleteId, setDeleteId] = useState('');
  const [error, setError] = useState('');
  const selected = users.find(user => user.id === deleteId);
  const term = normalized(query);
  const visible = users.filter(user => (filter === 'Todos' || user.active === (filter === 'Activos'))
    && [user.name, user.username, user.email].some(value => normalized(value).includes(term)));

  function confirmDelete() {
    if (!selected) return;
    const message = removeUser(selected.id);
    setError(message);
    if (!message) setDeleteId('');
  }

  const goBack = () => router.navigate('/');
  const addUser = () => router.push('/usuarios/nuevo');
  const editUser = (id: string) => router.push({ pathname: '/usuarios/[id]/editar', params: { id } });
  const cancelDelete = () => setDeleteId('');

  function requestDelete(id: string) {
    setError('');
    setDeleteId(id);
  }

  return {
    canManageUsers, sessionId: session?.id, selected, query, setQuery, filters, filter, setFilter,
    visible, error, notice, goBack, addUser, editUser, requestDelete, cancelDelete, confirmDelete,
  };
}
