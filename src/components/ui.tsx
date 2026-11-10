import type { PropsWithChildren, ReactNode } from 'react';
import { Image, KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { ColorValue } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { color } from '../theme';

const icons = {
  home: require('../../assets/home.png'),
  herd: require('../../assets/herd.png'),
  health: require('../../assets/health.png'),
  drop: require('../../assets/drop.png'),
  task: require('../../assets/task.png'),
  arrow: require('../../assets/arrow.png'),
  search: require('../../assets/search.png'),
  plus: require('../../assets/plus.png'),
  check: require('../../assets/check.png'),
  close: require('../../assets/close.png'),
  leaf: require('../../assets/leaf.png'),
} as const;

export type IconName = keyof typeof icons;

export function Icon({ name, size = 23, tint = color.green }: { name: IconName; size?: number; tint?: ColorValue }) {
  return <Image source={icons[name]} accessible={false} style={{ width: size, height: size, tintColor: tint }} />;
}

export function Screen({ title, intro, children }: PropsWithChildren<{ title?: string; intro?: string }>) {
  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.scroll}>
        <View style={styles.content}>
          <View style={styles.top}>
            <View style={styles.brand}><View style={styles.logo}><Icon name="leaf" tint={color.lime} size={20} /></View>
              <Text style={styles.wordmark}>SENAP <Text style={styles.brandMuted}>Móvil</Text></Text>
            </View>
            <Text style={styles.mode}>● DEMO</Text>
          </View>
          {title && <Text accessibilityRole="header" style={styles.title}>{title}</Text>}
          {intro && <Text style={styles.intro}>{intro}</Text>}
          {children}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export function SectionTitle({ children, hint }: PropsWithChildren<{ hint?: string }>) {
  return <View style={styles.section}><Text accessibilityRole="header" style={styles.sectionTitle}>{children}</Text>
    {hint && <Text style={styles.subtle}>{hint}</Text>}
  </View>;
}

export function Card({ children }: PropsWithChildren) {
  return <View style={styles.card}>{children}</View>;
}

export function Badge({ label, warm }: { label: string; warm?: boolean }) {
  return <Text style={[styles.badge, warm && styles.badgeWarm]}>{label}</Text>;
}

export function Action({ label, onPress, icon }: { label: string; onPress: () => void; icon?: IconName }) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [styles.action, pressed && styles.pressed]}>
      {icon && <Icon name={icon} size={18} tint={color.surface} />}
      <Text style={styles.actionText}>{label}</Text>
    </Pressable>
  );
}

export function Chips<T extends string>({ options, value, onChange }: {
  options: readonly T[]; value: T; onChange: (value: T) => void;
}) {
  return <View style={styles.chips}>
    {options.map(option => <Pressable key={option} accessibilityRole="button"
      accessibilityState={{ selected: option === value }} onPress={() => onChange(option)}
      style={({ pressed }) => [styles.chip, option === value && styles.chipActive, pressed && styles.pressed]}>
      <Text style={[styles.chipText, option === value && styles.chipActiveText]}>{option}</Text>
    </Pressable>)}
  </View>;
}

export function Sheet({ title, children, onClose }: { title: string; children: ReactNode; onClose: () => void }) {
  const { bottom } = useSafeAreaInsets();
  return <Modal visible transparent animationType="fade" onRequestClose={onClose}>
    <KeyboardAvoidingView style={styles.overlay} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Pressable accessibilityElementsHidden importantForAccessibility="no" style={StyleSheet.absoluteFill} onPress={onClose} />
      <View style={styles.sheet} accessibilityViewIsModal>
        <View style={styles.sheetHead}>
          <Text accessibilityRole="header" style={styles.sectionTitle}>{title}</Text>
          <Pressable accessibilityRole="button" accessibilityLabel="Cerrar" onPress={onClose} style={styles.close}>
            <Icon name="close" size={19} />
          </Pressable>
        </View>
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={[styles.sheetBody, { paddingBottom: 20 + bottom }]}>{children}</ScrollView>
      </View>
    </KeyboardAvoidingView>
  </Modal>;
}

export const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: color.background },
  scroll: { flexGrow: 1, paddingHorizontal: 20, paddingBottom: 24 },
  content: { width: '100%', maxWidth: 620, alignSelf: 'center' },
  top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 15, marginBottom: 24 },
  brand: { flexDirection: 'row', gap: 9, alignItems: 'center' },
  logo: { width: 35, height: 35, borderRadius: 12, backgroundColor: color.forest, alignItems: 'center', justifyContent: 'center' },
  wordmark: { fontSize: 17, fontWeight: '800', color: color.ink, letterSpacing: 0.3 },
  brandMuted: { color: color.muted, fontWeight: '600' },
  mode: { fontSize: 10, fontWeight: '800', color: color.green, letterSpacing: 1.1, backgroundColor: color.mint, paddingHorizontal: 9, paddingVertical: 5, borderRadius: 8 },
  title: { color: color.ink, fontSize: 36, fontWeight: '800', letterSpacing: -1.5 },
  intro: { fontSize: 15, color: color.muted, lineHeight: 21, marginTop: 5, marginBottom: 20 },
  section: { flexDirection: 'row', gap: 10, justifyContent: 'space-between', alignItems: 'center', marginTop: 23, marginBottom: 11 },
  sectionTitle: { color: color.ink, fontWeight: '800', fontSize: 20, flexShrink: 1 },
  subtle: { fontSize: 12, color: color.muted, fontWeight: '600' },
  body: { fontSize: 14, color: color.muted, lineHeight: 21 },
  label: { fontSize: 14, color: color.ink, fontWeight: '700' },
  card: { borderWidth: 1, borderColor: color.border, borderRadius: 18, padding: 14, backgroundColor: color.surface },
  badge: { color: color.green, backgroundColor: color.mint, fontSize: 11, fontWeight: '700', paddingHorizontal: 8, paddingVertical: 5, borderRadius: 8, alignSelf: 'flex-start', overflow: 'hidden' },
  badgeWarm: { color: color.rust, backgroundColor: color.amber },
  action: { backgroundColor: color.forest, minHeight: 47, borderRadius: 13, paddingHorizontal: 13, paddingVertical: 10, gap: 8, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  actionText: { color: color.surface, fontSize: 14, fontWeight: '800', textAlign: 'center' },
  pressed: { opacity: 0.72 },
  chips: { flexDirection: 'row', gap: 7, flexWrap: 'wrap' },
  chip: { minHeight: 44, justifyContent: 'center', borderWidth: 1, borderColor: color.border, paddingHorizontal: 12, borderRadius: 12, backgroundColor: color.surface },
  chipActive: { backgroundColor: color.forest, borderColor: color.forest },
  chipText: { color: color.muted, fontSize: 12, fontWeight: '700' },
  chipActiveText: { color: color.surface },
  overlay: { flex: 1, backgroundColor: '#0C231C88', justifyContent: 'flex-end' },
  sheet: { maxHeight: '85%', width: '100%', maxWidth: 620, alignSelf: 'center', paddingTop: 12, borderTopLeftRadius: 24, borderTopRightRadius: 24, backgroundColor: color.surface },
  sheetHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 12, paddingHorizontal: 20 },
  sheetBody: { padding: 20, gap: 12 },
  close: { width: 44, height: 44, backgroundColor: color.background, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  input: { borderWidth: 1, borderColor: color.border, backgroundColor: color.surface, color: color.ink, minHeight: 47, borderRadius: 12, paddingHorizontal: 13, fontSize: 15 },
});
