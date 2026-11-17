import { createContext, useContext, useRef, useState, type PropsWithChildren } from 'react';
import { initialHealth, initialTasks } from './demo';
import { initialUsers, normalized, validateUser, type UserDraft, type UserErrors } from '../features/usuarios/records';
import { initialAnimals, validateAnimal, type AnimalDraft, type AnimalErrors } from '../features/animales/records';
import { initialMilk, validateMilk, type MilkDraft, type MilkErrors } from '../features/leche/records';
import { parseLiters } from '../utils/validateMilk';

type Notice = { module: 'usuarios' | 'animales' | 'leche'; message: string };

function useDemoState() {
  const [health, setHealth] = useState(initialHealth);
  const [tasks, setTasks] = useState(initialTasks);
  const [milk, setMilk] = useState(initialMilk);
  const [animals, setAnimals] = useState(initialAnimals);
  const [accounts, setAccounts] = useState(initialUsers);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [notice, setNotice] = useState<Notice | null>(null);
  const sequence = useRef(0);
  const users = accounts.map(({ password, ...user }) => user);
  const session = users.find(user => user.id === sessionId && user.active);
  const canManageUsers = session?.role === 'Administrador';

  function signIn(username: string, password: string) {
    const account = accounts.find(user => user.username === normalized(username) && user.password === password && user.active);
    if (!account) return false;
    setNotice(null);
    setSessionId(account.id);
    return true;
  }

  function signOut() {
    setNotice(null);
    setSessionId(null);
  }

  function recoveryAccount(email: string) {
    if (session) return;
    return users.find(user => user.email === normalized(email) && user.active)?.id;
  }

  function resetPassword(id: string, password: string) {
    if (session || password.trim().length < 6 || !users.some(user => user.active && user.id === id)) return false;
    setAccounts(items => items.map(item => item.id === id ? { ...item, password } : item));
    return true;
  }

  function saveUser(draft: UserDraft, editingId?: string): UserErrors {
    if (!canManageUsers) return { form: 'La cuenta actual no puede gestionar usuarios.' };
    const target = accounts.find(user => user.id === editingId);
    if (editingId && !target) return { form: 'La cuenta ya no existe.' };
    const errors = validateUser(draft, users, editingId);
    if (Object.keys(errors).length) return errors;

    const account = {
      ...draft,
      id: target?.id ?? 'usuario-' + ++sequence.current,
      name: draft.name.trim(),
      username: normalized(draft.username),
      email: normalized(draft.email),
      password: draft.password || target?.password || '',
    };
    setAccounts(items => target ? items.map(item => item.id === account.id ? account : item) : [...items, account]);
    setNotice({ module: 'usuarios', message: target ? 'Usuario actualizado.' : 'Usuario creado.' });
    return {};
  }

  function removeUser(id: string) {
    if (!canManageUsers) return 'La cuenta actual no puede gestionar usuarios.';
    if (id === sessionId) return 'No puedes eliminar la cuenta con la que ingresaste.';
    setAccounts(items => items.filter(item => item.id !== id));
    setNotice({ module: 'usuarios', message: 'Usuario eliminado.' });
    return '';
  }

  function saveAnimal(draft: AnimalDraft, editingId?: string): { errors: AnimalErrors; id?: string } {
    if (!session) return { errors: { form: 'Inicia sesión para guardar un animal.' } };
    if (editingId && !animals.some(item => item.id === editingId)) return { errors: { form: 'El animal ya no existe.' } };
    const errors = validateAnimal(draft, animals, editingId);
    if (Object.keys(errors).length) return { errors };

    const animal = {
      ...draft,
      id: editingId ?? 'animal-' + ++sequence.current,
      name: draft.name.trim(),
      code: draft.code.trim().toUpperCase(),
      notes: draft.notes.trim(),
    };
    setAnimals(items => editingId ? items.map(item => item.id === editingId ? animal : item) : [...items, animal]);
    setNotice({ module: 'animales', message: editingId ? 'Ficha actualizada.' : 'Animal registrado.' });
    return { errors: {}, id: animal.id };
  }

  function completeHealth(id: string) {
    setHealth(items => items.map(item => item.id === id ? { ...item, done: true } : item));
  }

  function toggleTask(id: string) {
    setTasks(items => items.map(item => item.id === id ? { ...item, done: !item.done } : item));
  }

  function saveMilk(draft: MilkDraft): MilkErrors {
    if (!session) return { animalId: 'Inicia sesión para registrar un ordeño.' };
    const errors = validateMilk(draft, animals);
    const liters = parseLiters(draft.liters);
    if (Object.keys(errors).length || liters === null) return errors;
    const record = { ...draft, liters, notes: draft.notes.trim(), id: 'ordeño-' + ++sequence.current };
    setMilk(items => [record, ...items]);
    setNotice({ module: 'leche', message: 'Ordeño registrado.' });
    return {};
  }

  function removeMilk(id: string) {
    if (!session) return;
    setMilk(items => items.filter(item => item.id !== id));
    setNotice({ module: 'leche', message: 'Registro de ordeño eliminado.' });
  }

  return {
    session, canManageUsers, signIn, signOut, recoveryAccount, resetPassword,
    users, saveUser, removeUser, animals, saveAnimal, milk, saveMilk, removeMilk,
    health, tasks, completeHealth, toggleTask, notice, setNotice,
  };
}

const DemoContext = createContext<ReturnType<typeof useDemoState> | null>(null);

export function DemoProvider({ children }: PropsWithChildren) {
  return <DemoContext.Provider value={useDemoState()}>{children}</DemoContext.Provider>;
}

export function useDemo() {
  const state = useContext(DemoContext);
  if (!state) throw new Error('DemoProvider es necesario para leer los datos.');
  return state;
}
