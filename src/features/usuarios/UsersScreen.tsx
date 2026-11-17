import { useState } from 'react';
import { useRouter } from 'expo-router';
import { Text, View } from 'react-native';
import { Action, Badge, Card, Chips, EmptyState, Feedback, Field, Screen, SectionTitle, Sheet, styles as ui } from '../../components/ui';
import { useDemo } from '../../services/DemoProvider';
import { normalized } from './records';

const filters = ['Todos', 'Activos', 'Inactivos'] as const;

export default function UsersScreen() {
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

  if (!canManageUsers) return <Screen title="Usuarios" onBack={() => router.navigate('/')}>
    <EmptyState title="Acceso restringido" detail="La cuenta de demostración actual no puede gestionar usuarios." />
  </Screen>;

  function confirmDelete() {
    if (!selected) return;
    const message = removeUser(selected.id);
    setError(message);
    if (!message) setDeleteId('');
  }

  return <Screen title="Usuarios" intro="Consulta y administra las cuentas de la demostración.">
    <View style={ui.form}>
      <Action label="Nuevo usuario" icon="plus" onPress={() => router.push('/usuarios/nuevo')} />
      {notice?.module === 'usuarios' && <Feedback>{notice.message}</Feedback>}
      <Field label="Buscar usuarios" placeholder="Nombre, usuario o correo" value={query} onChangeText={setQuery} />
      <Chips options={filters} value={filter} onChange={setFilter} />
    </View>
    <SectionTitle hint={String(visible.length)}>Cuentas</SectionTitle>
    <View style={ui.list}>
      {!visible.length && <EmptyState title="Sin usuarios para esta búsqueda" detail="Prueba otro nombre o cambia el filtro." />}
      {visible.map(user => <Card key={user.id}><View style={ui.list}>
        <View style={ui.row}>
          <View style={ui.grow}>
            <Text style={ui.label}>{user.name}</Text>
            <Text style={ui.body}>{user.username} · {user.role}</Text>
            <Text style={ui.body}>{user.email}</Text>
          </View>
          <Badge label={user.active ? 'Activo' : 'Inactivo'} warm={!user.active} />
        </View>
        <Action label={`Editar a ${user.name}`} secondary onPress={() => router.push({ pathname: '/usuarios/[id]/editar', params: { id: user.id } })} />
        {user.id !== session?.id && <Action label={`Eliminar a ${user.name}`} secondary onPress={() => { setError(''); setDeleteId(user.id); }} />}
      </View></Card>)}
    </View>
    {selected && <Sheet title="Eliminar usuario" onClose={() => setDeleteId('')}>
      <Text style={ui.body}>¿Eliminar la cuenta de {selected.name} de la demostración?</Text>
      {error && <Feedback error>{error}</Feedback>}
      <Action label="Confirmar eliminación" onPress={confirmDelete} />
      <Action label="Cancelar" secondary onPress={() => setDeleteId('')} />
    </Sheet>}
  </Screen>;
}
