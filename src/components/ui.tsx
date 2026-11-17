import type { PropsWithChildren, ReactNode } from 'react';
import { ActivityIndicator, Image, KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import type { ColorValue, TextInputProps } from 'react-native';
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

export function Icon({ name, size = 23, tint = color.primary }: { name: IconName; size?: number; tint?: ColorValue }) {
  return <Image source={icons[name]} accessible={false} style={{ width: size, height: size, tintColor: tint }} />;
}

export function Screen({ title, intro, onBack, children }: PropsWithChildren<{ title?: string; intro?: string; onBack?: () => void }>) {
  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView style={styles.safe} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.scroll}>
        <View style={styles.content}>
          <View style={styles.top}>
            <View style={styles.brand}><View style={styles.logo}><Icon name="leaf" tint={color.surface} size={20} /></View>
              <Text style={styles.wordmark}>SENAP <Text style={styles.brandMuted}>Móvil</Text></Text>
            </View>
            <Text style={styles.mode}>DEMO</Text>
          </View>
          {onBack && <View style={styles.back}><Action label="Atrás" onPress={onBack} secondary back /></View>}
          {title && <Text accessibilityRole="header" style={styles.title}>{title}</Text>}
          {intro && <Text style={styles.intro}>{intro}</Text>}
          {children}
        </View>
      </ScrollView>
      </KeyboardAvoidingView>
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

export function Action({ label, onPress, icon, secondary, back, disabled }: {
  label: string; onPress: () => void; icon?: IconName; secondary?: boolean; back?: boolean; disabled?: boolean;
}) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={label} accessibilityState={{ disabled }} disabled={disabled}
      onPress={onPress} style={({ pressed }) => [styles.action, secondary && styles.secondary, (pressed || disabled) && styles.pressed]}>
      {back && <Text style={styles.secondaryText} accessible={false}>‹</Text>}
      {icon && <Icon name={icon} size={18} tint={secondary ? color.dark : color.surface} />}
      <Text style={[styles.actionText, secondary && styles.secondaryText]}>{label}</Text>
    </Pressable>
  );
}

export function Field({ label, error, hint, style, ...props }: TextInputProps & {
  label: string; error?: string; hint?: string;
}) {
  return <View style={styles.field}>
    <Text style={styles.label} accessible={false}>{label}</Text>
    <TextInput {...props} accessibilityLabel={label} accessibilityHint={error ?? hint}
      {...(Platform.OS === 'web' && error ? { 'aria-invalid': true } : {})}
      placeholderTextColor={color.muted} style={[styles.input, props.multiline && styles.multiline, error && styles.invalidInput, style]} />
    {error ? <Feedback error>{error}</Feedback> : hint && <Text style={styles.subtle}>{hint}</Text>}
  </View>;
}

export function Feedback({ children, error }: PropsWithChildren<{ error?: boolean }>) {
  return <Text accessibilityRole={error ? 'alert' : undefined} accessibilityLiveRegion={error ? 'assertive' : 'polite'}
    style={[styles.feedback, error && styles.error]}>{children}</Text>;
}

export function EmptyState({ title, detail }: { title: string; detail?: string }) {
  return <Card><Text style={styles.label}>{title}</Text>{detail && <Text style={styles.body}>{detail}</Text>}</Card>;
}

export function LoadingState({ label }: { label: string }) {
  return <View style={styles.loading} accessibilityLiveRegion="polite">
    <ActivityIndicator color={color.primary} /><Text style={styles.body}>{label}</Text>
  </View>;
}

export function ChoiceField<T extends string>({ label, options, value, onChange, error }: {
  label: string; options: readonly T[]; value: T | ''; onChange: (value: T) => void; error?: string;
}) {
  return <View style={styles.field}>
    <Text style={styles.label}>{label}</Text>
    <Chips options={options} value={value} onChange={onChange} />
    {error && <Feedback error>{error}</Feedback>}
  </View>;
}

