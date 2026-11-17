import { Stack } from 'expo-router';
import { color } from '../theme';

export default function ModuleStack() {
  return <Stack initialRouteName="index" screenOptions={{ headerShown: false, contentStyle: { backgroundColor: color.background } }} />;
}
