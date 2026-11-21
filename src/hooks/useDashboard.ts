import { useRouter, type Href } from 'expo-router';
import type { IconName } from '../components/ui';
import { dateKey, litersLabel } from '../features/leche/records';
import { useDemo } from './useDemo';

export function useDashboard() {
  const router = useRouter();
  const { session, canManageUsers, signOut, users, animals, milk, health, tasks } = useDemo();
  const todayMilk = milk.filter(item => item.date === dateKey());
  const total = todayMilk.reduce((sum, item) => sum + item.liters, 0);
  const activeAnimals = animals.filter(item => item.status === 'Activo').length;
  const activeUsers = users.filter(item => item.active).length;
  const modules: { name: string; detail: string; value: string; icon: IconName; href: Href; visible: boolean }[] = [
    { name: 'Animales', detail: 'Activos en el inventario', value: String(activeAnimals), icon: 'herd', href: '/animales', visible: true },
    { name: 'Producción de leche', detail: `${todayMilk.length} ordeños de hoy`, value: litersLabel(total) + ' L', icon: 'drop', href: '/leche', visible: true },
    { name: 'Usuarios', detail: 'Cuentas activas', value: String(activeUsers), icon: 'task', href: '/usuarios', visible: canManageUsers },
  ];

  const pendingControls = health.filter(item => !item.done).length;
  const completedTasks = tasks.filter(task => task.done).length;
  const totalTasks = tasks.length;
  const openModule = (href: Href) => router.navigate(href);

  return {
    session, modules: modules.filter(module => module.visible), pendingControls, completedTasks,
    totalTasks, openModule, signOut,
  };
}
