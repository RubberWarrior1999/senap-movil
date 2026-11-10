import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Icon, type IconName } from '../components/ui';
import { DemoProvider } from '../services/DemoProvider';
import { color } from '../theme';

const tabs = [
  { name: 'index', title: 'Inicio', icon: 'home' },
  { name: 'ganado', title: 'Ganado', icon: 'herd' },
  { name: 'sanidad', title: 'Sanidad', icon: 'health' },
  { name: 'produccion', title: 'Producción', icon: 'drop' },
  { name: 'jornadas', title: 'Jornadas', icon: 'task' },
] satisfies { name: string; title: string; icon: IconName }[];

export default function Layout() {
  return <DemoProvider>
    <StatusBar style="dark" />
    <Tabs screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: color.forest,
      tabBarInactiveTintColor: color.muted,
      tabBarStyle: { backgroundColor: color.surface, borderTopColor: color.border, minHeight: 57 },
      tabBarLabelStyle: { fontSize: 10, fontWeight: '700' },
    }}>
      {tabs.map(tab => <Tabs.Screen key={tab.name} name={tab.name} options={{
        title: tab.title,
        tabBarIcon: ({ color: tint, focused }) => (
          <Icon name={tab.icon} tint={tint} size={focused ? 24 : 21} />
        ),
      }} />)}
    </Tabs>
  </DemoProvider>;
}
