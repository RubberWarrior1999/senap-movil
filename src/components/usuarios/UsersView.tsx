import { Text, View } from 'react-native';
import { Action, Badge, Card, Chips, EmptyState, Feedback, Field, Screen, SectionTitle, Sheet, styles as ui } from '../ui';
import type { useUsers } from '../../hooks/useUsers';

export function UsersView({
  canManageUsers, sessionId, selected, query, setQuery, filters, filter, setFilter, visible, error,
  notice, goBack, addUser, editUser, requestDelete, cancelDelete, confirmDelete,
}: ReturnType<typeof useUsers>) {
  if (!canManageUsers) return <Screen title="Usuarios" onBack={goBack}>
    <EmptyState title="Acceso restringido" detail="La cuenta de demostración actual no puede gestionar usuarios." />
  </Screen>;

  return <Screen title="Usuarios" intro="Consulta y administra las cuentas de la demostración.">
    <View style={ui.form}>
      <Action label="Nuevo usuario" icon="plus" onPress={addUser} />
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
        <Action label={`Editar a ${user.name}`} secondary onPress={() => editUser(user.id)} />
        {user.id !== sessionId && <Action label={`Eliminar a ${user.name}`} secondary onPress={() => requestDelete(user.id)} />}
      </View></Card>)}
    </View>
    {selected && <Sheet title="Eliminar usuario" onClose={cancelDelete}>
      <Text style={ui.body}>¿Eliminar la cuenta de {selected.name} de la demostración?</Text>
      {error && <Feedback error>{error}</Feedback>}
      <Action label="Confirmar eliminación" onPress={confirmDelete} />
      <Action label="Cancelar" secondary onPress={cancelDelete} />
    </Sheet>}
  </Screen>;
}
