import { Stack } from 'expo-router';
import { color } from '../../theme';

export default function AccessLayout() {
  return <Stack initialRouteName="login" screenOptions={{ headerShown: false, contentStyle: { backgroundColor: color.background } }}>
    <Stack.Screen name="login" />
    <Stack.Screen name="recuperar" />
  </Stack>;
}
