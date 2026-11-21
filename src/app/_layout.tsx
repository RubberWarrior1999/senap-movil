import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { DemoProvider } from '../services/DemoProvider';
import { useDemo } from '../hooks/useDemo';
import { color } from '../theme';

function Navigation() {
  const { session } = useDemo();

  return <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: color.background } }}>
    <Stack.Protected guard={!session}>
      <Stack.Screen name="(auth)" />
    </Stack.Protected>
    <Stack.Protected guard={!!session}>
      <Stack.Screen name="(app)" />
    </Stack.Protected>
  </Stack>;
}

export default function Layout() {
  return <DemoProvider><StatusBar style="dark" /><Navigation /></DemoProvider>;
}
