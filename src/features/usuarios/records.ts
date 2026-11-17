export const roles = ['Administrador', 'Moderador', 'Usuario'] as const;
export type Role = typeof roles[number];

export type User = {
  id: string;
  name: string;
  username: string;
  email: string;
  role: Role;
  active: boolean;
};
export type UserDraft = Omit<User, 'id'> & { password: string };
export type DemoAccount = User & { password: string };
export type UserErrors = Partial<Record<'name' | 'username' | 'email' | 'password' | 'role' | 'form', string>>;

const demoAdminEmail = process.env.EXPO_PUBLIC_DEMO_ADMIN_EMAIL?.trim().toLowerCase() || 'admin@senap.test';
const demoLogin = { username: 'admin.demo', email: demoAdminEmail, password: 'SenapDemo21' };
export const demoReader = { username: 'campo.demo', email: 'campo@senap.test', password: 'CampoDemo21' };

export const initialUsers: DemoAccount[] = [
  { id: 'u1', name: 'Juan Sanchez', ...demoLogin, role: 'Administrador', active: true },
  { id: 'u2', name: 'Luis Peña', ...demoReader, role: 'Usuario', active: true },
  { id: 'u3', name: 'María Torres', username: 'maria.demo', email: 'maria@senap.test', password: 'MariaDemo21', role: 'Moderador', active: false },
];

export const normalized = (value: string) => value.trim().toLowerCase();
export const validEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) && value.trim().length <= 254;

export function validateUser(draft: UserDraft, users: User[], editingId?: string): UserErrors {
  const errors: UserErrors = {};
  const username = normalized(draft.username);
  const email = normalized(draft.email);
  if (draft.name.trim().length < 2 || draft.name.trim().length > 60) errors.name = 'Escribe un nombre de 2 a 60 caracteres.';
  if (!/^[a-z0-9._-]{3,30}$/.test(username)) errors.username = 'Usa de 3 a 30 letras, números, puntos, guiones o guiones bajos.';
  else if (users.some(user => user.id !== editingId && user.username === username)) errors.username = 'El nombre de usuario ya existe.';
  if (!validEmail(email)) errors.email = 'Introduce un correo válido.';
  else if (users.some(user => user.id !== editingId && user.email === email)) errors.email = 'Ya hay una cuenta con este correo.';
  if ((!editingId || draft.password) && draft.password.trim().length < 6) errors.password = 'Usa al menos 6 caracteres.';
  if (!roles.includes(draft.role)) errors.role = 'Selecciona un rol.';
  const current = users.find(user => user.id === editingId);
  if (current?.active && current.role === 'Administrador' && (!draft.active || draft.role !== 'Administrador')
    && !users.some(user => user.id !== editingId && user.active && user.role === 'Administrador')) {
    errors.form = 'Debe quedar al menos un administrador activo.';
  }
  return errors;
}
