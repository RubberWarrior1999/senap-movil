import { Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { Action, Badge, Card, Icon, Screen, SectionTitle, styles as ui } from '../ui';
import { color } from '../../theme';
import type { useDashboard } from '../../hooks/useDashboard';

export function DashboardView({
  session, modules, pendingControls, completedTasks, totalTasks, openModule, signOut,
}: ReturnType<typeof useDashboard>) {
  const { width, fontScale } = useWindowDimensions();

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
      {modules.map(module => <Pressable key={module.name} accessibilityRole="button"
        accessibilityLabel={`Abrir ${module.name}`} accessibilityHint={`${module.value}, ${module.detail}`}
        onPress={() => openModule(module.href)}
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
        <Badge label={`${pendingControls} controles pendientes`} />
        <Action label="Abrir Sanidad" secondary onPress={() => openModule('/sanidad')} />
        <Badge label={`${completedTasks} de ${totalTasks} tareas completas`} />
        <Action label="Abrir Jornadas" secondary onPress={() => openModule('/jornadas')} />
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
