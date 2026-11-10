import { useRouter } from 'expo-router';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Card, Icon, Screen, SectionTitle, styles as ui } from '../components/ui';
import { animals, litersLabel } from '../services/demo';
import { useDemo } from '../services/DemoProvider';
import { color } from '../theme';

export default function HomeScreen() {
  const router = useRouter();
  const { health, tasks, totalMilk } = useDemo();
  const completed = tasks.filter(task => task.done).length;
  const next = tasks.find(task => !task.done);
  const modules = [
    { name: 'Ganado', hint: 'Inventario animal', value: animals.length, icon: 'herd', href: '/ganado' },
    { name: 'Sanidad', hint: 'Controles pendientes', value: health.filter(item => !item.done).length, icon: 'health', href: '/sanidad' },
    { name: 'Producción', hint: 'Leche de la jornada', value: litersLabel(totalMilk) + ' L', icon: 'drop', href: '/produccion' },
    { name: 'Jornadas', hint: 'Tareas completadas', value: completed + ' / ' + tasks.length, icon: 'task', href: '/jornadas' },
  ] as const;

  return <Screen>
    <View style={styles.hero}>
      <Image source={require('../../assets/pastures.png')} resizeMode="cover" style={styles.heroImage} accessible={false} />
      <Text style={styles.eyebrow}>GESTIÓN AGROPECUARIA</Text>
      <Text accessibilityRole="header" style={styles.heroTitle}>Tu finca,{"\n"}al día.</Text>
      <Text style={styles.heroSub}>Resumen de la jornada</Text>
    </View>
    <SectionTitle hint="DATOS DE PRUEBA">Vista general</SectionTitle>
    <View style={styles.grid}>
      {modules.map(module => <Pressable key={module.href} accessibilityRole="button"
        accessibilityLabel={'Abrir ' + module.name} onPress={() => router.push(module.href)}
        style={({ pressed }) => [styles.tile, pressed && ui.pressed]}>
        <View style={styles.tileTop}><View style={styles.iconBox}><Icon name={module.icon} size={19} /></View>
          <Icon name="arrow" size={17} tint={color.muted} /></View>
        <Text style={styles.value}>{module.value}</Text>
        <Text style={ui.label}>{module.name}</Text>
        <Text style={ui.subtle}>{module.hint}</Text>
      </Pressable>)}
    </View>
    <SectionTitle>Próxima tarea</SectionTitle>
    <Card><Text style={ui.label}>{next?.title ?? 'Jornada completada'}</Text>
      <Text style={ui.body}>{next ? next.time + ' · ' + next.lot : 'Todas las tareas se completaron.'}</Text>
    </Card>
  </Screen>;
}

const styles = StyleSheet.create({
  hero: { minHeight: 182, padding: 20, borderRadius: 23, overflow: 'hidden', justifyContent: 'center', backgroundColor: color.forest },
  heroImage: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' },
  eyebrow: { color: color.lime, fontSize: 10, letterSpacing: 1.8, fontWeight: '800' },
  heroTitle: { fontSize: 42, lineHeight: 43, fontWeight: '800', letterSpacing: -1.7, color: color.surface, marginTop: 7 },
  heroSub: { color: '#E1EEE6', fontSize: 13, marginTop: 8 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 9 },
  tile: { flexBasis: '48%', flexGrow: 1, backgroundColor: color.surface, borderColor: color.border, borderWidth: 1, borderRadius: 17, padding: 12, gap: 4 },
  tileTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  iconBox: { width: 34, height: 34, borderRadius: 10, backgroundColor: color.mint, justifyContent: 'center', alignItems: 'center' },
  value: { color: color.ink, fontWeight: '800', fontSize: 25, marginTop: 2 },
});
