import { Tabs } from 'expo-router';
import { useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon, type IconName } from '../../components/ui';
import { useDemo } from '../../services/DemoProvider';
import { color } from '../../theme';

const tabs = [
  { name: 'index', title: 'Panel', icon: 'home' },
  { name: 'usuarios', title: 'Usuarios', icon: 'task' },
  { name: 'animales', title: 'Animales', icon: 'herd' },
  { name: 'leche', title: 'Leche', icon: 'drop' },
] satisfies { name: string; title: string; icon: IconName }[];

export default function MainLayout() {
  const { canManageUsers } = useDemo();
  const { bottom } = useSafeAreaInsets();
  const { fontScale } = useWindowDimensions();

  return <Tabs initialRouteName="index" screenOptions={{
    headerShown: false,
    tabBarHideOnKeyboard: true,
    tabBarActiveTintColor: color.dark,
    tabBarInactiveTintColor: color.muted,
    tabBarStyle: {
      backgroundColor: color.surface,
      borderTopColor: color.border,
      height: 62 + bottom + 16 * Math.max(0, fontScale - 1),
    },
    tabBarActiveBackgroundColor: color.background,
    tabBarLabelStyle: { fontSize: 12, fontWeight: '700' },
    sceneStyle: { backgroundColor: color.background },
  }}>
    {tabs.map(({ name, title, icon }) => <Tabs.Screen key={name} name={name} options={{
      title,
      href: name === 'usuarios' && !canManageUsers ? null : undefined,
      tabBarIcon: ({ color: tint }) => <Icon name={icon} tint={tint} size={21} />,
    }} />)}
    <Tabs.Screen name="ganado" options={{ href: null }} />
    <Tabs.Screen name="produccion" options={{ href: null }} />
    <Tabs.Screen name="sanidad" options={{ href: null }} />
    <Tabs.Screen name="jornadas" options={{ href: null }} />
  </Tabs>;
}
