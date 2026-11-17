export const breedsBySpecies = {
  Bovino: ['Pardo Suizo', 'Carora', 'Holstein', 'Brahman'],
  Bufalino: ['Murrah', 'Mediterránea'],
} as const;
export type Species = keyof typeof breedsBySpecies;
export const speciesOptions: Species[] = ['Bovino', 'Bufalino'];
export const sexOptions = ['Hembra', 'Macho'] as const;
export const animalStatuses = ['Activo', 'Vendido', 'Muerto', 'Transferido', 'Baja'] as const;
export const lots = ['Potrero Norte', 'Potrero Sur', 'Sin lote'] as const;

export type AnimalDraft = {
  code: string;
  name: string;
  species: Species;
  breed: string;
  lot: typeof lots[number];
  sex: typeof sexOptions[number];
  status: typeof animalStatuses[number];
  notes: string;
};
export type Animal = AnimalDraft & { id: string };
export type AnimalErrors = Partial<Record<'code' | 'name' | 'breed' | 'form', string>>;

export const initialAnimals: Animal[] = [
  { id: 'a1', code: 'BOV-001', name: 'Canela', species: 'Bovino', breed: 'Pardo Suizo', lot: 'Potrero Norte', sex: 'Hembra', status: 'Activo', notes: 'Identificación confirmada en el inventario de ejemplo.' },
  { id: 'a2', code: 'BOV-002', name: 'Lucero', species: 'Bovino', breed: 'Carora', lot: 'Potrero Sur', sex: 'Hembra', status: 'Activo', notes: '' },
  { id: 'a3', code: 'BOV-003', name: 'Paloma', species: 'Bovino', breed: 'Holstein', lot: 'Potrero Norte', sex: 'Hembra', status: 'Activo', notes: '' },
  { id: 'a4', code: 'BOV-004', name: 'Moro', species: 'Bovino', breed: 'Brahman', lot: 'Potrero Sur', sex: 'Macho', status: 'Activo', notes: '' },
  { id: 'a5', code: 'BUF-001', name: 'Brisa', species: 'Bufalino', breed: 'Murrah', lot: 'Sin lote', sex: 'Hembra', status: 'Transferido', notes: '' },
];

export const eligibleForMilk = (animal: Animal) => animal.sex === 'Hembra' && animal.status === 'Activo';

export function validateAnimal(draft: AnimalDraft, animals: Animal[], editingId?: string): AnimalErrors {
  const errors: AnimalErrors = {};
  const code = draft.code.trim().toUpperCase();
  if (!/^[A-Z0-9-]{2,15}$/.test(code)) errors.code = 'Usa de 2 a 15 letras, números o guiones.';
  else if (animals.some(animal => animal.code === code && animal.id !== editingId)) errors.code = 'Ya existe un animal con ese código.';
  if (draft.name.trim().length < 2 || draft.name.trim().length > 40) errors.name = 'Escribe un nombre de 2 a 40 caracteres.';
  const breeds: readonly string[] = breedsBySpecies[draft.species];
  if (!breeds.includes(draft.breed)) errors.breed = 'Selecciona una raza de la especie elegida.';
  return errors;
}
