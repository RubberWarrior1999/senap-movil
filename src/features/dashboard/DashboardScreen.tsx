import { useRouter, type Href } from 'expo-router';
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { Action, Badge, Card, Icon, Screen, SectionTitle, styles as ui, type IconName } from '../../components/ui';
import { dateKey, litersLabel } from '../leche/records';
import { useDemo } from '../../services/DemoProvider';
import { color } from '../../theme';

export default function DashboardScreen() {
  const router = useRouter();
  const { width, fontScale } = useWindowDimensions();
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

  return <Screen title="Panel principal" intro={session ? `Hola, ${session.name}.` : undefined}>
    <View style={styles.hero}>
      <View style={styles.heroIcon}><Icon name="home" tint={color.surface} size={24} /></View>
      <View style={ui.grow}>
        <Text style={styles.heroTitle}>Resumen de la finca</Text>
        <Text style={styles.heroBody}>Indicadores con los datos de la demostración.</Text>
      </View>
    </View>
    <SectionTitle>Vista general</SectionTitle>
    <View style={styles.grid}>
      {modules.filter(module => module.visible).map(module => <Pressable key={module.name} accessibilityRole="button"
        accessibilityLabel={`Abrir ${module.name}`} accessibilityHint={`${module.value}, ${module.detail}`}
        onPress={() => router.navigate(module.href)}
        style={({ pressed }) => [styles.tile, { flexBasis: width / fontScale >= 350 ? '46%' : '100%' }, pressed && ui.pressed]}>
        <View style={styles.tileTop}>
          <View style={styles.iconBox}><Icon name={module.icon} size={20} /></View>
          <Icon name="arrow" size={17} tint={color.dark} />
        </View>
        <Text style={styles.value}>{module.value}</Text>
        <Text style={ui.label}>{module.name}</Text>
        <Text style={ui.body}>{module.detail}</Text>
      </Pressable>)}
    </View>
    <SectionTitle>Operación de la finca</SectionTitle>
    <View style={ui.list}>
      <Card><View style={ui.form}>
        <Badge label={`${health.filter(item => !item.done).length} controles pendientes`} />
        <Action label="Abrir Sanidad" secondary onPress={() => router.navigate('/sanidad')} />
        <Badge label={`${tasks.filter(task => task.done).length} de ${tasks.length} tareas completas`} />
        <Action label="Abrir Jornadas" secondary onPress={() => router.navigate('/jornadas')} />
      </View></Card>
      <Action label="Cerrar sesión" secondary onPress={signOut} />
    </View>
  </Screen>;
}

const styles = StyleSheet.create({
  hero: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: color.dark, borderRadius: 20, padding: 18 },
  heroIcon: { width: 46, height: 46, borderRadius: 13, alignItems: 'center', justifyContent: 'center', backgroundColor: '#2D518B' },
  heroTitle: { color: color.surface, fontWeight: '800', fontSize: 18 },
  heroBody: { color: color.soft, fontSize: 14, lineHeight: 20 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  tile: { flexGrow: 1, ...ui.card, gap: 5 },
  tileTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  iconBox: { width: 38, height: 38, borderRadius: 11, backgroundColor: color.soft, alignItems: 'center', justifyContent: 'center' },
  value: { color: color.dark, fontWeight: '800', fontSize: 27 },
});
