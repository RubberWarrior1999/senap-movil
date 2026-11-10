export const animals = [
  { id: 'BOV-001', name: 'Canela', breed: 'Pardo Suizo', lot: 'Potrero Norte', state: 'Estable', weight: 468, sex: 'Hembra' },
  { id: 'BOV-002', name: 'Lucero', breed: 'Carora', lot: 'Potrero Sur', state: 'Seguimiento', weight: 412, sex: 'Hembra' },
  { id: 'BOV-003', name: 'Paloma', breed: 'Holstein', lot: 'Potrero Norte', state: 'Estable', weight: 502, sex: 'Hembra' },
  { id: 'BOV-004', name: 'Moro', breed: 'Brahman', lot: 'Potrero Sur', state: 'Estable', weight: 539, sex: 'Macho' },
] as const;

export const initialHealth = [
  { id: 'h1', title: 'Control posvacunación', animal: 'Lucero', detail: 'Revisar apetito y temperatura después de la vacunación.', due: 'Hoy', done: false },
  { id: 'h2', title: 'Revisión de pezuñas', animal: 'Canela', detail: 'Revisar apoyo y movilidad en el potrero.', due: 'Mañana', done: false },
  { id: 'h3', title: 'Desparasitación registrada', animal: 'Paloma', detail: 'Control preventivo asentado en la ficha de demostración.', due: 'Ayer', done: true },
];

export const initialTasks = [
  { id: 'j1', time: '06:30', title: 'Revisar bebederos', lot: 'Potrero Norte', done: true },
  { id: 'j2', time: '08:00', title: 'Registrar ordeño de la mañana', lot: 'Sala de ordeño', done: false },
  { id: 'j3', time: '10:30', title: 'Verificar cercas', lot: 'Potrero Sur', done: false },
  { id: 'j4', time: '15:00', title: 'Revisar el lote de seguimiento', lot: 'Potrero Sur', done: false },
];

export type MilkEntry = { id: string; animal: string; turn: 'Mañana' | 'Tarde'; liters: number };

export const initialMilk: MilkEntry[] = [
  { id: 'm1', animal: 'Canela', turn: 'Mañana', liters: 14.5 },
  { id: 'm2', animal: 'Paloma', turn: 'Mañana', liters: 18 },
  { id: 'm3', animal: 'Lucero', turn: 'Mañana', liters: 12 },
];

export const litersLabel = (value: number) =>
  new Intl.NumberFormat('es-VE', { maximumFractionDigits: 2 }).format(value);