export function Chips<T extends string>({ options, value, onChange }: {
  options: readonly T[]; value: T | ''; onChange: (value: T) => void;
}) {
  return <View style={styles.chips}>
    {options.map(option => <Pressable key={option} accessibilityRole="button" onPress={() => onChange(option)}
      {...(Platform.OS === 'web' ? { 'aria-pressed': option === value } : { accessibilityState: { selected: option === value } })}
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
  content: { width: '100%', maxWidth: 670, alignSelf: 'center' },
  top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 15, marginBottom: 24 },
  brand: { flexDirection: 'row', gap: 9, alignItems: 'center', flexShrink: 1 },
  logo: { width: 35, height: 35, borderRadius: 11, backgroundColor: color.dark, alignItems: 'center', justifyContent: 'center' },
  wordmark: { fontSize: 17, fontWeight: '800', color: color.ink, letterSpacing: 0.3 },
  brandMuted: { color: color.muted, fontWeight: '600' },
  mode: { fontSize: 11, fontWeight: '800', color: color.dark, letterSpacing: 0.8, backgroundColor: color.soft, paddingHorizontal: 9, paddingVertical: 5, borderRadius: 8 },
  back: { alignSelf: 'flex-start', marginBottom: 14 },
  title: { color: color.ink, fontSize: 34, fontWeight: '800', letterSpacing: -1.2 },
  intro: { fontSize: 15, color: color.muted, lineHeight: 21, marginTop: 5, marginBottom: 20 },
  section: { flexDirection: 'row', gap: 10, justifyContent: 'space-between', alignItems: 'center', marginTop: 23, marginBottom: 11 },
  sectionTitle: { color: color.ink, fontWeight: '800', fontSize: 20, flexShrink: 1 },
  subtle: { fontSize: 12, color: color.muted, fontWeight: '600' },
  body: { fontSize: 14, color: color.muted, lineHeight: 21 },
  label: { fontSize: 14, color: color.ink, fontWeight: '700' },
  card: { borderWidth: 1, borderColor: color.border, borderRadius: 16, padding: 16, backgroundColor: color.surface },
  badge: { color: color.dark, backgroundColor: color.soft, fontSize: 12, fontWeight: '700', paddingHorizontal: 9, paddingVertical: 5, borderRadius: 8, alignSelf: 'flex-start', overflow: 'hidden' },
  badgeWarm: { color: color.ink, backgroundColor: color.neutral },
  action: { backgroundColor: color.primary, minHeight: 48, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10, gap: 8, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  actionText: { color: color.surface, fontSize: 15, fontWeight: '700', textAlign: 'center', flexShrink: 1 },
  secondary: { backgroundColor: color.surface, borderWidth: 1, borderColor: color.outline },
  secondaryText: { color: color.dark, fontWeight: '700' },
  pressed: { opacity: 0.72 },
  chips: { flexDirection: 'row', gap: 7, flexWrap: 'wrap' },
  chip: { minHeight: 48, maxWidth: '100%', justifyContent: 'center', borderWidth: 1, borderColor: color.outline, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 11, backgroundColor: color.surface },
  chipActive: { backgroundColor: color.dark, borderColor: color.dark },
  chipText: { color: color.muted, fontSize: 13, fontWeight: '700' },
  chipActiveText: { color: color.surface },
  overlay: { flex: 1, backgroundColor: color.overlay, justifyContent: 'flex-end' },
  sheet: { maxHeight: '85%', width: '100%', maxWidth: 620, alignSelf: 'center', paddingTop: 12, borderTopLeftRadius: 24, borderTopRightRadius: 24, backgroundColor: color.surface },
  sheetHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 12, paddingHorizontal: 20 },
  sheetBody: { padding: 20, gap: 12 },
  close: { width: 48, height: 48, backgroundColor: color.background, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  input: { borderWidth: 1, borderColor: color.outline, backgroundColor: color.surface, color: color.ink, minHeight: 48, borderRadius: 10, paddingHorizontal: 13, paddingVertical: 10, fontSize: 16 },
  field: { gap: 6 },
  form: { gap: 16 },
  list: { gap: 10 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  grow: { flex: 1, minWidth: 0, gap: 4 },
  multiline: { minHeight: 96, textAlignVertical: 'top' },
  invalidInput: { borderColor: color.ink, borderWidth: 2 },
  feedback: { color: color.dark, backgroundColor: color.soft, fontSize: 14, lineHeight: 20, padding: 10, borderRadius: 8 },
  error: { color: color.ink, backgroundColor: color.neutral },
  loading: { flexDirection: 'row', alignItems: 'center', gap: 10, minHeight: 48 },
});
